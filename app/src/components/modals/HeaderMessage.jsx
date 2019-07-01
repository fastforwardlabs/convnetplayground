import React, { Component } from "react";

class HeaderMessage extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <div>
                <div className="greyhighlight p10 mb10">
                    Click the  <strong>[ ? More Info ]</strong> button on the top right to show this dialog at any time.
                </div>
                Convnet Playground -  <i>a tool for the interactive exploration of Convolutional Neural Networks (Convnets or CNNs)</i> -
               is a research prototype by Cloudera Fast Forward Labs, built to accompany our
                report on <a href="#" target="_blank" rel="noopener noreferrer" > Deep Learning for Image Analysis</a>.
                {/* More about this report is described in our blog post. */}


            </div>
        );
    }
}

export default HeaderMessage;