/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../task-webpack/getPlugins")(env,"[name].all","v2.0");
var output = require("../task-webpack/getOutput")(env,'',"v2.0");
var config = require("../task-webpack/config")({
	entry : {
		"pft.common.pc" : "./common/pft.common.pc.style.js"    //use in pc
	},
	output : output,
	plugins : plugins
});
module.exports = config;