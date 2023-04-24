import React, {useEffect, useState} from "react";
import TableSearch from "../../../components/antd/TableSearch";
import {Divider, Tag, Space, Table, message, Button, Switch, Modal} from "antd";
import UserAPI from "../../../api/system/user";
import RoleAPI from "../../../api/system/role";

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
    useEffect(() => {
        RoleAPI.get_roles().then(data => data.data).then(data => {
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取角色列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            setRoles(data.data);
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
            render: (_, record) => {
                return <Space wrap>
                    {
                        record.roles.map(role => {
                            return <Tag color="blue">{role.alias}/{role.name}</Tag>
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
    return <>
        <Modal
            title="角色列表"
            okType="default"
            open={isModalOpen}
            onOk={() => {
                update_user(curUser, 'role', {roles: selectedTags});
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
                    >
                        {role.alias}/{role.name}
                    </CheckableTag>
                ))
            }
        </Modal>
        <div className="p-3">
            <TableSearch
                onFinish={(values) => setQuery(values)}
                fields={searchFields}
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
