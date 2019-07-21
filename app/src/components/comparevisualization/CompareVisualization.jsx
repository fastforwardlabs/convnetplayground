import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./comparevisualization.css"
import * as _ from 'lodash'
import { InlineLoading } from 'carbon-components-react';
import { loadJSONData } from "../helperfunctions/HelperFunctions"
import * as d3 from "d3"

class CompareVisualization extends Component {
    constructor(props) {
        super(props)

        const modelDetails = this.props.data.modelDetails; // require('../../assets/semsearch/details.json');
        this.datasetdictionary = this.props.data.datasetdictionary; //require('../../assets/semsearch/datasetdictionary.json');



        this.state = {
            modelsList: modelDetails["models"],
            loadingCompare: true,
            bestModels: []
        }

        this.layerScores = { data: [], maxindex: 0 }
        this.miniChartWidth = this.props.data.chartWidth
        this.miniChartHeight = this.props.data.chartHeight
        this.overallBestScore = 0
        this.overallBestModel = ""
    }



    genGraphData(data, layer, model) {
        let simArr = data.slice(1, this.props.data.topx + 1)
        let allDictionary = this.datasetdictionary.dictionary[this.props.data.dataset]
        let selectedCat = allDictionary[this.props.data.selectedimage]
        let [modelScore, totalScore] = [0, 0]
        for (var i in simArr) {
            if (selectedCat == allDictionary[simArr[i][0]]) {
                modelScore += (this.props.data.topx - i) / this.props.data.topx
            }
            totalScore += (this.props.data.topx - i) / this.props.data.topx
        }
        let weightedScore = ((modelScore / totalScore) * 100).toFixed(1)

        if (this.layerScores[model] == undefined) {
            this.layerScores[model] = { data: [], maxindex: 0 }
        }


        this.layerScores[model].data.push({ layer: layer.name, index: layer.layer_index, score: weightedScore * 1 })

        // check if we have all layers for current model
        if (this.layerScores[model].data.length == this.props.data.numLayers) {
            this.layerScores[model].data = _.sortBy(this.layerScores[model].data, 'index');
            let maxVal = _.maxBy(this.layerScores[model].data, "score")

            this.layerScores[model].maxindex = this.layerScores[model].data.indexOf(maxVal)
            this.layerScores[model].maxvalue = maxVal.score
            this.layerScores[model].model = model
            // console.log("all data in", this.layerScores[model])

            this.drawChart(this.layerScores[model])

            if (maxVal.score > this.overallBestScore) {
                this.overallBestScore = maxVal.score
                this.overallBestModel = model
            }

            // console.log("Total", Object.keys(this.layerScores).length);
            if (Object.keys(this.layerScores).length == this.props.data.numModels) {
                // console.log("All models have been computed");
                this.setState({ loadingCompare: false })
                // console.log("Overall bases", this.overallBestModel)
                let backStrokes = document.getElementsByClassName("backstroke" + this.overallBestScore)
                let textBoxes = document.getElementsByClassName("topmodel" + this.overallBestScore)
                for (let i = 0; i < backStrokes.length; i++) {
                    backStrokes[i].setAttribute("stroke", "green")
                }

                for (let i = 0; i < textBoxes.length; i++) {
                    textBoxes[i].classList.remove("displaynone")
                }

                // this.layerScores.forEach(each => {
                //     if (each.data.score = this.overallBestScore) {
                //         console.log(each.data)
                //     }
                // });
                let bestModels = []
                let bestModelsMap = {}
                for (model in this.layerScores) {
                    let currentData = this.layerScores[model].data
                    currentData.forEach(each => {
                        if (each.score == this.overallBestScore) {
                            each["model"] = model
                            if (bestModelsMap[model] == undefined) {
                                bestModels.push(each)
                                bestModelsMap[model] = ""
                            }

                        }
                    });
                }
                // console.log(bestModels)
                this.setState({ bestModels: bestModels })


            }
        }


    }


    compareModels() {
        let self = this
        // let selectedNum = Math.round(Math.random() * 200) 

        this.layerScores = {}

        this.state.modelsList.forEach((model, i) => {
            let layers = this.state.modelsList[i].layers
            layers.forEach(layer => {

                let similarityPath = process.env.PUBLIC_URL + "/assets/semsearch/similarity/" + self.props.data.dataset + "/" + model.name + "/" + self.props.data.metric + "/" + layer.name + ".json"
                let loadedJSON = loadJSONData(similarityPath)
                loadedJSON.then(function (data) {
                    if (data) {
                        // console.log(self.props.data.selectedimage + "")
                        self.genGraphData(data[self.props.data.selectedimage + ""], layer, model.name)
                    }
                })
            });
        });



    }

