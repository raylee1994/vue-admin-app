var webpack = require("webpack");
var path = require("path");
var config = require("./config");

var is_development = process.env.NODE_ENV == "development";

var entry = {
    main: path.resolve(__dirname, "../src/main.ts")
};

var output = {
    path: path.resolve(__dirname, "../dist"),
    filename: is_development ? "[name].js" : "[name].[chunkhash:8].js",
    publicPath: is_development ? config.dev.publicPath : config.prod.publicPath
};

var module = {
    rules: [
        {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: "node_module",
            options: {
                appendTsSuffixTo: /\.vue$/
            }
        }
    ]
}
