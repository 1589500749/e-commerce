import {reqCartList,reqDeleteCartById,reqUpdateCheckedByid} from '@/api'

const state={
  cartList:[]
}
const mutations={
  GETCARTLIST(state,cartList){
    state.cartList=cartList
  },
}
const actions={
  // 获取购物车列表数据
    async getCartList(context){
        let result=await reqCartList()
        if (result.code==200){context.commit('GETCARTLIST',result.data)}
    },
    // 删除购物车产品
    async deleteCartListBySkuId(context,skuId){
        let result=await reqDeleteCartById(skuId)
        if (result.code==200){return '删除成功'}
        else {return Promise.reject(new Error('删除失败'))}
    },
    // 修改购物车产品的选中状态
    async updateCheckedById(context,{skuId,isChecked}){
        let result=await reqUpdateCheckedByid(skuId,isChecked)
        if (result.code==200){return '修改成功'}
        else {return Promise.reject(new Error('修改失败'))}
    },
    // 删除所有选中的产品
    deleteAllCheckedCart(context){
      let PromiseAll=[]
      // 遍历购物车列表，若商品被选中，则调用“删除一次”的函数，若未被选中，则什么也不做
      context.getters.cartList.cartInfoList.forEach(item=>{        
        if(item.isChecked==1){
          // 每次dispatch返回的都是一个promise对象，将它们存入PromiseAll数组中，
          let promise=context.dispatch('deleteCartListBySkuId',item.skuId)
          PromiseAll.push(promise)
        }else{
          ''
        }
      })
      // 若每一个被选项都成功删除，则返回结果为成功；如果其中有一个失败，则返回失败的结果;
      return Promise.all(PromiseAll)
    },
    // 修改全部产品的状态
    updateAllCartIsChecked(context,isChecked){
      let promiseAll=[]
      // 遍历购物车列表
      context.state.cartList[0].cartInfoList.forEach((item)=>{
        let promise=context.dispatch('updateCheckedById',{skuId:item.skuId,isChecked})
        promiseAll.push(promise)
      })
      return Promise.all(promiseAll)
    },
}
const getters={
  cartList(){
    return state.cartList[0] || {}
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}