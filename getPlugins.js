/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:56
 * Description: ""
 */
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = function(env){
	var plugins = [];
	//	var HtmlTpl = {
	//		terminal : {
	//			template : "./src/terminal/view/index.html"
	//		}
	//	};
	//	var rendViewConfig = function(project_name){
	//		var viewDir = ""
	//	};
	//	for(var i in entry){
	//		var opt = {};
	//		var config = HtmlTpl[i] || {};
	//		var _i = i.substr(0,2);
	//		var dirname = _i=="wx_" ? "view/wx/" : "view/pc/";
	//		var filename = config.filename ? config.filename : (dirname+i+".html");
	//		var template = config.template ? config.template : "";
	//		opt["filename"] = filename;
	//		opt["chunks"] = [i];
	//		opt["hash"] = true;
	//		if(template) opt["template"] = template;
	//		plugins.push(new HtmlWebpackPlugin(opt));
	//	}
	plugins.push(new ExtractTextPlugin("css/[name].all.css"));
	//Ñ¹Ëõjs css
	if(env=="prod" || env=="dev"){
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings : false
			},
			sourceMap : false
		}))
	}

	return plugins;
}