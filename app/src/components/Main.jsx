import React, { Component } from "react";  
import {
    Route, 
    HashRouter
} from "react-router-dom";
 
import "./template.css"
 
// import Sidebar from "./Sidebar";
import AppHeader from "./header/AppHeader";
import Footer from "./footer/Footer";
import SemanticEx from "../content/semanticex/SemanticEx";
import ModelEx from "../content/modelex/ModelEx";
import AlgebraEx from "../content/algebraex/AlgebraEx"
// import About from "../sections/About"
// import Game from "../sections/Game"
// import Doodle from "../sections/Doodle"
// import VideoDemo from "../sections/VideoDemo"


// ReactGA.initialize("UA-131578973-1")
// const history = createBrowserHistory({
//     basename: "", // The base URL of the app (see below)
//     forceRefresh: false, // Set true to force full page refreshes
//     keyLength: 6, // The length of location.key
//     // A function to use to confirm navigation with the user (see below)
//     getUserConfirmation: (message, callback) => callback(window.confirm(message))
// });
// history.listen(location => {
//     ReactGA.set({ page: location.hash })
//     ReactGA.pageview(location.hash)
//     // console.log(location.pathname, location.hash)
// })

class Main extends Component {

    componentDidMount() {
        // ReactGA.pageview(window.location.hash)
        document.title = "Image Analysis Explorer | Explore Convolutional Neural Nets for Imagee Analysis";
    }

    render() {
        return (
            <HashRouter>
                <AppHeader></AppHeader> 
                  <div className="container-fluid p10">   
                  <Route exact path="/" component={SemanticEx} />
                  <Route exact path="/datasets" component={SemanticEx} />
                  <Route exact path="/models" component={ModelEx} />
                  <Route exact path="/algebra" component={AlgebraEx} />
                            
                  </div>
                <div id="footer"> <Footer /> </div>
            </HashRouter>

        );
    }
}

export default Main;