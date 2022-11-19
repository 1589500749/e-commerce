import Vue from "vue";
// 引用vue-router路由插件
import VueRouter from "vue-router";
import routes from './routes'
// 引入store
import store from '@/store'

// 使用插件
Vue.use(VueRouter);


let router= new VueRouter({
    mode:"hash",
    routes: routes,
    // 控制路由跳转后滚动条默认位置
    scrollBehavior(to,from,savedPostition){
        return {x:0,y:0}
    },
})
// 路由守卫

// 全局前置守卫
// next是放行函数：next()指放行   next(path)指放行到指定的路由   next(false)指中断当前的路由跳转并回到from所指向的路由
router.beforeEach(async(to,from,next)=>{
  let token=store.state.user.token
  let name=store.state.user.userInfo.name
  // 获取仓库中的token,通过它判断用户是否成功登录
  if(token){
    // 已登录用户点击登录按钮，会重定向到主页
    if(to.path=='/login') next('/home')
    // 已登录用户点击其他按钮，先根据userInfo.name判断是否有用户信息
    // 如果有用户信息，则放行，否则去请求用户信息，然后放行
      else if(name) next()
              else {
                try {
                   await store.dispatch('getUserInfo')
                   next()
                } catch (error) {
                  // token过期，无法获取用户信息时报错
                  alert(error.message)
                  // 清除过期的token,回到登录页面
                  await store.dispatch('userLogout')
                  next('/login')
                }
              }
  }
  // 如果用户未登录,无法进入交易支付相关的页面，会重定向到登录页面,登录成功后跳转到先前
  else {
    if(to.path.indexOf('/trade')!=-1  ||  to.path.indexOf('/pay')!=-1  ||  to.path.indexOf('/center')!=-1  ||  to.path.indexOf('/shopcar')!=-1){
      // 登录成功会跳转到query参数中的redirect指向的路由
      next('/login?redirect='+ to.path)
    }else{
      next()
    }
  }
})
// 对外暴露vueRouter的实例
export default router
// 重写编程式导航的方法
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}
