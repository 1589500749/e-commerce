<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked==1" @change="updateChecked(cart,$event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{cart.skuName}}</div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{cart.skuPrice}}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus',-1,cart)">-</a>
            <!-- 这里的$event.target.value*1，乘以1是为了过滤输入非法情况，如果输入的是文本或字母，乘以1后结尾为NaN -->
            <input autocomplete="off" type="text"  minnum="1" class="itxt" :value="cart.skuNum" @change="handler('change',$event.target.value*1,cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add',1,cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{cart.skuNum*cart.skuPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <a  class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked='this.isAllchecked && cartInfoList.length>0' @change="updateAllCartChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{this.totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    name: 'ShopCart',
    methods: {
      getData(){
        this.$store.dispatch('getCartList')
      },
      async handler(type,disNum,cart){
        // type用来区分回调函数是哪个标签触发的；disNum代表将要修改的量；cart是v-for遍历时的item，cart中的id用来指明操作的哪个产品
        // 向服务器发请求，传递disNum给服务器，服务器在当前的“数量”基础上,根据变化量disNum更新产品数量
        switch(type){
          case 'add':
            disNum=1
            break;
          case 'minus':
            // 产品的个数大于1才会传给服务器-1；否则传递给服务器0，服务器数据不变
            if(cart.skuNum>1)disNum=-1  
            else disNum=0         
            break;
          case 'change':
            // 若输入的数量是非法的，则置0
            if(isNaN(disNum) || disNum<1)disNum=0
            // 将用户输入的数量(即参数收到的所谓的disNum)和服务器最近一次返回的数量相减，得到真正的disNum
            else disNum=parseInt(disNum)-cart.skuNum
            break;
          
        }
        try {
          // 修改成功
           await this.$store.dispatch('addOrUpdateShopCart',{skuId:cart.skuId,skuNum:disNum})
          //  再次获取服务器中的新数据
          this.getData()
        } catch (error) {
          
        }
      },
      // 点击删除的回调函数
      async deleteCartById(cart){
        try {
          await this.$store.dispatch('deleteCartListBySkuId',cart.skuId)
          // 若删除成功，再次发请求获取最新的数据来展示
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },
      // 修改商品的勾选状态
      async updateChecked(cart,event){
        try {
          // isChecked值是0代表不勾选，1代表勾选
          let isChecked=event.target.checked ? '1':'0'
          await this.$store.dispatch('updateCheckedById',{skuId:cart.skuId,isChecked})
          // 若状态修改成功，再次获取服务器最新勾选状态的数据
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },
      // 删除所有选中的产品
      async deleteAllCheckedCart(){
        try {
          await this.$store.dispatch("deleteAllCheckedCart")
          //若删除成功，再次获取最新的购物车数据
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },
      // 修改全部产品的购物车选择状态
      async updateAllCartChecked(event){
        try {
          // 获取当前“全选”框是否被勾选，被勾选是1，未被勾选是0
        let isChecked=event.target.checked ? "1" : "0"
        // 将“全选”框的状态派发到action
        await this.$store.dispatch("updateAllCartIsChecked",isChecked)
        this.getData()
        } catch (error) {
          alert(error.message)
        }
      },
    },
    mounted() {
      this.getData()
    },
    computed:{
      ...mapGetters(['cartList']),
      // 购物车的数据
      cartInfoList(){
        return this.cartList.cartInfoList || []
      },
      // 计算所购产品的总价
      totalPrice(){
        let sum=0
        this.cartInfoList.forEach(item=>{
          sum+=item.skuNum*item.skuPrice
          return sum
        })
      },
      // 判断是否全选
      isAllchecked(){
        // 数组方法every判断，数组中只要有一项不满足条件，返回false
        return this.cartInfoList.every(item=>item.isChecked==1)
      },
    },
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }



          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>