import {v4 as uuidv4} from 'uuid'
// 生成一个随机字符串且每次执行不能变化，游客身份永久存储
export const getUUID=()=>{
    // 首先从本地存储获取uuid
    let uuid_token=localStorage.getItem('UUIDTOKEN')
    // 若本地没有uuid，则生成一个
    if(!uuid_token){
        uuid_token=uuidv4()
        // 将生成的uuid存储到本地
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    return uuid_token
}