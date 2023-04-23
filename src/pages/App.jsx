import {Layout} from 'antd';
import React from 'react';
import NavBar from "./nav/NavBar";
import View from "./view/View";

import SideBar from "./side/SideBar";

export default function App(props) {
    return (
        <Layout>
            <SideBar {...props} />
            <NavBar/>
            <View/>
        </Layout>
    );
};
