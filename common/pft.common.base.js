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
	Util["Extend"] = require("./js/util.extend");
	Util["MinixParams"] = require("./js/util.minix.params");  //很早以前的，不建议使用，请使用minix替代
	Util["Mixin"] = require("./js/util.mixin");
	Util["Type"] = require("./js/util.type");
	Util["Prefix"] = require("./js/util.prefix");
	Util["BindScope"] = require("./js/util.bindscope");
	Util["isEmptyObject"] = require("./js/util.isEmptyObject");
	Util["ImgLoader"] = require("./js/util.imageLoader");
	var Config = PFT["Config"] || (PFT["Config"] = {});
	Config["Api"] = require("./js/config.api");
	Config["Ajax"] = function(){
		var fn = new Function;
		return{
			loading : fn,
			complete : fn,
			success : fn,
			empty : fn,
			fail : fn,
			error : fn,
			timeout : fn,
			serverError : fn
		}
	};

	PFT["Api"] = require("./Api/api.base");


	PFT["AJAX_ERROR_TEXT"] = "请求出错，请稍后重试";
	PFT["AJAX_TIMEOUT_TEXT"] = "请求超时，请稍后重试";
	PFT["AJAX_LOADING_TEXT"] = "努力加载中，请稍后...";
	PFT["AJAX_COMPLETE_TEXT"] = "请求完成";

	return PFT;

};
