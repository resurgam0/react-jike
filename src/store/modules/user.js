// 和用户相关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { request, getToken, setToken as _setToken, removeToken } from "@/utils";
import { LoginAPI, getProfileAPI } from "@/apis/user";
const userStore = createSlice({
    name: 'user',
    initialState:{
        token: getToken() || '',
        userInfo: {

        }
    },
    // 同步修改方法
    reducers:{
        setToken(state, action){
            state.token = action.payload
            _setToken(action.payload)
        },
        setUserInfo(state, action){
            state.userInfo = action.payload
        },
        clearUserInfo(state){
            state.token = ''
            state.userInfo = {}
            removeToken()
        }
    }
})
// 解构出actionCreator
const {setToken, setUserInfo, clearUserInfo} = userStore.actions
// 获取reducer函数
const userReducer = userStore.reducer
// 异步方法 完成登录获取token
const fetchLogin = (loginForm)=>{
    return async(dispatch)=>{
        // 发送异步请求
        // 提交同步action进行token的存入
        const res = await LoginAPI(loginForm)
        dispatch(setToken(res.data.token))
    }
}
// 获取个人用户信息
const fetchUserInfo = ()=>{
    return async(dispatch)=>{
        const res = await getProfileAPI()
        dispatch(setUserInfo(res.data))
    }
}
export {setToken, fetchLogin, setUserInfo, fetchUserInfo, clearUserInfo}
export default userReducer