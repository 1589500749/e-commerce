// 二次封装axios


import axios from 'axios';

// 引入进度条
import nprogress from 'nprogress';
// 引入进度条的样式
import "nprogress/nprogress.css";
// 引入vuex仓库
import store from '@/store';

// 创建一个axios实例
const requests=axios.create({
    // 基础路径，发请求时，路径中会在端口号后面添加 '/api'
    baseURL:'/api',
    // 请求的超时时间为5s
    timeout:5000,
})
// 请求拦截器：在发请求前做一些事情
requests.interceptors.request.use(
    (config)=>{
        // 请求头添加一个字段(userTempId)和后端提前商量好
        if(store.state.detail.uuid_token){
            config.headers.userTempId=store.state.detail.uuid_token
        }
        // 需要携带token给服务器
        if(store.state.user.token){
            config.headers.token=store.state.user.token
        }
        // 让进度条开始动
        nprogress.start();
        return config}
    );

// 响应拦截器
requests.interceptors.response.use(
    // 服务器响应成功返回数据后，响应拦截器做一些事情，响应失败也可以做一些事情
    (res)=>{nprogress.done();return res.data},(error)=>{return Promise.reject(new Error('faile'))}
    )

// 对外暴露
export default requests;