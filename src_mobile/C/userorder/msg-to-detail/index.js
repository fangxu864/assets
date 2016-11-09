/**
 * Author: huangzhiyang
 * Date: 2016/11/8 14:44
 * Description: 新需求，用户从短信链接点击进来的页面
 */
require("./index.scss");
var Tpl = require("./order.detail.xtpl");
var Toast = new PFT.Mobile.Toast();
var Alert = PFT.Mobile.Alert;
var Confirm = PFT.Mobile.Confirm;

var Detail = PFT.Util.Class({
	container : "#detailPage",
	template : PFT.Util.ParseTemplate(Tpl),
	EVENTS : {
		"click .detailBtnGroup .btn" : "onBtnClick"
	},
	init : function(opt){
		this.detailInfoContainer = $("#detailInfoContainer");
		this.containerDom = this.container[0];

		this.ordernum = PFT.Util.UrlParse()["ordernum"];
		if(this.ordernum) this.fetchDetailInfo(this.ordernum);

	},
	onBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		

	},
	fetchDetailInfo : function(ordernum,callback){
		if(!ordernum) return false;
		var that = this;
		PFT.Util.Ajax("/r/Mall_Member/detailShow/",{
			type : "post",
			params : {
				ordernum : ordernum,
				token : PFT.Util.getToken()
			},
			loading : function(){
				Toast.show("loading","努力加载中...");
				that.detailInfoContainer.html("");
			},
			complete : function(){
				Toast.hide()
			},
			success : function(res){
				console.log(res);
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					that.renderDetail(data);
				}else{
					Alert(msg);
				}
			}
		})
	},
	renderDetail : function(data){
		var that = this;
		var html = this.template(data);
		this.detailInfoContainer.html(html);
		setTimeout(function(){
			that.createQRcode(data.code);
		},10)
	},
	createQRcode : function(code){
		if(!code) return false;
		var container = $("#codeBox");
		var width = container.width();
		var qrcode = new QRCode("codeBox", {
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
	new Detail();
})

