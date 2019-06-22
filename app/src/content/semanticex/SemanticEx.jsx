import React, { Component } from "react";
import { Modal } from 'carbon-components-react';
// import Notification20 from '@carbon/icons-react/lib/notification/20';
import "./semanticex.css"
import SemanticModalContent from "../../components/modals/SemanticModal"
import { abbreviateString, loadJSONData, makeFriendly, boundWidth } from "../../components/helperfunctions/HelperFunctions"

import Scene from "../../components/three/Scene"
const LeaderLine = window.LeaderLine;

class SemanticEx extends Component {
    constructor(props) {
        super(props);
        const modelDetails = require('../../assets/semsearch/details.json');
        this.datasetdictionary = require('../../assets/semsearch/datasetdictionary.json');

        // const initialSimilarityPath = "../../assets/semsearch/similarity/" + modelDetails["datasets"][0].name + "/" + modelDetails["models"][0].name + "/" + modelDetails["metrics"][0] + "/" + modelDetails["models"][0].layers[0] + ".json"
        const similarityArray = require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block1_conv1.json');
        // require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block5_pool.json');
        // console.log(similarityArray)



        this.state = {
            selecteddataset: 0,
            selectedmodel: modelDetails["models"].length - 1,
            selectedsimimage: 0,
            selectedlayer: modelDetails["models"][modelDetails["models"].length - 1].layers.length - 1,
            selectedmetric: 0,
            similarityArray: similarityArray,
            datasetArray: [],
            datasetsList: modelDetails["datasets"],
            modelsList: modelDetails["models"],
            distanceMetricList: modelDetails["metrics"],
            // showorientationmodal: !this.props.pageviewed,
            showmodelconfig: true,
            showumap: false,
            showdatasetmodal: false,
            showtopresults: false,
            viewdatasetby: "category",
            topx: 10
        }
        this.updateSimilarity()
        this.loadDatasetList()

        this.searchCount = 0;
        this.lineHolder = []
    }

    componentDidMount() {
        this.drawLines()
        document.title = "ConvNet Playground | Semantic Search Explorer";

    }
    componentWillUnmount() {
        this.removeLines();
    }

    checkInView(container, element, partial) {

        //Get container properties
        let cTop = container.scrollTop;
        let cBottom = cTop + container.clientHeight;

        //Get element properties
        let eTop = element.offsetTop - 340;
        let eBottom = eTop + element.clientHeight;

        //Check if in view    
        let isTotal = (eTop >= cTop && eBottom <= cBottom);
        let isPartial = partial && (
            (eTop < cTop && eBottom > cTop) ||
            (eBottom > cBottom && eTop < cBottom)
        );

        //Return outcome
        // console.log( "cT:", cTop, "cB:", cBottom, "eT:", eTop, "eB:", eBottom, isTotal || isPartial)
        return (isTotal || isPartial);
    }

