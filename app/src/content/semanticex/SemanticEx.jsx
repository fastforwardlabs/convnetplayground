import React, { Component } from "react";
import { ToastNotification, InlineNotification, Tooltip } from 'carbon-components-react';
import "./semanticex.css"
 
function abbreviateString(value, maxLength){ 
    if (value.length <= maxLength){
        return value
    } else {
        return value.substring(0,maxLength) + " .."
    } 
}

class SemanticEx extends Component {
    constructor(props) {
        super(props);

        const similarityData = require('../../assets/semsearch/details.json');
        console.log(similarityData["datasets"])

        this.state = {
            selecteddataset: 0,
            selectedmodel: 0,
            selectedlayer:0,
            datasetsList : similarityData["datasets"],
            modelsList: similarityData["models"]
        }


        

    }

    componentDidMount() {
        document.title = "ConvNet Playground | Semantic Search Explorer";
    }

    clickDatasetImage(e) {

        this.setState({selecteddataset: e.target.getAttribute("indexvalue")})
    }

    clickModelImage(e){ 
        this.setState({selectedmodel: e.target.getAttribute("indexvalue")})     
    }

    clickLayerImage(e){ 

        this.setState({selectedlayer: e.target.getAttribute("indexvalue")})

    }

    clickAllDatasetImage() {
         

    }


    render() {
        let datasetImageList = this.state.datasetsList.map((dsdata, index) => {
            return (
                <div key={dsdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10">
                    <div className="datasettitles"> {dsdata.name.toUpperCase()}</div>
                    <img  onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + (this.state.selecteddataset == index? "active": "")} indexvalue={index}  />
                </div>
            )
        });


        let modelImageList = this.state.modelsList.map((mdata, index) => {
            return (
                <div key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {mdata.name.toUpperCase()}</div>
                    <img  onClick={this.clickModelImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index? "active": "")} indexvalue={index}  />
                </div>
            )
        });

        let layerImageList = this.state.modelsList[this.state.selectedmodel].layers.map((ldata, index) => {
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(ldata,11).toLowerCase()}</div>
                    <img  onClick={this.clickLayerImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index? "active": "")} indexvalue={index}  />
                </div>
            )
        });

        let holdarray = Array.from(Array(50).keys());
        let allDatasetImageList = holdarray.map((alldata, index) => {
            return (
                <div  key={alldata + "winper"} className="iblock datasetfullbox "> 
                    <img onClick={this.clickAllDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className="simiimage clickable rad2 " />
                </div>
            )
        });

        let semsearchIntro = `Layers in a trained convolutional neural network (CNN) can be used to extract features from images.
        Semantic image search explores how we can use these extracted features to compare the similarity of images 
        and hence "search" for similar images.  `

        let convnetLayer = `How do features extracted using different model architectures compare? What layers perform better and when?
        What similarity metrics work best? This demo helps you investigate these questions!`

        let introHeight= "8.5rem"
        return (
            <div>
                 
                <div className="pb10 sectiontitle"> What is Semantic Search?</div>
                <div className="horrule"></div>
                <div className="flex mt10">
                    <div className="flex5 mr10 mynotif lightbluehightlight p20">
                            <div className="boldtext mb10"> Semantic Search</div>
                            <div className="lh10">{semsearchIntro}</div>
                    </div>
                    <div className="flex5  mynotif lightbluehightlight p20">
                            <div className="boldtext mb10"> Convnet Models and Layer</div>
                            <div className="lh10">{convnetLayer}</div>
                    </div>
    
                </div>
                
                <div className="flex flexwrap">
                    <div className="flex4 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Dataset </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv">
                            {datasetImageList}
                        </div>
                        <div className=" iblock boldtext  iblock boldtext datasetdescription  p10 lightbluehightlight">{this.state.datasetsList[this.state.selecteddataset].name.toUpperCase()}</div>
                    </div>
                    <div className="flex5 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div className="datasetselectdiv">
                            {modelImageList}
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                    </div>
                    <div className="flex5">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow  ">
                             <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].toUpperCase()}</div>
                    </div>

                </div>
                
                
                <div className="mt20 mb10 sectiontitle"> Perform a Similarity Search</div>
                <div className="horrule mb10"></div>
                <div className="flex">
                   <div className="iblock  flex1">
                    <img src={require("../../images/0.jpg")} className="mainsimilarityimage rad4 mr10 iblock" alt=""/>
                    <div className="boldtext"> Selected Image </div>
                   </div>
                    <div className="iblock flex10">{allDatasetImageList}</div>
                </div>
            </div>
        );
    }
}

export default SemanticEx;