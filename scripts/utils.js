// css预处理（传入预处理器类型）=》postcss=》css=》（vue-style-loader/mini-css-extract-plugin）

const is_dev = process.env.NODE_ENV == "development";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.resolveStyle = function(config) {
    let cssConf = importLoaders => ({
        loader: "css-loader",
        options: {
            modules: true,
            sourceMap: is_dev,
            importLoaders: importLoaders
        }
    });
    let cssRule = {
        test: /\.css$/,
        use: [
            is_dev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            cssConf(1),
            "postcss-loader"
        ]
    }
    let preRule;
    for(var ext in config) {
        preRule = {
            test: new RegExp("\\."+ext+"$"),
            use: [
                is_dev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
                cssConf(2),
                "postcss-loader",
                {
                    loader: ext+"-loader",
                    options: {
                        sourceMap: is_dev,
                        ...config[ext]
                    }
                }
            ]
        }
    }
    return [cssRule].concat((() => {
        return preRule ? preRule : []
    })())
}
