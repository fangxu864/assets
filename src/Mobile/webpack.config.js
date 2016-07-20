/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var webpack = require('webpack');
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var ROOT_URL = "./src/Mobile";
var config = require("../../task-webpack/config")({
	entry : {
		"mb.index" : path.resolve(ROOT_URL,"B/index/index.es6")
	},
	output : output,
	plugins : plugins
});
module.exports = config;