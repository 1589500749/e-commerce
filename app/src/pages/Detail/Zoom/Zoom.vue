<template>
  <div class="spec-preview">
    <img :src="skuImageList[this.currentIndex].imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="skuImageList[this.currentIndex].imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['skuImageList'],
    data() {
      return {
        currentIndex:0,
      }
    },
    mounted() {
      // 获取兄弟组件imageList传来的图片索引值
      this.$bus.$on('getIndex',(index)=>{
        this.currentIndex=index
      })
    },
    methods: {
      handler(event){
        let mask=this.$refs.mask
        let big=this.$refs.big
        let left=event.offsetX-mask.offsetWidth/2
        let top=event.offsetY-mask.offsetHeight/2
        // 约束蒙板的范围
        if(left<=0)left=0
          else if(left>=mask.offsetWidth)left=mask.offsetWidth
        if(top<=0)top=0
          else if(top>=mask.offsetHeight)top=mask.offsetHeight
        // 修改元素的left和top属性值
        mask.style.left=left+'px'
        mask.style.top=top+'px'
        // 鼠标向左移动，big图向右移动；big放大了两倍，所以鼠标移动的left和top也要放大两倍
        big.style.left=-2*left+'px'
        big.style.top=-2*top+'px'
      },
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>