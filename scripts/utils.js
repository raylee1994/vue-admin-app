// postcss=》css预处理（传入预处理器类型）=》css=》（vue-style-loader/mini-css-extract-plugin）

const is_dev = process.env.NODE_ENV == "development";

let cssConf = {
    loader: "css-loader",
    options: {
        modules: true,
        sourceMap: is_dev,
        importLoaders: 1
    }
};

