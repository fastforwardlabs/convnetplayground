import React, { Component } from "react";

class ModelsModalContent extends Component {
    render() {
        return (
            <div>

Convnet Playground is a research prototype by Cloudera Fast Forward Labs, built to accompany our updated report on 
                Image Analysis. More about this report is described in our blog post.
            
                <br/>
                Convolutional Neural Networks (Convnets or CNNs) are deep neural networks that can learn hierarchical representations 
                useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours) 
                while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training. 
                In Convnet Playground, features extracted using layers from a CNN are used for 
                semantic search (image retrieval based on similarity of extracted features). 

                 
                <div className="horrule mb10 pt10"></div>

                 <div className="boldtext"> Interpretability via Visualizations </div>
                 Interpretable models are models we can "understand". Interpretability explores approaches to better understand neural networks. 
                 For example, how can we "peek" into a CNN to get an idea of what each neuron (or groups of neurons) in a layer has learned to detect?
                <br/> 

                <div className="boldtext mt10"> Optimization-based Feature Visualization</div>
                Within this approach to visualizing layers and neurons, we begin with random noise and update it (based on gradients) 
                to maximally excite each neuron.
                The <a href="https://github.com/tensorflow/lucid/tree/master/lucid" target="_blank" rel="noopener noreferrer" >Lucid</a> library is used to generate each image.
                     
                
                 
            </div>
        );
    }
}

export default ModelsModalContent;