var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
var plugins = [];
var _config = require("./config.js");
plugins.push(new ExtractTextPlugin("css/common/pft.common.all.min.css"));
plugins.push(new webpack.optimize.UglifyJsPlugin({
	compress: {
		warnings : false
	},
	sourceMap : false
}))
var config = _config({
	entry : ["./common/index.js"],
	output : {
		path : path.join(__dirname, "./build/prod/"),
		filename: "js/common/pft.common.all.min.js"
	},
	plugins : plugins
});
module.exports = config;