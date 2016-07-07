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

var entry = {
	"test_rebuild" : ["./src/test_rebuild/index.js"]
};
for(var i in entry){
	var en = entry[i];
	en.unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/dev-server");
}

var config = require("../../config")({
	entry : entry,
	output : {
		path : path.join(__dirname, "./build/"),
		filename: "assets/build/js/[name].js",
		publicPath : "http://localhost:"+PORT
	},
	plugins : [
		new ExtractTextPlugin("assets/build/css/[name].css"),
		new webpack.HotModuleReplacementPlugin()
	]
});

//启动服务
var app = new WebpackDevServer(webpack(config),{
	hot : false,
	historyApiFallback: true
	//,proxy : [{
	//	path: "/r/*",
	//	target: "http://www.12301.local",
	//	host: "www.12301.local"
	//}]
});


//监听端口
app.listen(PORT,"localhost",function(error){
	console.log(error);
});

