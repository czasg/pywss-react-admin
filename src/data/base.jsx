import axios from 'axios';

const request = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 0,
})

export default request;
