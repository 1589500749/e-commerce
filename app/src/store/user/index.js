import {reqGetCode,reqUserRegister,reqUserLogin,reqUserInfo,reqLogout} from '@/api'

const state={
    code:'',
    // 初始从本地拿到一个空串，登录成功以后刷新网页，获得的是存储在本地的token
    token:localStorage.getItem('TOKEN')|| '',
    userInfo:{},
}
const mutations={
    GETCODE(state,code){
        state.code=code
    },
    USERLOGIN(state,token){
        state.token=token
    },
    GETUSERINFO(state,userInfo){
        state.userInfo=userInfo
    },
    CLEAR(state){
        state.token=''
        state.userInfo={}
        localStorage.removeItem('TOKEN')
    },
}
const actions={
    // 这里的接口返回的是验证码，但实际业务中是将验证码发给用户的手机
    async getCode(context,phone){
        let result=await reqGetCode(phone)
        if(result.code==200){
            context.commit('GETCODE',result.data)
            return '验证码获取成功'
        }else return Promise.reject(new Error('faile'))
    },
    // 注册业务,将收到的用户信息作为参数传给接口
    async userRegister(context,user){
        let result=await reqUserRegister(user)
        if(result.code==200){
            return "注册成功"
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 登录业务
    async userLogin(context,data){
        let result=await reqUserLogin(data)
        if(result.code==200){
            // token是用户的唯一标识，通过带上token向服务器要到相应的用户的信息
            // 用户登录成功，获取到token
            context.commit('USERLOGIN',result.data.token)
            // 持久化存储
            localStorage.setItem('TOKEN',result.data.token)
            return "登录成功"
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 通过token获取用户信息
    async getUserInfo(context){
        let result=await reqUserInfo()
        if(result.code==200){
            context.commit('GETUSERINFO',result.data)
            return "获取用户信息成功"
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 首先向服务器发退出登录的请求，清除服务器的token;接着通过mutations清除vuex仓库的token和用户数据；最后清除localStorage中的token
    async userLogout(context){
        let result=await reqLogout()
        if(result.code==200){
            context.commit('CLEAR')
            return "退出登录成功"
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
}
const getters={}

export default {
  state,
  mutations,
  actions,
  getters,
}