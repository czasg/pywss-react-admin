import request from "../base";

class StatAPI {

    get_stat(props) {
        return request.request({
            method: 'GET',
            url: "/api/stat",
            params: {
                ...props
            }
        })
    }
}

export default new StatAPI();
