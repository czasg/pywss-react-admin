import React, {useEffect, useState} from "react";
import TableSearch from "../../../components/antd/TableSearch";
import {Divider, Tag, Space, Table, message, Button, Tree, Modal, Form, Input} from "antd";
import RoleAPI from "../../../api/system/role";
import UserAPI from "../../../api/system/user";
import jwt from "../../../utils/jwt";
import {appComponents} from "../../../route";
import menuTool from "../../../utils/menu";

const searchFields = [
    {
        type: 'text',
        name: 'name',
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

export default function RoleManage() {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [curRole, setCurRole] = useState({roles: []});
    const [query, setQuery] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
    const pageSize = pageInfo.pageSize;
    const pageNum = pageInfo.current - 1;
    const add_role = (props) => {
        setModalConfirmLoading(true);
        RoleAPI.add_role(props).then(data => data.data).then(data => {
            setModalConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `创建角色 ${props.name} 异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setAddRoleModalOpen(false);
            message.open({
                type: 'success',
                content: `创建角色 ${props.name} 成功`,
                duration: 1.5,
            });
            if (addRoleModalOpen) {
                get_roles();
            }
            form.resetFields();
        }).catch((e) => {
            setModalConfirmLoading(false);
            message.open({
                type: 'error',
                content: `创建角色 ${props.name} 异常：${e.message}`,
                duration: 3,
            })
        })
    };
    const get_roles = () => {
        setLoading(true);
        RoleAPI.get_roles({...query, pageSize, pageNum}).then(data => data.data).then(data => {
            setLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取角色列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            const roles = data.data.data.map(user => {
                return {
                    ...user,
                    key: user.id,
                }
            });
            setRoles(roles);
            setPageInfo({
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                total: data.data.total,
            })
        }).catch((e) => {
            setLoading(false);
            message.open({
                type: 'error',
                content: `获取角色列表异常：${e.message}`,
                duration: 3,
            })
        })
    };
    const update_permission = (role, type, props) => {
        setModalConfirmLoading(true);
        RoleAPI.update_role(role.id, type, props).then(data => data.data).then(data => {
            setModalConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `更新角色 ${role.name} 异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setIsModalOpen(false);
            message.open({
                type: 'success',
                content: `角色 ${role.name} 更新成功`,
                duration: 1.5,
            });
            if (isModalOpen) {
                get_roles();
            }
        }).catch((e) => {
            setModalConfirmLoading(false);
            message.open({
                type: 'error',
                content: `更新角色 ${role.name} 异常：${e.message}`,
                duration: 3,
            })
        })
    };
    useEffect(get_roles, [query, pageSize, pageNum]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '英文名',
            dataIndex: 'name',
        },
        {
            title: '中文名',
            dataIndex: 'alias',
        },
        {
            title: '权限',
            dataIndex: 'permission',
            className: "max-w-xl",
            render: (_, record) => {
                let ps = [];
                if (record.permission !== "") {
                    ps = record.permission.split(',')
                }
                return <Space wrap>
                    {
                        ps.map((v, idx) => {
                            return <Tag color="blue" key={idx}>{v}</Tag>
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
            title: '操作',
            render: (_, record) => {
                const disabled = record.name === 'admin';
                return (<Space size="middle">
                    <Button
                        type="text"
                        className="text-blue-900"
                        disabled={disabled}
                        onClick={() => {
                            setCheckedKeys(record.permission.split(','));
                            setCurRole(record);
                            setIsModalOpen(true);
                        }}
                    >
                        权限调整
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
    const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
    const treeData = menuTool.treeItemFromAppComponents(appComponents);
    return <>
        <Modal
            title={`${curRole.name} 权限列表`}
            okType="default"
            open={isModalOpen}
            onOk={() => {
                setLoading(true);
                setTimeout(() => {
                    update_permission(curRole, 'permission', {permission: checkedKeys});
                }, 300);
            }}
            confirmLoading={modalConfirmLoading}
            onCancel={() => {
                setIsModalOpen(false);
            }}
        >
            <Divider/>
            <Tree
                checkable
                defaultExpandAll={true}
                treeData={treeData}
                checkedKeys={checkedKeys}
                onCheck={(checkedKeysValue) => {
                    setCheckedKeys(checkedKeysValue);
                }}
            >
            </Tree>
        </Modal>
        <Modal
            title="新增角色"
            okType="default"
            open={addRoleModalOpen}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={modalConfirmLoading}
            onCancel={() => {
                form.resetFields();
                setAddRoleModalOpen(false);
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
                    add_role({...values, created_by: token.username});
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
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '英文名不能为空!',
                        },
                    ]}
                >
                    <Input/>
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
                                        setAddRoleModalOpen(true);
                                    }}
                            >
                                新增角色
                            </Button>
                        </div>
                    )
                }}
            />
            <Divider/>
            <Table
                loading={loading}
                columns={columns}
                dataSource={roles}
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
