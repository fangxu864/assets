/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:07
 * Description: ""
 */
module.exports = function(PFT){

	var Util = PFT["Util"] || (PFT["Util"] = {});

	Util["PubSub"] = require("./js/util.pubsub");
	Util["Ajax"] = require("./js/util.ajax");
	Util["Placeholder"] = require("./js/util.placeholder");
	Util["UrlParse"] = require("./js/util.url.parse.query");
	Util["Validate"] = require("./js/util.validate");
	Util["VCode"] = require("./js/util.vcode");
	Util["getToken"] = require("./js/util.get.token");
	Util["Promise"] = require("./js/util.promise");
	Util["STip"] = require("./js/util.simple.tip");
	Util["Extend"] = require("./js/util.extend");
	Util["MinixParams"] = require("./js/util.minix.params");

	var Config = PFT["Config"] || (PFT["Config"] = {});
	Config["Api"] = require("./js/config.api");

	PFT["AJAX_ERROR_TEXT"] = "请求出错，请稍后重试";
	PFT["AJAX_TIMEOUT_TEXT"] = "请求超时，请稍后重试";

	return PFT;

};
