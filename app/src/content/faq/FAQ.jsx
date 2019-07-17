import React, { Component } from "react";
import "./faq.css"


class FAQ extends Component {

    constructor(props) {
        super(props);



        this.state = {
            // selecteddataset: this.datasetslist[0]
        }


        this.algebraIntro = ` CNNs work really well. They are data hungry and also energy hungry!
         Estimating how much energy (and compute) is needed to run a prediction for each model architecture can be
         an important heuristic that informs how you build online prediction apis.`

    }

    componentDidMount() {
        document.title = "ConvNet Playground | About ";
    }

    clickDatasetImage() {
        alert("click here")

    }


    render() {

        return (
            <div>
                {/* <div className="pb10 sectiontitle"> Q: What is ConvNet Playground! </div>
                <div className="mb20 lh10 answerarea">
                    Convnet Playground -  <i> is a tool for the interactive exploration of Convolutional Neural Networks (Convnets or CNNs)</i>.
                    It focuses on the use case of <span className="boldtext">"semantic image search"</span>  which allows us search for images by content.
                    To implement this, a Convolutional Neural Network <span className="italics"> looks </span> at the content of an images
                    and can find all other images similar to that image.
                    It also provides an interface for viewing the features learned by layers in a pretrained CNN.
               </div> */}


                <div className="pb10 sectiontitle pt4"> Q:  So .. What are Convolutional Neural Networks? </div>
                {/* <div className="horrule mb10"></div> */}
                <div className="lh10 mb20 answerarea">
                    Convolutional Neural Networks (CNN or ConvNet) are a class
                    of <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Deep_learning#Deep_neural_networks">deep neural networks</a> mostly 
                    applied to the task of image analysis.
                    CNNs learn hierarchical representations which are useful for multiple tasks - early layers in a CNN learn low level features 
                    (e.g. colours, lines, edges, shapes) while later layers learn high level concepts (e.g eyes, legs, faces, doors, etc.) 
                    depending on the dataset used for training. For more information on ConvNets, we
                    recommend the <a target="_blank" rel="noopener noreferrer" href="http://cs231n.stanford.edu/">CS231n Stanford Course</a> .
               </div>

                <div className="pb10 sectiontitle"> Q: What questions can I ask with ConvNet Playground? </div>
                {/* <div className="horrule mb10"></div> */}
                <div className="lh10 mb20 answerarea">

                ConvNet playground focuses on  a simple example of 
                    semantic search using 
                        
                neural networks - <span className=" italics">
                   given a dataset of existing images, and a new arbitrary image (search query), find a subset of images from the 
                        dataset that are most similar to the new image.       
                </span>
                    
                &nbsp; In this implementation, we extract features (embeddings) for images in our dataset and compute similarity as the distance between these embeddings.
                    We perform this using multiple configurations (datasets, models, layers distance metrics) 
                    and allow the user to interactively ask questions of the results.
                    
    
                <ul className="pt10 pb10">
                        <li>
                            <span className="boldtext"> - How does semantic search (vanilla pretrained models) perform?  </span>
                            
                            Hint: We included a search score to <span className="italics">quantify</span> how well each model works for a given query.  
                            Explore this with the top search results view and search score metric.
                            </li>
                        <li> 
                            <span className="boldtext"> - How well does each model/layer configuration capture “semantic meaning” for a given dataset?  </span>
                            Hint: A good model should extract embeddings where similar images are close to each other, 
                            and dissimilar images are far from each other. 
                            You can explore this using the UMAP embeddings visualization view (advanced options). 

                        </li>
                        <li>
                            <span className="boldtext"> - For a given search query, how does search performance compare for each model/layer configuration? </span>
                             Hint: Use  the compare models view  (advanced options).
                        </li>
                        <li>
                            <span className="boldtext"> - What type of features/patterns are detected by various layers in a pretrained model? </span>
                             Hint: Use  the model explorer tab to view examples of patterns learned by  layers in 8 models pretrained on imagenet.
                        </li>
                        <li></li>
                    </ul>
                    
                    <div className=" pb10">
                        Note that the approach in this prototype (use of features from pretrained models) is relatively simple and 
                        hence has limitations (scale, matching multiple objects in search query, accuracy). 
                        In practice, we can extend this work by fine-tuning specialized models for given datasets, 
                        leveraging additional information (e.g text descriptions, interaction logs, purchase logs etc)
                        in constructing more meaningful embeddings or 
                        using a two stage approach for matching multiple objects in the search query (extract object crops and use as search queries). 
                    </div>
                    
                    
                
                        
                    
    
                    {/* <div className="flex flexwrap">
                        <div className="flex35 answerarea mr10">
                            <div>
                                <div> How well do features from a layer capture similarity in a dataset?</div>
                                <div> <strong>Hint: </strong> Try the UMAP visualization view.</div>
                                 
                            </div>
                        </div>
                        <div className="flex35 answerarea mr10">
                            <div>
                                How do models compare for a given search query?
                                <br />
                                <strong>Hint:</strong> Use the search score metric, compare results from each model/layer.</div>
                        </div>
                        <div className="flex3 answerarea">
                            <div> What features are learned by the models in each layer?</div>
                            <div> <strong>Hint: </strong> Try model explorer view.</div>
                             
                        </div>
                    </div> */}



                </div>


                <div className="pb10 sectiontitle">Q:  Does all of this run in realtime?</div>
                {/* <div className="horrule mb10 "></div> */}
                <div className="lh10 answerarea mb20">
                    No. We have precomputed all of the values beforehand. We have extracted features from all images in our dataset
                    using layers from all supported models. We have also precomputed the similarity between each of these features
                    and show these results based on your selections.
               </div>

                <div className="pb10 sectiontitle">Credits</div>
                <div className="lh10 answerarea mb10 pb20">
                    This project was created by Victor Dibia (<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/vykthur">@vykthur</a>) at Fast Forward Labs.
                    It builds on many related projects and tools aimed at making Neural Networks more accessible
                    via interactive experiences. Some of these related projects include  &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://distill.pub/2017/feature-visualization/">Feature Visualization,</a> &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://playground.tensorflow.org">Tensorflow Playgroud,</a> &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://teachablemachine.withgoogle.com">Teachable Machine,</a> &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://transcranial.github.io/keras-js/#/">Keras.js </a> &nbsp; and many others.&nbsp;
                    ConvNet Playground uses
                    the <a target="_blank" rel="noopener noreferrer" href="https://github.com/tensorflow/lucid/tree/master/lucid">lucid</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/totti0223/lucid4keras">lucid4keras</a> libraries
                    to visualize features learned by channels in a
                    layer, <a target="_blank" rel="noopener noreferrer" href="https://anseki.github.io/leader-line/">leader-line </a> for drawing svg lines
                    and <a target="_blank" rel="noopener noreferrer" href="https://www.carbondesignsystem.com/">carbon</a> design system for layout.
                  Thanks to Grant Custer for valuable <a target="_blank" rel="noopener noreferrer" href="https://observablehq.com/@bryakas/using-three-js-for-2d-data-visualization">pointers on Three.js</a> and the rest of the
                                Fast Forward Labs team for feedback and guidance!
                     
                </div>


                <br />
                <br/><br/>
            </div>
        );
    }
}

export default FAQ 