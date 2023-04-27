import React from "react";
import {createBrowserRouter, redirect} from "react-router-dom";

import {
    HomeOutlined,
    SettingOutlined,
    ScanOutlined,
    FileOutlined,
    UserOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import {message} from 'antd';

import menuTool from "./utils/menu";
import App from "./pages/App";
import Login from "./pages/Login";
import TemplateTaskList from "./pages/view/template/TaskList";
import RoleManageView from "./pages/view/system/RoleManage";
import UserManageView from "./pages/view/system/UserManage";
import jwt from "./utils/jwt";

function componentLoader() {
    const {token, valid} = jwt.getToken();
    if (!valid) {
        jwt.clear();
        message.warning("认证失效，请重新登录！");
        return redirect("/login")
    }
    return {token}
}


const appComponents = [
    {
        path: "index",
        label: "首页",
        icon: <HomeOutlined/>,
        Component: TemplateTaskList,
        loader: componentLoader,
    },
    {
        path: "template",
        label: "模板样例",
        icon: <FileOutlined/>,
        children: [
            {
                path: "task",
                Component: TemplateTaskList,
                label: "任务管理",
                icon: <ScanOutlined/>,
                childrenIgnore: true,
                children: [
                    {
                        path: "detail",
                        Component: TemplateTaskList,
                        label: "任务管理",
                        icon: <ScanOutlined/>,
                    },
                ],
            },
        ],
        loader: componentLoader,
    },
    {
        path: "system",
        label: "系统管理",
        icon: <SettingOutlined/>,
        children: [
            {
                path: "user-management",
                Component: UserManageView,
                label: "用户管理",
                icon: <UserAddOutlined/>,
            },
            {
                path: "role-management",
                Component: RoleManageView,
                label: "角色管理",
                icon: <UserSwitchOutlined/>,
            },
        ]
    },
];
console.log(menuTool.sideItemsFromAppComponents(appComponents), "app")
const pages = [
    {
        // 应用
        path: "app",
        element: <App
            sideItems={menuTool.sideItemsFromAppComponents(appComponents)} // 侧边栏元素
        />,
        children: appComponents,
        loader: componentLoader,
    },
    {
        // 登录页面
        path: "login",
        element: <Login/>,
    },
    {
        // 首页自动跳转应用页
        path: "/",
        loader: () => redirect("app"),
    },
    {
        // 异常页
        path: "*",
        element: <div className="h-screen flex items-center justify-center">
            page not found, please contact site's developer
        </div>
    },
];

export {appComponents};
export const router = createBrowserRouter(pages);
