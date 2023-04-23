import request from "../base";

class ScanTask {
    get_task_list() {
        return request.request({
            "url": "/demo/scan_task",
        })
    }
}

export default new ScanTask();
