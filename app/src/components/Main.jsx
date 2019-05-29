import React, { Component } from "react";  
import {
    Route,
    Switch,
    HashRouter
} from "react-router-dom";
 

 
// import Sidebar from "./Sidebar";
import AppHeader from "./header/AppHeader";
import Footer from "./footer/Footer";
import DataEx from "../content/dataex/DataEx";
import ModelEx from "../content/modelex/ModelEx";
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
    }

    render() {
        return (
            <HashRouter>
                <AppHeader></AppHeader> 
                  <div class="container-fluid"> hi 
                  <Route exact path="/" component={DataEx} />
                  <Route exact path="/datasets" component={DataEx} />
                  <Route exact path="/models" component={ModelEx} />
                            {/* <Route path="/about" component={About} />
                            <Route path="/demo" component={Demo} />
                            <Route path="/game" component={Game} />
                            <Route path="/doodle" component={Doodle} />
                            <Route path="/video" component={VideoDemo} /> */}
                  </div>
                <div id="footer"> <Footer /> </div>
            </HashRouter>

        );
    }
}

export default Main;