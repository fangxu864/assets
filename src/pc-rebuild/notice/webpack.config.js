/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../../task-webpack/getPlugins")(env);
var output = require("../../../task-webpack/getOutput")(env);
var config = require("../../../task-webpack/config")({
	entry : {
		//平台-前后端分离-系统通知页
		"system_notice.pc" : "./src/pc-rebuild/notice/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;

