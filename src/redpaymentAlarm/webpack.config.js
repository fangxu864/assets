
var path = require("path");
var env = require("../../task-webpack/getNodeENV.js");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"redpaymentAlarm" : "./src/redpaymentAlarm/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;