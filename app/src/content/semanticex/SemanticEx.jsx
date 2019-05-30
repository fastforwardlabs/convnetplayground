import React, { Component } from "react";
import { ToastNotification, InlineNotification, Tooltip } from 'carbon-components-react';
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

        this.state = {
            selecteddataset: 0,
            datasetslist : [
                { name: "CIFAR100x", css: "active", iconpath: "", description: "CIFAR1000 is a subset of the CIFAR10 dataset containing 32*32 images across 10 categories."},        
                { name: "ICONIC3K", css: "",  iconpath: "", description: "ICONIC3K is a custom dataset assembled from curated iconic images sourced from Flickr."},
                { name: "IMAGENET3K", css: "",  iconpath: "", description: "IMAGENET3K is a subset of the imagenet dataset on which all of the models used for feature extraction is based on." }
            ]
        }


        this.semsearchIntro = ` Layers in a trained convolutional neural network (CNN) can be used to extract features from images.
        The idea of semantic image search explores how we can use these extracted features to compare the similarity of images 
        and hence "search" for similar images. How do different architectures compare? What layers perform better and when?
        What similarity metrics work best? This demo helps you investigate these questions! `


    }

    componentDidMount() {
        document.title = "ConvNet Playground | Semantic Search Explorer";
    }

    clickDatasetImage(e) {
        
        let selectedDatasetIndex = e.target.getAttribute("indexvalue")
        let dbList = this.state.datasetslist
        dbList[selectedDatasetIndex].css = "active"
        dbList[this.state.selecteddataset].css = ""

        this.setState({selecteddataset: selectedDatasetIndex})
    }

    clickAllDatasetImage() {
         

    }


    render() {
        let datasetImageList = this.state.datasetslist.map((dsdata, index) => {
            return (
                <div key={dsdata.name + "fullbox"} className="iblock datasetfullbox clickable ">
                    <div className="datasettitles"> {dsdata.name}</div>
                    <img key={dsdata.name} onClick={this.clickDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className={"datasetbox rad2 " + dsdata.css} indexvalue={index}  />
                </div>
            )
        });

        let holdarray = Array.from(Array(50).keys());
        let allDatasetImageList = holdarray.map((alldata, index) => {
            return (
                <div  key={alldata + "winper"} className="iblock datasetfullbox "> 
                    <img onClick={this.clickAllDatasetImage.bind(this)} src={require("../../images/0.jpg")} alt="" className="simiimage clickable rad2 " />
                </div>
            )
        });

        return (
            <div>
                 
                <div className="pb10 sectiontitle"> Semantic Search</div>
                <div className="horrule"></div>
                <InlineNotification
                    title={"Semantic Search"}
                    // subtitle={"How it works."}
                    kind={"info"} 
                    subtitle={this.semsearchIntro}
                    style={{ minWidth:'100%', marginBottom: '.5rem'}}
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
                <div className="datasetdescription mt10 p10 lightbluehightlight">{this.state.datasetslist[this.state.selecteddataset].description}</div>

                <div className="mt20 mb10 sectiontitle"> Perform a Similarity Search</div>
                <div className="horrule mb10"></div>
                <div className="flex">
                   <div className="iblock  flex1">
                    <img src={require("../../images/0.jpg")} className="mainsimilarityimage mr10 iblock" alt=""/>
                    <div> Selected Image </div>
                   </div>
                    <div className="iblock flex9">{allDatasetImageList}</div>
                </div>
            </div>
        );
    }
}

export default SemanticEx;