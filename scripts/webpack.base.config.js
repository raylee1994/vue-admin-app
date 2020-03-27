var webpack = require("webpack");
var path = require("path");
var config = require("./config");
var HappyPack = require("happypack");
var os = require("os");
var HappyThreadPool = HappyPack.ThreadPool({size: os.cpus().length - 1});

var is_dev = process.env.NODE_ENV == "development";

var entry = {
    main: path.resolve(__dirname, "../src/main.ts")
};

var output = {
    path: path.resolve(__dirname, "../dist"),
    filename: is_dev ? "[name].js" : "[name].[chunkhash:8].js",
    publicPath: is_dev ? config.dev.publicPath : config.prod.publicPath
};

var module = {
    rules: [
        {
            test: /\.tsx?$/,
            loader: "babel-loader",
            exclude: "node_modules"
        },
        {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: "node_modules"
        },
        {
            test: /\.vue$/,
            loader: "vue-loader"
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: "url-loader",
            options: {
                limit: 8192,
                name: "images/[name].[contenthash:8].[ext]",
                esModules: false
            }
        }
    ]
}
