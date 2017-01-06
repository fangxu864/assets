/**
 * Created by Administrator on 15-12-4.
 */
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"distributor_manage" : "./src/distributor_manage/js/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;