var webpack = require("webpack");
var path = require("path");
var config = require("./config");
var {resolveStyle} = require("./utils");
var HappyPack = require("happypack");
var os = require("os");
var HappyThreadPool = HappyPack.ThreadPool({size: os.cpus().length - 1});
var HtmlWebpackPlugin = require("html-webpack-plugin");
var VueLoaderPugin = require("vue-loader/lib/plugin");

var is_dev = process.env.NODE_ENV == "development";

var entry = {
    main: path.resolve(__dirname, "../src/main.ts")
};

var output = {
    path: path.resolve(__dirname, "../dist"),
    filename: is_dev ? "[name].js" : "[name].[chunkhash:8].js",
    publicPath: is_dev ? config.dev.publicPath : config.prod.publicPath
};

var styleRules = resolveStyle({
    less: {}
});

var module = {
    rules: [
        {
            test: /\.(js|tsx?)$/,
            // loader: "babel-loader",
            loader: "happypack/loader?id=babel",
            exclude: "node_modules"
        },
        {
            test: /\.vue$/,
            // loader: "vue-loader"
            loader: "happypack/loader?id=vue"
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: "url-loader",
            options: {
                limit: 8192,
                name: "images/[name].[contenthash:8].[ext]",
                esModules: false
            }
        },
        ...styleRules
    ]
};

var devtool = is_dev ? "eval-source-map" : "source-map";

var plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../src/index.html")
    }),
    new VueLoaderPugin(),
    new HappyPack({
        id: "babel",
        loaders: ["babel-loader"],
        threadPool: HappyThreadPool
    }),
    new HappyPack({
        id: "vue",
        loaders: ["vue-loader"],
        threadPool: HappyThreadPool
    }),
    new HappyPack({
        id: "vue",
        loaders: ["vue-loader"],
        threadPool: HappyThreadPool
    })
]

