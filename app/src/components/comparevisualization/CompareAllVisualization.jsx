import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./comparevisualization.css"
import * as _ from 'lodash'
import { InlineLoading } from 'carbon-components-react';
import { loadJSONData } from "../helperfunctions/HelperFunctions"
import * as d3 from "d3"

class CompareAllVisualization extends Component {
    constructor(props) {
        super(props)


        this.state = {
            data: this.props.data,
            loadingCompare: true,
            bestModels: []
        }


        this.miniChartWidth = this.props.data.chartWidth
        this.miniChartHeight = this.props.data.chartHeight
        this.overallBestScore = 0
        this.overallBestModel = ""
    }




    loadAllModelComp() {
        let self = this
        this.refs["comparevisualizationbox"].innerHTML = ""
        self.setState({ loadingCompare: true })
        let scorePath = process.env.PUBLIC_URL + "/assets/semsearch/scores/" + this.state.data.dataset + "/" + this.state.data.model + "/" + this.state.data.metric + ".json";
        let loadedJSON = loadJSONData(scorePath)

        loadedJSON.then(function (data) {
            if (data) {
                // console.log(self.props.data.selectedimage + "")
                console.log(self.state)
                // self.genGraphData(data[self.props.data.selectedimage + ""], layer, model.name)
                self.state.data.layers.forEach(each => {
                    self.drawChart(data[each.name], each.layer_index)
                });
                self.setState({ loadingCompare: false })

            }
        })
    }

    drawChart(layerScores, layer_name) {
        let self = this
        let data = layerScores
        let lightgreen = "rgba(0, 128, 0, 0.795)"
        let grey = "rgba(117, 117, 117,"
        // const data = [12, 5, 6, 6, 9, 10];
        // const data = [{ sales: 10, salesperson: "lenny" }, { sales: 8.4, salesperson: "harper" }, { sales: 4.5, salesperson: "crass" }, { sales: 2, salesperson: "lago" }];
        var margin = { top: 30, right: 5, bottom: 40, left: 45 },
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
            .attr("class", "svgbox" + layer_name)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        x.domain(data.map(function (d, i) { return i; }));
        y.domain([0, d3.max(data, function (d, i) { return d; })]);
        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) { return x(i); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d); })
            .attr("height", function (d) { return height - y(d); })
            .attr("fill", function (d) {
                return grey + Math.max(d / 100, 0.3) + ")"
            })
            .on("mouseover", function () {
                d3.select(this)
                    .attr("fill", "#0062FF");
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("fill", grey + Math.max(d / 100, 0.3));
            })



        // add the x Axis
        var xAxis = d3.axisBottom(x)
        svg.append("g")
            .attr("class", "")
            .attr("transform", "translate(0," + height + ")")
            .call(customXAxis);

        var ticks = d3.select(".svgbox" + layer_name).selectAll(".tick text");
        ticks.attr("class", function (d, i) {
            if (i % 30 != 0) d3.select(this).remove();
        });

        var lines = d3.select(".svgbox" + layer_name).selectAll(".tick line");
        lines.attr("class", function (d, i) {
            if (i % 30 != 0) d3.select(this).remove();
        });
        // chart title
        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - 20)
            .attr("y", -12)
            .style("text-anchor", "middle")
            .attr("class", "boldtext mediumdesc")
            .text(function () {
                // let textVal = 
                return ("Layer " + layer_name).toUpperCase()
            });

        // xaxis label
        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - (margin.left + margin.right) / 2)
            .attr("y", self.miniChartHeight - (margin.bottom + margin.bottom) + 40)
            .style("text-anchor", "middle")
            .attr("class", "smalldesc")
            .text("image in dataset");

        // // overallbest label
        // svg.append("text")
        //     .attr("x", 0)
        //     .attr("y", 0 - 14)
        //     .style("text-anchor", "middle")
        //     .attr("class", function () {
        //         return "boldtext displaynone overallbest smalldesc topmodel" + layerScores.maxvalue
        //     })
        //     .text("*BEST");


        //yaxis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -5 - margin.left)
            .attr("x", 0 - (self.miniChartHeight / 2) + (margin.top + margin.bottom) / 2)
            .attr("dy", "2em")
            .style("text-anchor", "middle")
            .attr("class", "smalldesc")
            .text("search score");


        // add the y Axis
        let yAxis = d3.axisRight(y)
            .tickSize(this.miniChartWidth)
        svg.append("g")
            .call(customYAxis);

        function customYAxis(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "rgba(172, 172, 172, 0.74)").attr("stroke-dasharray", "2,2");
            g.selectAll(".tick text").attr("x", -20).attr("y", -.01)
        }

        function customXAxis(g) {
            g.call(xAxis);
            g.select(".domain").remove();
        }
    }


    componentDidMount() {
        // this.compareModels()
        this.loadAllModelComp()

    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("fire update event", this.props.data.dml)
        if (this.props.data.dml !== prevProps.data.dml) {
            console.log("things have changed", this.props.data)
            this.setState({ data: this.props.data }, () => {
                this.loadAllModelComp()
            })
        }



    }


    render() {

        return (
            <div>
                <div className="flex mb10">

                    <div className="flexfull">

                    </div>
                </div>


                {this.state.loadingCompare &&
                    <InlineLoading
                        description="Comparing scores for all models .."
                    >

                    </InlineLoading>
                }
                <div ref="comparevisualizationbox" className="comparevisualizationbox">

                </div>

                <br />
                <br />


            </div >

        )
    }

}

export default CompareAllVisualization;