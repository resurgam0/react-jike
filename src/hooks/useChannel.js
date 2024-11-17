import { useState, useEffect } from "react"
import { getChannelAPI } from "@/apis/article"
// 封装获取频道列表的逻辑
function useChannel(){
    // 1.获取频道列表所有的逻辑
    // 2.把组件中要用到的数据return出去
    const [channels, setChannels] = useState([])
    useEffect(()=>{
        // 1.封装函数 在函数体内调用接口
        // 2.调用函数
        async function fetchChannels(){
            const res = await getChannelAPI()
            setChannels(res.data.channels)
        }
        fetchChannels()
    },[])
    return {
        channels
    }
}
export { useChannel }