import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';
import {abbreviateString, loadJSONData, makeFriendly, boundWidth} from "../../components/helperfunctions/HelperFunctions"
import "./modelex.css"
class ModelEx extends Component {


    constructor(props) {
        super(props);

        const modelDetailsViz = require('../../assets/models/models.json');
        const modelDetails = require('../../assets/models/model_details.json');
       
        let nList = []

        // console.log( modelDetailsViz[modelDetails["models"][0].name])

                    
        this.state = {
            selectedmodel: 0, 
            selectedlayer: 0,
            selectedneuron:0, 
            modelsList: modelDetails["models"],
            layersList: modelDetailsViz[modelDetails["models"][0].name],
            neuronList: nList,
            showmodelmodal: false
        }

        this.layerList = modelDetailsViz
        this.pageIntro = ` Convolutional Neural Network models are comprised of layers which learn heirarchical 
        representations. What kind of representations or features does each layer learn? 
        Well, let us explore the following models. `


    }

    componentDidMount() {
        document.title = "ConvNet Playground | Model Explorer";
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedlayer: 0 }) 
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedneuron: 0 }) 
    }

    
    clickNeuronImage(e) {
       
        // this.setState({selectedneuronpath: e.target.getAttribute("pathinfo")  })
        this.setState({ selectedneuron: e.target.getAttribute("indexvalue") }) 
        // this.setState({ selectedneuronindex: e.target.getAttribute("neuronindex") }) 
        
        // console.log(this.state.neuronList)

    }



    toggleModelsModal(e){
        this.setState({showmodelmodal: !(this.state.showmodelmodal)})
        // console.log(this.state.showmodelmodal)
    }


    render() {
        let modelInterpretabilityIntro = `Interpretable models are models we can "understand". 
        Interpretability explores approaches to better understand neural networks. For example, 
        how can we "peek" into a CNN to get an idea of what each neuron in a layer has learned to detect? `    

        let optimizationVisualization = `  
        One way to accomplish this is the use of optimization approaches to feature visualizations. Within this approach,
        we begin with random noise and update it (based on gradients) to maximally excite each neuron. 
        We use the lucid library to accomplish this and results are shown for a few models below.
        `

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
        let selectedModel = this.state.modelsList[this.state.selectedmodel].name
        let currentLayers = this.layerList[selectedModel] 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let neuronList = currentLayers[selectedlayer]

        this.state.neuronList = neuronList
        
        let neuronImageList
        if (neuronList) {
            neuronImageList = currentLayers[selectedlayer].map((ldata, index) => {    
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + ldata + ".jpg" 
            // console.log(imagePath)
            let neuronIndex = ldata.split(".")[0]
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> Neuron { neuronIndex }</div>
                    <img  onClick={this.clickNeuronImage.bind(this)}   src={imagePath} alt="" className={"neuronbox rad2 " + (this.state.selectedneuron == index ? "active" : "")} indexvalue={index} pathinfo={imagePath} neuronindex={neuronIndex} />
                </div>
            )
        });
        }
        

        return (
            <div>
                 
                <div className=" flex  "> 
                    <div  className="iblock sectiontitle flexfull   pt4 ">Model Explorer</div>
                    <div className="flex5  ">
                    <div onClick={this.toggleModelsModal.bind(this)}  className="iblock floatright  clickable showmodal"> ? More Info  </div>
                    </div>
                </div> 
                <div className="horrule"></div>
                {/* <InlineNotification
                    title={"Image Algebra"} 
                    kind={"info"} 
                    subtitle={this.pageIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                /> */}

                <div className="flex mt10">
                    <div className="flex5 mr10 mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Model Interpretability</div>
                        <div className="lh10">{modelInterpretabilityIntro}</div>
                    </div>
                    <div className="flex5  mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Optimization-based Feature Visualization</div>
                        <div className="lh10">{optimizationVisualization}</div>
                    </div>

                </div>

                <div className="flex flexwrap">
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
                        <div className="layerwindow ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                            <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index }  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers }  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type } </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} neurons  </div>
                            </div>
                        </div>
                        
                    </div>
                </div>


                <div className="mt20 mb10 ">
                    <div className="sectiontitle iblock mr10"> Neurons in {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} Layer </div>
                    <div className="iblock"> A selection of 30 neurons on the current layer.</div>
                </div>

                <div className="horrule mb10"></div>

                <div className="flex flexwrap">
                    <div className="flex1">
                        <div className="enlargeddiv rad2 mr10">
                            <div className="boldtext enlargeddesc mb10  p10 lightbluehightlight">{this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}: {this.state.neuronList[this.state.selectedneuron].split(".")[0]} / {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} </div>
                            <img className="enlargedneuron rad4" src={process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + this.state.neuronList[this.state.selectedneuron] + ".jpg"}  alt=""/>
                            
                        </div>
                        </div>
                    <div className="flexfull">
                        {neuronImageList}
                    </div>
                   
                </div>

               


                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default ModelEx;