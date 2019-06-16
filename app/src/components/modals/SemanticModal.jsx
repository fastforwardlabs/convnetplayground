import React, { Component } from "react";

class SemanticModalContent extends Component {
    render() {
        return (
            <div>
                 
                <div className="horrule mb10 pt10"></div>

                 <div className="boldtext"> Extracting Similarity Using Convolutional Networks </div>
                Layers in a trained convolutional neural network (CNN) can be used to extract features from images.
                Semantic search explores the use these extracted features in computing the "similarity" between images. 
                We have precomputed the extracted features from images in 3 datasets, using 8 different models 
                and 8 different layers from each model. We have also computed the similarity 
                between all of these features using 4 different similarity metrics. 
                This demo allows you interactively explore the results of these computations. <br/>
                How do features extracted using different model architectures compare? What layers perform better and when?
                What similarity distance metrics work best? This demo helps you investigate these questions!
                <br/> 

                The weighted score is a provides insights on the performance of each search configuration 
                based on the percentage of search results that belong to the same conceptual category as the searched item. 
                The score is weighted by the position of retrieval i.e correct results that are ranked top of the 
                similarity list get more points compared to correct results ranked at the end.

                <div className="boldtext mt10"> Datasets </div>
                
                <strong> [Iconic200] </strong> This is a dataset of real world images collected from Flickr (creative commons).
                It contains images spanning 10 keyword searches (arch, banana, volkswagen beetle, eiffel tower, empire state building, ferrari, pickup truck, sedan, stonehenge, tractor).
                These images are chosen deliberately with conceptual overlaps (several car brands, similar colors across classes) to highlight 
                how various models perform in correctly representing similarity.
                <br/>

                <strong>[TinyImagenet200]</strong>  This dataset contains 64px * 64px images and is a subset (200) of the
                 <a href="https://tiny-imagenet.herokuapp.com/" target="_blank" rel="noopener noreferrer" > Tiny Imagenet Visual Recognition Challenge dataset.</a> 
                It consists of images from 10 categories (arch, bottle, bridge, bus, face, frog, goldfish, sandals, teapot, tractor).
                <br/>

                <strong>[Cifar10] </strong> This is a subset (200 images) of the popular 
                <a href="https://www.cs.toronto.edu/~kriz/cifar.html" target="_black"> cifar10 </a>  dataset 
                containing 20 images from 10 randomly selected classes. Each image is 32px by 32px in dimension.

                <div className="boldtext mt10"> Models and Layers</div>
                We provide results from 8 models (vgg16, vgg19, mobilenet, xception, resnet50, inceptionv3, densenet121) 
                and a selection of layers from each model. The models are presented in order of increasing complexity (number of layers)
                and show marked differences in their ability to generate features that correctly identify similar images.  

                <div className="boldtext mt10"> Distance Metric </div>
                We provide results that from the use of 4 different distance metrics in measuring the similarity between 
                features extracted from all images in each dataset. These include cosine, euclidean, squared euclidean and minkowsi distances.  
                <br/> Hint: Cosine works best.  
            </div>
        );
    }
}

export default SemanticModalContent;