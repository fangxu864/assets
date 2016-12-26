/**
 * Author: huangzhiyang
 * Date: 2016/6/17 16:42
 * Description: ""
 */
var env = require("../../task-webpack/getNodeENV.js");
var output = require("../../task-webpack/getOutput")(env,"[name]/all");
var plugins = require("../../task-webpack/getPlugins")(env,"[name]/all");
var config = require("../../task-webpack/config")({
	entry : {
		//续费通知
		"renew_warning_xufeichongzhi" : "./src/renew_warning/xufeichongzhi/index.js",
		"renew_warning_headerWarning" : "./src/renew_warning/headerWarning/index.js"
	},
	output : output,
	plugins : plugins,
	watch : true
});
module.exports = config;