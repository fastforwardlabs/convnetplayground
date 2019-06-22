import React, { Component } from 'react'
// import * as LeaderLine from 'leader-line'
import "./test.css"
const LeaderLine = window.LeaderLine;
class Test extends Component {
    constructor(props) {
        super(props)


        this.state = {

        }

        this.lineHolder = []
    }

    clearLines() {

    }

    componentDidMount() {

        // console.log(this.boxList1)

    }

    drawLines(e) {
        this.removeLines()
        let self = this;
        [...Array(5).keys()].forEach(function (each) {
            let line = new LeaderLine(self.refs.start, self.refs["bx1" + each], {
                color: 'red',
                startPlug: 'square',
                endPlug: 'circle',
                path: "fluid",
                size: 3,
                hide: true,
            });
            let animOptions = { duration: 1300, timing: 'linear' }
            line.show("draw", animOptions)
            self.lineHolder.push(line)
        })
    }
    removeLines(e) {
        console.log(this.lineHolder.length)
        this.lineHolder.forEach(function (each) {
            each.remove()
        })
        this.lineHolder = []
    }

    render() {

        const vals = [...Array(5).keys()]

        this.boxList1 = vals.map((val, index) => {
            return (
                <div ref={"bx1" + index} key={"legend" + index}>
                    <div className="boxer rad4">
                        {index}
                    </div>
                </div>
            )
        });

        return (
            <div>
                <div className="flex">
                    <div className=" flex4">
                        <div ref="start" id="start" className="boxer rad4"></div>
                        <button onClick={this.drawLines.bind(this)} ref="drawlines"> Draw lines </button>
                        <button onClick={this.removeLines.bind(this)} ref="removelines"> Remove lines </button>
                    </div>
                    <div className=" flex4">
                        <div className="boxer rad4"></div>
                    </div>
                    <div id="end" className="pt20 flex2">
                        <div ref="end" className="boxer rad4"></div>
                        {this.boxList1}
                    </div>

                </div>

            </div>

        )
    }

}

export default Test;