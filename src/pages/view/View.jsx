import {Outlet} from "react-router-dom";
import React from "react";

export default function View() {
    return (
        <div className="ml-56 p-4" style={{
            backgroundColor: '#f1f1f1',
        }}>
            <div className="bg-white">
                <Outlet/>
            </div>
        </div>
    )
}
