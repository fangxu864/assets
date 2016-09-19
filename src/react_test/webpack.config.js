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


plugins.push(
	new webpack.DllReferencePlugin({
		//context: path.join(__dirname, "../../", "task-webpack"),
		context: "./",
		manifest: require("./react_vendor-manifest.json")
	})
)


var config = require("../../task-webpack/config")({
	entry : {
		"react.test" : [
			'./src/react_test/index.jsx'
		]
	},
	output : output,
	plugins : plugins
});
module.exports = config;