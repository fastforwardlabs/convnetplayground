import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';

class ModelEx extends Component {


    constructor(props) {
        super(props);

 

        this.state = {
             
        }


        this.pageIntro = ` Convolutional Neural Network models are comprised of layers which learn heirarchical 
        representations. What kind of representations or features does each layer learn? 
        Well, let us explore the following models. `


    }

    componentDidMount() {
        document.title = "ConvNet Playground | Model Explorer";
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
               


                 
            </div>
        );
    }
}

export default ModelEx;