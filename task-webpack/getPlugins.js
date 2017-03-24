/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:56
 * Description: ""
 */
var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = function(env,cssname,verision){
	var plugins = [];
	var verision = verision ? ("."+verision) : "";
	var filename = cssname ? (cssname + verision +".css") : "[name].all" + verision + ".css";
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