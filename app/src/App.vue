<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 通知vuex发请求，获取商品分类三级列表的数据，存储于home的vuex子仓库当中
    // 下面这句代码不放在home和search组件的子组件TyepNav里，是因为每次组件跳转都会销毁上一个组件，在home组件和search组件间来回跳转会不停的发送数据请求，影响性能
    // 数据请求语句放在App组件中，只会执行一次，将数据存在vuex仓库中
    this.$store.dispatch("categoryList");
  },
}
</script>

<style>

</style>
