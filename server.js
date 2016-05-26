/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:12
 * Description: ""
 */
'use strict'
var PORT = "9090";
var ROOT_PATH = "./src";
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//npm run server :                 server整个项目内的所有模块(模块多时启动会耗时一会)
//npm run server my_project_name : server整个项目内的指定模块(my_project_name为要server的模块名)
var project_name = (function(){
	var argv = process.argv;
	var env = argv[argv.length-1];
	var project_name = "";
	if(env.indexOf("server.js")<0){
		project_name = env;
	}
	console.log("project_name="+project_name);
	return project_name
})();
var entry = require("./getEntry")(ROOT_PATH,project_name);
for(var i in entry){
	var en = entry[i];
	en.unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/dev-server");
}
var config = require("./config")({
	entry : entry,
	output : {
		path : path.join(__dirname, "./build/"),
		filename: "build/js/[name]/all.js",
		publicPath : "http://localhost:"+PORT
	},
	plugins : [
		new ExtractTextPlugin("build/css/[name]/all.css"),
		new webpack.HotModuleReplacementPlugin()
	]
});
//启动服务
var app = new WebpackDevServer(webpack(config),{
	hot : true,
	historyApiFallback: true
});
app.listen(PORT,"localhost",function(error){
	console.log(error);
});