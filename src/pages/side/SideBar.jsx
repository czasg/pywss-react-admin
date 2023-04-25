import {Menu} from 'antd';
import React, {useState} from 'react';
import {ScanOutlined} from '@ant-design/icons';
import {
    useNavigate,
    useLoaderData,
} from "react-router-dom";
import menuTool from "../../utils/menu";


export default function SideBar({sideItems, collapsedOnlyOne = true}) {
    const {token} = useLoaderData();
    const navigate = useNavigate();
    const [openKeys, setOpenKeys] = useState([]);
    const onOpenChange = (keys) => {
        if (collapsedOnlyOne === false) {
            setOpenKeys(keys);
            return
        }
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        const sideRoots = sideItems.map(sideItem => sideItem.key);
        if (sideRoots.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    if (token.roles.indexOf("admin") === -1) {
        sideItems = menuTool.sideItemsFilterByRoles(sideItems, token.roles);
    }
    return (
        <div className="h-screen overflow-auto fixed left-0 top-0 bottom-0 w-56"
             style={{
                 backgroundColor: '#001529',
             }}
        >
            <div
                className="text-base font-bold text-white h-12 m-4 flex justify-center items-center rounded-md select-none"
                style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                }}
            >
                <ScanOutlined className="mr-2 scale-125"/>
                后台管理系统
            </div>
            <Menu
                mode="inline"
                theme="dark"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={sideItems}
                onClick={({key}) => {
                    navigate(key);
                }}
            />
        </div>
    );
};
