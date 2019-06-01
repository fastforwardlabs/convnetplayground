import React, { Component } from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';

import {
    Link, NavLink
} from "react-router-dom";

import "./header.css"
import Notification20 from '@carbon/icons-react/lib/notification/20';
import UserAvatar20 from '@carbon/icons-react/lib/user--avatar/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';

class AppHeader extends Component {
    render() {
        return (
            <div>
                <Header aria-label="Convolutional Neural Network Playground">
                <SkipToContent />
                <HeaderName href="/" prefix="">
                ConvNet Playground
                </HeaderName>
                <HeaderNavigation aria-label="Convolutional Neural Network Playground">
                {/* <HeaderMenuItem element={Link} to="/" className="navbarlink "> Datasets </HeaderMenuItem> */}
                {/* <HeaderMenuItem  element={Link} to="/models" className="navbarlink "> Models</HeaderMenuItem> */}
                <div className="navbarlinks  "><NavLink exact to="/"> Semantic Search </NavLink></div>
                <div className="navbarlinks "><NavLink to="/models"> Model Explorer </NavLink></div>
                <div className="navbarlinks "><NavLink to="/algebra"> Image Algebra </NavLink></div>
                <div className="navbarlinks "><NavLink to="/extra"> Extras </NavLink></div>
                </HeaderNavigation>
                <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Notifications">
                    <Notification20 />
                </HeaderGlobalAction>
               
                {/* <HeaderGlobalAction aria-label="User Avatar">
                    <UserAvatar20 />
                </HeaderGlobalAction> */}
                <HeaderGlobalAction aria-label="App Switcher">
                    <AppSwitcher20 />
                </HeaderGlobalAction>
                </HeaderGlobalBar>
            </Header>
            <div> <br/> <br/>  <br/>  <br/> </div>
            </div>
            
        );
    }
}

export default AppHeader;
 