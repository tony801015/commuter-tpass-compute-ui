const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    port:8081,
    client: {
        webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
})
