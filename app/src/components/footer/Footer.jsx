import React, { Component } from "react";
import "./footer.css"

class Footer extends Component {
    render() {
        return (
            <div>
                Made with <span className="redcolor">&#9829;</span> at <a href="http://experiments.fastforwardlabs.com/" target="blank">Cloudera Fast Forward Labs</a>.
            </div>
        );
    }
}

export default Footer;