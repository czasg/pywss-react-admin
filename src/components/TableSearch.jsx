import React, {useState} from "react";

import {
    Button,
    Form,
    Input,
    Select,
    notification,
    Cascader,
    DatePicker,
    Col,
    Row,
} from 'antd';
import {
    UpOutlined,
    DownOutlined,
} from '@ant-design/icons';

const {RangePicker} = DatePicker;

function TableSearchFieldCol({field, index, colSpan}) {
    let searchCol = null;
    if (field.type === "text") {
        searchCol = <Input
            placeholder={field.placeholder}
        />
    } else if (field.type === "select") {
        const multiple = field.rules.some(item => item.type === 'array');
        const cascade = field.options.some(item => item.children !== undefined)
        searchCol = cascade ? <Cascader
            multiple={multiple}
            placeholder={field.placeholder}
            options={field.options}
            allowClear={true}
        /> : <Select
            mode={multiple ? 'multiple' : ''}
            placeholder={field.placeholder}
            options={field.options}
        />
    } else if (field.type === "time") {
        const multiple = field.rules.some(item => item.type === 'array');
        searchCol = multiple ? <RangePicker
            className="w-full"
            placeholder={field.placeholder}
        /> : <DatePicker
            className="w-full"
            placeholder={field.placeholder}
        />
    } else {
        return null
    }
    return (
        <Col span={colSpan} key={index}>
            <Form.Item
                name={field.name}
                label={field.label}
                rules={field.rules}
            >
                {searchCol}
            </Form.Item>
        </Col>
    )
}

function TableSearchFieldRow({fields, gutter, colSpan}) {
    return (
        <Row gutter={gutter}>
            {fields.map((field, idx) => {
                return <TableSearchFieldCol
                    index={idx}
                    key={idx}
                    field={field}
                    colSpan={colSpan}
                />
            })}
        </Row>
    )
}

function TableSearchFooter({form}) {
    return (
        <>
            <Button className="bg-sky-400 text-white" type="primary" htmlType="submit">
                查询
            </Button>
            <Button
                className="mx-1"
                onClick={() => form.resetFields()}
            >
                重置
            </Button>
        </>
    )
}

export default function TableSearch({
                                        fields,
                                        onFinish,
                                        gutter = 24,
                                        colSpan = 6,
                                        FooterComponent = TableSearchFooter,
                                    }) {
    const expendLimit = gutter / colSpan;
    const needExpend = expendLimit < fields.length;
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);
    const [notify, contextHolder] = notification.useNotification();
    const onFinishFailed = (values) => {
        const errorField = values.errorFields[0]
        notify.error({
            duration: 3,
            message: `提交异常`,
            description: `${errorField.name} ${errorField.errors}`,
        });
    }
    if (needExpend && !expand) {
        fields = fields.slice(0, expendLimit)
    }
    return (
        <>
            {contextHolder}
            <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <TableSearchFieldRow
                    fields={fields}
                    gutter={gutter}
                    colSpan={colSpan}
                />
                <FooterComponent form={form}/>
                {
                    needExpend ? <a
                        className="text-xs" onClick={() => setExpand(!expand)}
                    >
                        更多{expand ? <UpOutlined/> : <DownOutlined/>}
                    </a> : null
                }
            </Form>
        </>
    )
}
