import React, {useEffect} from "react";
import {UserOutlined} from '@ant-design/icons';
import {useNavigate, useLoaderData} from "react-router-dom";
import {Avatar, Dropdown, message, Breadcrumb} from 'antd';
import jwt from "../../utils/jwt";
import {useLocation, Link} from "react-router-dom";
import {appComponentsMap} from "../../route";

const items = [
    {
        label: '个人信息',
        extend: {
            onClick: ({navigate}) => {
                navigate('/app/user-info');
            }
        },
    },
    {
        type: 'divider',
    },
    {
        label: '退出登录',
        danger: true,
        extend: {
            onClick: ({navigate}) => {
                jwt.clear();
                message.open({
                    type: 'success',
                    content: '注销成功',
                    duration: 1,
                }).then(() => {
                    navigate('/login');
                });
            }
        }
    },
].map((item, idx) => {
    return {...item, key: `${idx}`}
});

export default function NavBar() {
    let location = useLocation();
    const {token} = useLoaderData();
    const navigate = useNavigate();
    const handleMenuClick = ({key}) => {
        for (let item of items) {
            if (item.key === key) {
                if (item.extend !== undefined && item.extend.onClick !== undefined) {
                    item.extend.onClick({navigate})
                }
                return
            }
        }
    };
    const pathSnippets = location.pathname.replace('/app', '').split('/').filter((i) => i);

    const breadcrumbItems = [
        {
            title: '导航',
        },
        {
            type: 'separator',
            separator: '>',
        },
    ];
    pathSnippets.forEach((path, index) => {
        const url = `/app/${pathSnippets.slice(0, index + 1).join('/')}`;
        if (index !== 0) {
            breadcrumbItems.push({
                type: 'separator',
            })
        }
        breadcrumbItems.push({
            key: url,
            title: appComponentsMap[url] ? appComponentsMap[url].label : path,
        })
    })
    return (
        <>
            <div className="bg-white ml-56 p-3 h-16 flex items-center">
                <Breadcrumb separator="" items={breadcrumbItems}/>
                <div className="flex-1">
                </div>
                <UserOutlined className="mr-1"/>
                <div className="mr-2">
                    {token.username}
                </div>
                <Dropdown
                    className="cursor-pointer"
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                    arrow={{
                        pointAtCenter: true,
                    }}
                    trigger={['click']}
                >
                    <Avatar size={40} icon={<UserOutlined/>} src="/src/static/cat.png"/>
                </Dropdown>
            </div>
        </>
    )
}
