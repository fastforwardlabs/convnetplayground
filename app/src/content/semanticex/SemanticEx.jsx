import React, { Component } from "react";
import { Modal, Toggle, Tooltip } from 'carbon-components-react';
// import Notification20 from '@carbon/icons-react/lib/notification/20';
import "./semanticex.css"
import SemanticModalContent from "../../components/modals/SemanticModal"
import { greyColor, blueColor, abbreviateString, loadJSONData, makeFriendly, boundWidth, checkInView, animOptions, LeaderLine } from "../../components/helperfunctions/HelperFunctions"
import CompareVisualization from "../../components/comparevisualization/CompareVisualization"
import Scene from "../../components/three/Scene"
import * as _ from 'lodash'

let containerOffset = -80
let elementOffset = -385
const topTransitionDuration = 400;

class SemanticEx extends Component {
    constructor(props) {
        super(props);
        const modelDetails = require('../../assets/semsearch/details.json');
        this.modelDetails = modelDetails;
        this.datasetdictionary = require('../../assets/semsearch/datasetdictionary.json');

        // const initialSimilarityPath = "../../assets/semsearch/similarity/" + modelDetails["datasets"][0].name + "/" + modelDetails["models"][0].name + "/" + modelDetails["metrics"][0] + "/" + modelDetails["models"][0].layers[0] + ".json"
        const similarityArray = require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block1_conv1.json');
        // require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block5_pool.json');
        // console.log(similarityArray)



        this.state = {
            selecteddataset: 0,
            selectedmodel: 5, //modelDetails["models"].length - 1,
            selectedsimimage: 0,
            hoversimimage: 0,
            selectedlayer: modelDetails["models"][5].layers.length - 1,
            selectedmetric: 0,
            similarityArray: similarityArray,
            datasetArray: [],
            datasetsList: modelDetails["datasets"],
            modelsList: modelDetails["models"],
            distanceMetricList: modelDetails["metrics"],
            showorientationmodal: !this.props.pageviewed,
            showmodelconfig: false,
            showumap: false,
            showdatasetmodal: false,
            showtopresults: false,
            viewdatasetby: "all",
            showadvanced: false,
            topx: 15,
            showcomparemodal: false
        }
        this.updateSimilarity()
        this.loadDatasetList()

        this.searchCount = 0;
        this.lineHolder = []
        this.lastclicked = "dataset"


        this.keyFunction = this.keyFunction.bind(this);
        this.scrollEndedHandler = this.scrollEndedHandler.bind(this)

    }

    scrollEndedHandler() {
        window.clearTimeout(this.isScrolling);
        let self = this
        this.isScrolling = setTimeout(function () {
            // console.log('Scrolling has stopped.');
            self.drawLines()
        }, 200);
    }



    resizeHandler() {
        // this.drawLines()
    }

    getNextVisible(selectedModel) {
        let modelVisible = checkInView(this.refs["modelscrollbox"], this.refs["modelimg" + selectedModel], true, containerOffset, elementOffset)
        if (modelVisible) {
            return selectedModel
        } else {
            let nextIndex = ((selectedModel * 1) + 1) % this.state.modelsList.length
            return this.getNextVisible(nextIndex)
        }
    }

    getNextVisibleLayer(selectedLayer) {
        let layerVisible = checkInView(this.refs["layerscrollbox"], this.refs["layerimg" + selectedLayer], true, containerOffset, elementOffset)
        if (layerVisible) {
            console.log(selectedLayer, " is available, returning ")
            return selectedLayer
        } else {
            let nextIndex = ((selectedLayer * 1) + 1) % this.state.modelsList[this.state.selectedmodel].layers.length
            console.log(selectedLayer, "layer not available, trying ", nextIndex)
            return this.getNextVisibleLayer(nextIndex)
        }
    }

