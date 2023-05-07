import request from "../base";

class AsyncTaskAPI {

    get_task(tid) {
        return request.request({
            method: 'GET',
            url: `/api/async_task/task/${tid}`,
        })
    }

    get_tasks(props) {
        return request.request({
            method: 'GET',
            url: "/api/async_task/task",
            params: {
                ...props
            }
        })
    }

    create_task(props) {
        return request.request({
            method: 'POST',
            url: "/api/async_task/task",
            data: {
                ...props
            }
        })
    }

    delete_task(tid) {
        return request.request({
            method: 'DELETE',
            url: `/api/async_task/task/${tid}`,
        })
    }
}

export default new AsyncTaskAPI();
