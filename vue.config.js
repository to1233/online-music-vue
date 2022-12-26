const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
    lintOnSave: false,
    chainWebpack: (config) => {
        // 生产环境，开启js\css压缩
            config.plugin('compressionPlugin').use(new CompressionPlugin({
                test: /\.(js|css|less|map)$/, // 匹配文件名
                threshold: 1024, // 对超过10k的数据压缩
                minRatio: 0.8,
            }))
    },
}
