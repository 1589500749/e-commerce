import Vue from 'vue'
import App from './App.vue'
import router from '@/router'//引入路由器
import VueLazyload from 'vue-lazyload'//图片懒加载
// 引入全局组件
import TypeNav from '@/components/TypeNav';
import Pagination from '@/components/Pagination';
import { Button, MessageBox } from 'element-ui'
// 注册全局组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Pagination.name,Pagination)
Vue.component(Button.name, Button)


// elemetUI注册组件的方式之一，挂载到原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 引入vuex仓库
import store from '@/store';

// 引入mock.js---mock数据
import '@/mock/mockServe'
// 引入swiper样式
import "swiper/css/swiper.css"
// 引入api文件夹的所有请求函数
import * as API from '@/api'
// 引入懒加载默认的图片
import atm from '@/assets/test.png'

// 注册插件
Vue.use(VueLazyload, {
  // 懒加载默认的图片
  loading: atm,
})

Vue.config.productionTip = false

// 检测search组件需要的数据是否成功获取
// import {reqGetSearchInfo} from '@/api'
// console.log(reqGetSearchInfo({}));
new Vue({
  el:'#app',
  render: h => h(App),
  // 注册路由器:此时所有的组件上会多出$route和$router属性
  router,
  // 注册vuex仓库：此时所有的组件上会多出$store属性
  store,
  beforeCreate(){
    // 配置全局事件总线
    Vue.prototype.$bus=this
    // 将api文件夹的所有请求函数挂载到vm上，所有组件都可以不通过vuex仓库，直接发送请求
    Vue.prototype.$API=API
  },
})