import axios from 'axios';
import jwt from "../utils/jwt";

const host = import.meta.env.VITE_SERVER_HOST === undefined ? '' : import.meta.env.VITE_SERVER_HOST

const request = axios.create({
    baseURL: host,
    timeout: 0,
})
request.interceptors.request.use(function (config) {
    const jwtToken = jwt.getJWT();
    if (jwtToken !== null) {
        config.headers.set("Authorization", `Bearer ${jwtToken}`);
    }
    console.log(config)
    return config;
});

export default request;
