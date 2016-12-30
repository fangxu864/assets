/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../task-webpack/getPlugins")(env);
var output = require("../task-webpack/getOutput")(env);
var config = require("../task-webpack/config")({
	entry : {
		"pft.common.mb" : "./common/pft.common.mb.js",   //use in mobile
		"pft.common.pc" : "./common/pft.common.pc.js"    //use in pc
	},
	output : output,
	plugins : plugins
});
module.exports = config;