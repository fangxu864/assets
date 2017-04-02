var Base = require("./base");
var fs = require("fs");
var Path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


var Config = Base.getbaseconfig({
    entry : Path.join(process.cwd(),"./example/index.js"),
    plugins : Base.getplugin({
        filename : "bundle.all.css"
    }),
    loaders : Base.getloader()
});
Config["defServer"] = {
    inline : true,
    contentBase: "./example/",
    // hot: true,
    // compress: true,
    proxy: {
        "/r/*": {
			target : "http://localhost:8001/",
			secure: false,
			changeOrigin: false
		}
    },
    setup: function(app) {
        
    },

    staticOptions: {},
    quiet: false,
    noInfo: false,
    // lazy: true,
    // filename: "bundle.js",
    // watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: 1000
    // },
    // publicPath: "./build/develop",
    headers: { "X-Custom-Header": "yes" },
    stats: { colors: true }
}

Config.plugins.push(new HtmlWebpackPlugin({
    title: "pft-ui-component dev",
    filename : "index.html",
    template : "./example/index.html",
    inject : true,
    hash : false
}))



module.exports = Config;