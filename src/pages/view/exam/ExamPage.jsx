import React, {useEffect, useState} from "react";
import API from "../../../api/api";
import {message, Divider, Row, Col, Card} from "antd";
import {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';

export default function ExamPageView() {
    const [exam, setExam] = useState([]);
    useEffect(() => {
        API.Exam.exam.get_exam().then(data => data.data).then(data => {
            if (data.code !== 0) {
                throw new Error(data.message);
            }
            setExam(data.data);
        }).catch((e) => {
            message.open({
                type: 'error',
                content: `获取数据异常：${e.message}`,
                duration: 3,
            })
            throw e;
        });
    }, []);
    return <>
        <div className="p-4">
            {exam.map((item, index) => {
                return <>
                    <div className="text-lg font-bold mb-2">{item.name}</div>
                    <Row>
                        {item.exam.map(data => {
                            return <Col span={4}>
                                <Card
                                    title={data.name}
                                    size="small"
                                    headStyle={{
                                        backgroundColor: '#f1f1f1',
                                    }}
                                    bordered={false}
                                    hoverable={true}
                                    className="mt-2 mr-2"
                                >
                                    {data.description}
                                </Card>
                            </Col>
                        })}
                    </Row>
                    {index === (exam.length - 1) ? undefined : <Divider/>}
                </>
            })}
        </div>
    </>
}
