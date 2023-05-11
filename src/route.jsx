import React from "react";
import {createBrowserRouter, redirect} from "react-router-dom";

import {
    HomeOutlined,
    SettingOutlined,
    ScanOutlined,
    FileOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    SmileOutlined,
    ReadOutlined,
    PaperClipOutlined,
} from '@ant-design/icons';
import {message, Result} from 'antd';
import menuTool from "./utils/menu";
import App from "./pages/App";
import Login from "./pages/Login";
import RoleManageView from "./pages/view/system/RoleManage";
import UserManageView from "./pages/view/system/UserManage";
import jwt from "./utils/jwt";
import UserInfo from "./pages/view/UserInfo";
import AsyncTaskView from "./pages/view/async_task/AsyncTask";
import AsyncTaskDetailView from "./pages/view/async_task/AsyncTaskDetail";
import IndexView from "./pages/view/Index";
import ExamPageView from "./pages/view/exam/ExamPage";

function componentLoader() {
    const {token, valid} = jwt.getToken();
    if (!valid) {
        jwt.clear();
        message.warning("认证失效，请重新登录！");
        return redirect("/login");
    }
    return {token}
}


const appComponents = [
    {
        path: "index",
        label: "首页",
        icon: <HomeOutlined/>,
        Component: IndexView,
        loader: componentLoader,
    },
    {
        path: "async-task",
        label: "异步任务",
        icon: <FileOutlined/>,
        children: [
            {
                path: "task",
                Component: AsyncTaskView,
                label: "任务管理",
                icon: <ScanOutlined/>,
            },
            {
                path: "task/:tid",
                Component: AsyncTaskDetailView,
                label: "任务详情",
                sideIgnore: true,
            },
        ],
        loader: componentLoader,
    },
    {
        path: "exam-system",
        label: "考试系统",
        icon: <ReadOutlined/>,
        children: [
            {
                path: "exam",
                Component: ExamPageView,
                label: "考试系统",
                icon: <PaperClipOutlined/>,
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

const implicitComponents = [
    {
        path: "",
        element: <Result
            icon={<SmileOutlined/>}
            title="Welcome to here!"
        />,
    },
    {
        path: "user-info",
        Component: UserInfo,
        label: "个人信息",
        loader: componentLoader,
    },
]

const pages = [
    {
        // 应用
        path: "app",
        element: <App
            sideItems={menuTool.sideItemsFromAppComponents(appComponents)} // 侧边栏元素
        />,
        children: implicitComponents.concat(appComponents),
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

const appComponentsMap = menuTool.appComponentsMap(implicitComponents.concat(appComponents), "/app");

export {appComponents, appComponentsMap};
export const router = createBrowserRouter(pages);
