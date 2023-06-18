import React, {useContext, useState} from "react";
import {
    Button,
    Form,
    Input,
    Divider,
    Segmented,
    ConfigProvider,
    message,
} from 'antd';
import {LockOutlined, UserOutlined, SlackOutlined} from '@ant-design/icons';

import "./Login.css";
import {useNavigate} from "react-router-dom";
import UserAPI from "../api/system/user";
import {Context, JwtContext} from "../context";

function LoginForm() {
    const ctx = useContext(Context);
    console.log(ctx)
    const jwtToken = useContext(JwtContext);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const onFinish = (values) => {
        setLoading(true);
        const key = 'loginKey';
        messageApi.open({
            key,
            type: 'loading',
            content: "登录中",
            duration: 0,
        });
        UserAPI.login({...values}).then(data => data.data).then(data => {
            setLoading(false);
            if (data.code !== 0) {
                messageApi.open({
                    key,
                    type: 'error',
                    content: `登录失败：${data.message}`,
                    duration: 2,
                })
                return
            }
            localStorage.setItem('jwtToken', data.data.token);
            ctx.setJwtToken(data.data.token);
            messageApi.open({
                key,
                type: 'success',
                content: "登录成功",
                duration: 0.5,
            }).then(() => {
                navigate("/");
            });
        }).catch(() => {
            setLoading(false);
            messageApi.open({
                key,
                type: 'error',
                content: `登录失败，服务发生未知异常`,
                duration: 3,
            })
        })
    };
    const onFinishFailed = (errorInfo) => {
        messageApi.open({
            type: 'error',
            content: errorInfo.errorFields[0].errors,
        })
    };
    return (
        <>
            {contextHolder}
            <Form
                className="w-64"
                initialValues={{
                    loginType: 'default',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your username'}]}
                >
                    <Input
                        className="py-3 text-base"
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        placeholder="用户名/邮箱"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your password'}]}
                >
                    <Input
                        className="py-3 text-base"
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-sky-500 h-10 font-bold"
                        loading={loading}
                    >
                        登录
                    </Button>
                </Form.Item>
                <Divider plain>
                    <p className="text-white" style={{color: 'rgba(0, 0, 0, 0.7)'}}>登录方式</p>
                </Divider>
                <ConfigProvider
                    theme={{
                        token: {
                            colorBgElevated: 'rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <Form.Item
                        name="loginType"
                    >
                        <Segmented
                            block
                            options={[
                                {
                                    label: '默认',
                                    value: 'default',
                                },
                                {
                                    label: 'ldap',
                                    value: 'ldap',
                                },
                            ]}
                            onChange={(value) => {
                                messageApi.open({
                                    type: 'success',
                                    content: `use ${value} mode`,
                                });
                            }}
                        />
                    </Form.Item>
                </ConfigProvider>
            </Form>
        </>
    )
}


export default function Login() {
    return (
        <div
            className="relative h-screen w-screen flex justify-center items-center overflow-hidden"
            style={{
                background: 'linear-gradient(45deg, #678f90, #8da797, #75ac89)',
            }}
        >
            <div
                className="w-screen z-10 flex flex-col justify-center items-center"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}
            >
                <div className="flex justify-center items-center text-white mt-12 mb-7">
                    <SlackOutlined className="mr-2 text-7xl"/>
                    <div>
                        <div className="text-4xl font-bold">应用后台管理系统</div>
                        <div className="text-xl">app management system</div>
                    </div>
                </div>
                <LoginForm/>
            </div>
            <ul className="bg-squares">
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
            </ul>
        </div>
    )
}
