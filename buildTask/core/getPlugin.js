var Path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = function(opt){

    opt || (opt={});

    var minify = typeof opt.minify=="boolean" ? opt.minify : false;

    var plugins = [];
    var path = opt.path || "";
    var filename = opt.filename || "";

    var output = Path.join(path,filename);
    plugins.push(new ExtractTextPlugin(output));
    if(minify){
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings : false
            },
            sourceMap : false
        }))
    }

    return plugins;

}