import React, {useEffect, useState} from "react";
import TableSearch from "../../../components/TableSearch";
import {Divider, Tag, Space, Table, message, Button, Switch, Modal, Form, Input} from "antd";
import UserAPI from "../../../api/system/user";
import RoleAPI from "../../../api/system/role";
import jwt from "../../../utils/jwt";

const {CheckableTag} = Tag;

const searchFields = [
    {
        type: 'text',
        name: 'username',
        label: '英文名',
        rules: [
            {
                required: false,
            }
        ],
        placeholder: '请输入英文名',
    },
    {
        type: 'text',
        name: 'alias',
        label: '中文名',
        rules: [
            {
                required: false,
            }
        ],
        placeholder: '请输入中文名',
    },
];

export default function UserManage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [curUser, setCurUser] = useState({roles: []});
    const [selectedTags, setSelectedTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [query, setQuery] = useState({});
    const pageSize = pageInfo.pageSize;
    const pageNum = pageInfo.current - 1;
    const get_users = () => {
        setLoading(true);
        UserAPI.get_users({...query, pageSize, pageNum}).then(data => data.data).then(data => {
            setLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取用户列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            const users = data.data.data.map(user => {
                return {
                    ...user,
                    key: user.id,
                }
            });
            setUsers(users);
            setPageInfo({
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                total: data.data.total,
            })
        }).catch((e) => {
            setLoading(false);
            message.open({
                type: 'error',
                content: `获取用户列表异常：${e.message}`,
                duration: 3,
            })
        })
    };
    const update_user = (user, type, props) => {
        setModalConfirmLoading(true);
        UserAPI.update_user(user.id, type, props).then(data => data.data).then(data => {
            setModalConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `更新用户 ${user.username} 异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setIsModalOpen(false);
            message.open({
                type: 'success',
                content: `用户 ${user.username} 更新成功`,
                duration: 1.5,
            });
            if (isModalOpen) {
                get_users();
            }
        }).catch((e) => {
            setModalConfirmLoading(false);
            message.open({
                type: 'error',
                content: `更新用户 ${user.username} 异常：${e.message}`,
                duration: 3,
            })
        })
    };
    const add_user = (props) => {
        setModalConfirmLoading(true);
        UserAPI.add_user(props).then(data => data.data).then(data => {
            setModalConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `创建用户 ${props.username} 异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setAddUserModalOpen(false);
            message.open({
                type: 'success',
                content: `创建用户 ${props.username} 成功`,
                duration: 1.5,
            });
            if (addUserModalOpen) {
                get_users();
            }
            form.resetFields();
        }).catch((e) => {
            setModalConfirmLoading(false);
            message.open({
                type: 'error',
                content: `创建用户 ${props.username} 异常：${e.message}`,
                duration: 3,
            })
        })
    };
    useEffect(() => {
        RoleAPI.get_roles({pageSize: 1000}).then(data => data.data).then(data => {
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取角色列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            setRoles(data.data.data);
        })
    }, []);
    useEffect(get_users, [query, pageSize, pageNum]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '英文名',
            dataIndex: 'username',
        },
        {
            title: '中文名',
            dataIndex: 'alias',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            className: "max-w-xl",
            render: (_, record) => {
                return <Space wrap>
                    {
                        record.roles.map((role, idx) => {
                            return <Tag color="blue" key={idx}>{role.alias}/{role.name}</Tag>
                        })
                    }
                </Space>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
        },
        {
            title: '创建者',
            dataIndex: 'created_by',
        },
        {
            title: '允许登录',
            dataIndex: 'enable',
            render: (_, record) => {
                const disabled = record.created_by === 'system';
                return (
                    <Space size="middle">
                        <Switch
                            defaultChecked={record.enable}
                            disabled={disabled}
                            onClick={(v) => {
                                update_user(record, 'enable', {enable: v});
                                setLoading(true);
                                setTimeout(get_users, 300);
                            }}
                        />
                    </Space>
                )
            },
        },
        {
            title: '操作',
            render: (_, record) => {
                const disabled = record.created_by === 'system';
                return (<Space size="middle">
                    <Button
                        type="text"
                        className="text-blue-900"
                        disabled={disabled}
                        onClick={() => {
                            setSelectedTags(record.roles.map(role => role.name));
                            setCurUser(record);
                            setIsModalOpen(true);
                        }}
                    >
                        角色调整
                    </Button>
                </Space>)
            },
        },
    ].map((item, idx) => {
        return {
            ...item,
            key: idx,
            align: 'center',
        }
    });
    const [form] = Form.useForm();
    return <>
        <Modal
            title={`${curUser.username}-角色列表`}
            okType="default"
            okText="确认"
            cancelText="取消"
            open={isModalOpen}
            onOk={() => {
                setLoading(true);
                setTimeout(() => {
                    update_user(curUser, 'role', {roles: selectedTags});
                }, 300);
            }}
            confirmLoading={modalConfirmLoading}
            onCancel={() => {
                setIsModalOpen(false);
            }}
        >
            {
                roles.map(role => (
                    <CheckableTag
                        key={role.name}
                        checked={selectedTags.includes(role.name)}
                        onChange={(checked) => {
                            if (checked) {
                                setSelectedTags(selectedTags.concat([role.name]))
                            } else {
                                setSelectedTags(selectedTags.filter(v => v !== role.name))
                            }
                        }}
                        className="my-2"
                    >
                        {role.alias}/{role.name}
                    </CheckableTag>
                ))
            }
        </Modal>
        <Modal
            title="新增用户"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
                className: "bg-sky-600",
            }}
            open={addUserModalOpen}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={modalConfirmLoading}
            onCancel={() => {
                form.resetFields();
                setAddUserModalOpen(false);
            }}
        >
            <Divider/>
            <Form
                form={form}
                labelCol={{
                    span: 4,
                }}
                onFinish={(values) => {
                    setLoading(true);
                    const {token} = jwt.getToken();
                    add_user({...values, created_by: token.username});
                }}
            >
                <Form.Item
                    label="中文名"
                    name="alias"
                    rules={[
                        {
                            required: true,
                            message: '中文名不能为空!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="英文名"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '英文名不能为空!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
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
                    name="ensure_password"
                    rules={[
                        {
                            required: true,
                            message: '密码不能为空!',
                        },
                        ({getFieldValue}) => ({
                            validator(rule,value){
                                if(!value || getFieldValue('password') === value){
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
        <div className="p-3">
            <TableSearch
                onFinish={(values) => setQuery(values)}
                fields={searchFields}
                FooterComponent={({form}) => {
                    return (
                        <div className='flex'>
                            <Button className="bg-sky-400 text-white" type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button
                                className="mx-1"
                                onClick={() => form.resetFields()}
                            >
                                重置
                            </Button>
                            <div className='flex-1'/>
                            <Button className="bg-sky-400 text-white" type="primary"
                                    onClick={() => {
                                        setAddUserModalOpen(true);
                                    }}
                            >
                                新增用户
                            </Button>
                        </div>
                    )
                }}
            />
            <Divider/>
            <Table
                loading={loading}
                columns={columns}
                dataSource={users}
                size="middle"
                pagination={{
                    ...pageInfo,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: (total) => `总计 ${total} 条数据`,
                    onChange: (page, pageSize) => {
                        setPageInfo({
                            current: page,
                            pageSize: pageSize,
                            total: pageInfo.total,
                        })
                    }
                }}
            />
        </div>
    </>
}
