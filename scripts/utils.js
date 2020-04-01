// css预处理（传入预处理器类型）=》postcss=》css=》（vue-style-loader/mini-css-extract-plugin）

const is_dev = process.env.NODE_ENV == "development";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
const os = require("os");
const HappyThreadPool = HappyPack.ThreadPool({size: os.cpus().length - 1}); 


exports.resolveStyle = function(config) {
    let cssConf = importLoaders => ({
        loader: "css-loader",
        options: {
            modules: true,
            sourceMap: is_dev,
            importLoaders: importLoaders
        }
    });
    let cssRule = new HappyPack({
        id: "css",
        loaders: [
            is_dev && "vue-style-loader",
            cssConf(1),
            "postcss-loader"
        ].filter(Boolean),
        threadPool: HappyThreadPool
    })
    let preRule;
    for(var ext in config) {
        preRule = new HappyPack({
            id: ext,
            loaders: [
                is_dev && "vue-style-loader",
                cssConf(2),
                "postcss-loader",
                {
                    loader: ext+"-loader",
                    options: {
                        sourceMap: is_dev,
                        ...config[ext]
                    }
                }
            ].filter(Boolean),
            threadPool: HappyThreadPool
        })
    }
    return [cssRule].concat((() => {
        return preRule ? preRule : []
    })())
}
