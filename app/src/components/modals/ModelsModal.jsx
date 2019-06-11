import React, { Component } from "react";

class ModelsModalContent extends Component {
    render() {
        return (
            <div>
                 
                <div className="horrule mb10 pt10"></div>

                 <div className="boldtext"> Interpretability via Visualizations </div>
                 Interpretable models are models we can "understand". Interpretability explores approaches to better understand neural networks. 
                 For example, how can we "peek" into a CNN to get an idea of what each neuron in a layer has learned to detect?
                <br/> 

                <div className="boldtext mt10"> Optimization-based Feature Visualization</div>
                Within this approach to visualizing layers and neurons, we begin with random noise and update it (based on gradients) 
                to maximally excite each neuron. The Lucid library is used to generate visualizations for layers in the models below. 
                
                 
            </div>
        );
    }
}

export default ModelsModalContent;