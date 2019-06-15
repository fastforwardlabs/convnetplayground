import React, { Component } from "react";
import { Modal } from 'carbon-components-react';
// import Notification20 from '@carbon/icons-react/lib/notification/20';
import "./semanticex.css"
import SemanticModalContent from "../../components/modals/SemanticModal"
import { abbreviateString, loadJSONData, makeFriendly, boundWidth } from "../../components/helperfunctions/HelperFunctions"

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
            selectedmodel: modelDetails["models"].length -1,
            selectedsimimage: 0,
            selectedlayer: modelDetails["models"][modelDetails["models"].length -1].layers.length -1,
            selectedmetric: 0,
            similarityArray: similarityArray,
            datasetArray: [],
            datasetsList: modelDetails["datasets"],
            modelsList: modelDetails["models"],
            distanceMetricList: modelDetails["metrics"],
            showorientationmodal: false,
            showmodelconfig: false,
            showdatasetmodal: false,
            showtopresults: false,
            viewalldataset: true,
            topx: 15
        }
        // setTimeout(() => {
        this.updateSimilarity()
        this.loadDatasetList()
        // }, 2000);
       

    }

    componentDidMount() {
        document.title = "ConvNet Playground | Semantic Search Explorer";
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedmodel !== prevState.selectedmodel || this.state.selectedmetric !== prevState.selectedmetric || this.state.selectedlayer !== prevState.selectedlayer || this.state.selecteddataset !== prevState.selecteddataset) {
            this.updateSimilarity()
            this.setState({ showtopresults: true })
        }
    }

    clickDatasetImage(e) {
        this.setState({ selecteddataset: e.target.getAttribute("indexvalue") })
        this.setState({ selectedmodel: 0 })
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") })
        this.setState({ selectedlayer: 0 })
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") })
    }

    clickMetricImage(e) {
        this.setState({ selectedmetric: e.target.getAttribute("indexvalue") })
    }

    clickSimilarImage(e) {
        this.setState({ selectedsimimage: e.target.getAttribute("indexvalue") })
        // this.setState({ showmodelconfig: false })
        this.setState({ showtopresults: true })
    }

    toggleSemanticModal(e) {
        this.setState({ showorientationmodal: !(this.state.showorientationmodal) })
        // console.log(this.state.showorientationmodal)
    }

   
    toggleModelConfig(e) {
        this.setState({ showmodelconfig: !(this.state.showmodelconfig) })
        // console.log(this.state.showorientationmodal)
    }

    toggleDatasetModal(e) {
        this.setState({ showdatasetmodal: !(this.state.showdatasetmodal) }) 
    }

    toggleViewAllImages(e) {
        this.setState({ viewalldataset: !(this.state.viewalldataset) }) 
    }

    showTopResults(){
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
                <div key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {mdata.name.toUpperCase()}</div>
                    <div className="smalldesc pb5">{mdata.numlayers} layers </div>
                    <img onClick={this.clickModelImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index ? "active" : "")} indexvalue={index} />
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
                    <div className="datasettitles"> {abbreviateString(ldata.name, 11).toLowerCase()}</div>
                    <img onClick={this.clickLayerImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
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

        let datasetClassImagesList = datasetClasses.map((className, index) => {
            let classcon = this.datasetdictionary["classes"][this.state.datasetsList[this.state.selecteddataset].name]
            let clist = classcon[className].map((classval, index) => {
                let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + classval + ".jpg"
            
                return (
                    <div key={classval + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                        <img key={classval + "image"  } onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 " + (this.state.selectedsimimage == classval ? "active" : "")} indexvalue={classval} />
                    </div>
                )
            });
            return (
                <div key={className + "fullbox" + index} className=" mb10 mr10 ">
                    <div className="pb5 mr20 boldtext "> {className.toUpperCase()} </div> 
                    <div>{clist}</div>
                </div>
            )
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

        let simArr =this.state.similarityArray[this.state.selectedsimimage].slice(1, this.state.topx + 1)
        let allDictionary = this.datasetdictionary.dictionary[this.state.datasetsList[this.state.selecteddataset].name] 
        let selectedCat = allDictionary[this.state.selectedsimimage] 
        // console.log(simar.slice(1, this.state.topx + 1))
        // console.log(this.state.selectedsimimage)
        let simCount = 0
        let modelScore = 0
        let totalScore = 0
        for  (var i in simArr){ 
            if (selectedCat == allDictionary[simArr[i][0]]) {
                simCount++
                modelScore += (this.state.topx - i)/ this.state.topx
            }
            totalScore += (this.state.topx - i)/ this.state.topx
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

        let datasetSimpleimagesList = this.state.datasetArray.map((alldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
            // let similarityScore = (alldata[1] * 1).toFixed(3) 
            let returnValue = (
                <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                    <img key={alldata[0] + "image" + alldata[0]} src={imagePath} alt="" className={"simiimage  rad2 " + (this.state.selectedsimimage == alldata[0] ? "active" : "")} indexvalue={alldata[0]} />
                </div>
            )
            return (returnValue)
        });

 

        let selectedImagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.selectedsimimage + ".jpg"
        // process.env.PUBLIC_URL + "/assets/semsearch/datasets/cifar100/train/" + this.state.selectedsimimage + ".jpg"
        return (
            <div>
               

                {(this.state.showorientationmodal) && <Modal className="orientationmodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText="Get Started"
                    // secondaryButtonText = "Do not show this again"
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
                    <div className=" ">{this.state.datasetsList[this.state.selecteddataset].description}  </div>
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
                   
                    <br/>
                    <strong> Hint:</strong>  Early layers work well for simple feature matching (colors, lines), later layers work well for complex concepts (faces, cars etc).
                    
                </div>

              
                {/* config panel and content */}
                <div onClick={this.toggleModelConfig.bind(this)} className="unselectable mt10 p10 clickable  flex greymoreinfo">
                    <div className="iblock flexfull minwidth485"> <strong> {!this.state.showmodelconfig &&  <span>&#x25BC;  </span> } {this.state.showmodelconfig &&  <span>&#x25B2;  </span> } </strong> Search Configuration </div>
                    <div className="iblock   ">
                        <div className="iblock mr5"> <span className="boldtext"> {this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</span></div>
                        <div className="iblock">
                            <div className="smalldesc"> DATASET </div>
                        </div>
                    </div>

                </div>
                {(this.state.showmodelconfig) && <div className="flex modelconfigdiv p10">
                    <div className="flex2 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Dataset </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv scrollwindow layerwindow">
                            {datasetImageList}
                        </div>
                        <div>
                            <div className=" iblock boldtext  boldtext datasetdescription mr10  p10 greyhighlight">{this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</div>
                            <div onClick={this.toggleDatasetModal.bind(this)} className="iblock p10 greyhighlight clickable unselectable greymoreinfo"> ? More Info </div>
                        </div>
                        
                    </div>
                    <div className="flex3  mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv scrollwindow layerwindow">
                            {modelImageList}
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 greyhighlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                    </div>
                    <div className="flex3  ">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow layerwindow  mr10">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                                <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers}  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </div>
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
               
                


                 
                {/* top results */}
                { 
                <div className="sliderboxcontainer pt10 ">
                    <div className={"  flex sliderbox topconfig" + (this.state.showtopresults ? " open": " closed") }>
                        <div className="iblock  flex1 mr10">
                            <img src={selectedImagePath} className="mainsimilarityimage rad4  iblock" alt="" />
                            <div className="mt5  datasetdescription   lightbluehightlight"> 
                                <div className="boldtext iblock mediumdesc mr5"> SELECTED IMAGE  </div>
                                <div className="iblock smalldesc pt5 ">  CLASS: [{selectedCat.toUpperCase()}]</div>
                            </div>
                        
                        
                            {/* <div> searchimi number {this.state.selectedsimimage}</div> */}
                        </div>
                        <div className=" flexfull">
                            <div className="flex mb10">
                                <div className="flexfull"> <div className="mainsimilaritydesc lightbluehightlight p10"> <strong>Top {this.state.topx} results </strong>  with  <strong className="smalldesc">{this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()}</strong> similarity score. </div></div>
                                <div className="">
                                    <div className="block p10 greyhighlight   ">
                                        <div className="iblock mr5"> <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span></div>
                                        <div className="iblock">
                                            <div className="smalldesc">  {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div className="scrollwindow layerwindow ">
                                {similarImagesList.slice(1, this.state.topx+1)}
                                <div className=" iblock mr10 rad3 "> 
                                    <div className="pb5 smalldesc "> weighted score </div>
                                    <div className="topscorediv">
                                       
                                        <div className="mainscore  topmainscore"> { ( (modelScore/totalScore) *100 ).toFixed(1)  + "%"} </div>
                                        <div className="weightedscore smalldesc textaligncenter"> {simCount} / {this.state.topx} correct classes </div>
                                    </div>
                                    
                                </div>
                               <br/>
                               <br/>
                            </div>
                            
                        </div>
                    </div>
                </div> }

                {this.state.showtopresults &&
                    <div className=" pt5 mediumdesc lhmedium textalignright mr10"> 
                    Search results not awesome? <strong>Hint:</strong> Try a different model or layer. 
                    </div>
                }
                

               
                
                {/* daset div */}

                <div className="mt10">
                    <div>
                        <div onClick={this.toggleViewAllImages.bind(this)} className="p10 greyhighlight clickable unselectable greymoreinfo iblock mr10"> {this.state.viewalldataset ? " View by Category" : "View All"}   </div>
                         
                                <div className="boldtext mb10 iblock mr10"> Dataset [ {this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()} ] </div>
                                <div className="iblock">Click an image to search for the most similar images. </div>
                    </div>
                    <div className="horrule mb10"></div>
                    <div className="mt10 mb10">
                          
                    </div>
                    <div className="  scrollwindow  datasetdivbox"> { this.state.viewalldataset?  datasetimagesList: datasetClassImagesList} </div>
                </div>

                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default SemanticEx;