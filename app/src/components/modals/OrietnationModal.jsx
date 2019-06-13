import React, { Component } from "react";

class OrientationModalContent extends Component {
    render() {
        return (
            <div>
                Convnet Playground is a research prototype by Clouderaa Fast Forward Labs, built to accompany our updated report on 
                Image Analysis. More about this report is described in our blog post.
            
                <div className="horrule mb10 pt10"></div>
                Convolutional Neural Networks (Convnets or CNNs) are deep neural networks that can learn hierarchical representations 
                useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours) 
                while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training. 
                In Convnet Playground, features extracted using layers from a CNN are used for 
                semantic search (image retrieval based on similarity of extracted features). 

                
                <div className="horrule mb10 pt10"></div>

                <div className="boldtext"> Semantic Search </div>
                This section of the prototype shows how features extracted using layers from a CNN can be used to 
                implement image similarity search capabilities (finding images that are similar in content to a selected image). 
                The interface allows you select a search configuration 
                (dataset, model, layer, distance metric) and shows the a list of results for a search query. 
                By changing search  configuration parameters, you can observe how various models and layers perform 
                on the task of extracting important features useful for  similarity search. 

                <br/>
                 
                <div className="boldtext mt10"> Models Explorer</div>
                This section enables the user to view visualizations of select layers and channels (collection of neurons neurons) within a model.
                This can help provide intuition on how/why CNNs are effective for image analysis tasks such as image classification
                object detection, image segmentation, image generation etc etc.
                <br/>  
              
            </div>
        );
    }
}

export default OrientationModalContent;