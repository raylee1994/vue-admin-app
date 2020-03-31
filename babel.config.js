module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "modules": false,
                "corejs": "2"
            }
        ],
        [
            '@babel/preset-typescript',   // 引用Typescript插件
            {
                "allExtensions": true,        // 🔴支持所有文件扩展名
            },
        ],
    ],
    "plugins": []
}