    drawLines(e) {
        if (this.state.showmodelconfig) {
            this.removeLines()
            let self = this;
            let layers = this.state.modelsList[this.state.selectedmodel].layers

            // let visibleModel = this.getNextVisible(this.state.selectedmodel)
            // if (visibleModel != this.state.selectedmodel) {
            //     this.setState({ selectedmodel: visibleModel + "" })
            // }

            // let visibleLayer = this.getNextVisibleLayer(this.state.selectedlayer)
            // if (visibleLayer != this.state.selectedlayer) {
            //     this.setState({ selectedlayer: visibleLayer + "" })
            // }

            let modelVisible = checkInView(self.refs["modelscrollbox"], self.refs["modelimg" + this.state.selectedmodel], true, containerOffset, elementOffset)
            // console.log("Next visible is ", this.getNextVisible(this.state.selectedmodel))
            let maxLineWidth = 3.5
            let minLineWidth = 1.5
            let incs = (maxLineWidth - minLineWidth) / layers.length


            layers.forEach(function (each, i) {

                let layerVisible = checkInView(self.refs["layerscrollbox"], self.refs["layerimg" + i], true, containerOffset, elementOffset)
                if (layerVisible && modelVisible) {
                    // console.log("we drawing to", i)

                    // console.log(i, self.state.selectedlayer)

                    let line = new LeaderLine(self.refs["modelimg" + self.state.selectedmodel], self.refs["layerimg" + i], {
                        color: self.state.selectedlayer == (i + "") ? blueColor : greyColor,
                        startPlug: 'disc',
                        endPlug: 'disc',
                        startPlugColor: blueColor,
                        path: "fluid",
                        size: Math.min(minLineWidth + i * incs, maxLineWidth),
                        hide: true,
                        startSocket: 'bottom',
                        endSocket: self.state.selectedlayer == (i + "") ? "top" : 'left',
                        endPlugSize: maxLineWidth / Math.min(minLineWidth + i * incs, maxLineWidth),

                    });
                    document.querySelector('.leader-line').style.zIndex = -100
                    animOptions.duration = 800
                    line.show("draw", animOptions)
                    self.lineHolder.push({ line: line, index: i })
                }
            })
        }

    }
    removeLines(e) {
        this.lineHolder.forEach(function (each) {
            each.line.remove()
        })
        this.lineHolder = []
    }
    recolorLines(e) {
        let self = this
        // let visibleLayer = this.getNextVisibleLayer(this.state.selectedlayer)
        // if (visibleLayer != this.state.selectedlayer) {
        //     this.setState({ selectedlayer: visibleLayer + "" })
        // }
        if (this.LayerScrollTop != this.refs["layerscrollbox"].scrollTop) {
            this.LayerScrollTop = this.refs["layerscrollbox"].scrollTop
            this.drawLines()
        } else {
            this.lineHolder.forEach(function (each) {
                if (each.index == self.state.selectedlayer) {
                    each.line.hide("none")
                    each.line.color = blueColor
                    each.line.show("draw", animOptions)
                    each.line.endSocket = "top"
                } else {
                    each.line.color = greyColor
                    each.line.endSocket = "left"
                }
            })
        }
    }

