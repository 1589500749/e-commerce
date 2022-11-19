<template>
  <div class="swiper-container" ref="cur" >
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in skuImageList" :key="item.id">
        <img :src="item.imgUrl" :class="{active:currentIndex==index}" @click="changeCurrentIndex(index)"/>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  props: ["skuImageList"],
  data() {
    return {
      currentIndex:0
    }
  },
  watch: {
    skuImageList(newValue, oldValue) {
      this.$nextTick(() => {
        new Swiper (this.$refs.cur, {
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // 轮播图同时显示的图片个数
    slidesPerView : 3,
  })        
      });
    },
  },
  methods: {
    changeCurrentIndex(index){
      // 修改当前点击的轮播图的索引，使active类样式出现在当前索引的图片上
      this.currentIndex=index
      // 告诉兄弟组件zoom当前的索引值，使轮播图上方的大图同步变化
      this.$bus.$emit('getIndex',this.currentIndex)
      },
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>