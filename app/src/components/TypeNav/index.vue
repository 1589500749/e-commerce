<template>
  <div>
    <div class="type-nav">
      <div class="container" @mouseenter="entershow" @mouseleave="leaveshow" >
        <h2 class="all" >全部商品分类</h2>
        <nav class="nav">
          <a href="###">服装城</a>
          <a href="###">美妆馆</a>
          <a href="###">尚品汇超市</a>
          <a href="###">全球购</a>
          <a href="###">闪购</a>
          <a href="###">团购</a>
          <a href="###">有趣</a>
          <a href="###">秒杀</a>
        </nav>
        <div class="sort" v-show="show">
          <!-- 事件委派@click='goSearch'，将子节点的事件全部委派给父节点，从而产生疑问：怎么确定触发click事件一定是<a>标签？怎么确定点击的<a>标签是一级、二级还是三级分类的标签？ -->
          <!-- 在<a>标签中添加自定义属性data-categoryName,判断event.target.dataset中是否有该自定义属性，从而与其他类型的节点(h3、dt、dl、em节点)区分开 -->
          <!--同理，在<a>标签中添加自定义属性data-categoryId。      注意：自定义属性在定义的时候属性名用小驼峰法，但用的时候属性名全转为小写，因为dateset获取到的属性名都为小写-->
          <!-- 这里路由跳转使用的是编程式导航，若用声明式导航则会产生大量router-link的组件实例，占用内存影响性能 -->
          <div class="all-sort-list2" @click="goSearch">
            <div
              class="item bo"
              v-for="item_1 in categoryList"
              :key="item_1.categoryId"
            >
              <h3>
                <a
                  :data-categoryName="item_1.categoryName"
                  :data-category1Id="item_1.categoryId"
                  >{{ item_1.categoryName }}</a
                >
              </h3>
              <!-- 二、三级分类 -->
              <div class="item-list clearfix">
                <div
                  class="subitem"
                  v-for="item_2 in item_1.categoryChild"
                  :key="item_2.categoryId"
                >
                  <dl class="fore">
                    <dt>
                      <a
                        :data-categoryName="item_2.categoryName"
                        :data-category2Id="item_2.categoryId"
                        >{{ item_2.categoryName }}</a
                      >
                    </dt>
                    <dd>
                      <em
                        v-for="item_3 in item_2.categoryChild"
                        :key="item_3.categoryId"
                      >
                        <a
                          :data-categoryName="item_3.categoryName"
                          :data-category3Id="item_3.categoryId"
                          >{{ item_3.categoryName }}</a
                        >
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// 引入lodash全部函数
import _ from "lodash";
import "animate.css";
export default {
  name: "TypeNav",
  data() {
    return {
      show: true,
    };
  },
  components: {},
  // 组件挂载完毕，向服务器发送请求
  mounted() {
    // 如果不是Home组件，在挂载组件时将typeNav组件进行默认隐藏。只有Home组件中typeNav是默认显示的。
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  methods: {
    goSearch(event) {
      let element = event.target;
      // 解构出自定义属性
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      // 若categoryName不为空，则一定是a标签
      if (categoryname) {
        //整理路由跳转时需要携带的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 对一级、二级、三级分类的标签分别判断,并进行路由跳转和传递相应的参数
        if (category1id) {
          // 在query参数对象中创建并赋值id属性
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else if (category3id) {
          query.category3Id = category3id;
        }
        // 将已有的query对象合并进location对象
        location.query = query;
        // 判断当前路由是否有点击header组件所需要传递的params参数，若有，同样要将其合并进location对象
        if(this.$route.params){
          location.params=this.$route.params
        }
        this.$router.push(location);
      }
    },
    entershow() {
      this.show = true;
    },
    leaveshow() {
      // 除home组件外，鼠标移出则隐藏typeNav组件
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
  computed: {
    // 将vuex中的数据映射为组件实例对象身上的属性
    ...mapState({
      // 当使用categoryList这个计算属性时，右侧的函数会立即执行一次，参数state为总的vuex仓库的数据
      categoryList: (state) => {
        return state.home.categoryList;
      },
    }),
  },
};
</script>
<style scoped lang='less'>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
        .item:hover {
          background-color: skyblue;
        }
      }
    }
  }
}
</style>