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
    NavLink
} from "react-router-dom";

import "./header.css"
import Notification20 from '@carbon/icons-react/lib/notification/20';
import UserAvatar20 from '@carbon/icons-react/lib/user--avatar/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';

class AppHeader extends Component {
    render() {
        return (
            <div>
                <Header aria-label="Carbon Tutorial">
                <SkipToContent />
                <HeaderName href="/" prefix="">
                Image Analysis Explorer
                </HeaderName>
                <HeaderNavigation aria-label="Carbon Tutorial">
                <HeaderMenuItem className="navbarlink selected"> <NavLink exact to="/">Datasets</NavLink> </HeaderMenuItem>
                <HeaderMenuItem className="navbarlink "><NavLink exact to="/models"> Models </NavLink> </HeaderMenuItem>
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
 