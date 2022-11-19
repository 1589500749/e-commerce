// 二次封装axios


import axios from 'axios';

// 引入进度条
import nprogress from 'nprogress';
// 引入进度条的样式
import "nprogress/nprogress.css";

// 创建一个axios实例
const mockRequests=axios.create({
    // 基础路径，发请求时，路径中会在端口号后面添加 '/api'
    baseURL:'/mock',
    // 请求的超时时间为5s
    timeout:5000,
})
// 请求拦截器：在发请求前做一些事情
mockRequests.interceptors.request.use(
    (config)=>{nprogress.start();return config}
    );

// 响应拦截器
mockRequests.interceptors.response.use(
    // 服务器响应成功返回数据后，响应拦截器做一些事情，响应失败也可以做一些事情
    (res)=>{nprogress.done();return res.data},(error)=>{return Promise.reject(new Error('faile'))}
    )

// 对外暴露
export default mockRequests;