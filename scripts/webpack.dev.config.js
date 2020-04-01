var baseConfig = require("./webpack.base.config");
var webpack = require("webpack");
var merge = require("webpack-merge");

baseConfig.entry["webpack-hot-middleware"] = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

var webpackConfig = merge({
    mode: "development",
    optimization: {
        moduleIds: "named",
        chunkIds: "named"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}, baseConfig);

module.exports = webpackConfig