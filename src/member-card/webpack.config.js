/**
 * Created by Administrator on 15-11-17.
 */
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"memcard_reg" : "./src/member-card/reg/index.js",
		// "membercard_list" : "./src/member-card/list/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;
