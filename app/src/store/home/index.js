import { reqCategoryList } from '@/api'
import { reqGetBannerList } from '@/api'
import {reqGetFloorList} from '@/api';
const state = {
    categoryList: [],
    bannerList:[],
    floorList:[],
}
const actions = {
    // 通过调用api文件夹中index.js中接口函数，向服务器发请求并获取数据
    async categoryList(context, value) {
        let result = await reqCategoryList()
        if (result.code == 200) { context.commit("CATEGORYLIST", result.data) }
    },
    async getBannerList(context, value) {
        let result = await reqGetBannerList()
        if (result.code == 200) { context.commit("GETBANNERLIST", result.data) }
    },
    async getFloorList(context, value) {
        let result = await reqGetFloorList()
        if (result.code == 200) { context.commit("GETFLOORLIST", result.data) }
    }
}
const mutations = {
    CATEGORYLIST(state, value) {
        state.categoryList = value
    },
    GETBANNERLIST(state, value) {
        state.bannerList = value
    },
    GETFLOORLIST(state, value) {
        state.floorList = value
    },
}
const getters = {}
export default {
    state,
    actions,
    mutations,
    getters,
}