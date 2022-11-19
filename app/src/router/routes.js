// 路由配置信息


import Search from "@/pages/Search"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Detail from "@/pages/Detail"
import AddCartSuccess from "@/pages/AddCartSuccess"
import ShopCart from "@/pages/ShopCart"
import Trade from "@/pages/Trade"
import Pay from "@/pages/Pay"
import PaySuccess from "@/pages/PaySuccess"
import Center from "@/pages/Center"
// 引入center路由组件下的二级路由组件
import MyOrder from "@/pages/Center/myOrder"
import GroupOrder from "@/pages/Center/groupOrder"

// 路由懒加载的第一步：定义箭头函数
const foo =()=>{
    return import("@/pages/Home")
}

export default [
    {
        path:"/home",
        // 路由懒加载的第二步:"Home"改写为 "foo"
        component:foo,
        meta:{show:true}
    },
    {
        path:"/center",
        component:Center,
        meta:{show:true},
        // 二级路由
        children:[
            {
                path:"myorder",
                component:MyOrder,
            },
            {
                path:"grouporder",
                component:GroupOrder,
            },
            {
                path:"/center",
                // 重定向，使得跳转到center路由后自动显示myorder二级路由
                redirect:"/center/myorder"
            }
        ]
    },
    {
        path:"/paysuccess",
        component:PaySuccess,
        meta:{show:true}
    },
    {
        path:"/pay",
        component:Pay,
        meta:{show:true},
        beforeEnter: (to, from, next) => {
            if(from.path=='/trade'){
                next()
            }else{
                next(false)
            }
        }
    },
    {
        name:'trade',
        path:"/trade",
        component:Trade,
        meta:{show:true},
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 只有从shopcart页面才能跳转到trade页面，其他页面跳转到trade的行为都会被中断
            if(from.path=='/shopcart'){
                next()
            }else{
                // url地址重置到'from'对应的路由
                next(false)
            }
        }
    },
    {
        path:"/shopcart",
        component:ShopCart,
        meta:{show:true}
    },
    {
        name:"addcartsuccess",
        path:"/addcartsuccess",
        component:AddCartSuccess,
        meta:{show:true}
    },
    {
        path:"/detail/:skuId",
        component:Detail,
        meta:{show:true}
    },
    {
        name:"search",
        path:"/serach/:keyword?",
        component:Search,
        meta:{show:true}
    },
    {
        path:"/register",
        component:Register,
        meta:{show:false}
    },
    {
        path:"/Login",
        component:Login,
        meta:{show:false}
    },
    {
        path:'*',
        redirect:"/home",
    },
]