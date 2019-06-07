import React, { Component } from "react";
import { Modal } from 'carbon-components-react';
import Notification20 from '@carbon/icons-react/lib/notification/20';
import "./semanticex.css"
import SemanticModalContent from "../../components/modals/SemanticModal"
import {abbreviateString, loadJSONData, makeFriendly, boundWidth} from "../../components/helperfunctions/HelperFunctions"

class SemanticEx extends Component {
    constructor(props) {
        super(props);

        const modelDetails = require('../../assets/semsearch/details.json');
        // console.log (similarityArray)
        const initialSimilarityPath = "../../assets/semsearch/similarity/" + modelDetails["datasets"][0].name + "/" + modelDetails["models"][0].name + "/" + modelDetails["metrics"][0] + "/" + modelDetails["models"][0].layers[0] + ".json"
        const similarityArray = require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block1_conv1.json');
        // require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block5_pool.json');
        // console.log(similarityArray)
        
        
        this.state = {
            selecteddataset: 0,
            selectedmodel: 0,
            selectedsimimage: 0,
            selectedlayer: 0,
            selectedmetric: 0,
            similarityArray: similarityArray,
            datasetsList: modelDetails["datasets"],
            modelsList: modelDetails["models"],
            distanceMetricList: modelDetails["metrics"],
            showorientationmodal: false,
            topx:5
        }
        // setTimeout(() => {
        this.updateSimilarity() 
        // }, 2000);
       
    }

    componentDidMount() {
        document.title = "ConvNet Playground | Semantic Search Explorer"; 
    }

