// API进行统一管理
import requests from './request'
import mockRequests from './request_mock'
// 三级联动接口
//   /api/product/getBaseCategoryList get请求 无参数
// 一旦调用reqCategoryList函数，就会发出请求，返回一个promise对象
export  const reqCategoryList=()=>{
    // 发请求
   return requests({
        // 前面会自动加上baseURL,即为'/api'
        url:'/product/getBaseCategoryList',
        method:'get',
    })
}

// 首页轮播图接口
export const reqGetBannerList=()=>mockRequests.get('/banner')

// floor组件的数据接口
export const reqGetFloorList=()=>mockRequests.get('/floor')



// 获取搜索了以后，从服务器返回的数据
// 调用这个post接口，请求参数至少要传一个空对象给服务器，不然post请求失败
export const reqGetSearchInfo=(params)=>{
    return requests({
        url:'/list',
        method:'post',
        data:params,
    })
}
// 获取产品详情的数据
export const reqGoodsInfo=(skuId)=>{
    return requests({
        url:`/item/${skuId}`,
        method:'get',
        
    })
}
// 将产品添加到购物车并更新产品个数
export const reqAddOrUpdateShopCart=(skuId,skuNum)=>{
    return requests({
        url:`/cart/addToCart/${skuId}/${skuNum}`,
        method:'post',
        
    })
}
// 获取购物车页面的数据
export const reqCartList=()=>{
    return requests({
        url:"/cart/cartList",
        method:'get',
        
    })
}
// 删除购物车中的产品
export const reqDeleteCartById=(skuId)=>{
    return requests({
        url:`/cart/deleteCart/${skuId}`,
        method:'delete',
        
    })
}
// 修改商品选中的状态
export const reqUpdateCheckedByid=(skuId,isChecked)=>{
    return requests({
        url:`/cart/checkCart/${skuId}/${isChecked}`,
        method:'get',
        
    })
}
// 获取验证码
export const reqGetCode=(phone)=>{
    return requests({
        url:`/user/passport/sendCode/${phone}`,
        method:'get',
        
    })
}
// 注册
export const reqUserRegister=(data)=>{
    return requests({
        url:`/user/passport/register`,
        method:'post',
        data,
    })
}
// 登录
export const reqUserLogin=(data)=>{
    return requests({
        url:`/user/passport/login`,
        method:'post',
        data,
    })
}
// 带着用户的token从服务器获取用户的信息
export const reqUserInfo=()=>{
    return requests({
        url:`/user/passport/auth/getUserInfo`,
        method:'get',
    })
}
// 退出登录
export const reqLogout=()=>{
    return requests({
        url:`/user/passport/logout`,
        method:'get',
    })
}
// 获取结算页面的用户收货地址等信息
export const reqAddressInfo=()=>{
    return requests({
        url:`/user/userAddress/auth/findUserAddressList`,
        method:'get',
    })
}
// 获取结算页面的送货清单
export const reqOrderInfo=()=>{
    return requests({
        url:`/order/auth/trade`,
        method:'get',
    })
}
// 提交订单
export const reqSubmitOrder=(tradeNo,data)=>{
    return requests({
        url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,
        method:'post',
        data
    })
}
// 支付页面获取订单信息
export const reqPayInfo=(orderId)=>{
    return requests({
        url:`/payment/weixin/createNative/${orderId}`,
        method:'get',
    })
}
// 获取支付状态
export const reqPayStatus=(orderId)=>{
    return requests({
        url:`/payment/weixin/queryPayStatus/${orderId}`,
        method:'get',
    })
}
// 获取个人中心的订单列表
export const reqMyOrderList=(page,limit)=>{
    return requests({
        url:`/order/auth/${page}/${limit}`,
        method:'get',
    })
}

