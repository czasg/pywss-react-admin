import React, {useEffect, useState} from "react";
import clsx from "clsx";
import AsyncTaskAPI from "../../../api/async_task/task";
import {Button, message, Space, Switch, Table, Tag, Progress, Divider} from "antd";
import TableSearch from "../../../components/TableSearch";

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

function TableDetail({query}) {
    const [loading, setLoading] = useState(true);
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
            dataIndex: 'description',
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
                        }}
                    >
                        查看
                    </Button>
                    <Button
                        type="text"
                        className="text-blue-900"
                        disabled={disabled}
                        onClick={() => {
                        }}
                        danger
                    >
                        删除任务
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
    useEffect(() => {
        setLoading(true);
        AsyncTaskAPI.get_tasks({...query, pageSize, pageNum}).then(data => data.data).then(data => {
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
    }, []);
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
    const [query, setQuery] = useState({});
    return (
        <>
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
                                        }}
                                >
                                    创建任务
                                </Button>
                            </div>
                        )
                    }}
                />
                <Divider/>
                <TableDetail query={query}/>
            </div>
        </>
    )
};
