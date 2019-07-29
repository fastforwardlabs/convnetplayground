import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';
import "./modelpatterns.css"


class ModelPatterns extends Component {

    constructor(props) {
        super(props);


        this.datasetslist = [
            { name: "CIFAR100x", css: "active", index: [0] },
            { name: "ICONIC3K", css: "" },
            { name: "IMAGENET3K", css: "" }
        ]

        this.state = {
            selecteddataset: this.datasetslist[0]
        }


        this.algebraIntro = ` CNNs work really well. They are data hungry and also energy hungry!
         Estimating how much energy (and compute) is needed to run a prediction for each model architecture can be
         an important heuristic that informs how you build online prediction apis.`

    }

    componentDidMount() {
        document.title = "ConvNet Playground | Image Algebra";
    }

    clickDatasetImage() {
        alert("click here")

    }


    render() {
        // let datasetImageList = this.datasetslist.map(dsdata => {
        //     return (
        //         <div className="iblock datasetfullbox clickable ">
        //             <div className="datasettitles"> {dsdata.name}</div>
        //             <img key={dsdata} onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + dsdata.css} />
        //         </div>
        //     )
        // });

        // let holdarray = Array.from(Array(50).keys());
        // let allDatasetImageList = holdarray.map(dsdata => {
        //     return (
        //         <div className="iblock datasetfullbox ">
        //             <div className="datasettitles"> {dsdata.name}</div>
        //             <img key={dsdata} onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className="datasetbox rad2 dsselected " />
        //         </div>
        //     )
        // });

        return (
            <div className="h100 ">
                <div className="pb10 sectiontitle"> Model Patterns </div>
                <div className="horrule"></div>

                <div className="flex flexcolumn h100">
                    <div className="flex9 border"></div>
                </div>

            </div>
        );
    }
}

export default ModelPatterns 