import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./test.css"
import { loadJSONData } from "../helperfunctions/HelperFunctions"

class Test extends Component {
    constructor(props) {
        super(props)

        const modelDetails = require('../../assets/semsearch/details.json');
        const similarityArray = require('../../assets/semsearch/similarity/cifar100/vgg16/cosine/block1_conv1.json');
        this.datasetdictionary = require('../../assets/semsearch/datasetdictionary.json');

        this.state = {
            topx: 10,
            selecteddataset: 0,
            selectedmodel: 5, //modelDetails["models"].length - 1,
            selectedsimimage: 127,
            hoversimimage: 0,
            selectedlayer: modelDetails["models"][5].layers.length - 1,
            similarityArray: similarityArray,
            datasetArray: [],
            datasetsList: modelDetails["datasets"],
            modelsList: modelDetails["models"],
            distanceMetricList: modelDetails["metrics"],
            selectedmetric: 0,

        }


    }

    genGraph(data) {
        let simArr = this.state.similarityArray[this.state.selectedsimimage].slice(1, this.state.topx + 1)
        let allDictionary = this.datasetdictionary.dictionary[this.state.datasetsList[this.state.selecteddataset].name]
        let selectedCat = allDictionary[this.state.selectedsimimage]
        // console.log(simar.slice(1, this.state.topx + 1))
        // console.log(this.state.selectedsimimage)
        let simCount = 0
        let modelScore = 0
        let totalScore = 0
        for (var i in simArr) {
            if (selectedCat == allDictionary[simArr[i][0]]) {
                simCount++
                modelScore += (this.state.topx - i) / this.state.topx
            }
            totalScore += (this.state.topx - i) / this.state.topx
        }

        let weightedScore = (modelScore / totalScore) * 100

        console.log(modelScore, totalScore, weightedScore.toFixed(1))
        // data.forEach(each => {
        //     console.log(each)
        // });
    }

    updateSimilarity() {

        let similarityPath = process.env.PUBLIC_URL + "/assets/semsearch/similarity/" + this.state.datasetsList[this.state.selecteddataset].name + "/" + this.state.modelsList[this.state.selectedmodel].name + "/" + this.state.distanceMetricList[this.state.selectedmetric] + "/" + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name + ".json"
        let loadedJSON = loadJSONData(similarityPath)
        console.log(similarityPath)
        let self = this
        loadedJSON.then(function (data) {
            if (data) {
                self.setState({ similarityArray: data })
                self.genGraph(data[self.state.selectedsimimage + ""])

            }
        })

    }

    compareModels() {

    }

    componentDidMount() {

        // this.drawLines()

        // console.log(document.querySelector('.leader-line').style.zIndex)
        this.updateSimilarity()
    }

    render() {


        return (
            <div>
                test
                <button onClick={this.compareModels.bind(this)}> Launch Stuff</button>
            </div >

        )
    }

}

export default Test;