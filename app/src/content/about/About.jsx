import React, { Component } from "react";
import HeaderMessage from "../../components/modals/HeaderMessage"
import { InlineNotification } from 'carbon-components-react';
import "./about.css"


class About extends Component {

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
                <div className="pb10 sectiontitle"> What is ConvNet Playground! </div>
                <div className="horrule mb10"></div>

                <div className="  p10 lh10">
                    Convnet Playground -  <i> is a tool for the interactive exploration of Convolutional Neural Networks (Convnets or CNNs)</i>.
                    It focuses on the use case of <span className="boldtext">"semantic image search"</span>  which allows us search for images by content.
                    To implement this, a Convolutional Neural Network <span className="italics"> looks </span> at the content of an images
                    and can find all other images similar to that image.


               </div>



            </div>
        );
    }
}

export default About 