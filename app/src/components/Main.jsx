import React, { Component } from "react";
import {
    Route,
    HashRouter,

} from "react-router-dom";

import { Modal } from 'carbon-components-react';


import "./template.css"

// import Sidebar from "./Sidebar";
import AppHeader from "./header/AppHeader";
import Footer from "./footer/Footer";
import SemanticEx from "../content/semanticex/SemanticEx";
import ModelEx from "../content/modelex/ModelEx";
import FAQ from "../content/faq/FAQ";
import Test from "../components/helperfunctions/Test"
import Scene from "../components/three/Scene"
// import About from "../sections/About"
// import Game from "../sections/Game"
// import Doodle from "../sections/Doodle"
// import VideoDemo from "../sections/VideoDemo"

import { createBrowserHistory } from 'history';


// ReactGA.initialize("UA-131578973-1")
const history = createBrowserHistory({
    basename: "", // The base URL of the app (see below)
    forceRefresh: false, // Set true to force full page refreshes
    keyLength: 6, // The length of location.key
    // A function to use to confirm navigation with the user (see below)
    getUserConfirmation: (message, callback) => callback(window.confirm(message))
});
// history.listen(location => {
//     ReactGA.set({ page: location.hash })
//     ReactGA.pageview(location.hash)
//     // console.log(location.pathname, location.hash)
// })

let linkHolder = {}

function updateLh(location) {

    if (location.hash in linkHolder) {
        linkHolder[location.hash] = linkHolder[location.hash] + 1
    } else {
        linkHolder[location.hash] = 0
    }

}

history.listen(location => {
    updateLh(location)
});


class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }

        // console.log(window.location)
        updateLh(window.location)
    }

    componentDidMount() {
        // ReactGA.pageview(window.location.hash)
        // document.title = "Image Analysis Explorer | Explore Convolutional Neural Nets for Imagee Analysis";
    }

    // toggleOrientationModal(e) {
    //     this.setState({ showorientationmodal: !(this.state.showorientationmodal) })
    //     // console.log(this.state.showorientationmodal)
    // }




    render() {
        const mScene = (props) => {
            return (
                <Scene
                    setselected={function (val) { }}
                    data={{
                        dataset: "tinyimagenet",
                        model: "xception",
                        layer: "block14_sepconv2_act",
                        dml: "bingo",
                        selectedimage: "0",
                        layerindex: 1
                    }}
                />
            );
        }

        const myModalComponent = (props) => {
            return (
                <ModelEx
                    pageviewed={linkHolder[window.location.hash] > 0 ? true : false}
                    lh={linkHolder}
                />
            );
        }

        const mySemanticComponent = (props) => {
            return (
                <SemanticEx
                    pageviewed={linkHolder[window.location.hash] > 0 ? true : false}
                    lh={linkHolder}
                />
            );
        }

        return (
            <HashRouter>
                <AppHeader></AppHeader>

                <div className="container-fluid p10">
                    <Route exact path="/" component={mySemanticComponent} />
                    <Route exact path="/models" component={myModalComponent} />
                    <Route exact path="/scene" component={mScene} />
                    <Route exact path="/faq" component={FAQ} />
                    <Route exact path="/test" component={Test} />

                </div>
                <div id="footer"> <Footer /> </div>
            </HashRouter>

        );
    }
}

export default Main;