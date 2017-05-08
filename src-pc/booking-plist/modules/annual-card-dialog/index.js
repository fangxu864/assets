/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:22
 * Description: ""
 */
require("./index.scss");
var Common = require("../../common.js");
var SDialog = require("./dialog-simple");
var dialogTpl = require("./index.xtpl");
var Ajax = PFT.Util.Ajax;
var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var Message = require("pft-ui-component/Message");
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
				"click #buyBtn_card" : function(e){
					var tarBtn = $(e.currentTarget);
					if(tarBtn.hasClass("disable")) return false;
					var physics = [];
					var hasReadCards = that.hasReadCards;
					for(var i in hasReadCards) physics.push(i);
					window.location.href = that.orderPage + "?pid="+that.pid + "&aid="+that.aid + "&physics="+physics.join(",");
				},
				"click #buyBtn_virtual" : function(e){
					var tarBtn = $(e.currentTarget);
					if(tarBtn.hasClass("disable")) return false;
					window.location.href = that.orderPage + "?pid="+that.pid + "&aid="+that.aid + "&physics=";
				},
				"click #clearCardInpBtn" : function(e){
					var tarBtn = $(e.currentTarget);
					var inp = $("#cardNumberInp");
					inp.val("").focus();
					tarBtn.hide();
				},
				"keyup #cardNumberInp" : function(e){
					var keycode = e.keyCode;
					if(keycode!=13) return false;
					that.onCardNumberInpKeyup(e);
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
				that.getVirtualStorage(that.pid,that.sid);
			},
			onCloseBefore : function(){

			},
			onCloseAfter : function(){
				that.pid = "";
				that.aid = "";
				that.sid = "";
			}
		})
		//setTimeout(function(){
		//	that.readCardObj = new ReadCardObj({id:"readCardObj"});
		//},100)
	},
	onCardNumberInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var card_number = $.trim(tarInp.val());
		$("#clearCardInpBtn").show();
		if(card_number){
			if(!this.hasReadCards[card_number]){
				$("#cardNumberInp").val(card_number);
				var hasReadCount = $("#hasReadCount");
				hasReadCount.text(hasReadCount.text()*1+1);
				this.hasReadCards[card_number] = 1;
				this.buyBtn_card.removeClass("disable");
			}else{
				Message.warning("此卡已刷过，请换另一张卡");
			}
		}else{
			Message.error("读卡失败");
		}
	},
	open : function(opt){
		opt = opt || {};
		this.pid = opt.pid || "";
		this.aid = opt.aid || "";
		this.sid = opt.sid || "";
		this.dialog.open();
	},
	/**
	 * 获取某个产品的虚拟卡的库存
	 * @param pid  产品id
	 */
	getVirtualStorage : function(pid,sid){
		var that = this;
		if(that.xhr && that.xhr.abort) that.xhr.abort();
		that.xhr = Ajax(Common.Api.getVirtualStorage(),{
			type : Common.AJAX_TYPE,
			ttimeout : Common.AJAX_TIMEOUT,
			params : {
				pid : pid,
				sid : sid
			},
			loading : function(){
				that.virtualStorage.text("正在获取库存，请稍后..").css({fontSize:12});
			},
			complete : function(){
				that.virtualStorage.text("").css({fontSize:16});
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
					Message.error(res.msg || AJAX_ERROR_TEXT);
				}
			}
		})
	}
};
module.exports = AnnualCardBuyDialog;
