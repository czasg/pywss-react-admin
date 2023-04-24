import request from "../base";

class UserAPI {
    login({loginType = 'default', username, password}) {
        return request.request({
            method: 'POST',
            url: "/api/system/user/login",
            data: {
                loginType,
                username,
                password,
            }
        })
    }

    update_user(uid, props) {
        return request.request({
            method: 'POST',
            url: `/api/system/user/${uid}`,
            data: {
                ...props
            }
        })
    }

    get_users(props) {
        return request.request({
            method: 'GET',
            url: "/api/system/user",
            params: {
                ...props
            }
        })
    }
}

export default new UserAPI();
