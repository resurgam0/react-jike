// axios的封装处理
// 1.根域名配置
// 2.超时时间
// 3.请求拦截器 响应拦截器
import axios from "axios";
import { getToken } from "@/utils";
import router from "@/router";
import { removeToken } from "@/utils";
const request = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use((config)=>{
    // 操作这个config 注入token数据
    // 1.获取到token
    // 2.按照后端的格式要求做token的拼接
    const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error)=>{
    return Promise.reject(error)
})
// 添加响应拦截器
request.interceptors.response.use((response)=>{
    // 对响应数据做点什么
    return response.data
},(error)=>{
    // 对响应，错误做点什么
    // 监控401 token失效
    console.dir(error)
    if(error.response.status===401){
        removeToken()
        router.navigate('/login')
        window.location.reload() //window强制刷新
    }
    return Promise.reject(error)
})
export { request }