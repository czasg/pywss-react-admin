import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {RouterProvider} from 'react-router-dom';

import {router} from "./route";
import "./main.css";
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import {Context, JwtContext} from "./context";
import {Layout} from "antd";
import SideBar from "./pages/side/SideBar";
import NavBar from "./pages/nav/NavBar";
import View from "./pages/view/View";

dayjs.locale('zh-cn');


function Main() {
    const [jwtToken, setJwtToken] = useState({});
    const [ctx, _] = useState({setJwtToken});
    console.log(ctx, "app")
    return <>
        <React.StrictMode>
            <Context.Provider value={ctx}>
                <JwtContext.Provider value={jwtToken}>
                    <RouterProvider router={router}/>
                </JwtContext.Provider>
            </Context.Provider>
        </React.StrictMode>
    </>
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);
