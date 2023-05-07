import React from "react";
import { Routes, Route, useParams } from 'react-router-dom';


export default function AsyncTaskDetailView() {
    const { tid } = useParams();
    console.log(tid)
    return (
        <>
            <div>
                hello world
            </div>
        </>
    )
};
