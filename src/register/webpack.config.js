/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../../getNodeENV.js");
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require("webpack");
var plugins = (function(env){
	var plugins = [];
	plugins.push(new ExtractTextPlugin("css/[name].all.css"));
	if(env=="prod" || env=="dev"){
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings : false
			},
			sourceMap : false
		}))
	}
	return plugins;
})(env);
var config = require("../../config")({
	entry : {
		"register" : "./src/register/js/index.js"
	},
	output : {
		path : path.join(__dirname, "../../build/"+env+"/"),
		filename: "js/[name].all.js"
	},
	plugins : plugins
});
module.exports = config;