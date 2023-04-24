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

    update_user(uid, type, props) {
        return request.request({
            method: 'POST',
            url: `/api/system/user/${uid}/${type}`,
            data: {
                ...props
            }
        })
    }

    // update_user_role(uid, roles) {
    //     return request.request({
    //         method: 'POST',
    //         url: `/api/system/user/${uid}/role`,
    //         data: {
    //             roles
    //         }
    //     })
    // }

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
