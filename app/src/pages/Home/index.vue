<template>
  <div>
    <!-- 三级联动组件已注册为全局组件，不需要再引入 -->
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <!-- 使用v-for遍历来复用组件，生成两个floor组件实例 -->
    <!-- 用props将floorList传递给子组件 -->
    <Floor  v-for="(item) in floorList" :key="item.id" :list='item ' />
    <Brand />
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import { mapState } from 'vuex';
export default {
  name: "home",
  data() {
    return {};
  },
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 派发action:通过vuex发ajax请求，将数据存储到仓库中
    // 由于要复用组件floor，所以获取数据、存数据到vuex仓库的语句放在父组件中
    this.$store.dispatch("getFloorList");
    // 获取登录成功的用户的信息在首页展示
    if(this.$store.state.user.token){
      this.$store.dispatch('getUserInfo')
    }
  },
  methods: {},
  computed:{
    // 获取vuex仓库中的floorList数据
    ...mapState({
      floorList: (state) => state.home.floorList,
      }),
  }
};
</script>
<style scoped lang='less'>
</style>