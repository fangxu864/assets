/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		"poster-img-upload-mallposter" : "./src/poster-img-upload/mallposter/index.js",
		"poster-img-upload-myposter" : "./src/poster-img-upload/myposter/index.js",
		"poster-img-upload-supplyposter" : "./src/poster-img-upload/supplyposter/index.js",
		"poster-img-upload-editmyposter" : "./src/poster-img-upload/editmyposter/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;