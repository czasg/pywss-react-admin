import React, {useState} from "react";
import clsx from "clsx";

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


export default function ListView() {
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
                    </tr>
                    </thead>
                    <tbody>
                    {
                        ListData.map((data, idx) => (
                            <tr key={data.id} className="">
                                <th>{data.id}</th>
                                <td>{data.name}</td>
                                <td>{data.comment}</td>
                                <td>{data.all_count}</td>
                                <td>{data.success_count}</td>
                                <td>
                                    <progress className="progress progress-info w-56" value={data.success_count}
                                              max={data.all_count}/>
                                    {parseInt(data.success_count / data.all_count * 100)}%
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm text-black"
                                            disabled={data.success_count === data.all_count ? "" : "true"}>下载结果
                                    </button>
                                    <button className="btn btn-ghost btn-sm text-black">删除</button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <div className="btn-group">
                    <button className="btn">1</button>
                    <button className="btn btn-active">2</button>
                    <button className="btn">3</button>
                    <button className="btn">4</button>
                </div>
            </div>
        </>
    )
};