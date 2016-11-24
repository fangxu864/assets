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
		//修改手机号及支付宝，两块业务合在一个入口里
		"system.manager.mobile.alipay" : "./src/system-manager/mobile.alipay.index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;