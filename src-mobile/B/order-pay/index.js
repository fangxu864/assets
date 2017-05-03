
require("./index.scss");
var ParseTemplate = require("COMMON/js/util.parseTemplate")
var Template = {
	orderdetail: ParseTemplate(require("./tpl/payorderdetail.xtpl"))
}
var Service = require("./service-pay");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();
var PayCore = require("SERVICE_M/pft-pay-core");
var Order_pay = PFT.Util.Class({
	__interval: null,
	__CacheData: {},
	container: "#bodyContainer",
	dom: {
		div: {
			bodyContainer: "#bodyContainer",
		}
	},
	EVENTS: {
		"click #wxPayBtn": "onWXPayBtnClick",
		"click #alipayBtn": "onAlipayBtnClick",
		"click #unipayBtn": "onUnipayBtnClick"
	},
	init: function () {
		var urlParams = PFT.Util.UrlParse();
		var that = this;
		this.ordernum = urlParams["ordernum"] || "";
		this.host = urlParams["h"];

		// return false

		Service(this.ordernum, this.host, {
			loading: function () {
				Toast.show("loading", "努力加载中...");
			},
			complete: function () {
				Toast.hide("loading", "努力加载中...");
			},
			success: function (data) {
				that.__CacheData = data;

				data["payDomain"] = $("#paydomainHinInp").val();
				var html = Template.orderdetail(data);
				$("#bodyContainer").html(html);
				setTimeout(function () {
					that.setLoop();
				}, 10);
			},
			fail: function (msg) {
				Alert(msg);
			}
		})
	},
	setLoop: function () {
		var that = this;
		var ordernum = PFT.Util.UrlParse()["ordernum"];
		if (!ordernum) return false;
		that.__interval = setInterval(function () {
			that.loopToGetPaySuccess(ordernum);
		}, 3 * 1000);
	},
	//轮询支付结果
	loopToGetPaySuccess: function (ordernum) {
		var that = this;
		var host=PFT.Util.UrlParse()["h"]
		var nhost = window.location.host;
		nhost = nhost.indexOf("wx") > -1 ? nhost : nhost + "/wx";
		PFT.Util.Ajax('http://' + nhost +'/api/index.php?c=MicroPlat_Order&a=isPayComplete', {
			type: "POST",
			params: {
				ordernum: ordernum,
				token: PFT.Util.getToken()
			},
			success: function (res) {
				res = res || {};
				if (res.code == 200) {
					var data = res.data;
					var payStatus = data.payStatus;
					if (payStatus == 1) { //已支付
						clearInterval(that.__interval);
						/*	var host =PFT.Util.UrlParse()["h"];*/
						var link = "http://" + nhost + "/b/order_pay_success.html?h="+host+"&ordernum="+ ordernum;
						// console.log(link)
						window.location.href = link;

					}
				}
			},
			timeout: function () {
				clearInterval(that.__interval);
				Alert("支付超时，请检查网络并完成支付。");
			},
			serverError: function () {
				clearInterval(that.__interval);
			}
		})
	},
	//微信支付
	onWXPayBtnClick: function (e) {
		var that = this;
		var tarBtn = $(e.currentTarget);
		if (tarBtn.hasClass("disable")) return Alert("此订单尚不支持微信支付");
		var payParams = this.__CacheData.payParams || {};
		var params = {
			appid: payParams.appid,
			out_trade_no: payParams.outTradeNo,
			subject: payParams.subject,
			openid: payParams.openid,
			expire_time: payParams.expireTime
		};
		PayCore.Wx({
			WeixinJSBridge: WeixinJSBridge,
			url: 'http://wx.12301.cc/api/index.php?c=pay_WxPay&a=order',
			data: params,
			loading: function () {
				Toast.show("loading", "请稍后...");
			},
			complete: function () {

			},
			success: function (res) { },
			error: function (msg) {
				Toast.hide();
				Alert(msg);
			},
			timeout: function () {
				Toast.hide();
				Alert(PFT.AJAX_TIMEOUT_TEXT);
			},
			serverError: function () {
				Toast.hide();
				Alert(PFT.AJAX_ERROR_TEXT)
			},
			//开始支付
			loading_wx: function () { },
			//完成支付
			complete_wx: function () {
				Toast.hide();
			},
			//支付成功
			success_wx: function (res) {
				var payParams = that.__CacheData.payParams;
				var __domain = payParams.domain;
				var out_tarde_no = payParams.outTradeNo;
				var total_fee = that.__CacheData.detail.totalmoney;
				var ordernum = that.ordernum;
				var account = that.host;
				// Alert("支付成功");
				var ctx = (PFT.Util.UrlParse()).ctx || 0;
				window.location.href = "http://" + account + ".12301.cc/wx/b/order_pay_success.html?ordernum=" + ordernum;
			},
			//用户取消支付
			cancel_wx: function (res) { },
			//微信支付失败
			fail_ex: function (res) { },
			//微信支付系统错误
			error_wx: function (res) { }
		})
	},
	//支付宝支付
	onAlipayBtnClick: function (e) {
		var tarBtn = $(e.currentTarget);
		if (tarBtn.hasClass("disable")) return false;
		document.getElementById("pay_form_alipay").submit();
	},
	//银联支付
	onUnipayBtnClick: function (e) {
		var tarBtn = $(e.currentTarget);
		if (tarBtn.hasClass("disable")) return false;
		document.getElementById("pay_form_unipay").submit();
	}

});


$(function () {
	new Order_pay();
});





