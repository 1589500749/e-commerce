<template>
  <div>
    <div class="pagination">
      <!-- 若当前是第一页，则不能点这个按钮。否则触发自定义事件 -->
    <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="this.startNumAndEndNum.start>1"  @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <button v-if="this.startNumAndEndNum.start>2">···</button>
    <!-- v-for和v- -->

        <button v-for="(page, index) in startNumAndEndNum.end" :key="index"  v-show="isShow(page)" @click="$emit('getPageNo',page)"  :class="{active:pageNo==page}">{{page}}</button>

    
    
    <button v-if="this.startNumAndEndNum.end<totalPage-1">···</button>
    <button v-if="this.startNumAndEndNum.end<totalPage" @click="$emit('getPageNo',totalPage)"  :class="{active:pageNo==totalPage}">{{totalPage}}</button>
    <button :disabled="pageNo==totalPage" @click="$emit('getPageNo',pageNo+1)">下一页</button>
    
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props:['pageNo',"pageSize","total","continues"],
  data () {
    return {

    }
  },
  components: {

  },
  mounted() {

  },
  methods: {
    isShow(page){
        if(page>=this.startNumAndEndNum.start){
            return true
        }else{
            return false
            }
    },

  },
  computed:{
    totalPage(){
        // 向上取整算出总共多少页
        return Math.ceil(this.total/this.pageSize)
    },
    startNumAndEndNum(){
        //算出连续页码的起始值和结束值
        let start=0,end=0
        // 如果总页数没有连续的页码多
        if(this.continues>this.totalPage){
            start=1
            end=this.totalPage
        }
        // 总页数大于连续的页码
        else{
            start=this.pageNo-parseInt(this.continues/2)
            end=this.pageNo+parseInt(this.continues/2)
            // 考虑start等0或等于负数的bug情况
            if(start<1){
                start=1
                end=this.continues
            }
            // 考虑end大于总页数的bug情况
            if(end>this.totalPage){
                end=this.totalPage
                start=this.totalPage-this.continues+1
            }
        }
        return {start,end}
    },
    
  },
}

</script>
<style scoped lang='less'>
.pagination {
    text-align: center;
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #409eff;
        color: #fff;
      }
    }
  }
.active{
  background: skyblue;
}
</style>