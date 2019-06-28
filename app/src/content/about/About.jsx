import React, { Component } from "react";
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
                <div className="pb10 sectiontitle"> FAQ </div>
                <div className="horrule"></div>
                <InlineNotification
                    title={"Energy Costs for Model Predictions"}
                    kind={"info"}
                    subtitle={this.algebraIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                />

                <div>
                    Convolutions account for over 90% of all energy requirements of most CNN models.

               </div>



            </div>
        );
    }
}

export default About 