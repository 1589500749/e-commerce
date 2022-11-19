import { reqGoodsInfo,reqAddOrUpdateShopCart } from "@/api"
import {getUUID} from "@/utils/uuid_token"
const state={
    goodInfo:{},
    // 临时游客身份,随机生成一个字符串标识该游客身份
    uuid_token:getUUID()
}
const mutations={
    GETGOODINFO(state,goodInfo){
        state.goodInfo=goodInfo
    }
}
const actions={
     async getGoodInfo(context,skuId){
        let result=await reqGoodsInfo(skuId)
        if(result.code==200){
            context.commit('GETGOODINFO',result.data)
        }
    },
    async addOrUpdateShopCart(context,{skuId,skuNum}){
        // 添加到购物车，服务器写入数据库并没有返回其他数据，所以不需要三连环进行vuex仓库存储
        let result=await reqAddOrUpdateShopCart(skuId,skuNum)
        // async函数返回的一定是promise，要么成功要么失败
        if(result.code==200)
            return '成功加入购物车'
        else 
            return Promise.reject(new Error('faile'))
    },
}
const getters={
    // state.goodInfo初始是空对象，若服务器响应慢，则state.goodInfo.categoryView此时读取到的是undefined，组件中使用state.goodInfo.categoryView中的属性会报错
    // 因此在后面或一个空对象，state.goodInfo.categoryView中的属性读取为undefined
    // 路径导航的数据
    categoryView(state){
        return state.goodInfo.categoryView || {}
    },
    // 产品信息的数据
    skuInfo(state){
        return state.goodInfo.skuInfo || {}
    },
    // 售卖属性的数据
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || []
    },
}

export default{
    state,
    actions,
    mutations,
    getters,
}
