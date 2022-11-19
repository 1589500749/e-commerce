const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // npm run build 打包结果中移除map文件(map文件对于开发者意义不大，且文件较大)
  productionSourceMap:false,
  transpileDependencies: true,
  lintOnSave:false,
  // 配置代理服务器，解决跨域
  devServer:{
    proxy:{
      "/api":{
        target:" http://gmall-h5-api.atguigu.cn",
      },
    },
  },
})
