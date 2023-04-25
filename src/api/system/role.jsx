import request from "../base";

class RoleAPI {

    add_role(props) {
        return request.request({
            method: 'POST',
            url: `/api/system/role`,
            data: {
                ...props
            }
        })
    }

    update_role(rid, type, props) {
        return request.request({
            method: 'POST',
            url: `/api/system/role/${rid}/${type}`,
            data: {
                ...props
            }
        })
    }

    get_roles(props) {
        return request.request({
            method: 'GET',
            url: "/api/system/role",
            params: {
                ...props
            }
        })
    }
}

export default new RoleAPI();