    getNextVal(newVal, maxVal) {
        if (newVal >= 0) {
            return newVal % maxVal
        } else {
            return (maxVal - Math.abs(newVal))
        }

    }
    cycleLayerModel(val) {
        if (this.lastclicked == "model") {
            let newState = this.getNextVal((this.state.selectedmodel * 1 + val), this.state.modelsList.length);// Math.max((this.state.selectedmodel*1 + val) % this.state.modelsList.length, 0) 
            // console.log(newState)
            if (!(isNaN(newState))) {
                this.setState({ selectedmodel: newState })
            }

        }
        else if (this.lastclicked == "dataset") {
            let newState = this.getNextVal((this.state.selecteddataset * 1 + val), this.state.datasetsList.length)
            if (!(isNaN(newState))) {
                this.setState({ selecteddataset: newState })
            }

        } else if (this.lastclicked == "layer") {
            let newState = this.getNextVal((this.state.selectedlayer * 1 + val), this.state.modelsList[this.state.selectedmodel].layers.length)
            if (!(isNaN(newState))) {
                this.setState({ selectedlayer: newState })
            }

        } else if (this.lastclicked == "neuron") {

            let numNeurons = (this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name].length)
            let newState = this.getNextVal((this.state.selectedneuron * 1 + val), numNeurons)
            // console.log(this.state.selectedneuron,newState,  val, numNeurons)
            if (!(isNaN(newState))) {
                this.setState({ selectedneuron: newState })
            }

        }
    }

    keyFunction(event) {
        if (this.state.showmodelconfig) {
            if (event.keyCode === 37) {
                this.cycleLayerModel(-1)
            }
            else if (event.keyCode === 39) {
                this.cycleLayerModel(1)
            }
        }
    }

    componentDidMount() {
        document.title = "ConvNet Playground | Semantic Search Explorer";
        this.LayerScrollTop = 0
        window.addEventListener('resize', this.scrollEndedHandler)
        document.addEventListener("keydown", this.keyFunction, false);
        this.refs["layerscrollbox"].addEventListener("scroll", this.scrollEndedHandler, false)
        this.refs["modelscrollbox"].addEventListener("scroll", this.scrollEndedHandler, false)
    }


    componentWillUnmount() {
        this.removeLines();
        document.removeEventListener("keydown", this.keyFunction);
        window.removeEventListener('resize', this.scrollEndedHandler)

        this.refs["layerscrollbox"].removeEventListener("scroll", this.scrollEndedHandler, false)
        this.refs["modelscrollbox"].removeEventListener("scroll", this.scrollEndedHandler, false)

        // if (this.timeout) {
        //     clearTimeout(this.timeout)
        // }
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedmodel !== prevState.selectedmodel || this.state.selectedmetric !== prevState.selectedmetric || this.state.selectedlayer !== prevState.selectedlayer || this.state.selecteddataset !== prevState.selecteddataset) {
            this.updateSimilarity()
            this.showTopResults()
            this.searchCount++

        }
        if (this.state.selectedmodel !== prevState.selectedmodel) {
            this.drawLines()
        }
        if (this.state.selectedlayer !== prevState.selectedlayer) {
            this.recolorLines()
        }
        if (this.state.showmodelconfig != prevState.showmodelconfig) {
            let self = this
            if (this.state.showmodelconfig) {
                this.drawLines()
                // console.log(this.state.selectedlayer, this.refs.layerscrollbox.clientHeight)
                if (this.state.selectedlayer == "7") {
                    this.refs.layerscrollbox.scrollTo({
                        top: 100,
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            } else {
                this.removeLines()

            }
        }
    }

    clickDatasetImage(e) {
        this.setState({ selecteddataset: e.target.getAttribute("indexvalue") })
        // this.setState({ selectedmodel: 0 })
        this.lastclicked = "dataset"
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") })
        // this.setState({ selectedlayer: 0 })
        this.lastclicked = "model"
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") })
        this.lastclicked = "layer"
    }

    clickMetricImage(e) {
        this.setState({ selectedmetric: e.target.getAttribute("indexvalue") })
    }

    clickSimilarImage(e) {
        this.setSelectedImage(e.target.getAttribute("indexvalue"))
    }

    hoverSimilarImage(e) {
        let val = e.target.getAttribute("indexvalue")
        if (val != this.state.hoversimimage) {
            this.setState({ hoversimimage: val })
            // this.showTopResults()
        }
    }
    setSelectedImage(val) {
        // console.log(val);

        if (val != this.state.selectedsimimage) {
            this.setState({ selectedsimimage: val })
            this.showTopResults()
        }
        this.searchCount++
    }

    toggleSemanticModal(e) {
        this.setState({ showorientationmodal: !(this.state.showorientationmodal) })
    }


    toggleModelConfig(e) {
        this.setState({ showmodelconfig: !(this.state.showmodelconfig) })

    }

    toggleUMAPView(e) {
        this.setState({ showumap: !(this.state.showumap) })
    }

    toggleTopX(e) {
        this.setState({ showtopresults: !(this.state.showtopresults) })
    }

    toggleDatasetModal(e) {
        this.setState({ showdatasetmodal: !(this.state.showdatasetmodal) })
    }

    toggleShowCompare(e) {
        this.setState({ showcomparemodal: !(this.state.showcomparemodal) })
    }

    toggleViewDatasetBy(e) {
        this.setState({ viewdatasetby: e.target.getAttribute("viewby") })
    }
    toggleAdvancedOptions(e) {
        this.setState({ showmodelconfig: !(this.state.showadvanced) })
        this.setState({ showadvanced: !(this.state.showadvanced) })
    }

    showTopResults() {
        let self = this
        // this.setState({ showtopresults: true })
        this.setState({ showtopresults: true })
        this.refs["topresultsbox"].style.opacity = 0.65;

        this.refs["glowbar"].classList.add('notransition');
        this.refs["glowbar"].style.width = "0%";

        setTimeout(() => {
            self.refs["glowbar"].classList.remove('notransition');
            self.refs["glowbar"].style.width = "100%";

        }, 150);

        setTimeout(() => {
            self.refs["topresultsbox"].style.opacity = 1;
        }, topTransitionDuration);


    }

    updateSimilarity() {

        let similarityPath = process.env.PUBLIC_URL + "/assets/semsearch/similarity/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.modelsList[this.state.selectedmodel].name + "/" + this.state.distanceMetricList[this.state.selectedmetric] + "/" + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name + ".json"
        let loadedJSON = loadJSONData(similarityPath)
        // console.log(similarityPath)    
        let self = this
        loadedJSON.then(function (data) {
            if (data) {
                self.setState({ similarityArray: data })

            }
        })

    }

    loadDatasetList() {

        let similarityPath = process.env.PUBLIC_URL + "/assets/semsearch/similarity/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.modelsList[this.state.selectedmodel].name + "/" + this.state.distanceMetricList[this.state.selectedmetric] + "/" + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name + ".json"
        let loadedJSON = loadJSONData(similarityPath)
        let self = this
        loadedJSON.then(function (data) {
            if (data) {
                let dArray = _.shuffle(data["0"])
                self.setState({ datasetArray: dArray })
            }
        })

    }




    render() {
        let datasetImageList = this.state.datasetsList.map((dsdata, index) => {
            let iconPath = process.env.PUBLIC_URL + "/assets/semsearch/images/" + dsdata.icon

            return (
                <div key={dsdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10">
                    <div className="datasettitles"> {dsdata.name.toUpperCase()}</div>
                    <img onClick={this.clickDatasetImage.bind(this)} src={iconPath} alt="" className={"datasetbox rad2 " + (this.state.selecteddataset == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });


        let modelImageList = this.state.modelsList.map((mdata, index) => {
            let selectedModel = this.state.modelsList[index].name
            let selectedlayer = this.state.modelsList[index].layers[this.state.modelsList[index].layers.length - 1].name

            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/0.jpg"
            // console.log(imagePath)

            return (
                <div ref={"modelimgbox" + index} key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {mdata.name.toUpperCase()}</div>
                    <div className="smalldesc pb5">{mdata.numlayers} layers </div>
                    <img ref={"modelimg" + index} onClick={this.clickModelImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let layerImageList = this.state.modelsList[this.state.selectedmodel].layers.map((ldata, index) => {
            let selectedModel = this.state.modelsList[this.state.selectedmodel].name
            let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[index].name
            // let neuronList = this.layerList[selectedModel] [selectedlayer]
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/0.jpg"

            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {"layer " + ldata.layer_index} </div>
                    {/* {abbreviateString(ldata.name, 11).toLowerCase()}  */}
                    <div className="smalldesc pb5"> {abbreviateString(ldata.name, 11).toLowerCase()} </div>
                    <img ref={"layerimg" + index} onClick={this.clickLayerImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let metricImageList = this.state.distanceMetricList.map((metric, index) => {
            return (
                <div key={metric + "fullbox" + index} className=" positionrelative iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(metric, 11).toLowerCase()} </div>
                    <div className="metrictitle positionabsolute"> {abbreviateString(metric, 3).toUpperCase()}</div>
                    <img onClick={this.clickMetricImage.bind(this)} src={require("../../images/bgwhite.png")} alt="" className={"datasetbox rad2 " + (this.state.selectedmetric == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        // console.log(this.state.similarityArray[this.state.selectedsimimage]) 
        let datasetClasses = this.datasetdictionary["classlist"][this.state.datasetsList[this.state.selecteddataset].name]

        let datasetClassImagesList = []
        let co = datasetClasses.map((className, index) => {
            let classcon = this.datasetdictionary["classes"][this.state.datasetsList[this.state.selecteddataset].name]
            let clist = classcon[className].map((classval, index) => {
                let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + classval + ".jpg"
                return (
                    <div key={classval + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                        <img key={classval + "image"} onMouseOver={this.hoverSimilarImage.bind(this)} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 " + (this.state.selectedsimimage == classval ? "active" : "")} indexvalue={classval} />
                    </div>
                )
            });
            let header =
                <div key={"header" + className} className="iblock mr5 categorymain  mb5 ">
                    <div>
                        <div className=" boldtext categorytitle"> {className.toUpperCase()} </div>
                        <img src={require("../../images/bgwhite.png")} alt="" className={"categorybox rad2 "} indexvalue={index} />
                    </div>

                </div>

            datasetClassImagesList.push(header)
            datasetClassImagesList.push(clist)
        });

        let similarImagesList = this.state.similarityArray[this.state.selectedsimimage].map((alldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
            // console.log(imagePath)
            let similarityScore = (alldata[1] * 1).toFixed(3)
            let returnValue = (
                <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                    <div className="smalldesc mb5">dst: {makeFriendly((1 * similarityScore).toFixed(2))} </div>
                    <img key={alldata[0] + "image" + alldata[0]} onMouseOver={this.hoverSimilarImage.bind(this)} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 "} indexvalue={alldata[0]} />
                    <div className="outersimbar">
                        <div className="innersimbar" style={{ width: (boundWidth(similarityScore) * 100) + "%" }}></div>
                    </div>
                    <div className="similarityscorebox">{makeFriendly(similarityScore)} </div>
                    {/* <div>{ "w:" + boundWidth(similarityScore)*100  }</div> */}
                </div>
            )
            return (returnValue)
        });

        let simArr = this.state.similarityArray[this.state.selectedsimimage].slice(1, this.state.topx + 1)
        let allDictionary = this.datasetdictionary.dictionary[this.state.datasetsList[this.state.selecteddataset].name]
        let selectedCat = allDictionary[this.state.selectedsimimage]
        // console.log(simar.slice(1, this.state.topx + 1))
        // console.log(this.state.selectedsimimage)
        let simCount = 0
        let modelScore = 0
        let totalScore = 0
        for (var i in simArr) {
            if (selectedCat == allDictionary[simArr[i][0]]) {
                simCount++
                modelScore += (this.state.topx - i) / this.state.topx
            }
            totalScore += (this.state.topx - i) / this.state.topx
        }


        let datasetimagesList = this.state.datasetArray.map((alldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
            // let similarityScore = (alldata[1] * 1).toFixed(3) 
            let returnValue = (
                <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                    <img key={alldata[0] + "image" + alldata[0]} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 " + (this.state.selectedsimimage == alldata[0] ? "active" : "")} indexvalue={alldata[0]} />
                </div>
            )
            return (returnValue)
        });

        // datasetimagesList = _.shuffle(datasetimagesList)
        // alert(datasetimagesList.length)

        // let datasetSimpleimagesList = this.state.datasetArray.map((alldata, index) => {
        //     let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
        //     // let similarityScore = (alldata[1] * 1).toFixed(3) 
        //     let returnValue = (
        //         <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
        //             <img key={alldata[0] + "image" + alldata[0]} src={imagePath} alt="" className={"simiimage  rad2 " + (this.state.selectedsimimage == alldata[0] ? "active" : "")} indexvalue={alldata[0]} />
        //         </div>
        //     )
        //     return (returnValue)
        // });



        let selectedImagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.selectedsimimage + ".jpg"
        // process.env.PUBLIC_URL + "/assets/semsearch/datasets/cifar100/train/" + this.state.selectedsimimage + ".jpg"
        return (
            <div className="mainsemanticdiv">


                {(this.state.showorientationmodal) && <Modal className="orientationmodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={false}
                    primaryButtonText="Get Started"
                    // secondaryButtonText=""
                    modalHeading="Semantic Search"
                    modalLabel="ConvNet Playground"
                    onRequestSubmit={this.toggleSemanticModal.bind(this)}
                    onRequestClose={this.toggleSemanticModal.bind(this)}
                >
                    <SemanticModalContent></SemanticModalContent>

                </Modal>}

                {(this.state.showcomparemodal) && <Modal className="comparemodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText="Get Started"
                    secondaryButtonText="Close"
                    modalHeading="Compare models"
                    modalLabel="Compare models"
                    onRequestSubmit={this.toggleShowCompare.bind(this)}
                    onRequestClose={this.toggleShowCompare.bind(this)}
                >
                    {/* <div className="mb10">
                        Charts of search score results for the current image using all
                         models and layers.
                   </div> */}
                    <CompareVisualization
                        data={{
                            metric: this.state.distanceMetricList[this.state.selectedmetric],
                            selectedimage: this.state.selectedsimimage,
                            numLayers: 8,
                            numModels: this.state.modelsList.length,
                            dataset: this.state.datasetsList[this.state.selecteddataset].name,
                            topx: this.state.topx,
                            chartWidth: 250,
                            chartHeight: 220,
                            datasetdictionary: this.datasetdictionary,
                            modelDetails: this.modelDetails
                        }}
                    />

                </Modal>}

                {(this.state.showdatasetmodal) && <Modal className="datasetmodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText="Get Started"
                    // secondaryButtonText = "Do not show this again"
                    modalHeading={this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}
                    modalLabel="Dataset details"
                    onRequestSubmit={this.toggleDatasetModal.bind(this)}
                    onRequestClose={this.toggleDatasetModal.bind(this)}
                >
                    <div className=" mb10">{this.state.datasetsList[this.state.selecteddataset].description}  </div>
                    {datasetClassImagesList}

                </Modal>}

                <div className=" flex   ">
                    <div className="iblock sectiontitle flexfull pt4 "> Image Similarity Search </div>
                    <div className="flex  ">
                        <div onClick={this.toggleSemanticModal.bind(this)} className="iblock floatright  clickable showmore"> ? More Info  </div>
                    </div>
                </div>

                {/* <div className="flex mt10">
                    <div className="flex4 mr10 mynotif lightbluehightlight  p20">
                        <div className="boldtext mb10"> Semantic Search</div>
                        <div className="lh10 maxh16">{semsearchIntro}</div>
                    </div>
                    <div className="flex6  mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Model architectures and Layers</div>
                        <div className="lh10 maxh16">{convnetLayer}</div>
                    </div>

                </div> */}

                <div className="flex ">
                    <div className="flex5 ">

                        <div className="mynotif h100 lh10 pl  instructions lightbluehightlight maxh16 mr10">
                            <div className="boldtext pb5"> Welcome!</div>
                            This demo allows you to perform <strong> semantic image search </strong> using convolutional neural networks
                            <span className="smalldesc"> [
                             <strong> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}   </strong>
                                {/* <strong>  {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}  </strong> */}
                                {/* <strong> DISTANCE METRIC: </strong>   {this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()} ] */}
                                ]</span>.
When you select an image (by clicking it), a neural network <span className="italics"> looks </span> at the content of all images in our dataset
                            and shows you the  <strong> top {this.state.topx} </strong> most similar images to the selected image.
                          </div>
                    </div>

                    <div className="flex5">
                        <div className="mynotif lh10    instructions lightbluehightlight maxh16">
                            <div className="boldtext pb5 advancedoptionsbox"> Advanced Options</div>
                            <div className="advancedgreyborder rad2 iblock pr10 pl10">
                                {/* <div className="mr10 pt10">Advanced options </div> */}
                                <div className="boldtext">
                                    <Toggle
                                        id="advancedoptionstoggle"
                                        className='smalldesc boldtext'
                                        labelA='Off'
                                        labelB='On'
                                        // onChange action('onChange'),
                                        onToggle={this.toggleAdvancedOptions.bind(this)}
                                    ></Toggle>
                                </div>

                            </div>
                            Interested in modifying search configurations (try different datasets, models, layers and distance metrics)
                            or a UMAP visualization of the features extracted by each layer? Turn on advanced options.



                        </div>

                    </div>

                </div>




                <div className={" " + (this.state.showadvanced ? "" : " displaynone")}>

                    {/* config panel and content */}
                    <div onClick={this.toggleModelConfig.bind(this)} className="unselectable mt10 p10 clickable  flex greymoreinfo">
                        <div className="iblock flexfull minwidth485"> <strong> {!this.state.showmodelconfig && <span>&#x25BC;  </span>} {this.state.showmodelconfig && <span>&#x25B2;  </span>} </strong> Search Configuration </div>
                        <div className="iblock   ">
                            <div className="iblock mr5"> <span className="boldtext"> {this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</span></div>
                            <div className="iblock">
                                <div className="smalldesc"> DATASET </div>
                            </div>
                        </div>

                    </div>

                    {<div style={{ zIndex: 500 }} className={"flex modelconfigdiv p10 " + (this.state.showmodelconfig ? "" : " displaynone")} >
                        <div className="flex2 mr10">
                            <div className=" pb10 sectiontitle" >
                                <div className="iblock">
                                    Select Dataset
                                </div>
                                <div className="iblock">
                                    {/* <Tooltip
                                        className="border"
                                        triggerText=""
                                    >
                                        <div className="wscore">
                                            This is the percentage of returned results that belong to the same category
                                                        as the selected image (weighted by position in the result list). In this case, <strong>{simCount} / {this.state.topx} results </strong>  are in same category
                                                        </div>

                                    </Tooltip> */}
                                </div>


                            </div>
                            <div className="horrule mb10"></div>
                            <div className=" datasetselectdiv scrollwindow layerwindow">
                                {datasetImageList}
                            </div>
                            <div className="">
                                <div className=" iblock boldtext  boldtext datasetdescription mr10  p10 greyhighlight">{this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</div>
                                <div onClick={this.toggleDatasetModal.bind(this)} className="iblock p10 greyhighlight clickable unselectable greymoreinfo mt10"> ? More Info </div>
                            </div>

                        </div>
                        <div style={{ zIndex: 100 }} className="flex3  mr10">
                            <div className=" pb10 sectiontitle" > Select Model </div>
                            <div className="horrule mb10"></div>
                            <div ref="modelscrollbox" className="datasetselectdiv scrollwindow layerwindow">
                                {modelImageList}
                            </div>
                            <div className=" iblock boldtext datasetdescription  p10 greyhighlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                        </div>
                        <div style={{ zIndex: 100 }} className="flex3  ">
                            <div className=" pb10 sectiontitle" > Select Layer </div>
                            <div className="horrule mb10"></div>
                            <div ref="layerscrollbox" className="scrollwindow layerwindow  mr10">
                                <div className="windowcontent"> {layerImageList} </div>
                            </div>
                            <div className="flex flexwrap pr10">
                                <div className="  mr10 ">
                                    {/* <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div> */}
                                    <div className=" iblock boldtext datasetdescription  p10 greyhighlight">{" LAYER " + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}</div>
                                </div>
                                <div className="flexfull ">
                                    {/* <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers}  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </div> */}
                                    <div className="smalldesc pt4"> <strong>Type: {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </strong> | <span className="smalldesc"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</span> </div>
                                    <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} channels </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex2">
                            <div className=" pb10 sectiontitle" > Distance Metric </div>
                            <div className="horrule mb10"></div>
                            <div className="scrollwindow layerwindow ">
                                <div className="windowcontent"> {metricImageList} </div>
                            </div>
                            <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> {this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()}</div>
                        </div>
                        <div className="horrule mb10"></div>

                    </div>}


                    {/* show umap panel and content */}
                    <div style={{ zIndex: 100 }} onClick={this.toggleUMAPView.bind(this)} className="unselectable mt10 p10 clickable  flex greymoreinfo">
                        <div className="iblock flexfull minwidth485"> <strong> {!this.state.showumap && <span>&#x25BC;  </span>} {this.state.showumap && <span>&#x25B2;  </span>} </strong> Visualization of Embeddings (UMAP) for Extracted Features </div>
                        <div className="iblock   ">
                            <div className="iblock mr5"> <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span></div>
                            <div className="iblock">
                                <div className="smalldesc"> LAYER {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} / {this.state.modelsList[this.state.selectedmodel].numlayers} </div>
                            </div>
                        </div>

                    </div>

                    {(this.state.showumap) &&
                        <div className="flex modelconfigdiv p10">
                            <Scene
                                setselected={this.setSelectedImage.bind(this)}
                                data={{

                                    dataset: this.state.datasetsList[this.state.selecteddataset].name,
                                    selectedimage: this.state.hoversimimage,
                                    model: this.state.modelsList[this.state.selectedmodel].name,
                                    layerindex: this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index,
                                    layer: this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name,
                                    dml: this.state.datasetsList[this.state.selecteddataset].name + this.state.modelsList[this.state.selectedmodel].name + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name + this.state.hoversimimage
                                }}
                            >
                            </Scene>
                        </div>
                    }

                </div>


                {/* top results */}
                {/* show top results panel and content */}
                {(this.state.showtopresults || this.searchCount > 0) &&
                    <div>
                        <div className="unselectable mt10    flex ">
                            <div onClick={this.toggleTopX.bind(this)} className=" iblock clickable greymoreinfo flexfull minwidth485 p10"> <strong> {!this.state.showtopresults && <span>&#x25BC;  </span>} {this.state.showtopresults && <span>&#x25B2;  </span>} </strong>
                                <strong>Top {this.state.topx} results </strong>  based on your search configuration
                                <span className="smalldesc"> [
                                    <strong> MODEL: </strong> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} |
                                    <strong> LAYER: </strong>  {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} |
                                    <strong> DISTANCE METRIC: </strong>   {this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()} ]
                                </span>
                            </div>

                            <div onClick={this.toggleShowCompare.bind(this)} className={" boldtext greenmoreinfo clickable bluehighlight justifycenter p10 flex flexcolumn " + (this.state.showadvanced ? "" : "displaynone")}>
                                ? Compare Models
                            </div>



                            {/* <div className="iblock   ">
                        <div className="iblock mr5"> <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span></div>
                        <div className="iblock">
                            <div className="smalldesc">  LAYER {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} / {this.state.modelsList[this.state.selectedmodel].numlayers} </div>
                        </div>
                    </div> */}

                        </div>

                    </div>
                }

                {
                    <div ref="topresultsbox" className="sliderboxcontainer transition3s">
                        <div className={" sliderbox topconfig" + (this.state.showtopresults ? " open" : " closed")}>

                            <div ref="glowbar" className="glowbar transitionw6s mb7 w0"></div>
                            <div className="flex ">
                                <div className="iblock h100 positionrelative  mr10">
                                    <img src={selectedImagePath} className="mainsimilarityimage rad4  iblock" alt="" />
                                    <div className="mt5  mainsimilaritytitle   lightbluehightlight">
                                        <div className="boldtext iblock mediumdesc mr5"> SELECTED IMAGE  </div>
                                        <div className="iblock smalldesc pt5 "> {selectedCat.toUpperCase()}  <strong>  </strong></div>
                                    </div>


                                    {/* <div> searchimi number {this.state.selectedsimimage}</div> */}
                                </div>
                                <div className=" flexfull">
                                    <div className="scrollwindow layerwindow ">
                                        <div className=" iblock mr10 rad3 ">
                                            <div className="pb5 smalldesc "> Search result score </div>
                                            <div className="topscorediv">

                                                <div className="mainscore  topmainscore"> {((modelScore / totalScore) * 100).toFixed(1) + "%"} </div>

                                                <div className="weightedscore smalldesc textaligncenter">
                                                    <Tooltip
                                                        triggerText="What is this?"
                                                    >

                                                        <div className="wscore">
                                                            This is the percentage of returned results that belong to the same category
                                                        as the selected image (weighted by position in the result list). For the current
                                                        search, <strong>{simCount} / {this.state.topx} results </strong>  are in same category <strong>({selectedCat.toUpperCase()})</strong>.
                                                                                                                                                                                                                                                                        Note that this score is conservative - some images may belong to different classes but
                                                        are <span className="italics"> similar </span> (e.g sedan, beetle, ferrari are <span className="italics">all</span> cars).
                                                        </div>

                                                    </Tooltip>
                                                </div>
                                            </div>

                                        </div>
                                        {similarImagesList.slice(1, this.state.topx + 1)}
                                        <br />
                                        <br />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>}

                {this.state.showtopresults &&
                    <div className="mb5 pt5 mediumdesc lhmedium textalignright mr10">
                        Search results not awesome? <strong>Hint:</strong> Try a different model or layer.
                    </div>
                }




                {/* daset div */}

                <div className="">
                    {/* <div className="horrule mt10"></div> */}
                    <div className="mb10 mt10 ">
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greyhighlight clickable unselectable greymoreinfo iblock mr10"}> {this.state.viewalldataset ? " View Images by Category" : "View All Images in Dataset"}   </div> */}
                        <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr5 " + (this.state.viewdatasetby == "all" ? "active" : "")} viewby="all">  All </div>
                        <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr10 " + (this.state.viewdatasetby == "category" ? "active" : "")} viewby="category">  By  Category </div>
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr10 " + (this.state.viewdatasetby == "graph" ? "active" : "")} viewby="graph">  Graph </div> */}

                        <div className="boldtext sectiontitle  iblock   h100 mt10  mr10"> DATASET: [ {this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()} ] </div>
                        <div className="iblock pt10">  {this.state.datasetsList[this.state.selecteddataset].description}   </div>
                    </div>
                    {/* <div className="horrule mb10"></div> */}
                    {/* <div className="mt10 mb10">
                          
                    </div> */}
                    <div className="lightbluehightlight mb10 "> Click an image to search for other similar images. </div>
                    <div className="  scrollwindow  datasetdivbox">
                        {this.state.viewdatasetby == "all" && datasetimagesList}
                        {this.state.viewdatasetby == "category" && datasetClassImagesList}

                        {/* { this.state.viewalldataset?  datasetimagesList: datasetClassImagesList}  */}
                    </div>
                </div>

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default SemanticEx;