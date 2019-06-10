import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';
import "./energyex.css"
 

class showmodelmodal extends Component {

    constructor(props) {
        super(props);


        this.datasetslist = [
            { name: "CIFAR100x", css: "active" , index:[0]},        
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
            <div>
                <div className="pb10 sectiontitle"> Energy Explorer</div>
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

export default showmodelmodal 