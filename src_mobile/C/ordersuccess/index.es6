/**
 * Author: huangzhiyang
 * Date: 2016/10/11 15:18
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Service = require("SERVICE_M/ordersuccess");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();
var Main = PFT.Util.Class({
	container : "#bodyContainer",
	template : PFT.Util.ParseTemplate(Tpl),
	init : function(){
		this.ordernum = $("#ordernumHidInp").val() || "";
		this.paymode = $("#paymode").val() || "";
		document.title = this.paymode==1 ? "支付成功" : "下单成功";
		Service(this.ordernum,{
			loading : ()=>{
				Toast.show("loading","努力加载中...");
			},
			complete : ()=>{
				Toast.hide("loading","努力加载中...");
			},
			success : (data)=>{
				data["paymode"] = this.paymode;
				var html = this.template(data);
				this.container.html(html);
				this.createQRcode(data.qrcode);
			},
			fail : (msg)=>{
				Alert("提示",msg);
			}
		})
	},
	createQRcode : function(code){
		var container = $("#qrcodeBox");
		var width = container.width();
		var qrcode = new QRCode("qrcodeBox", {
			text: code,
			width: width,
			height: width,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	}
});


$(function(){
	new Main();
})