    componentDidUpdate(prevProps, prevState) {
        if ( this.state.selectedmodel !== prevState.selectedmodel || this.state.selectedmetric !== prevState.selectedmetric || this.state.selectedlayer !== prevState.selectedlayer || this.state.selecteddataset !== prevState.selecteddataset) {
            this.updateSimilarity()
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
        
    }

    toggleSemanticModal(e){
        this.setState({showorientationmodal: !(this.state.showorientationmodal)})
        // console.log(this.state.showorientationmodal)
    }
     

    updateSimilarity() {

        let similarityPath = process.env.PUBLIC_URL +  "/assets/semsearch/similarity/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.modelsList[this.state.selectedmodel].name + "/" + this.state.distanceMetricList[this.state.selectedmetric] + "/" + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name + ".json"
        let loadedJSON =  loadJSONData(similarityPath)  
        // console.log(similarityPath)    
        let self = this 
        loadedJSON.then(function(data){ 
            if(data){
                self.setState({similarityArray:data}) 
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
            return (
                <div key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {mdata.name.toUpperCase()}</div>
                    <img onClick={this.clickModelImage.bind(this)} src={require("../../images/model.png")} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let layerImageList = this.state.modelsList[this.state.selectedmodel].layers.map((ldata, index) => {
            
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(ldata.name, 11).toLowerCase()}</div>
                    <img onClick={this.clickLayerImage.bind(this)} src={require("../../images/layer.png")} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let metricImageList = this.state.distanceMetricList.map((metric, index) => {
            return (
                <div key={metric + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(metric, 11).toLowerCase()}</div>
                    <img onClick={this.clickMetricImage.bind(this)} src={require("../../images/layer.png")} alt="" className={"datasetbox rad2 " + (this.state.selectedmetric == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        // console.log(this.state.similarityArray[this.state.selectedsimimage]) 
       
         
        let similarImagesList = this.state.similarityArray[this.state.selectedsimimage].map((alldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + alldata[0] + ".jpg"
            // console.log(imagePath)
            let similarityScore = (alldata[1] * 1).toFixed(3) 
            let isTopX = index == this.state.topx ? true: false
            let returnVlaue = ( 
                <div key={alldata[0] + "winper"} className="iblock similarityfullbox mr5 mb5 positionrelative">
                    <img key={alldata[0] + "image" + alldata[0]} onClick={this.clickSimilarImage.bind(this)} src={imagePath} alt="" className={"simiimage clickable rad2 "} indexvalue={alldata[0]} />
                    <div className="outersimbar">
                        <div className="innersimbar" style={{ width: (boundWidth(similarityScore) *100) + "%" }}></div>
                    </div>
                    <div className="similarityscorebox">{ makeFriendly(similarityScore) } </div>
                    {/* <div>{ "w:" + boundWidth(similarityScore)*100  }</div> */}
                </div>
            )

            // return (returnVlaue)

            if (isTopX){
                return ( 
                    <div key={alldata[0] + "winper"}  className="">
                         
                        {/* {returnVlaue} */}
                    </div>
                )
            }else{
                return (returnVlaue)
            }
            
        });
       
        

        let semsearchIntro = `Layers in a trained convolutional neural network (CNN) can be used to extract features from images.
        Semantic search explores the use these extracted features in computing the "similarity" between images.  `

        let convnetLayer = `How do features extracted using different model architectures compare? What layers perform better and when?
        What similarity distance metrics work best? This demo helps you investigate these questions!`

        // let introHeight= "8.5rem"

        let selectedImagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.selectedsimimage + ".jpg"
        // process.env.PUBLIC_URL + "/assets/semsearch/datasets/cifar100/train/" + this.state.selectedsimimage + ".jpg"
        return (
            <div>

                { (this.state.showorientationmodal) && <Modal className="orientationmodal" 
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText = "Get Started"
                    // secondaryButtonText = "Do not show this again"
                    modalHeading= "Semantic Search"  
                    modalLabel= "How this demo works"
                    onRequestSubmit = {this.toggleSemanticModal.bind(this)}
                    ref={(ref) => this.orientationModal = ref}
                    onRequestClose = {this.toggleSemanticModal.bind(this)}
                    >
                    <SemanticModalContent></SemanticModalContent>
                    
                </Modal>} 

                <div className=" flex  "> 
                    <div  className="iblock sectiontitle flexfull   pt4 ">What is Semantic Search?</div>
                    <div className="flex5  ">
                    <div onClick={this.toggleSemanticModal.bind(this)}  className="iblock floatright  clickable showmodal"> ? More Info  </div>
                    </div>
                </div>
                <div className="horrule"></div>
                <div className="flex mt10">
                    <div className="flex5 mr10 mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Semantic Search</div>
                        <div className="lh10">{semsearchIntro}</div>
                    </div>
                    <div className="flex5  mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Model architectures and Layers</div>
                        <div className="lh10">{convnetLayer}</div>
                    </div>

                </div>

                <div className="flex flexwrap">
                    <div className="flex2 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Dataset </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv">
                            {datasetImageList}
                        </div>
                        <div className=" iblock boldtext  iblock boldtext datasetdescription  p10 lightbluehightlight">{this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</div>
                    </div>
                    <div className="flex3 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv">
                            {modelImageList}
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                    </div>
                    <div className="flex3">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow  ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                            <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index }  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers }  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type } </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} neurons </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="flex2">
                        <div className="mt20 pb10 sectiontitle" > Distance Metric </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow  ">
                            <div className="windowcontent"> {metricImageList} </div>
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight"> {this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()}</div>
                    </div>

                </div>


                <div className="mt20 mb10 ">
                    <div className="sectiontitle iblock mr10"> Similarity search </div>
                    <div className="iblock"> Select an image to view most similar based on model output.</div>
                </div>
                <div className="horrule mb10"></div>
                <div className="flex">
                    <div className="iblock  flex1 mr10">
                        <img src={selectedImagePath} className="mainsimilarityimage rad4  iblock" alt="" />
                        <div className=" mt10  boldtext datasetdescription  p10 lightbluehightlight"> SEARCH IMAGE </div>
                        {/* <div> searchimi number {this.state.selectedsimimage}</div> */}
                    </div>
                    <div className=" flexfull">
                        <div className="mb10 mainsimilaritydesc lightbluehightlight p10">
                            Based on features extracted using <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </span>
                            , layer <span className="boldtext"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} </span>
                            and  <span className=" boldtext"> COSINE </span> distance metric, the  images below are ranked from most similar to least similar.

                        </div>
                        <div>{similarImagesList}</div>
                    </div>
                </div>
                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default SemanticEx;