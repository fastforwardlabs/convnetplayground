import React, { Component } from "react";
import { ToastNotification, InlineNotification } from 'carbon-components-react';
import "./semanticex.css" 

// const kinds = {
//     'Error (error)': 'error',
//     'Info (info)': 'info',
//     'Success (success)': 'success',
//     'Warning (warning)': 'warning',
//   };
// const notificationProps = () => ({
//     kind: select('The notification kind (kind)', kinds, 'info'),
//     lowContrast: boolean('Use low contrast variant (lowContrast)', false),
//     role: text('ARIA role (role)', 'alert'),
//     title: text('Title (title)', 'Notification title'),
//     subtitle: text('Subtitle (subtitle)', 'Subtitle text goes here.'),
//     iconDescription: text(
//         'Icon description (iconDescription)',
//         'describes the close button'
//     ),
//     hideCloseButton: boolean('Hide close button (hideCloseButton)', false),
//     onCloseButtonClick: action('onCloseButtonClick'), });

class SemanticEx extends Component {

    

    constructor(props) {
        super(props);
        this.semsearchIntro = ` Layers in a trained convolutional neural network (CNN) can be used to extract features from images.
        The idea of semantic image search explores how we can use these extracted features to compare the similarity of images 
        and hence "search" for similar images. How do different architectures compare? What layers perform better and when?
        What similarity metrics work best? This demo helps you investigate these questions! `

        this.datasetslist = [ {name: "CIFAR100x", opacitystyle:"active"}, 
        {name: "ICONIC3K", opacitystyle:""}, 
        {name: "IMAGENET3K", opacitystyle:""} ]
    }
    
    componentDidMount() {
        document.title = " Image Analysis Explorer | Data Explorer";
    }

    clickDatasetImage(){
        alert("click here")

    }

    clickDatasetImage(){
        alert("click here")

    }


    render() {
        let datasetImageList = this.datasetslist.map(dsdata => {  
            return (
                <div className="iblock datasetfullbox clickable ">
                    <div className="datasettitles"> {dsdata.name}</div>
                    <img key={dsdata}  onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className= { "datasetbox rad2 " + dsdata.opacitystyle} />                  
                </div>
            )
        });

        let holdarray = Array.from(Array(50).keys());
        let allDatasetImageList = holdarray.map(dsdata => {  
            return (
                <div className="iblock datasetfullbox ">
                    <div className="datasettitles"> {dsdata.name}</div>
                    <img key={dsdata}  onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className="datasetbox rad2 dsselected " />                  
                </div>
            )
        });

        return (
            <div>
                 <div className="pb10 sectiontitle"> Semantic Search</div>
                 <div className="horrule"></div>
                 <ToastNotification
                    title = {"Semantic Search"}
                    subtitle = {"How it works."}
                    kind = "info"
                    lowContrast = {false}
                    caption={this.semsearchIntro}
                    style={{ width: '100%', marginBottom: '.5rem' }}
                />
                 {/* <div className="lh10 bluehightlight"> 
                 This demo explores the idea of semantic search using convolutional neural networks.
                 Convolutional Neural Networks are able to learn heriarchical features (or representations) of images 
                 when trained on a given task such as image classification. Early layers in the model learn to detect low level
                 features such as lines and shapes while later layers learn to detect more concepts such as eyes, faces etc depending 
                 on the data used for training.  
                 </div> */}
                
               
                <div className="mt20 pb10 sectiontitle" > Select a dataset </div>
                <div className="horrule mb10"></div>
                <div className="datasetselectdiv">
                    {datasetImageList}
                </div>

                <div className="mt20 mb10"> Most similar images</div>
                <div>
                {allDatasetImageList}
                </div>
            </div>
        );
    }
}

export default SemanticEx;