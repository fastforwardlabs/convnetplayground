import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';
import {abbreviateString, loadJSONData, makeFriendly, boundWidth} from "../../components/helperfunctions/HelperFunctions"

class ModelEx extends Component {


    constructor(props) {
        super(props);

        let mList = [{name:"vgg16", layers:[{name:"b1_conv", layer_index:"4", parametercount:3000, type:"Conv2D"}, {name:"block3_conv2", layer_index:"4", parametercount:3000, type:"Conv2D"} ]},
                    {name:"vgg19",layers:[{name:"b1_conv", layer_index:"4", parametercount:3000, type:"Conv2D"}, {name:"block5_Conv4", layer_index:"4", parametercount:3000, type:"Conv2D"} ]},
                    {name:"resnet50",layers:[{name:"r5_abr", layer_index:"4", parametercount:13000, type:"Conv2D"}, {name:"b1_cor4_rgt_nv", layer_index:"4", parametercount:3000, type:"Conv2D"} ]}]
        this.state = {
            selectedmodel: 0, 
            selectedlayer: 0,
            modelsList:mList
        }


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

        return (
            <div>
                <div className="pb10 sectiontitle"> Model Explorer </div>
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
                        <div className="scrollwindow  ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                            <div className=" iblock boldtext datasetdescription  p10 lightbluehightlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index }  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers }  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type } </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
               


                 
            </div>
        );
    }
}

export default ModelEx;