    drawChart(layerScores) {
        let self = this
        let data = layerScores.data
        // const data = [12, 5, 6, 6, 9, 10];
        // const data = [{ sales: 10, salesperson: "lenny" }, { sales: 8.4, salesperson: "harper" }, { sales: 4.5, salesperson: "crass" }, { sales: 2, salesperson: "lago" }];
        var margin = { top: 30, right: 30, bottom: 40, left: 45 },
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
        var svg = d3.select("div.comparevisualizationbox").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "svgbox" + layerScores.maxvalue)
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
                let color = d.score == layerScores.maxvalue ? "green" : "#CDCDCD";
                // console.log(layerScores.maxindex, d.score, color)
                return color
            }).on("mouseover", function () {
                d3.select(this)
                    .attr("fill", "#0062FF");
            })
            .on("mouseout", function (d, i) {
                d3.select(this).attr("fill", function () {
                    let color = i == layerScores.maxindex ? "green" : "#CDCDCD";
                    // console.log(layerScores.maxindex, d.score, color)
                    return color
                });
            })


        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text").text(function (d) {
                return d.score.toFixed(0);
            })
            .attr("class", "boldtext")
            .attr("x", function (d) {
                return x(d.index) + 10;
            })
            .attr("y", function (d) {
                let maxVal = self.miniChartHeight - (margin.top + margin.bottom) - 5
                return Math.min(maxVal, (y(d.score) + 14));
            }).attr("font-family", "sans-serif")
            .attr("font-size", "9px")
            .style("text-anchor", "middle")
            .attr("fill", function (d, i) {
                let color = d.score == layerScores.maxvalue ? "white" : "black";
                // console.log(layerScores.maxindex, d.score, color)
                return color
            });


        // add the y Axis
        let yAxis = d3.axisRight(y)
            .tickSize(this.miniChartWidth)
        svg.append("g")
            .call(customYAxis);




        // add the x Axis
        var xAxis = d3.axisBottom(x)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(customXAxis);







        // chart title
        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - 20)
            .attr("y", -12)
            .style("text-anchor", "middle")
            .attr("class", "boldtext mediumdesc")
            .text(function () {
                // let textVal = 
                return (layerScores.model + " [TOP: " + layerScores.maxvalue + "%] ").toUpperCase()
            });

        // xaxis label
        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - (margin.left + margin.right) / 2)
            .attr("y", self.miniChartHeight - (margin.bottom + margin.bottom) + 40)
            .style("text-anchor", "middle")
            .attr("class", "smalldesc")
            .text("layer (index)");

        // overallbest label
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0 - 14)
            .style("text-anchor", "middle")
            .attr("class", function () {
                return "boldtext displaynone overallbest smalldesc topmodel" + layerScores.maxvalue
            })
            .text("*BEST");


        //yaxis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -5 - margin.left)
            .attr("x", 0 - (self.miniChartHeight / 2) + (margin.top + margin.bottom) / 2)
            .attr("dy", "2em")
            .style("text-anchor", "middle")
            .attr("class", "smalldesc")
            .text("search score");


        function customYAxis(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2").attr("class", " backstroke" + layerScores.maxvalue);
            g.selectAll(".tick text").attr("x", -20).attr("y", -.01)
        }

        function customXAxis(g) {
            g.call(xAxis);
            g.select(".domain").remove();
        }
    }


    componentDidMount() {
        this.compareModels()

    }

    render() {
        let selectedImagePath = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.props.data.dataset + "/" + this.props.data.selectedimage + ".jpg"
        let bestModelsList = this.state.bestModels.map((best, index) => {
            // console.log(best)
            return (
                <div key={"bestmodel" + index} className="iblock mr5 greentext"> {best.model.toUpperCase() + "[" + best.score + "]"}, </div>
            )
        })
        return (
            <div>
                <div className="flex mb10">
                    <div className=" mr10">
                        <img src={selectedImagePath} className="simiimage" alt="" />
                    </div>
                    <div className="flexfull">
                        For the current search query (image shown on the left),
                        the charts below allows you to <strong>compare search score </strong> results obtained when we use layers
                        from all <strong> {this.props.data.numModels} </strong> models. The <span className="greentext boldtext"> green bar </span>
                        highlights the layer(s) in a model with the best search score.
                    </div>
                </div>
                {!this.state.loadingCompare &&
                    <div className=" mediumdesc mb10 boldtext">
                        Models with *BEST search score - {bestModelsList}.
                    </div>
                    // <div>{bestModelsList}</div>
                }

                <div className="comparevisualizationbox">
                    {this.state.loadingCompare &&
                        <InlineLoading
                            description="Comparing scores for all models .."
                        >

                        </InlineLoading>
                    }
                </div>

                <br />
                <br />


            </div >

        )
    }

}

export default CompareVisualization;