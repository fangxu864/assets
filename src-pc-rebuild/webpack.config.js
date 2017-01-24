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
		"home.pc" : "./src-pc-rebuild/home/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;