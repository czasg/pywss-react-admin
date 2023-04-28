import React, {useState} from "react";

import {
    Space,
    Table,
    Progress,
    Button,
    Divider,
} from 'antd';

import TableSearch from "../../../components/TableSearch";

const searchFields = [
    {
        type: 'text',
        name: 'taskName1',
        label: '任务名',
        rules: [
            {
                required: false,
                message: '必填参数',
            }
        ],
        placeholder: 'placeholder',
    },
    {
        type: 'time',
        name: 'time',
        label: '时间',
        rules: [
            {
                type: 'object',
                required: false,
                message: '必填参数',
            }
        ],
        placeholder: 'placeholder',
    },
    {
        type: 'text',
        name: 'taskName2',
        label: '任务名',
        rules: [
            {
                required: false,
                message: '必填参数',
            }
        ],
        placeholder: 'placeholder',
    },
    {
        type: 'text',
        name: 'taskName3',
        label: '任务名',
        rules: [
            {
                required: false,
                message: '必填参数',
            }
        ],
        placeholder: 'placeholder',
    },
    {
        type: 'select',
        name: 'name1',
        label: '任务名',
        rules: [
            {
                required: false,
                message: '非必填参数',
            }
        ],
        placeholder: 'placeholder',
        options: [
            {
                label: '2343',
                value: '3453',
            },
            {
                label: '2344',
                value: '3454',
            },
        ]
    },
    {
        type: 'select',
        name: 'name2',
        label: '任务名',
        rules: [
            {
                type: 'array',
                required: false,
                message: '非必填参数',
            }
        ],
        placeholder: 'placeholder',
        options: [
            {
                label: '1',
                value: '1',
            },
            {
                label: '2',
                value: '2',
            },
            {
                label: '3',
                value: '3',
            },
        ]
    },
];

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
        title: '样本数量',
        dataIndex: 'sample_count',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
    },
    {
        title: '完成时间',
        dataIndex: 'complete_time',
    },
    {
        title: '任务进度',
        key: 'progress',
        render: (_, record) => {
            return <Progress percent={
                parseInt((record.complete_count / record.sample_count) * 100)
            }/>
        }
    },
    {
        title: '操作',
        render: (_, record) => (
            <Space size="middle">
                <Button type="text" className="text-blue-900"
                        disabled={record.complete_count !== record.sample_count}
                >
                    下载结果
                </Button>
                <Button type="text" danger>
                    删除
                </Button>
            </Space>
        ),
    },
].map((item, idx) => {
    return {
        ...item,
        key: idx,
        align: 'center',
    }
});

const dataSource = [
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 12,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 32,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
    {
        name: '20230101.1',
        description: '20230101.1',
        sample_count: 64,
        complete_count: 32,
        create_time: '2021-01-03 10:12:23',
        complete_time: '2021-01-03 10:12:23',
    },
].map((item, idx) => {
    return {
        ...item, key: idx, id: idx,
    }
});

export default function TaskList() {
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        total: dataSource.length,
    })
    const onFinish = (values) => {
        console.log(values)
    };
    return (
        <div className="p-3">
            <TableSearch
                onFinish={onFinish}
                fields={searchFields}
            />
            <Divider/>
            <Table
                columns={columns}
                dataSource={dataSource}
                size="middle"
                pagination={{
                    ...pageInfo,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    onChange: (page, pageSize) => {
                        setPageInfo({
                            current: page,
                            pageSize: pageSize,
                            total: dataSource.length,
                        })
                    }
                }}
            />
        </div>
    )
}
