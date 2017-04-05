/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var path = require("path");
var env = require("../../task-webpack/getNodeENV.js");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"summary-combine" : "./src/admin-summary-combine/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;