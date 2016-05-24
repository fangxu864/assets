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
var getNodeParams = require("./getNodeParams")();
var project_name = getNodeParams.project_name;
var env = getNodeParams.env;
var entry = require("./getEntry")(ROOT_PATH,project_name);
var output = require("./getOutput")(env);
var plugins = require("./getPlugins")(env);
var config = require("./config")({
	entry : entry,
	output : output,
	plugins : plugins
});
config.entry[project_name].unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/dev-server");
config.plugins.push(new webpack.HotModuleReplacementPlugin());
// 这里配置：请求http://localhost:9090/api，
// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
var proxy = [{
	path: "/api/*",
	target: "https://cnodejs.org",
	host: "cnodejs.org"
}]
//启动服务
var app = new WebpackDevServer(webpack(config),{
	contentBase: {target: 'localhost:3000/webpack-dev-server/index.html'},
	publicPath: "/",
	hot:true,
	historyApiFallback: true
	//,proxy:{
	//	"*" : "http://localhost:3000"
	//}
});
app.listen(PORT,"localhost",function(error){
	console.log(error);
});