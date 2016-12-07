/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		//应用中心 - 首页
		"appcenter_index" : "./src/application-center/index/index.js",
        //应用中心 - 详情
        "appcenter_index" : "./src/application-center/details/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;