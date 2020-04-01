var webpack = require("webpack");
var path = require("path");
var config = require("./config");
var { resolveStyle } = require("./utils");
var HappyPack = require("happypack");
var os = require("os");
var HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
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

var rules = [
    {
        test: /\.(js|tsx?)$/,
        // loader: "babel-loader",
        loader: "happypack/loader?id=babel",
        exclude: /node_modules/
    },
    {
        test: /\.vue$/,
        loader: "vue-loader"
        // loader: "happypack/loader?id=vue"
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
    {
        test: /\.css$/,
        use: [!is_dev && MiniCssExtractPlugin.loader, "happypack/loader?id=css"].filter(Boolean)
    },
    {
        test: /\.less$/,
        loader: [!is_dev && MiniCssExtractPlugin.loader, "happypack/loader?id=less"].filter(Boolean)
    }
];

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
    /* new HappyPack({
        id: "vue",
        loaders: ["vue-loader"],
        threadPool: HappyThreadPool
    }), */
    ...resolveStyle({
        less: {}
    })
]

var resolve = {
    alias: {
        "@": path.resolve(__dirname, "../src"),
        "views": path.resolve(__dirname, "../src/views"),
        "components": path.resolve(__dirname, "../src/components"),
        "common": path.resolve(__dirname, "../src/common"),
        "router": path.resolve(__dirname, "../src/router"),
        "views": path.resolve(__dirname, "../src/views"),
        vue$: "vue/dist/vue.esm.js",
    },
    extensions: [".vue", ".js", ".ts", ".tsx", ".less", ".css"]
}

var externals = {
    "$": "jquery",
    "window.$": "jquery",
    "jQuery": "jquery",
    "window.jQuery": "jquery"
}

var optimization = {
    splitChunks: {
        name: false,
        chunks: "all",
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/, // [\\/] 代表可以是\也可以是/
                name: "vendor",
                enforce: true,
                priority: 100
            }
        }
    },
    runtimeChunk: {
        name: "runtime"
    }
};

module.exports = {
    entry,
    output,
    module: { rules },
    devtool,
    plugins,
    resolve,
    externals,
    optimization
}
