import axios from "axios";
import {useStore } from "vuex";
import { getToken} from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { ElMessage,ElNotification  } from 'element-plus'


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'


const  BASE_URL = 'http://localhost:8889';
// 创建axios 实例
const service  = axios.create({
    // axios 中请求配置有baseUrl选项，表示请求URL公共部分
    baseURL: BASE_URL,
    timeout: 10000,
})

// request 拦截器
service.interceptors.request.use(config => {

    const token = getToken();
    if (token) {
        //请求携带自定义token
        config.headers['AuthToken'] = token;
    }
   // get请求映射params 参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?';
        for (const propertyName of Object.keys(config.params)) {
            const value = config.params[propertyName];
            var part = encodeURIComponent(propertyName) + "=";
            url +=part + encodeURIComponent(value) + "&";
        }
        url = url.slice(0,-1);
        config.params = {};
        config.url = url;
    }
    return config;
}, error =>  {
    Promise.reject(error);
})

// 响应拦截器
service.interceptors.response.use( res => {
    // 未设置状态码，默认为成功
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (code === 500) {
        ElMessage({
            message: msg,
            type: 'error',
        })
        return Promise.reject(new Error(msg));
    } else if (code !== 200) {
        ElNotification({
            title: 'error',
            message: msg,
            type: 'error',
        })
        return Promise.reject('error')
    } else {
        return res.data.data;
    }
},error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
        message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

function getBaseURL() {
    return BASE_URL;
}

export {service , getBaseURL };
