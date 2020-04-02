var path = require('path');
var bodyParser = require('body-parser');
var chokidar = require('chokidar');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var cache = require('apicache').middleware;

var express = require('express');
var app = express();

app.use(require('morgan')('short'));

process.env.NODE_ENV = "development";
process.env.HOST = "localhost";
process.env.PORT = 8080;

var webpackConf = require('./scripts/webpack.dev.config.js');
var webpackCompiller = webpack(webpackConf);

var hotMiddleware = webpackHotMiddleware(webpackCompiller);
var devMiddleWare = webpackDevMiddleware(
    webpackCompiller,
    {
        publicPath: webpackConf.output.publicPath,
    }
);

app.use(devMiddleWare);
app.use(hotMiddleware);

// CORS & Preflight request
app.use((req, res, next) => {
    if(req.path !== '/' && !req.path.includes('.')){
        res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// cache
app.use(cache('2 minutes', ((req, res) => res.statusCode === 200)));

app.active = ()=>{
    const watcher = chokidar.watch([
        path.resolve(__dirname, './src/index.html'),// index.html is on the root folder
    ]);
    watcher.on('ready', function() {
        console.log('Initial scan complete. Ready for changes');
    });
    watcher.on('change', function(path) {
        console.log('File [' + path + '] changed !');
        // reload the client on file changes
        hotMiddleware.publish({action: 'reload'});
    });
}

app.active();
app.set('views', path.join(__dirname, './src'));
app.use(require('connect-history-api-fallback')());

app.get("/*", function(req, res, next) {
    res.sendFile(path.resolve(__dirname, './src/index.html'));
});

app.listen(8080, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    // log server running
    console.log('Listening at http://localhost:8080/');
});

module.exports = app;
