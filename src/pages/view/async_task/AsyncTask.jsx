import React, {useEffect, useState} from "react";
import {
    Button, message, Space, Switch, Table, Tag, Progress, Divider, Form, Input,
    Popconfirm,
    Modal
} from "antd";
import TableSearch from "../../../components/TableSearch";
import jwt from "../../../utils/jwt";
import API from "../../../api/api";
import {Outlet, useNavigate} from "react-router-dom";

function CreateTask({setQuery}) {
    const [form] = Form.useForm();
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [createTaskConfirmLoading, setCreateTaskConfirmLoading] = useState(false);
    const create_task = (props) => {
        setCreateTaskConfirmLoading(true);
        API.AsyncTask.task.create_task(props).then(data => data.data).then(data => {
            setCreateTaskConfirmLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `创建任务异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            setCreateTaskOpen(false);
            message.open({
                type: 'success',
                content: `创建任务成功`,
                duration: 1.5,
            });
            form.resetFields();
            setQuery({});
        }).catch((e) => {
            setCreateTaskConfirmLoading(false);
            message.open({
                type: 'error',
                content: `创建任务异常：${e.message}`,
                duration: 3,
            })
        })
    };
    const CreateTaskComponent = (
        <Modal
            title="创建任务"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
                className: "bg-sky-600",
            }}
            open={createTaskOpen}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={createTaskConfirmLoading}
            onCancel={() => {
                form.resetFields();
                setCreateTaskOpen(false);
            }}
        >
            <Divider/>
            <Form
                form={form}
                className="p-1"
                labelCol={{
                    span: 4,
                }}
                onFinish={(values) => {
                    const {token} = jwt.getToken();
                    create_task({...values, created_by: token.username});
                }}
                initialValues={{
                    task_all_number: 100,
                }}
            >
                <Form.Item
                    label="任务名"
                    name="name"
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
                    label="任务描述"
                    name="description"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="任务数量"
                    name="task_all_number"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="成功数量"
                    name="task_success_number"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    )
    return {
        setCreateTaskOpen,
        setCreateTaskConfirmLoading,
        CreateTaskComponent,
    }
}

function TaskTableSearch() {
    const [query, setQuery] = useState({});
    const {setCreateTaskOpen, CreateTaskComponent} = CreateTask({setQuery});
    const searchFields = [
        {
            type: 'text',
            name: 'name',
            label: '任务名',
            rules: [
                {
                    required: false,
                }
            ],
            placeholder: '请输入任务名',
        },
        {
            type: 'text',
            name: 'description',
            label: '描述',
            rules: [
                {
                    required: false,
                }
            ],
            placeholder: '请输入描述',
        },
    ];
    const TableSearchComponent = (
        <>
            {CreateTaskComponent}
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
                                        setCreateTaskOpen(true);
                                    }}
                            >
                                创建任务
                            </Button>
                        </div>
                    )
                }}
            />
        </>
    )
    return {
        query,
        TableSearchComponent,
    }
}

function TaskTableDeleteButton({task, trigger}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const delete_task = (tid) => {
        setLoading(true);
        API.AsyncTask.task.delete_task(tid).then(data => data.data).then(data => {
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `操作异常：${data.message}`,
                    duration: 3,
                })
                return
            }
            message.open({
                type: 'success',
                content: `操作成功`,
                duration: 1.5,
            });
            setOpen(false);
            trigger();
        }).catch((e) => {
            message.open({
                type: 'error',
                content: `操作异常：${e.message}`,
                duration: 3,
            })
        }).finally(() => {
            setLoading(false);
        })
    };
    return (
        <Popconfirm
            placement="top"
            title="提示"
            description="是否删除任务"
            open={open}
            okButtonProps={{
                loading: loading,
                className: "bg-sky-600",
            }}
            onConfirm={() => {
                delete_task(task.id);
            }}
            onCancel={() => {
                setOpen(false);
                setLoading(false);
            }}
            okText="确认"
            cancelText="取消"
        >
            <Button
                type="text"
                className="text-blue-900"
                onClick={() => {
                    setLoading(false);
                    setOpen(true);
                }}
                danger
            >
                删除任务
            </Button>
        </Popconfirm>
    )
}

function TaskTableDetail({query}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState({});
    const [tasks, setTasks] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const pageSize = pageInfo.pageSize;
    const pageNum = pageInfo.current - 1;
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '任务名',
            dataIndex: 'name',
        },
        {
            title: '任务描述',
            dataIndex: 'description',
        },
        {
            title: '任务数量',
            dataIndex: 'task_all_number',
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
            title: '任务进度',
            dataIndex: 'task_success_number',
            render: (_, record) => {
                const percent = parseInt(record.task_success_number / record.task_all_number * 100);
                return (
                    <Space>
                        <Progress className="w-52" percent={percent}/>
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
                            navigate(`${record.id}`);
                        }}
                    >
                        查看
                    </Button>
                    <TaskTableDeleteButton task={record} trigger={() => {
                        setTrigger({})
                    }}/>
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
    useEffect(() => {
        setLoading(true);
        API.AsyncTask.task.get_tasks({...query, pageSize, pageNum}).then(data => data.data).then(data => {
            setLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            const tasks = data.data.data.map(task => {
                return {
                    ...task,
                    key: task.id,
                }
            });
            setTasks(tasks);
            setPageInfo({
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                total: data.data.total,
            })
        })
    }, [query, pageSize, pageNum, trigger]);
    return <>
        <Table
            loading={loading}
            columns={columns}
            dataSource={tasks}
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
    </>
}


export default function AsyncTaskView() {
    const {query, TableSearchComponent} = TaskTableSearch();
    return (
        <>
            <div className="p-3">
                {TableSearchComponent}
                <Divider/>
                <TaskTableDetail query={query}/>
            </div>
        </>
    )
};