    drawLines(e) {
        this.removeLines()
        let self = this;
        let layers = this.state.modelsList[this.state.selectedmodel].layers
        let models = this.state.modelsList

        // layers.forEach(function (each, i) {
        //     let inView = self.checkInView(self.refs["layerscrollbox"], self.refs["layerimg" + i], false, i)
        //     // console.log(i, inView)

        // })
        // let inView = self.checkInView(self.refs["modelscrollbox"], self.refs["modelimg0"], true, 0)


        // console.log(layers)
        let modelVisible = self.checkInView(self.refs["modelscrollbox"], self.refs["modelimg" + this.state.selectedmodel], false)
        layers.forEach(function (each, i) {

            let layerVisible = self.checkInView(self.refs["layerscrollbox"], self.refs["layerimg" + i], false)
            if (layerVisible && modelVisible) {
                // console.log("we drawing to", i)

                let line = new LeaderLine(self.refs["modelimg" + self.state.selectedmodel], self.refs["layerimg" + i], {
                    color: 'red',
                    startPlug: 'disc',
                    endPlug: 'circle',
                    path: "fluid",
                    size: 3,
                    hide: true,
                });
                document.querySelector('.leader-line').style.zIndex = -100
                let animOptions = { duration: 800, timing: 'linear' }

                line.show("draw", animOptions)
                self.lineHolder.push(line)
            }


        })

    }
    removeLines(e) {
        this.lineHolder.forEach(function (each) {
            each.remove()
        })
        this.lineHolder = []
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedmodel !== prevState.selectedmodel || this.state.selectedmetric !== prevState.selectedmetric || this.state.selectedlayer !== prevState.selectedlayer || this.state.selecteddataset !== prevState.selecteddataset) {
            this.updateSimilarity()
            this.setState({ showtopresults: true })
        }
        if (this.state.selectedmodel !== prevState.selectedmodel) {
            this.drawLines()
        }
    }

    clickDatasetImage(e) {
        this.setState({ selecteddataset: e.target.getAttribute("indexvalue") })
        // this.setState({ selectedmodel: 0 })
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") })
        // this.setState({ selectedlayer: 0 })
        // this.drawLines()
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") })
    }

    clickMetricImage(e) {
        this.setState({ selectedmetric: e.target.getAttribute("indexvalue") })
    }

    clickSimilarImage(e) {
        // this.setState({ selectedsimimage: })
        // // this.setState({ showumap: false })
        // this.setState({ showtopresults: true })
        this.setSelectedImage(e.target.getAttribute("indexvalue"))
    }
    setSelectedImage(val) {
        this.setState({ selectedsimimage: val })
        this.setState({ showtopresults: true })
        this.searchCount++
    }

    toggleSemanticModal(e) {
        this.setState({ showorientationmodal: !(this.state.showorientationmodal) })
        // console.log(this.state.showorientationmodal)
    }


    toggleModelConfig(e) {
        this.setState({ showmodelconfig: !(this.state.showmodelconfig) })
        // console.log(this.state.showorientationmodal)
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

    toggleViewDatasetBy(e) {
        this.setState({ viewdatasetby: e.target.getAttribute("viewby") })
    }

    showTopResults() {
        this.setState({ showtopresults: true })
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

                self.setState({ datasetArray: data["0"] })
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
                        <img key={classval + "image"} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 " + (this.state.selectedsimimage == classval ? "active" : "")} indexvalue={classval} />
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

            // return (
            //     <div key={className + "fullbox" + index} className="positionrelative  mr10 border ">
            //         {/* <div className="p10 unselectable unclickable mr20 boldtext categorytitle "> {className.toUpperCase()} </div>  */}
            //         <div>{clist}</div>
            //     </div>
            // )
        });

        let similarImagesList = this.state.similarityArray[this.state.selectedsimimage].map((alldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
            // console.log(imagePath)
            let similarityScore = (alldata[1] * 1).toFixed(3)
            let returnValue = (
                <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                    <div className="smalldesc mb5">{makeFriendly(similarityScore)} </div>
                    <img key={alldata[0] + "image" + alldata[0]} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 "} indexvalue={alldata[0]} />
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
            <div>


                {(this.state.showorientationmodal) && <Modal className="orientationmodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={false}
                    primaryButtonText="Get Started"
                    secondaryButtonText="Close"
                    modalHeading="Semantic Search"
                    modalLabel="ConvNet Playground"
                    onRequestSubmit={this.toggleSemanticModal.bind(this)}
                    onRequestClose={this.toggleSemanticModal.bind(this)}
                >
                    <SemanticModalContent></SemanticModalContent>

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
                    <div className="iblock sectiontitle flexfull   pt4 "> Image Similarity Search </div>
                    <div className="flex  ">
                        <div onClick={this.toggleSemanticModal.bind(this)} className="iblock floatright  clickable showmore"> ? More Info  </div>
                    </div>
                </div>
                <div className="horrule"></div>
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

                <div className="mynotif lh10 p20 mt10 instructions lightbluehightlight maxh16">
                    In this demo, we use features extracted from convolutional neural networks to search for images that are
                    similar to a selected image.
                    To <strong> perform a search</strong>, <strong>click</strong>  on any image to select it and the  <strong> top {this.state.topx} </strong>
                    most similar images (from our dataset) will be displayed. The
                    <strong> Search Configuration </strong> interactive panel lets you observe how different models, layers and distance metrics affect search results for different datasets.

                    <br />
                    <strong> Hint:</strong>  Early layers work well for simple feature matching (colors, lines), later layers work well for complex concepts (faces, cars etc).

                </div>




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

                {(this.state.showmodelconfig) && <div style={{ zIndex: 500 }} className="flex modelconfigdiv p10">
                    <div className="flex2 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Dataset </div>
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
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div ref="modelscrollbox" className="datasetselectdiv scrollwindow layerwindow">
                            {modelImageList}
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 greyhighlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                    </div>
                    <div style={{ zIndex: 100 }} className="flex3  ">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
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
                        <div className="mt20 pb10 sectiontitle" > Distance Metric </div>
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
                                model: this.state.modelsList[this.state.selectedmodel].name,
                                layerindex: this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index,
                                layer: this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name,
                                dml: this.state.datasetsList[this.state.selecteddataset].name + this.state.modelsList[this.state.selectedmodel].name + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
                            }}
                        >
                        </Scene>
                    </div>
                }


                {/* top results */}
                {/* show top results panel and content */}
                {(this.state.showtopresults || this.searchCount > 0) && <div onClick={this.toggleTopX.bind(this)} className="unselectable mt10 p10 clickable  flex greymoreinfo">
                    <div className="iblock flexfull minwidth485"> <strong> {!this.state.showtopresults && <span>&#x25BC;  </span>} {this.state.showtopresults && <span>&#x25B2;  </span>} </strong> <strong>Top {this.state.topx} results </strong>  with  <strong className="smalldesc">{this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()}</strong> similarity score. </div>
                    <div className="iblock   ">
                        <div className="iblock mr5"> <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span></div>
                        <div className="iblock">
                            <div className="smalldesc"> LAYER {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} / {this.state.modelsList[this.state.selectedmodel].numlayers} </div>
                        </div>
                    </div>

                </div>}

                {
                    <div className="sliderboxcontainer pt10 ">
                        <div className={" sliderbox topconfig" + (this.state.showtopresults ? " open" : " closed")}>


                            <div className="flex">
                                <div className="iblock positionrelative flex1 mr10">
                                    <img src={selectedImagePath} className="mainsimilarityimage rad4  iblock" alt="" />
                                    <div className="mt5  mainsimilaritytitle   lightbluehightlight">
                                        <div className="boldtext iblock mediumdesc mr5"> SELECTED IMAGE  </div>
                                        <div className="iblock smalldesc pt5 "> {selectedCat.toUpperCase()}  <strong>  </strong></div>
                                    </div>


                                    {/* <div> searchimi number {this.state.selectedsimimage}</div> */}
                                </div>
                                <div className=" flexfull">
                                    {/* <div className="flex mb10">
                                <div className="flexfull"> <div className="mainsimilaritydesc lightbluehightlight p10"> <strong>Top {this.state.topx} results </strong>  with  <strong className="smalldesc">{this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()}</strong> similarity score. </div></div>
                                <div className="">
                                    <div className="block p10 greyhighlight   ">
                                        <div className="iblock mr5"> <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span></div>
                                        <div className="iblock">
                                            <div className="smalldesc">  {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div> */}

                                    <div className="scrollwindow layerwindow ">

                                        <div className=" iblock mr10 rad3 ">
                                            <div className="pb5 smalldesc "> weighted score </div>
                                            <div className="topscorediv">

                                                <div className="mainscore  topmainscore"> {((modelScore / totalScore) * 100).toFixed(1) + "%"} </div>
                                                <div className="weightedscore smalldesc textaligncenter"> {simCount} / {this.state.topx} results <br /> in same category </div>
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
                <div className="horrule mb10"></div>
                <div className="">
                    <div>
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greyhighlight clickable unselectable greymoreinfo iblock mr10"}> {this.state.viewalldataset ? " View Images by Category" : "View All Images in Dataset"}   </div> */}
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr5 " + (this.state.viewdatasetby == "all" ?  "active" : "" ) } viewby="all">  All </div> */}
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr10 " + (this.state.viewdatasetby == "category" ?  "active" : "" ) } viewby="category">  By  Category </div> */}
                        {/* <div onClick={this.toggleViewDatasetBy.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr10 " + (this.state.viewdatasetby == "graph" ?  "active" : "" ) } viewby="graph">  Graph </div> */}

                        <div className="boldtext mb10 iblock  mr10"> Dataset [ {this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()} ] </div>
                        <div className="iblock pt10">  {this.state.datasetsList[this.state.selecteddataset].description}   </div>
                    </div>
                    {/* <div className="horrule mb10"></div> */}
                    {/* <div className="mt10 mb10">
                          
                    </div> */}
                    <div className="lightbluehightlight mb10 mt10"> Click an image to search for other similar images. </div>
                    <div className="  scrollwindow  datasetdivbox">
                        {this.state.viewdatasetby == "all" && datasetimagesList}
                        {this.state.viewdatasetby == "category" && datasetClassImagesList}

                        {/* { this.state.viewalldataset?  datasetimagesList: datasetClassImagesList}  */}
                    </div>
                </div>

                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default SemanticEx;