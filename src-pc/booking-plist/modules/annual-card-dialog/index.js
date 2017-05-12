/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:22
 * Description: ""
 */
require("./index.scss");
var Common = require("../../common.js");
var SDialog = require("./dialog-simple");

var Dialog = require("pft-ui-component/Dialog");
var Drag = require("pft-ui-component/Drag");

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
		this.dialog = new Dialog({
			width : 805,
			content : dialogTpl,
			drag : Drag,
			cache : false,
			EVENTS : {
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
				},
				"click #resultCardList .deleteBtn" : function(e){
					var result = confirm("确认要删除此卡吗？");
					if(!result) return false;
					$(e.currentTarget).parents(".item").remove();
					that.minuCount();
				}
			},
			onOpenAfter : function(){
				//每一次打开dialog都要先清空之前已读取到的卡号
				$("#resultCardList").html("");
				that.buyBtn_card = $("#buyBtn_card");
				that.buyBtn_virtual = $("#buyBtn_virtual");
				that.virtualStorage = $("#virtualStorageNum");
				that.cardNumberInp = $("#cardNumberInp");
				that.hasReadCount = $("#hasReadCount");
				that.cardNumberInp.val("");
				that.hasReadCount.text(0);
				that.getVirtualStorage(that.pid,that.sid);
			},
			onCloseAfter : function(){
				that.pid = "";
				that.aid = "";
				that.sid = "";
			}
		});


	},
	//增加一张卡
	addCount : function(){
		var dom = $("#hasReadCount");
		var count = dom.text() *1;
		var newCount = count+1;
		dom.text(newCount);
		$("#buyBtn_card").removeClass("disable");
	},
	//减少一张卡
	minuCount : function(){
		var dom = $("#hasReadCount");
		var count = dom.text() *1;
		var newCount = count -1;
		var buyBtn = $("#buyBtn_card");
		dom.text(newCount);
		if(newCount>0){
			buyBtn.removeClass("disable");
		}else{
			buyBtn.addClass("disable");
		}
	},
	onCardNumberInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var card_number = $.trim(tarInp.val());
		var keyCode = e.keyCode;
		if(keyCode!=13) return false;
		if(!card_number) return false;
		if(this.checkCardNum(card_number).hasExit){
			setTimeout(function(){
				tarInp.val("");
			},50)
			return Message.warning("此卡已刷过，请换另一张卡");
		}
		this.renderHasReadItem(card_number);
		this.addCount();
		setTimeout(function(){
			tarInp.val("");
		},50)
		
	},
	//判断卡是否已经刷过
	checkCardNum : function(cardNum){
		var hasExit = false;
		var listUl = $("#resultCardList");
		listUl.children().each(function(){
			var card = $(this).find(".card").text();
			if(card==cardNum){
				hasExit = true;
				return false;
			}
		})
		return{ hasExit : hasExit};
	},
	//用户每刷一次卡都把卡号显示在下面
	renderHasReadItem : function(cardNum){
		var listUl = $("#resultCardList");
		if(!cardNum) return false;
		var html = "";
		html += '<li class="item">';
        html += '<span class="card">'+cardNum+'</span>';
        html += '<span class="deleteBtn">×</span>';
        html += '</li>';
		listUl.append(html);
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
