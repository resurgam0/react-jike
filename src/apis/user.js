// 用户相关的所有请求

const { request } = require("@/utils");

// 1.登录请求
export function LoginAPI(data){
    return request({
        url: '/authorizations',
        method: 'POST',
        data
    })
}

// 2.获取用户信息
export function getProfileAPI(){
    return request({
        url: '/user/profile',
        method: 'GET',
    })
}