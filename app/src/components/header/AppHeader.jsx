import React, { Component } from "react";
import {
    Header,
    HeaderName,
    HeaderNavigation,
    //   HeaderMenuItem,
    HeaderGlobalBar,
    HeaderPanel,
    Switcher,
    SwitcherItem,
    SwitcherDivider,
    HeaderGlobalAction,
    SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';

import {
    NavLink
} from "react-router-dom";

import "./header.css"
// import Notification20 from '@carbon/icons-react/lib/notification/20';
// import UserAvatar20 from '@carbon/icons-react/lib/user--avatar/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';

class AppHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showpanel: false
        }
    }

    showPanel() {
        this.setState({ showpanel: !this.state.showpanel })
        // this.refs["tester"].focus()
        // console.log(this.refs["switchermenu"])
    }

    headerPanelBlur() {
        this.setState({ showpanel: false })
        // console.log("blur")
    }

    checkCurrentRoute(route) {
        console.log(window.location.hash, route)
        if (window.location.hash == route) {
            return true
        }
    }
    switcherClick(e) {
        // console.log(e.target)
        // e.target.blur()
    }

    render() {
        return (
            <div>
                <Header aria-label="Convolutional Neural Network Playground">
                    <SkipToContent />
                    <HeaderName prefix="">
                        {/* <div className="decornone "><NavLink exact to="/"> </NavLink></div> */}
                        <img className="headericon" src="images/icon.png" alt="" />
                        ConvNet Playground

                    </HeaderName>
                    <HeaderNavigation aria-label="Convolutional Neural Network Playground">
                        {/* <HeaderMenuItem element={Link} to="/" className="navbarlink "> Datasets </HeaderMenuItem> */}
                        {/* <HeaderMenuItem  element={Link} to="/models" className="navbarlink "> Models</HeaderMenuItem> */}
                        <div className="navbarlinks  "><NavLink exact to="/"> Semantic Search </NavLink></div>
                        <div className="navbarlinks "><NavLink to="/models"> Model Explorer </NavLink></div>
                        <div className="navbarlinks "><NavLink to="/faq"> FAQ </NavLink></div>
                        {/* <div className="navbarlinks "><NavLink to="/algebra"> Image Algebra </NavLink></div> */}
                        {/* <div className="navbarlinks "><NavLink to="/energy"> Energy Explorer </NavLink></div> */}
                    </HeaderNavigation>
                    <HeaderGlobalBar>
                        {/* <HeaderGlobalAction aria-label="Notifications">
                    <Notification20 />
                </HeaderGlobalAction>
                */}
                        {/* <HeaderGlobalAction aria-label="User Avatar">
                    <UserAvatar20 />
                </HeaderGlobalAction> */}
                        <HeaderGlobalAction
                            onClick={this.showPanel.bind(this)}
                            aria-label="App Switcher">
                            <AppSwitcher20 />
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>
                    <HeaderPanel aria-label="Header Panel" onBlur={this.headerPanelBlur.bind(this)} expanded={this.state.showpanel} >
                        <Switcher ref="switchermenu" role="menu" aria-label="Switcher Container">

                            <SwitcherItem onClick={this.switcherClick.bind(this)} aria-label="Link 1" isSelected={this.checkCurrentRoute("#/")} href="#/" > Semantic Search</SwitcherItem>
                            <SwitcherItem onClick={this.switcherClick.bind(this)} aria-label="Link 1" isSelected={this.checkCurrentRoute("#/models")} href="#/models" > Model Explorer</SwitcherItem>

                            <SwitcherItem onClick={this.switcherClick.bind(this)} aria-label="Link 1" isSelected={this.checkCurrentRoute("#/faq")} href="#/faq" >FAQ</SwitcherItem>
                            <SwitcherDivider />
                            <SwitcherItem onClick={this.switcherClick.bind(this)} aria-label="Link 1" isSelected={this.checkCurrentRoute("#/blogexternal")} href="https://blog.fastforwardlabs.com/2019/07/22/new-research-deep-learning-for-image-analysis.html" target="_blank" rel="noopener noreferrer" >Blog Post</SwitcherItem>


                        </Switcher>
                    </HeaderPanel>
                </Header>
                <div> <br /> <br />  <br />  <br /> </div>
            </div>

        );
    }
}

export default AppHeader;
