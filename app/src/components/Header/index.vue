<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <!-- 用户未登录时显示 -->
          <p>尚品汇欢迎您！</p>
          <p v-if="!this.userName">
            <span>请</span>
            <router-link to="/Login">登录</router-link>
            <router-link class='register' to="/register">免费注册</router-link>
          </p>
          <!-- 用户登录以后显示 -->
          <p v-else>
            <a >{{this.userName}}</a>
            <a class='register' @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name:"",
  data() {
    return {
      keyword:'',
    }
  },
  computed:{
    // 从仓库获得已登录的用户的信息
    userName(){
      return this.$store.state.user.userInfo.name
    },
  },
  methods: {
    // 点击搜索按钮后向serach路由跳转,并将参数传给search路由组件 
    goSearch(){
      // this.$router.push('/serach/'+this.keyword+"?k="+this.keyword)  //以字符串形式路由传参，前一个传params参数，后一个传query参数
      // this.$router.push(`/serach/${this.keyword}?k=${this.keyword}`)  //以模板字符串形式路由传参，前一个传params参数，后一个传query参数
      // 判断是否有点击TypeNav组件所传递的query参数，若有，则合并进location一起传递给search路由组件
        if(this.$route.query){
          let location={                                               //以对象形式路由传参（常用),对象的写法可以是name或path形式，但注意path写法不能和params参数一起使用
          name:"search",
          // path:'./search',
          params:{keyword:this.keyword },
        }
        location.query=this.$route.query
        this.$router.push(location)
        }
    },
    async logout(){
      try {
        await this.$store.dispatch('userLogout')
        // 退出登录后回到首页
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    },
  },
  mounted() {
    // 通过全局事件总线清楚输入框的关键字
    this.$bus.$on("clear",()=>{
      this.keyword=''
    })
  },
}
</script>

<style scoped lang='less'>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>