var PORT = "8090";
var ROOT_PATH = "./src";
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var getNodeParams = require("./getNodeParams")();
var project_name = getNodeParams.project_name;
var env = getNodeParams.env;
var entry = require("./getEntry")(ROOT_PATH,project_name);
var output = require("./getOutput")(env);
var plugins = require("./getPlugins")(env);
var config = require("./config")({
	entry : entry,
	output : output,
	plugins : plugins
});
//config.devServer = {
//	port : 8090,
//	proxy: {
//		'*': {
//			target: 'http://localhost:8090',
//			ws: true
//		}
//	},
//	contentBase : "./local/",
//	historyApiFallback : true
//};
module.exports = config;