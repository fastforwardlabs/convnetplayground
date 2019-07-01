import React, { Component } from "react";
import HeaderMessage from "./HeaderMessage"
class ModelsModalContent extends Component {
    render() {
        return (
            <div>
                <HeaderMessage></HeaderMessage>
                
                <br/>
        
                This section of the prototype allows you <strong>view visualizations</strong> of the channels (groups of neurons) across layers in 
                9 convolutional neural network models (pretrained on imagenet).

                <br />
                 
                 
                <div className="horrule mb10 pt10"></div>
                <div className="boldtext"> Convolutional Neural Netwoks</div>
                CNNs learn hierarchical representations
                useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours)
                while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training.


                 <div className="boldtext mt10"> Interpretability via Visualizations </div>
                 Interpretable models are models we can "understand". One way to achieve this is to visualize the features learned by 
                 neurons (or groups of neurons) in the model. In this section of the prototype, we present visualizations 
                 from 30 random channels (groups of neurons) from layers in 9 different models (vgg16, vgg19, mobilenet, xception, resnet50, inceptionv3, densenet121).
                 
                
                 {/* <img className="mt10 w100" src={process.env.PUBLIC_URL + "/assets/semsearch/images/model.gif"} alt="" />
                 <div className="smalldesc mb10">Selecting a model shows a list of some of its layers. Selecting a layer shows visualizations of its channels.</div> */}

<br />
                 {/* An observation of these images show how complexity of learned features increases with deeper layers in the model. */}
                
                Channel images are generated using the <a href="https://github.com/tensorflow/lucid/tree/master/lucid" target="_blank" rel="noopener noreferrer" >Lucid Library</a>  which
                 implements optimization based  <a href="https://distill.pub/2017/feature-visualization/" target="_blank" rel="noopener noreferrer"> feature visualization  </a> for neurons, channels, logits and layers of a neural network. 

                <br />
                Note: A layer must be differentiable in order to be visualized using optimization approaches, hence not all layers are visualized.
                A selection of 30 channels are chosen for convenience.


                <br/>  
                     
                
                 
            </div>
        );
    }
}

export default ModelsModalContent;