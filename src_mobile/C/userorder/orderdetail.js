/**
 * Author: huangzhiyang
 * Date: 2016/10/13 16:29
 * Description: ""
 */
var Tpl = require("./tpl/order.detail.xtpl");
var Toast = new PFT.Mobile.Toast();
var Alert = PFT.Mobile.Alert;
var Detail = PFT.Util.Class({
	container : "#detailPage",
	template : PFT.Util.ParseTemplate(Tpl),
	__Cache : {},
	EVENTS : {
		 "click .detailBtnGroup .btn" : "onBtnClick"
	},
	init : function(opt){
		this.Service = opt.Service;
		this.detailInfoContainer = $("#detailInfoContainer");
		this.containerDom = this.container[0];
	},
	onBtnClick : function(e){
		this.trigger("btn.click",e,"detail");
	},
	fetchDetailInfo : function(ordernum,callback){
		if(!ordernum) return false;
		if(this.__Cache[ordernum]){ //如果已经请求过了
			this.renderDetail(this.__Cache[ordernum]);
		}else{
			this.Service.detail(ordernum,{
				loading : function(){
					Toast.show("loading","努力加载中...");
					this.detailInfoContainer.html("");
				},
				complete : function(){ Toast.hide()},
				success : function(data){
					this.__Cache[ordernum] = data;
					this.renderDetail(data);
					callback && callback(data);
				},
				fail : function(msg){
					Alert("提示",msg);
				}
			},this)
		}
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
	},
	clearCache : function(ordernum){
		if(!ordernum) return this.__Cache = {};
		delete this.__Cache[ordernum];
	},
	show : function(ordernum){
		var that = this;
		this.containerDom.style.transform = "translate3d(0px,0px,0px)";
		setTimeout(function(){
			that.fetchDetailInfo(ordernum);
		},200)
	},
	close : function(){
		this.containerDom.style.transform = "translate3d(0px,2000px,0px)";
	}
});
module.exports = Detail;