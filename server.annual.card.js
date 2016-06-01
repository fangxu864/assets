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


var entry = {
	"publish_card_prod_info" : ["./src/annual_card/page/publish_card_prod_info/index.js"]
}
for(var i in entry){
	var en = entry[i];
	en.unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/dev-server");
}

var config = require("./config")({
	entry : entry,
	output : {
		path : path.join(__dirname, "./build/"),
		filename: "assets/build/js/[name]/all.js",
		publicPath : "http://localhost:"+PORT
	},
	plugins : [
		new ExtractTextPlugin("assets/build/css/[name]/all.css"),
		new webpack.HotModuleReplacementPlugin()
	]
});
//启动服务
var app = new WebpackDevServer(webpack(config),{
	hot : true,
	historyApiFallback: true,
	proxy : [{
		path: "/r/*",
		target: "http://www.12301.local",
		host: "www.12301.local"
	}]
});
app.listen(PORT,"localhost",function(error){
	console.log(error);
});