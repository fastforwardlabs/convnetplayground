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


                <div className="pb10 sectiontitle pt4"> Q:  So .. What is a Convolutional Neural Network? </div>
                {/* <div className="horrule mb10"></div> */}
                <div className="lh10 mb20 answerarea">
                    I guess the real first question is what is a neural network?
               </div>

                <div className="pb10 sectiontitle"> Q: What Questions Can I ask With ConvNet Playground? </div>
                {/* <div className="horrule mb10"></div> */}
                <div className="lh10 mb20 ">

                    <div className="flex flexwrap">
                        <div className="flex35 answerarea mr10">
                            <div>
                                <div> How well does features from a layer capture similarity in a dataset?</div>
                                <div> <strong>Hint: </strong> Try the UMAP visualization view</div>
                                <img className="qimg rad4 pt5 " src={process.env.PUBLIC_URL + "/images/umap.jpg"} alt="" />
                            </div>
                        </div>
                        <div className="flex35 answerarea mr10">
                            <div>
                                How do models compare for a given search query?
                                <br />
                                <strong>Hint:</strong> You can use the search score metric and compare models option.</div>
                        </div>
                        <div className="flex3 answerarea">
                            <div> What features are learned by the models in each layer?</div>
                            <div> <strong>Hint: </strong> Try model explorer view</div>
                            <img className="qimg rad4 pt5 " src={process.env.PUBLIC_URL + "/images/patterns.jpg"} alt="" />

                        </div>
                    </div>



                </div>


                <div className="pb10 sectiontitle">Q:  Does all of this run in Realtime?</div>
                {/* <div className="horrule mb10 "></div> */}
                <div className="lh10 answerarea mb20">
                    No. We have precomputed all of the values beforehand. We have extracted features from all images in our dataset
                    using layers from all supported models. We have also precomputed the similarity between each of these features
                    show these results based on your selection.
               </div>

                {/* <div className="pb10 sectiontitle">Credits</div> 
                <div className="lh10 answerarea mb10 pb20">
                    This project was created by Victor Dibia at Fast Forward Labs.
                    This work builds on many interesting projects and tools aimed at making Neural Networks more accessible
                    via interactive experiences. Some of these related projects include the &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://playground.tensorflow.org">Tensorflow Playgroud,</a> &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://teachablemachine.withgoogle.com">Teachable Machine,</a> &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://transcranial.github.io/keras-js/#/">Keras.js </a> &nbsp; and many others.&nbsp;
                    This project uses
                    the <a target="_blank" rel="noopener noreferrer" href="https://github.com/tensorflow/lucid/tree/master/lucid">lucid</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/totti0223/lucid4keras">lucid4keras</a> library
                    to visualize features learned by channels in a
                    layer, <a target="_blank" rel="noopener noreferrer" href="https://anseki.github.io/leader-line/">leader-line </a> for drawing svg lines
                    and <a target="_blank" rel="noopener noreferrer" href="https://www.carbondesignsystem.com/">carbon</a> design system for layout.
                  Thanks to Grant Custer and the rest of the
                    Fast Forward Labs team for the valuable <a target="_blank" rel="noopener noreferrer" href="https://observablehq.com/@bryakas/using-three-js-for-2d-data-visualization">pointers</a>, feedback and guidance!
               </div> */}



            </div>
        );
    }
}

export default FAQ 