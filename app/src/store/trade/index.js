import {reqAddressInfo,reqOrderInfo} from '@/api'


const state={
    address:[],
    orderInfo:{},
}
const mutations={
    GETUSERADDRESS(state,address){
        state.address=address
    },
    GETORDERINFO(state,orderInfo){
        state.orderInfo=orderInfo
    }
}
const actions={
    async getUserAddress(context){
        let result=await reqAddressInfo()
        if(result.code==200){
            context.commit('GETUSERADDRESS',result.data)
        }
    },
    async getOrderInfo(context){
        let result=await reqOrderInfo()
        if(result.code==200){
            context.commit('GETORDERINFO',result.data)
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