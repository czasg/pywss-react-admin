import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import API from "../../api/api";
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';

import {ConfigProvider, message, Row, Col, DatePicker, Card, Button} from "antd";

const {RangePicker} = DatePicker;

function EChartsLineOptions({name, x, data}) {
    return {
        title: {
            text: name,
            left: 'center',
        },
        legend: {
            show: false,
        },
        xAxis: {
            type: 'category',
            data: x,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: data,
                type: 'line',
                smooth: true
            }
        ]
    }
}

function EChartsPieOptions({name, data}) {
    return {
        title: {
            text: name,
            left: 'center',
        },
        legend: {
            show: false,
        },
        series: [
            {
                name: name,
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
            }
        ]
    }
}


export default function IndexView() {
    const now = dayjs();
    const [dateRange, setDateRange] = useState([now.add(-7, 'day'), now]);
    const [requestNumberOption, setRequestNumberOption] = useState({});
    const [apiStatOption, setApiStatOption] = useState({});
    const [codeStatOption, setCodeStatOption] = useState({});
    const [userStatOption, setUserStatOption] = useState({});
    useEffect(() => {
        const props = {
            start: dateRange[0].format("YYYY-MM-DD"),
            end: dateRange[1].format("YYYY-MM-DD"),
        };
        API.Stat.stat.get_stat(props).then(data => data.data).then(data => {
            if (data.code !== 0) {
                throw new Error(data.message);
            }
            setRequestNumberOption(EChartsLineOptions({
                name: "请求统计",
                x: data.data.date,
                data: data.data.request_number_stat,
            }));
            setApiStatOption(EChartsPieOptions({
                name: "接口统计",
                data: data.data.api_stat,
            }));
            setCodeStatOption(EChartsPieOptions({
                name: "状态码统计",
                data: data.data.code_stat,
            }));
            setUserStatOption(EChartsPieOptions({
                name: "用户统计",
                data: data.data.user_stat,
            }));
        }).catch((e) => {
            message.open({
                type: 'error',
                content: `获取数据异常：${e.message}`,
                duration: 3,
            })
            throw e;
        })
    }, dateRange);
    return <>
        <Row className="p-2" style={{
            borderColor: "#f1f1f1",
        }}>
            <Button type="link" disabled>时间范围</Button>
            <ConfigProvider locale={zhCN}>
                <RangePicker
                    defaultValue={dateRange}
                    onChange={(date, dateString) => {
                        setDateRange(date);
                        console.log(dateString);
                    }}
                />
            </ConfigProvider>
        </Row>
        <Row>
            <Col span={8} className="border-y-8" style={{
                borderColor: "#f1f1f1",
                backgroundColor: "#f1f1f1",
            }}>
                <Card hoverable>
                    <ReactECharts option={apiStatOption}/>
                </Card>
            </Col>
            <Col span={8} className="border-8" style={{
                borderColor: "#f1f1f1",
                backgroundColor: "#f1f1f1",
            }}>
                <Card hoverable>
                    <ReactECharts option={codeStatOption}/>
                </Card>
            </Col>
            <Col span={8} className="border-y-8" style={{
                borderColor: "#f1f1f1",
                backgroundColor: "#f1f1f1",
            }}>
                <Card hoverable>
                    <ReactECharts option={userStatOption}/>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Card hoverable >
                    <ReactECharts option={requestNumberOption}/>
                </Card>
            </Col>
        </Row>
    </>
}
