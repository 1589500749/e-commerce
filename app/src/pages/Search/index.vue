<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 各级分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">×</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTrademark">×</i></li>
            <!-- 商品属性的面包屑 -->
            <li class="with-x" v-for="(item, index) in searchParams.props" :key="index">{{item.split(":")[1]}}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector  @trademarkInfo='trademarkInfo' @attrInfo='attrInfo'/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序 -->
              <ul class="sui-nav">
                <!-- 若order包含1，则active为true,“综合”加上active类 -->
                <!-- 点击事件的回调函数将tab栏的标识作为参数 -->
                <li :class="{active:isOne}" @click="changeOrder(1)">
                  <a>综合<span v-show="isOne" class="iconfont" :class=" {'icon-arrowup':isUp,'icon-arrowdown':isDown}"></span></a>
                </li>
                <li :class="{active:isTwo}" @click="changeOrder(2)">
                  <a>价格<span v-show="isTwo" class="iconfont" :class=" {'icon-arrowup':isUp,'icon-arrowdown':isDown}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 路由跳转带上id，跳到指定的详情页 -->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{good.price}}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{good.title}}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页 -->
          <pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @getPageNo="getPageNo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters,mapState} from "vuex";
export default {
  name: "Search",
  data() {
    return {
      // post请求将要带给服务器的参数

      searchParams: {
        // 一级分类id
        category1Id: "",
        // 二级分类id
        category2Id: "",
        // 三级分类id
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 用户输入的关键字
        keyword: "",
        // 排序(1代表综合，2代表价格，desc代表降序，asc代表升序)，默认为综合降序
        order: "1:desc",
        // 代表当前是第几页，默认为第一页
        pageNo: 1,
        // 代表每一页展示数据的个数
        pageSize: 3,
        // 用户选择的具体的商品属性
        props: [],
        // 商品的品牌
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  // params参数来自用户输入的关键字，query参数来自用户点击的各级分类
  beforeMount() {
    
    // 发请求之前，将用户点击分类的query参数和用户输入的关键字参数params合并到this.searchParams
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    // 挂载完毕后的第一次发请求
    this.getData();
  },
  computed: {
    // 只要仓库有goodsList就能用，不用区分goodsList是哪个子仓库的
    ...mapGetters(["goodsList"]),
    // 获取search模块展示的产品总数
    ...mapState({
      total:state=>state.search.searchList.total
    }),
    // order中包含1或2，则active为true,“综合”或“价格”加上active类
    isOne(){return this.searchParams.order.indexOf('1')!=-1},
    isTwo(){return this.searchParams.order.indexOf('2')!=-1},
    // order中包含acs(desc)，则加上向上(向下)的箭头
    isUp(){return this.searchParams.order.indexOf('asc')!=-1},
    isDown(){return this.searchParams.order.indexOf('desc')!=-1},
  },
  methods: {
    // 把请求数据派发dispatch封装成一个函数
    // 向服务器请求获取search组件的数据，根据用户输入的关键词(即参数)不同来返回不同的数据
    getData() {
      // post请求，至少传一个空对象作为post请求的参数
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 面包屑点击后删除分类面包屑
    removeCategoryName(){
      // 把带给服务器的参数置空
      // 接口文档中下面的几个参数是非必选，如果通过赋空串来置空，参数仍会带给服务器，若通过赋“undefined”来置空，参数不会带给服务器，提高服务器效率
      this.searchParams.categoryName=undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      // 重新发请求，刷新商品展示区
      this.getData()
      // 地址栏相应的分类参数也要去掉
      // 在当前路由下跳转到当前路由(带上用户输入的keyword关键字)，刷新地址栏
      this.$router.push({name:'search',params:this.$route.params})
    },
    // 面包屑点击后删除“用户输入的关键字”面包屑
    removeKeyword(){
      this.searchParams.keyword=undefined
      // 重新发请求，刷新商品展示区
      this.getData()
      // 通知兄弟组件Header清除输入框的关键字
      this.$bus.$emit('clear')
      // 地址栏相应的keyword参数也要去掉
      // 在当前路由下跳转到当前路由(带上用户点击的分类参数)，刷新地址栏
      this.$router.push({name:'search',query:this.$route.query})
    },
    // 面包屑点击后删除品牌信息的面包屑
    removeTrademark(){
      this.searchParams.trademark=undefined
      this.getData()
    },
    // 面包屑点击后删除商品售卖属性的面包屑
    removeAttr(index){
      // 根据index来确认删除的哪个面包屑
      this.searchParams.props.splice(index,1)
      this.getData()
    },
    // 自定义事件tardemarkInfo的回调函数
    trademarkInfo(trademark){
      // 将品牌信息添加进参数
      this.searchParams.trademark=`${trademark.tmId}:${trademark.tmName}`
      // 重新发请求，刷新商品展示区
      this.getData()
    },
    // 自定义事件attrInfo的回调函数
    attrInfo(attr,attrValue){
      let props=`${attr.attrId}:${attrValue}:${attr.attrName}`
      // 若用户新点击的属性在searchParams.props中已经有了
      if(this.searchParams.props.indexOf(props==-1)){
        this.searchParams.props.push(props)
      }
      this.getData()
    },
    // 排序
    changeOrder(flag){
      // 获取初始的order是综合还是价格(originFlag)，是升序还是降序(originSort)
      let originFlag=this.searchParams.order.split(":")[0]
      let orginSort=this.searchParams.order.split(":")[1]
      // 默认是综合降序
      // 如果点击的是上一次的tab标签，则只需改箭头方向(即desc和acs切换)
      if(flag==originFlag){this.searchParams.order=`${originFlag}:${orginSort=="desc"?"asc":"desc"}`}
      // 如果点击的不是上一次的tab标签，则order中两个值都要改
      else{this.searchParams.order=`${originFlag=="1"?"2":"1"}:${orginSort=="desc"?"asc":"desc"}`}
      // 根据新的order参数再次发请求获取新数据
      this.getData()
    },
    // 自定义事件getPageNo获取当前是第几页
    getPageNo(pageNo){
      // 整理参数并重新发数据请求
      this.searchParams.pageNo=pageNo
      this.getData()
    },
  },
  watch: {
    // 监听路由信息是否变化(即query和params的变化)，若变化则再次发请求，从而解决组件只能发一次请求的不足
    $route(newValue) {
      // 每次请求完毕，将上次请求的一二三级分类的id参数清空，从而接收下一次请求的参数，这样上次请求所留下的多余参数不会带到本次请求
      // 这里的categoryName和keyword不用清空，是因为它们每次路由变化都会重新赋值，而各级的分类id中，用户每次点击的分类的级别不一样，例如第一次点的一级分类，第二次点击三级分类，category3Id的赋值并不会影响category1Id的值
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
      // 再次发请求前，重新整理发给服务器的参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getData();
      
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      
    }
  }
}
</style>