import React, { Component } from "react";
import { ToastNotification, InlineNotification } from 'carbon-components-react';
import "./algebraex.css"
 

class AlgebraEx extends Component {

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


        this.algebraIntro = ` With Image Algebra, we take advantage of complex meaningful representations that 
        can be learned with ConvNets and use them as variables in simple and interesting algebra operations.
        If we "subtract" the representation of the horizon with trees from the representation of just trees ..
        is the resulting representation most similar to that of plain horizon? Well, lets find out.`

    }

    componentDidMount() {
        document.title = "ConvNet Playground | Image Algebra";
    }

    clickDatasetImage() {
        alert("click here")

    }

    clickDatasetImage() {
        alert("click here")

    }


    render() {
        let datasetImageList = this.datasetslist.map(dsdata => {
            return (
                <div className="iblock datasetfullbox clickable ">
                    <div className="datasettitles"> {dsdata.name}</div>
                    <img key={dsdata} onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + dsdata.css} />
                </div>
            )
        });

        let holdarray = Array.from(Array(50).keys());
        let allDatasetImageList = holdarray.map(dsdata => {
            return (
                <div className="iblock datasetfullbox ">
                    <div className="datasettitles"> {dsdata.name}</div>
                    <img key={dsdata} onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className="datasetbox rad2 dsselected " />
                </div>
            )
        });

        return (
            <div>
                <div className="pb10 sectiontitle"> Image Algebra</div>
                <div className="horrule"></div>
                <InlineNotification
                    title={"Image Algebra"}
                    subtitle={"How it works."}
                    kind={"info"} 
                    subtitle={this.algebraIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                />
               


                 
            </div>
        );
    }
}

export default AlgebraEx 