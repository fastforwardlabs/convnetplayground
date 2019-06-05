import React, { Component } from "react";

class SemanticModalContent extends Component {
    render() {
        return (
            <div>
                 
                <div className="horrule mb10 pt10"></div>
                 

                <div className="boldtext"> Datasets </div>
                [TinyImagenet] This dataset contains 64px * 64px images and is a subset of the Tiny Imagenet Visual Recognition Challenge dataset.
                It consists of images from 10 categories (faces, shoes, teapots, goldfish, frogs, ..)
                <br/>
                [Iconic3k] This is a dataset collected from Flickr images (open attribution) of real world iconic images taken by users.
                It contains images spanning 10 keyword searches (toyota corolla, volkswagen beetle, honda civic, tractors, bananna, pineapples, ..)

                <div className="boldtext mt10"> Models and Layers</div>
                We provide 10 models and a selection of layers from each model. 
                These include VGG16, ResNet50, .. . 
                <br/> Click on a model or layer to select it and layer to display additional information.
              
            </div>
        );
    }
}

export default SemanticModalContent;