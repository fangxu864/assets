/**
 * Created by Administrator on 15-10-20.
 */
var path = require("path");
//var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	entry : {
		register : "./src/register/js/main.js",
		terminal : "./src/terminal/js/main.js",
		yx_storage_normal : "./src/yx_storage_normal/js/main.js"
	},
	output : {
		path : path.join(__dirname, "./build"),
		filename: "js/[name].all.js"
	},
	module : {
		loaders: [{
			test: /\.html$/,
			loader: "html"
		},{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!cssnext-loader")
		}
		,{
			test: /\.png$/,
			loader: "url-loader?limit=100000"
		}]
	},
	plugins : [
//		new HtmlWebpackPlugin({
//			filename : 'tpl/tpl.html'
//		}),
		new ExtractTextPlugin('css/[name].all.css')
	],
	watch : true,
	devtool : "#source-map"
}