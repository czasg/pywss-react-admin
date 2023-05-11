import request from "../base";

class ExamAPI {

    get_exam() {
        return request.request({
            method: 'GET',
            url: "/api/exam",
        })
    }

    get_exam_record() {
        return request.request({
            method: 'GET',
            url: "/api/exam/record",
        })
    }

    start_exam(eid) {
        return request.request({
            method: 'POST',
            url: `/api/exam/${eid}`,
        })
    }
}

export default new ExamAPI();
