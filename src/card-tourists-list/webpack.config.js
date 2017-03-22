//2017.3.8
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"card-tourists-list" : "./src/card-tourists-list/index"
	},
	output : output,
	plugins : plugins
});
module.exports = config;