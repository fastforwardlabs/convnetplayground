import React, { Component } from "react";
import { InlineNotification } from 'carbon-components-react';

class ModelEx extends Component {


    constructor(props) {
        super(props);

 

        this.state = {
             
        }


        this.pageIntro = ` Convolutional Neural Network models are comprised of layers which learn heirarchical 
        representations. What kind of representations or features does each layer learn? 
        Well, let us explore the following models. `


    }

    componentDidMount() {
        document.title = "ConvNet Playground | Model Explorer";
    }
    render() {
        return (
            <div>
                <div className="pb10 sectiontitle"> Model Explorer </div>
                <div className="horrule"></div>
                <InlineNotification
                    title={"Image Algebra"} 
                    kind={"info"} 
                    subtitle={this.pageIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                />
               


                 
            </div>
        );
    }
}

export default ModelEx;