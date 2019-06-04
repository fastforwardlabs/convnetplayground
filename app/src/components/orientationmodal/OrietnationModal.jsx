import React, { Component } from "react";

class OrientationModalContent extends Component {
    render() {
        return (
            <div>
                Convnet Playground is a research prototype by Clouderaa Fast Forward Labs, built to accompany our updated report on 
                Image Analysis. More about this report is described in our blog post.
            
                <div className="horrule mb10 pt10"></div>
                Convolutional Neural Networks (Convnets or CNNs) are deep neural networks that cna learn heirarchical representations 
                useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, shapes, colours) 
                while later layers learn high level concepts (e.g eyes, legs, faces, doors etc). 
                In Convnet Playground, we features extracted using layers from a CNN can be used for 
                semantic search (image retrieval). 

                To explore this prototype, the user can select a configuration (dataset, model, layer, distance metric) and then view 
                how these result in different image similarity rankings.

                <div className="horrule mb10 pt10"></div>

                <div className="boldtext"> Datasets </div>
                [TinyImagenet] This dataset contains 64px * 64px images and is a subset of the Tiny Imagenet Visual Recognition Challenge dataset.
                It consists of images from 10 categories (faces, shoes, teapots, goldfish,frogs)
                [Iconic3k] This is a dataset collected from Flickr images (open attribution) of real world iconic images taken by users.
                It contains images spanning 10 keyword searches (toyota corolla, volkswagen beetle, honda civic, tractors, bananna, pineapples)

                <div className="boldtext mt10"> Models and Layers</div>
                We provide 10 models and a selection of layers from each model. The user can then observe how these model + layer 
                configurations impact the similarity rankings for each image in a dataset.  
              
            </div>
        );
    }
}

export default OrientationModalContent;