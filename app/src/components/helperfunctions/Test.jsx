import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./test.css"
import * as _ from 'lodash'
import { loadJSONData } from "../helperfunctions/HelperFunctions"
import * as d3 from "d3"

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
            layerCompareList: []

        }

        this.layerScores = { data: [], maxindex: 0 }
        this.maxIndex = 0
        this.maxScore = 0
        this.miniChartWidth = 250
        this.miniChartHeight = 250
    }



    genGraphData(data, layer, model) {
        let simArr = data.slice(1, this.state.topx + 1)
        let allDictionary = this.datasetdictionary.dictionary[this.state.datasetsList[this.state.selecteddataset].name]
        let selectedCat = allDictionary[this.state.selectedsimimage]
        let [modelScore, totalScore] = [0, 0]
        for (var i in simArr) {
            if (selectedCat == allDictionary[simArr[i][0]]) {
                modelScore += (this.state.topx - i) / this.state.topx
            }
            totalScore += (this.state.topx - i) / this.state.topx
        }
        let weightedScore = ((modelScore / totalScore) * 100).toFixed(1)

        if (this.layerScores[model] == undefined) {
            this.layerScores[model] = { data: [], maxindex: 0 }
        }


        this.layerScores[model].data.push({ layer: layer.name, index: layer.layer_index, score: weightedScore * 1 })
        if (this.layerScores[model].data.length == this.state.modelsList[this.state.selectedmodel].layers.length) {
            this.layerScores[model].data = _.sortBy(this.layerScores[model].data, 'index');
            let maxVal = _.maxBy(this.layerScores[model].data, "score")
            // console.log("all data in", this.layerScores.data, maxVal, this.layerScores.data.indexOf(maxVal))
            this.layerScores[model].maxindex = this.layerScores[model].data.indexOf(maxVal)
            this.layerScores[model].maxvalue = maxVal.score
            this.layerScores[model].model = model

            this.drawChart(this.layerScores[model])
        }
    }


    compareModels() {
        let self = this
        let selectedNum = Math.round(Math.random() * 200)
        this.setState({ selectedsimimage: selectedNum + "" })
        let layers = this.state.modelsList[this.state.selectedmodel].layers
        this.layerScores = {}
        this.maxScore = 0
        let model = "inceptionv3"
        layers.forEach(layer => {
            let similarityPath = process.env.PUBLIC_URL + "/assets/semsearch/similarity/" + self.state.datasetsList[self.state.selecteddataset].name + "/" + self.state.modelsList[self.state.selectedmodel].name + "/" + self.state.distanceMetricList[self.state.selectedmetric] + "/" + layer.name + ".json"
            let loadedJSON = loadJSONData(similarityPath)
            // console.log(similarityPath)
            // 
            loadedJSON.then(function (data) {
                if (data) {
                    self.genGraphData(data[self.state.selectedsimimage + ""], layer, model)
                }
            })
        });

    }

    drawChart(layerScores) {
        let self = this
        let data = layerScores.data
        // const data = [12, 5, 6, 6, 9, 10];
        // const data = [{ sales: 10, salesperson: "lenny" }, { sales: 8.4, salesperson: "harper" }, { sales: 4.5, salesperson: "crass" }, { sales: 2, salesperson: "lago" }];
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = this.miniChartWidth - margin.left - margin.right,
            height = this.miniChartHeight - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("div.d3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        x.domain(data.map(function (d) { return d.index; }));
        y.domain([0, d3.max(data, function (d) { return d.score; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.index); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.score); })
            .attr("height", function (d) { return height - y(d.score); })
            .attr("fill", function (d, i) {
                let color = i == layerScores.maxindex ? "green" : "#CDCDCD";
                // console.log(layerScores.maxindex, d.score, color)
                return color
            });

        // add the x Axis
        var xAxis = d3.axisBottom(x)
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(customXAxis);


        let yAxis = d3.axisRight(y)
            .tickSize(this.miniChartWidth)
        // add the y Axis
        svg.append("g")
            .call(customYAxis);

        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - 20)
            .attr("y", -8)
            .style("text-anchor", "middle")
            .attr("class", "boldtext")
            .text(layerScores.model);


        function customYAxis(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
            g.selectAll(".tick text").attr("x", -20).attr("y", -.01)
        }

        function customXAxis(g) {
            g.call(xAxis);
            g.select(".domain").remove();
        }
    }


    componentDidMount() {

        // this.drawLines()

        // console.log(document.querySelector('.leader-line').style.zIndex)
        this.compareModels()
        // this.drawChart()
    }

    render() {


        return (
            <div>
                test
                <button onClick={this.compareModels.bind(this)}> Launch Stuff</button>
                <div> Selected Image {this.state.selectedsimimage}</div>
                <div className="d3 "></div>
            </div >

        )
    }

}

export default Test;