import request from "../base";

class AsyncTaskAPI {

    get_tasks(props) {
        return request.request({
            method: 'GET',
            url: "/api/async_task/task",
            params: {
                ...props
            }
        })
    }
}

export default new AsyncTaskAPI();
