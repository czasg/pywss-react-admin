import React, {useEffect, useState} from "react";
import clsx from "clsx";
import scan_task from "../../../api/demo/scan_task";

const ListData = [
    {
        "id": 1,
        "name": "Python",
        "comment": "best lang",
        "all_count": 10,
        "success_count": 2,
    },
    {
        "id": 2,
        "name": "Go",
        "comment": "fast lang",
        "all_count": 20,
        "success_count": 20,
    },
    {
        "id": 3,
        "name": "Java",
        "comment": "omg",
        "all_count": 30,
        "success_count": 15,
    },
    {
        "id": 4,
        "name": "PHP",
        "comment": "ha ha",
        "all_count": 40,
        "success_count": 30,
    },
    {
        "id": 5,
        "name": "React",
        "comment": "ku ku",
        "all_count": 50,
        "success_count": 0,
    },
];

function Tbody({listData}) {
    return (
        <tbody>
        {
            listData.data.map(data => {
                const done = data.success_count === data.all_count;
                return (
                    <tr key={data.id}>
                        <th>{data.id}</th>
                        <td>{data.name}</td>
                        <td>{data.comment}</td>
                        <td>{data.all_count}</td>
                        <td>{data.success_count}</td>
                        <td>{data.create_at}</td>
                        <td>{data.create_by}</td>
                        <td>
                            <progress className="progress progress-info w-56" value={data.success_count}
                                      max={data.all_count}/>
                            {parseInt(data.success_count / data.all_count * 100)}%
                        </td>
                        <td>
                            {
                                done ?
                                    <button
                                        className={clsx("btn btn-ghost btn-sm text-black")}>下载结果
                                    </button>
                                    :
                                    <button
                                        className={clsx("btn btn-ghost btn-sm text-black")} style={{
                                        "backgroundColor": "#ffffff",
                                    }} disabled>下载结果
                                    </button>
                            }
                            <button className="btn btn-ghost btn-sm text-black">删除</button>
                        </td>
                    </tr>
                )
            })
        }
        </tbody>
    )
}

function Footer({listData}) {
    if (listData.total === 0) {
        return (
            <div className="hero">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-sm font-bold opacity-50 pt-32">暂无数据</h1>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className="divider m-0"/>
            <div className="flex float-right">
                <div
                    className="inline-flex items-center text-sm">{`每页${listData.pageSize}条，总共${listData.total}条`}</div>
                <div className="btn-group float-right ml-1">
                    <button className="btn btn-ghost bg-white" style={{
                        "backgroundColor": "#ffffff",
                        "cursor": "not-allowed",
                    }}>
                        <svg fill="currentColor" viewBox="64 64 896 896" focusable="false" width="1em" height="1em">
                            <path
                                d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"/>
                        </svg>
                    </button>
                    <button className="btn btn-ghost">1</button>
                    <button className="btn btn-ghost">2</button>
                    <button className="btn btn-ghost" style={{
                        "backgroundColor": "#ffffff",
                        "pointerEvents": "none",
                    }}>...
                    </button>
                    <button className="btn btn-ghost">4</button>
                    <button className="btn btn-ghost">
                        <svg fill="currentColor" viewBox="64 64 896 896" focusable="false" width="1em" height="1em">
                            <path
                                d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}


export default function ScanTaskListView() {
    const [listData, setListData] = useState({
        data: [],
        total: 0,
        pageSize: 10,
        pageNumber: 10,
    });
    useEffect(() => {
        scan_task.get_task_list().then(data => data.data).then(data => {
            if (data.code !== 0) {
                return
            }
            setListData({
                data: data.data,
                total: data.page.total,
                pageSize: listData.pageSize,
                pageNumber: listData.pageNumber,
            })
        })
    }, [])
    return (
        <>
            <div className="overflow-x-auto p-2">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Comment</th>
                        <th>All Count</th>
                        <th>Success Count</th>
                        <th>Progress</th>
                        <th>Operator</th>
                        <th>Operator</th>
                        <th>Operator</th>
                    </tr>
                    </thead>
                    <Tbody listData={listData}/>
                </table>
                <Footer listData={listData}/>
            </div>
        </>
    )
};
