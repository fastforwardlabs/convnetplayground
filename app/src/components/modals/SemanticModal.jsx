import React, { Component } from "react";
import HeaderMessage from "./HeaderMessage"
class SemanticModalContent extends Component {
    render() {
        return (
            <div className="mr10">
                <HeaderMessage></HeaderMessage>

                <br />
                This section of the prototype allows you to perform <strong>semantic image search</strong>  using convolutional neural networks.
                When you select an image (by clicking it), a neural network looks at the content of all
                images in our dataset and shows you the top most similar images to the selected image.

                <br />



                <div className="horrule mb10 pt10"></div>
                <div className="boldtext"> Convolutional Neural Netwoks</div>
                CNNs learn hierarchical representations
                useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours)
                while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training.



                <div className="boldtext mt10"> Extracting Similarity Using Convolutional Networks </div>
                Semantic search explores the use features extracted (embeddings) from images using layers in a CNN to compute the "similarity" between images.
                We have precomputed the extracted features from images in 4 datasets using 7 different CNN models (pretrained on imagenet)
                and 8 <i>selected layers </i> from each model. We have also computed the similarity
                between all of these features using 4 different similarity metrics. This demo allows you interactively explore the results of these computations.
                Start by performing a search query (clicking an image).

                {/* <img className=" mt10 w100" src={process.env.PUBLIC_URL + "/assets/semsearch/images/embed.jpg"} alt="" />
                <div className="smalldesc mb10">Clicking on an image shows the top similar returned based on embeddings from a CNN model.</div> */}
                <br />
                Do different models (e.g vgg19 vs ResNet50) perform differently?
                How do the embeddings they generate differ?
                How do layers compare?
                You can explore these questions by enabling "advanced options"  - selecting various search
                configurations, viewing UMAP visualizations of embeddings from each layer, and using
                the <span className="italics">compare models</span> button.

                {/* <img className=" mt10 w100" src={process.env.PUBLIC_URL + "/assets/semsearch/images/config.gif"} alt="" />
                <div className="smalldesc mb10">Use the search configuration panel to try different datasets, models, layers and distance metrics</div> */}

                <br />


                The <strong> search results score </strong>  is the percentage of returned results that belong to the same category
                as the selected image, weighted by position in the result list i.e correct results that are ranked top of the
                           result list get more points compared to correct results at the end of the list.
                For example, for a search query which is an image of a Banana, the search score will be 100%
                if all returned images all belong to the same category  (Bananas).
                Note that this score is conservative - some images may belong to different classes
                but are <span className="italics"> also similar </span> (e.g sedan, beetle, ferrari are <span className="italics">all</span> cars).
                The search score can be used to easily compare  the performance of each search configuration.



                <div className="boldtext mt10"> Models and Layers</div>
                We provide results from 7 models (vgg16, vgg19, mobilenet, xception, resnet50, inceptionv3, densenet121)
                and a selection of 8 layers from each model. The models are presented in order of increasing complexity (number of layers)
                and show marked differences in their ability to generate features that correctly identify similar images.

                <div className="boldtext mt10"> Distance Metric </div>
                We provide results that from the use of 4 different distance metrics in measuring the similarity between
                features extracted from all images in each dataset. These include cosine, euclidean, squared euclidean and minkowsi distances.
                <br /> Hint: Cosine works best.


                <div className="boldtext mt10"> Datasets </div>

                <strong> [Iconic200] </strong> This is a dataset of real world images collected from Flickr (creative commons).
                It contains images spanning 10 keyword searches (arch, banana, volkswagen beetle, eiffel tower, empire state building, ferrari, pickup truck, sedan, stonehenge, tractor).
                These images are chosen deliberately with conceptual overlaps (several car brands, similar colors across classes) which can be challenging to distinguish.
                This in turn offers opportunity to evaluate how various models hand these overlaps.
                <br />

                <strong> [Fashion200] </strong>  A collection of 200 images (10 categories) of real fashion models from
                the <a href="https://www.kaggle.com/paramaggarwal/fashion-product-images-dataset" target="_blank" rel="noopener noreferrer">Kaggle Fashion Product Images Dataset</a> .
Images have a max width of 300px. Categories include flipflops, menjeans, menshirt, mentshirt, sandals, sportshoe, womenheels, womenjeans, womentshirt.
                <br />

                <strong>[TinyImagenet200]</strong>  This dataset contains 64px * 64px images and is a subset (200) of
                the <a href="https://tiny-imagenet.herokuapp.com/" target="_blank" rel="noopener noreferrer" >Tiny Imagenet Visual Recognition Challenge dataset.</a> It consists of
                images from 10 categories (arch, bottle, bridge, bus, face, frog, goldfish, sandals, teapot, tractor).
                <br />

                <strong>[Cifar10] </strong> This is a subset (200 images) of the popular
                <a href="https://www.cs.toronto.edu/~kriz/cifar.html" target="_black"> cifar10 </a>  dataset
                containing 20 images from 10 randomly selected classes. Each image is 32px by 32px in dimension.

                <br />
                <br />
            </div>
        );
    }
}

export default SemanticModalContent;