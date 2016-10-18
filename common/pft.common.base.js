/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:07
 * Description: ""
 */
module.exports = function(PFT){

	var Util = PFT["Util"] || (PFT["Util"] = {});
	Util["Class"] = require("./js/util.class");
	Util["Each"] = require("./js/util.each");
	Util["ParseTemplate"] = require("./js/util.parseTemplate");
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
	Util["winWidthHeight"] = require("./js/util.window.width.height");
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
	Config["ptype"] = {
		A : "景区门票",
		B : "旅游线路",
		C : "度假酒店",
		F : "套票产品",
		H : "剧场演出"
	};
	Config["orderStatus"] = {
		0 : {
			name : "未使用",
			color:"#3eba40"
		},
		1 : {
			name : "已使用",
			color:"#f37138"
		},
		2 : {
			name : "已过期",
			color:"#e12424"
		},
		3 : {
			name : "已取消",
			color:"#f37138"
		},
		4 : {
			name : "凭证码被替代",
			color:"#f37138"
		},
		5 : {
			name : "被终端撤销(已取消)",
			color:"#f37138"
		},
		6 : {
			name : "被终端撤销(已使用)",
			color:"#f37138"
		},
		7 : {
			name : "已部分使用",
			color:"#f37138"
		},
		9 : {
			name : "已删除",
			color:"#f37138"
		}
	};


	PFT["Api"] = require("./Api/api.base");


	PFT["AJAX_ERROR_TEXT"] = "请求出错，请稍后重试";
	PFT["AJAX_TIMEOUT_TEXT"] = "请求超时，请稍后重试";
	PFT["AJAX_LOADING_TEXT"] = "努力加载中，请稍后...";
	PFT["AJAX_COMPLETE_TEXT"] = "请求完成";
	PFT["LOADING_IMG_GIF"] = "http://static.12301.cc/assets/build/images/gloading.gif";
	PFT["DEFAULT_IMG"] = "http://www.12301.cc/images/defaultThum.jpg";

	return PFT;

};
