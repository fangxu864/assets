/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:22
 * Description: ""
 */
require("./annual_dialog.scss");
var SDialog = require("COMMON/modules/dialog-simple");
var dialogTpl = require("./dialog.xtpl");
var ReadCardObj = require("../../common/readPhysicsCard.js");
var Api = require("../../common/api.js");
var Ajax = require("COMMON/js/util.ajax.js");
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
var AnnualCardBuyDialog = function(){
	this.init();
};
AnnualCardBuyDialog.prototype = {
	hasReadCards : {},
	xhr : null,
	orderPage : "/new/annual_order.html",
	init : function(){
		var that = this;
		this.buyBtn_card = null;
		this.buyBtn_virtual = null;
		this.virtualStorage = null;
		this.cardNumberInp = null;
		this.hasReadCount = null;
		this.dialog = new SDialog({
			content : dialogTpl,
			drag : true,
			events : {
				"click #readCardBtn" : function(e){
					that.onReadCardBtnClick(e);
				},
				"click #buyBtn_card" : function(e){
					var tarBtn = $(e.currentTarget);
					if(tarBtn.hasClass("disable")) return false;
					var physics = [];
					var hasReadCards = that.hasReadCards;
					for(var i in hasReadCards) physics.push(i);
					window.location.href = that.orderPage + "?pid="+that.pid + "&physics="+physics.join(",");
				},
				"click #buyBtn_virtual" : function(e){
					var tarBtn = $(e.currentTarget);
					if(tarBtn.hasClass("disable")) return false;
					window.location.href = that.orderPage + "?pid="+that.pid + "&physics=";
				}
			},
			onOpenBefore : function(){
				//每一次打开dialog都要先清空之前已读取到的卡号
				that.hasReadCards = [];
			},
			onOpenAfter : function(){
				that.buyBtn_card = $("#buyBtn_card");
				that.buyBtn_virtual = $("#buyBtn_virtual");
				that.virtualStorage = $("#virtualStorageNum");
				that.cardNumberInp = $("#cardNumberInp");
				that.hasReadCount = $("#hasReadCount");
				that.cardNumberInp.val("");
				that.hasReadCount.text(0);
				that.getVirtualStorage(that.pid);
			},
			onCloseBefore : function(){

			},
			onCloseAfter : function(){

			}
		})
		setTimeout(function(){
			that.readCardObj = new ReadCardObj({id:"readCardObj"});
		},100)
	},
	onReadCardBtnClick : function(e){
		var card_number = this.readCardObj.read();
		if(card_number){
			if(!this.hasReadCards[card_number]){
				$("#cardNumberInp").val(card_number);
				var hasReadCount = $("#hasReadCount");
				hasReadCount.text(hasReadCount.text()*1+1);
				this.hasReadCards[card_number] = 1;
				this.buyBtn_card.removeClass("disable");
			}else{
				alert("此卡已刷过，请换另一张卡");
			}
		}else{
			alert("读卡失败");
		}
	},
	open : function(opt){
		opt = opt || {};
		this.pid = opt.pid;
		this.dialog.open();
	},
	/**
	 * 获取某个产品的虚拟卡的库存
	 * @param pid  产品id
	 */
	getVirtualStorage : function(pid){
		var that = this;
		if(that.xhr && that.xhr.abort) that.xhr.abort();
		that.xhr = Ajax(Api.Url.getVirtualStorage,{
			params : {
				pid : pid
			},
			loading : function(){
				that.virtualStorage.text("正在获取库存，请稍后..");
				//that.buyBtn_virtual.addClass("disable");
			},
			complete : function(){
				that.virtualStorage.text("");
			},
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				var storage = data.storage;
				if(code==200){
					that.virtualStorage.text(storage);
					that.buyBtn_virtual.removeClass("disable");
				}else{
					alert(res.msg || AJAX_ERROR_TEXT);
				}
			}
		})
	}
};
window["AnnualCardBuyDialog"] = AnnualCardBuyDialog;
//$(function(){
//	var annual = new AnnualCardBuyDialog();
//	setTimeout(function(){
//		annual.open({pid:"13692"});
//	},500)
//})
