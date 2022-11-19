import { reqGetSearchInfo } from "@/api"
const state={
    // 由于从服务器返回的是对象形式的数据，所以searchList初始值必须是个空对象
    searchList:{}
}
const actions={
    // params是post请求接口所必需的请求参数
    // params={}这种写法，若没有传参过来，参数params默认值为空对象
    async getSearchList(contex,params={}){
        let result=await reqGetSearchInfo(params)
        if(result.code==200){
            contex.commit('GETSEARCHLIST',result.data)
        }
    }
}
const mutations={
    GETSEARCHLIST(state,searchList){
        state.searchList=searchList
    }
}
// getters用来简化仓库中的数据，组件获取数据更加方便
const getters={
    goodsList(state){
        // 如果网络有问题，接收不到返回的数据(此时返回的是undefined)，那么至少也要返回空数组,否则遍历会出问题
        return state.searchList.goodsList || []
    },
    trademarkList(state){
        return state.searchList.trademarkList
    },
    attrsList(state){
        return state.searchList.attrsList
    }
}
export default{
    state,
    actions,
    mutations,
    getters,
}