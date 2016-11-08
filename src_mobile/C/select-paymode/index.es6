/**
 * Author: huangzhiyang
 * Date: 2016/10/11 15:18
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Service = require("SERVICE_M/select-paymode-info");
var ServiceQRcode = require("SERVICE_M/select-paymode-wx-qrcode");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();
var PayCore = require("SERVICE_M/pft-pay-core");
var Main = PFT.Util.Class({
	container : "#bodyContainer",
	template : PFT.Util.ParseTemplate(Tpl),
	EVENTS : {
		"click #wxPayBtn" : "onWXPayBtnClick",
		"click #alipayBtn" : "onAlipayBtnClick",
		"click #unipayBtn" : "onUnipayBtnClick"
	},
	__CacheData : {},
	init : function(){
		var urlParams = PFT.Util.UrlParse();
		this.ordernum = urlParams["ordernum"] || "";
		this.host = urlParams["h"].split(".")[0];
		Service(this.ordernum,this.host,{
			loading : ()=>{
				Toast.show("loading","努力加载中...");
			},
			complete : ()=>{
				Toast.hide("loading","努力加载中...");
			},
			success : (data)=>{
				this.__CacheData = data;
				data["payDomain"] = $("#paydomainHinInp").val();
				var html = this.template(data);
				this.container.html(html);
				this.ajaxToQueryCode(data);
			},
			fail : (msg)=>{
				Alert("提示",msg);
			}
		})
	},

	//请求二维码
	ajaxToQueryCode : function(data){
		var payParams = data.payParams;
		var ordernum = payParams.outTradeNo;
		var subject = payParams.subject;
		ServiceQRcode(ordernum,subject,{
			loading : ()=> {},
			complete : ()=> {},
			success : (data)=> {
				this.createQRcode(data);
			},
			fail : (msg)=> {
				alert(msg);
			}
		})
	},
	creaeQRcode : function(code){
		//code = "weixin://wxpay/bizpayurl?pr=irJUNA8";
		var box = $("#wxQRcodeBox");
		var qrcode = new QRCode("wxQRcodeBox", {
			text: code,
			width: box.width(),
			height: box.width(),
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	},


	//微信支付
	onWXPayBtnClick : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return Alert("提示","此订单尚不支持微信支付");
		var payParams = this.__CacheData.payParams || {};
		var params = {
			appid : payParams.appid,
			out_trade_no : payParams.outTradeNo,
			subject : payParams.subject,
			openid : payParams.openid,
			expire_time : payParams.expireTime
		};

		PayCore.Wx({
			WeixinJSBridge : WeixinJSBridge,
			data : params,
			loading : function(){
				Toast.show("loading","请稍后...");
			},
			complete : function(){

			},
			success : function(res){},
			error : function(msg){
				Toast.hide();
				Alert("提示",msg);
			},
			//请求超时
			timeout : function(){
				Toast.hide();
				alert(PFT.AJAX_TIMEOUT_TEXT)
			},
			//请求服务器出错
			serverError : function(){
				Toast.hide();
				alert(PFT.AJAX_ERROR_TEXT);
			},

			//微信WeixinJSBridge.invoke也是异步操作
			//开始支付
			loading_wx : function(){},
			//完成支付
			complete_wx : function(){
				Toast.hide();
			},
			//支付成功
			success_wx : function(res){
				var payParams = that.__CacheData.payParams;
				var __domain = payParams.domain;
				var out_trade_no = payParams.outTradeNo;
				var total_fee = that.__CacheData.detail.totalmoney;
				var ordernum = that.ordernum;
				location.href = __domain+'/wx/c/ordersuccess.html?ordernum='+ordernum+'&paymode=4&&out_trade_no='+out_trade_no+'&total_fee='+total_fee;
			},
			//用户取消支付
			cancel_wx : function(res){},
			//微信支付失败
			fail_wx : function(res){},
			//微信支付系统错误
			error_wx : function(res){}
		})
	},
	//支付宝支付
	onAlipayBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		document.getElementById("pay_form_alipay").submit();
	},
	//银联支付
	onUnipayBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		document.getElementById("pay_form_unipay").submit();
	}
});


$(function(){
	new Main();
})


