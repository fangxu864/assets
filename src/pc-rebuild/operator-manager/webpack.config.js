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
		//平台-前后端分离-员工管理-列表页
		"operator.manager.list" : "./src/pc-rebuild/operator-manager/list/index.js",
		//平台-前后端分离-员工管理-操作日志页
		"operator.manager.record" : "./src/pc-rebuild/operator-manager/record/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;

