/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:56
 * Description: ""
 */
var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = function(env,cssname){
	var plugins = [];
	var filename = cssname ? (cssname+".css") : "[name].all.css";
	plugins.push(new ExtractTextPlugin("css/"+filename));
	if(env=="production" || env=="release"){
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings : false
			},
			sourceMap : false
		}))
	}
	return plugins;
}