import React, {useEffect, useState} from "react";
import {
    Col, Row, Divider, Image,
    Form,
    Input,
    Button, message,
    Modal,
    Popconfirm,
} from 'antd';
import {useLoaderData} from "react-router-dom";
import UserAPI from "../../api/system/user";


export default function UserInfo() {
    const {token} = useLoaderData();
    const [curUser, setCurUser] = useState({});
    useEffect(() => {
        UserAPI.get_user_by_uid(token.uid).then(data => data.data).then(data => {
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取用户 ${token.username} 信息异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setCurUser(data.data);
            basicForm.setFieldsValue({
                ...data.data,
            });
        })
    }, []);
    const [basicForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [basicOpen, setBasicOpen] = useState(false);
    const [basicConfirmLoading, setBasicConfirmLoading] = useState(false);
    const update_user = (user, type, props) => {
        setBasicConfirmLoading(true);
        UserAPI.update_user(user.id, type, props).then(data => data.data).then(data => {
            setBasicConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `更新用户 ${user.username} 异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setBasicOpen(false);
            setIsModalOpen(false);
            message.open({
                type: 'success',
                content: `用户 ${user.username} 更新成功`,
                duration: 1.5,
            });
        }).catch((e) => {
            setBasicConfirmLoading(false);
            message.open({
                type: 'error',
                content: `更新用户 ${user.username} 异常：${e.message}`,
                duration: 3,
            })
        })
    };
    return <>
        <div className="px-5 py-2">
            <Row>
                <Col span={24}>
                    <h1 className="text-xl font-bold mb-2">用户头像</h1>
                </Col>
                <Image
                    width={200}
                    src="/src/static/cat.png"
                />
            </Row>
            <Divider/>
            <Row>
                <Col span={24}>
                    <h1 className="text-xl font-bold mb-6">基础信息</h1>
                </Col>
                <Form
                    rootClassName="w-2/5"
                    labelCol={{
                        span: 4,
                    }}
                    form={basicForm}
                    onFinish={(values) => {
                        update_user(curUser, 'basic', values);
                    }}
                >
                    <Form.Item
                        label="英文名"
                        name="username"
                        rules={[
                            {
                                required: false,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="创建时间"
                        name="created_at"
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="最后更新时间"
                        name="updated_at"
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="中文名"
                        name="alias"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your alias!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="email"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 4,
                            span: 5,
                        }}
                    >
                        <Popconfirm
                            title="提示"
                            description="是否保存最新用户信息"
                            open={basicOpen}
                            onConfirm={() => {
                                basicForm.submit();
                            }}
                            okButtonProps={{
                                loading: basicConfirmLoading,
                                className: "bg-sky-600",
                            }}
                            onCancel={() => {
                                setBasicOpen(false);
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                className="bg-sky-600"
                                type="primary"
                                onClick={() => {
                                    setBasicOpen(true);
                                }}>
                                保存信息
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Form>
            </Row>
            <Divider className="mt-0"/>
            <Row>
                <Col span={24}>
                    <h1 className="text-xl font-bold mb-6">其他操作</h1>
                </Col>
                <Button className="bg-sky-600" type="primary" onClick={() => {
                    setIsModalOpen(true);
                }}>
                    修改密码
                </Button>
                <Modal
                    title="修改密码"
                    open={isModalOpen}
                    okText="确认"
                    cancelText="取消"
                    onOk={() => {
                        passwordForm.submit();
                    }}
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}
                    okButtonProps={{
                        className: "bg-sky-600",
                    }}
                    confirmLoading={basicConfirmLoading}
                >
                    <Divider className="my-4"/>
                    <Form
                        form={passwordForm}
                        labelCol={{
                            span: 4,
                        }}
                        onFinish={(values) => {
                            update_user(curUser, 'pwd', values);
                        }}
                    >
                        <Form.Item
                            label="旧密码"
                            name="password_old"
                            rules={[
                                {
                                    required: true,
                                    message: '英文名不能为空!',
                                },
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="新密码"
                            name="password_new"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空!',
                                },
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="password_new_ensure"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空!',
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password_new') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject("两次密码输入不一致")
                                    }
                                }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Col span={24} className="my-2"/>
                <Button disabled>注销账号</Button>
            </Row>
        </div>
    </>
}
