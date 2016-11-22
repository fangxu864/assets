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
		//账号 - 基本信息
		"account_baseinfo" : "./src/account/baseinfo/index.js",
		//账号 - 账号信息
		"account_accountinfo" : "./src/account/accountinfo/index.js",
		//账号 - 联系方式
		"account_contact" : "./src/account/contact/index.js",
        //账号 - 资质认证
        "account_certification" : "./src/account/certification/index.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;