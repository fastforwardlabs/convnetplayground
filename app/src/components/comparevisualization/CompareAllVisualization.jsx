import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./comparevisualization.css"
import * as _ from 'lodash'
import { InlineLoading } from 'carbon-components-react';
import { loadJSONData, ColorArray } from "../helperfunctions/HelperFunctions"
import * as d3 from "d3"
import { Color } from 'three';

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

        this.colorPalette = ["0,86,77", "56,60,74", "141,38,99", "37,37,37", "175,4,4", "0,102,102", "23,34,59", "62,100,255", "39,170,128", "148,56,85"]
        this.palette = ColorArray()
    }




    loadAllModelComp() {
        let self = this
        this.refs["comparevisualizationbox"].style.opacity = 0.0;
        // 

        self.setState({ loadingCompare: true })
        let scorePath = process.env.PUBLIC_URL + "/assets/semsearch/scores/" + this.state.data.dataset + "/" + this.state.data.model + "/" + this.state.data.metric + ".json";
        let loadedJSON = loadJSONData(scorePath)

        loadedJSON.then(function (data) {
            if (data) {
                self.refs["comparevisualizationbox"].innerHTML = ""
                // console.log(self.props.data.selectedimage + "")
                // console.log(self.state)
                // self.genGraphData(data[self.props.data.selectedimage + ""], layer, model.name)
                self.state.data.layers.forEach(each => {
                    self.drawChart(data[each.name], each.layer_index)
                });
                self.setState({ loadingCompare: false })

                // let mbox = document.createElement("div");
                // mbox.setAttribute("class", "maincomparebox positionrelative iblock displayinvisible");
                // mbox.setAttribute("id", "mainimagebox")

                // let mboxtitle = document.createElement("div");
                // mboxtitle.setAttribute("class", "maincomparetitle pt5 mediumdesc");
                // mboxtitle.setAttribute("id", "mainimagetitle")
                // // mboxtitle.innerHTML = "Bingo"


                // let mainimg = document.createElement("img");
                // mainimg.setAttribute("src", "assets/semsearch/datasets/iconic200/0.jpg");
                // mainimg.setAttribute("class", "maincompareimg rad2 iblock");
                // mainimg.setAttribute("id", "mainimage")
                // mbox.appendChild(mainimg)
                // mbox.appendChild(mboxtitle)
                // self.refs["comparevisualizationbox"].append(mbox)

                self.refs["comparevisualizationbox"].style.opacity = 1;

            }
        })
    }

    drawChart(layerScores, layer_name) {
        this.componetOffsetLeft = this.refs["componentbox"].offsetLeft
        this.componetOffsetTop = this.refs["componentbox"].offsetTop
        let self = this
        let data = layerScores
        let lightgreen = "rgba(0, 128, 0, 0.795)"
        let grey = "rgba(117, 117, 117,"
        let base_img_path = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.data.dataset + "/";
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
            .attr("fill", function (d, i) {
                let opacity = Math.max(d / 100, 0.3)
                let colorIndex = Math.floor(i / 20)
                let color = "rgba(" + self.colorPalette[colorIndex] + "," + opacity + ")"
                // console.log(color)
                return grey + Math.max(d / 100, 0.3) + ")"
            })
            .on("mouseover", function (d, i) {
                d3.select(this).attr("width", 4);
                var x = d3.event.pageX - self.componetOffsetLeft
                x = d3.event.pageX + 200 < window.innerWidth ? x : x - 200 - self.componetOffsetLeft - 10
                var y = d3.event.pageY - self.componetOffsetTop
                // console.log(d3.event.pageX + 200, window.innerWidth)
                let fillColor = self.palette[Math.floor(i / 20)]
                d3.select(this).attr("fill", fillColor);

                document.getElementById("mainimagebox").style.left = x + "px"
                document.getElementById("mainimagebox").style.top = y + "px"
                document.getElementById("mainimagebox").classList.remove("displaynone")
                document.getElementById("mainimage").src = base_img_path + i + ".jpg"
                document.getElementById("mainimagetitle").innerHTML = "Image " + i + ", <strong> " + d.toFixed(2) + "%  </strong> "
            })
            .on("mouseout", function (d, i) {
                d3.select(this).attr("width", x.bandwidth());
                d3.select(this).attr("fill", grey + Math.max(d / 100, 0.3));
                document.getElementById("mainimagebox").classList.add("displaynone")
            })




        // add the x Axis
        var xAxis = d3.axisBottom(x)
        svg.append("g")
            .attr("class", "")
            .attr("transform", "translate(0," + height + ")")
            .call(customXAxis);

        var ticks = d3.select(".svgbox" + layer_name).selectAll(".tick text");
        ticks.attr("class", function (d, i) {
            if (i % 20 != 0) d3.select(this).remove();
        });

        var lines = d3.select(".svgbox" + layer_name).selectAll(".tick line");
        lines.attr("class", function (d, i) {
            if (i % 20 != 0) d3.select(this).remove();
        });
        // chart title
        svg.append("text")
            .attr("x", self.miniChartWidth / 2 - 20)
            .attr("y", -12)
            .attr("class", "mediumdesc boldtext")
            .style("text-anchor", "middle")
            .text(function () {
                let textVal = "<div><span class='boldtext mediumdesc'>" + "Layer " + layer_name + "</span> <span class='smalldesc'> " + _.mean(layerScores).toFixed(2) + " </span> </div>"

                return "Layer " + layer_name + " [ Mean: " + _.mean(layerScores).toFixed(2) + " ]"
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
        //         return "boldtext displayinvisible overallbest smalldesc topmodel" + layerScores.maxvalue
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

        layerScores.forEach((each, i) => {

            if (i % 20 == 0) {
                // console.log("start", (Math.floor(i / 20)) * (width / 10), "end")
                let x1 = (Math.floor(i / 20)) * (width / 10)
                let x2 = x1 + width / 10
                svg.append("line")
                    .attr("x1", x1)
                    .attr("x2", x2)
                    .attr("y1", height)
                    .attr("y2", height)
                    .attr("stroke-width", 2)
                    .attr("stroke", this.palette[Math.floor(i / 20)])
            }
        });

        // .attr("stroke-dasharray", "8,8");
    }


    componentDidMount() {
        // this.compareModels()
        this.loadAllModelComp()




    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("fire update event", this.props.data.dml)
        if (this.props.data.dml !== prevProps.data.dml) {
            // console.log("things have changed", this.props.data)
            console.log(this.props.data.classLabels)
            this.setState({ data: this.props.data }, () => {
                this.loadAllModelComp()
            })
        }



    }


    render() {
        let classHolder = []
        for (let i = 0; i < 200; i += 20) {
            classHolder.push({ label: this.props.data.classLabels[i], color: this.palette[Math.floor(i / 20)] })
        }

        console.log(classHolder)

        let legendImageList = classHolder.map((data, index) => {
            return (
                <div key={"labelrow" + index} className="">
                    <div style={{ borderLeft: "4px solid " + data.color }} className="legbox mediumdesc">{data.label}</div>

                </div>
            )
        })


        return (
            <div ref="componentbox" className="positionrelative">
                <div id="mainimagebox" className="maincomparebox positionabsolute displaynone">
                    <div id="mainimagetitle" className="maincomparetitle"></div>
                    <img id="mainimage" className="maincompareimg rad2 iblock" src="assets/semsearch/datasets/iconic200/0.jpg" alt="" />

                </div>



                <div className="flex mb10">

                    <div className="flexfull mb5 mt5 lh10">
                        The charts below summarize the similarity search score achieved by each intermediate model in <strong>{this.state.data.model}</strong> for
                         each of the 200 images in the <strong> {this.state.data.dataset} </strong> dataset.
                    </div>
                </div>

                <div className="">

                </div>



                <div className="flex">
                    <div ref="comparevisualizationbox" className=" flexfull comparevisualizationbox compareallvizbox transition3s">
                    </div>
                    <div>
                        {/* <div className="legheader"> Legend </div> */}
                        <div>
                            {legendImageList}
                        </div>
                    </div>
                </div>

                {this.state.loadingCompare &&
                    <div className="loadingdiv">
                        <InlineLoading
                            description="Generating scores for intermediate models"
                        >

                        </InlineLoading>
                    </div>
                }



            </div >

        )
    }

}

export default CompareAllVisualization;