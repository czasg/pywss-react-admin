import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import API from "../../../api/api";
import {message, Descriptions, Progress} from "antd";


export default function AsyncTaskDetailView() {
    const {tid} = useParams();
    const [task, setTask] = useState({});
    useEffect(() => {
        API.AsyncTask.task.get_task(tid).then(data => data.data).then(data => {
            if (data.code !== 0) {
                throw new Error(data.message);
            }
            setTask(data.data);
        }).catch((e) => {
            message.open({
                type: 'error',
                content: `请求异常：${e.message}`,
                duration: 3,
            })
        })
    }, []);
    return (
        <>
            <div className="p-3">
                <Descriptions
                    bordered
                    title="任务详情"
                    column={1}
                    labelStyle={{
                        width: '200px',
                        textAlign: 'center',
                    }}
                >
                    <Descriptions.Item label="任务名">{task.name}</Descriptions.Item>
                    <Descriptions.Item label="任务描述">{task.description}</Descriptions.Item>
                    <Descriptions.Item label="创建者">{task.created_by}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{task.created_at}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{task.updated_at}</Descriptions.Item>
                    <Descriptions.Item label="任务总数">{task.task_all_number}</Descriptions.Item>
                    <Descriptions.Item label="任务完成数">{task.task_success_number}</Descriptions.Item>
                    <Descriptions.Item label="任务完成率">
                        <Progress
                            type="circle"
                            percent={parseInt(task.task_success_number / task.task_all_number * 100)}
                            format={(percent) => `${percent}%`}
                            size="default"
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="其他信息">
                        Data disk type: MongoDB
                        <br/>
                        Database version: 3.4
                        <br/>
                        Package: dds.mongo.mid
                        <br/>
                        Storage space: 10 GB
                        <br/>
                        Replication factor: 3
                        <br/>
                        Region: East China 1
                        <br/>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </>
    )
};
