/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 */
var env = require("../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../task-webpack/getPlugins")(env);
var output = require("../task-webpack/getOutput")(env);
var config = require("../task-webpack/config")({
	entry : {
		//新版首页
		// "home.pc" : "./src-pc-rebuild/home/index.js",

		//新版首页 右边栏点击更多进去的二级列表页
		"notic.list.pc" : "./src-pc/notice-list/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;