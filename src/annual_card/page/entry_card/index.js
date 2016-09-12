/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var PubSub = PFT.Util.PubSub;
var Header = require("./header.js");
var List = require("./list.js");
var Dialog = require("./dialog");
var Select = require("COMMON/modules/select");
var Api = require("../../common/api.js");
var MainView = Backbone.View.extend({
	el : $("body"),
	events : {
		"click #relateSHCardBtn" : "onRelateSHCardBtnClick",
		"click #clearAllListBtn" : "onClearAllListClick",
		"click #submitBtn" : "onSubmit",
		"click #actityBtn" : "onActityBtnClick"
	},
	initialize : function(){
		var that = this;
		this.pid = PFT.Util.UrlParse()["pid"] || "";
		this.Header = new Header();
		this.List = new List();
		this.Dialog = new Dialog({List:this.List});
		this.Header.on("create.card",function(data){
			var cards = data.cards;
			that.List.render(cards);
		})
		this.cardList = $("#cardList");
		this.Select = new Select({
			trigger : $("#cardProdTriggerInput"),
			source : Api.Url.EntryCard.getProdList + "?page=1&page_size=1000",
			defaultVal : this.pid,
			height : 400,
			field : {
				id : "id",
				name : "p_name"
			},
			adaptor : function(res){
				var result = {};
				res = res || {};
				result["code"] = res.code;
				result["data"] = res.data.list;
				result["msg"] = res.msg;
				return result;
			}
		});
		$(".arrowup").hide();
		this.Select.on("open",function(){
			$("#card_headerContaienr").addClass("select-on");
			$(".arrowdown").hide();
			$(".arrowup").show();
		})
		this.Select.on("close",function(){
			$("#card_headerContaienr").removeClass("select-on");
			$(".arrowdown").show();
			$(".arrowup").hide();
		})
	},
	onRelateSHCardBtnClick : function(e){
		var cardList = this.cardList;
		if(cardList.children(".cardItem").length==0) return alert("请先生成卡号");
		this.Dialog.open(function(){
			var total = 0;
			var hasRelated = 0;
			cardList.children().each(function(){
				var tarItem = $(this);
				var card_no = tarItem.find(".card").text();
				var physics_no = tarItem.find(".physics").text();
				if(card_no=="--") card_no = "";
				if(physics_no=="--") physics_no = "";
				total+=1;
				if(card_no && card_no) hasRelated+=1;
			});
			$("#hasRelatedCount").text(hasRelated);
			$("#totalRelatedCount").text(total);
		});
	},
	//清空重置
	onClearAllListClick : function(e){
		if(this.cardList.children().length==0) return false;
		if(!confirm("确定要清空卡片列表吗？")) return false;
		this.cardList.html("");
	},
	//确定发卡
	onSubmit : function(e){
		var submitBtn = $(e.currentTarget);
		if(submitBtn.hasClass("disable")) return false;
		this.submit(submitBtn);
	},
	//一键激活
	onActityBtnClick : function(e){
		var actityBtn = $(e.target);
		if(actityBtn.hasClass("disable")) return false;
		this.submit(actityBtn,"actity");
	},
	submit : function(submitBtn,type){
		var pid = this.Select.getValue().id;
		if(!pid) return alert("缺少年卡产品id");
		var list = [];
		this.cardList.children().each(function(){
			var item = $(this);
			var virtual = item.find(".virtual").text();
			var card = item.find(".card").text();
			var physics = item.find(".physics").text();
			if(card=="--") card = "";
			if(physics=="--") physics = "";
			list.push({
				virtual_no : virtual,
				card_no : card,
				physics_no : physics
			})
		})
		if(list.length==0) return false;
		if(type=="actity" && list.length>20) return alert("一键激活时，卡数量不得超过20张");
		var params = {
			pid : pid,
			list : list
		};
		if(type=="actity") params["active"] = 1;
		PFT.Util.Ajax(Api.Url.EntryCard.createAnnualCard,{
			type : "post",
			params : params,
			loading : function(){ submitBtn.addClass("disable")},
			complete : function(){ submitBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				var code = res.code;
				if(code==200){
					PFT.Util.STip("success",'<p style="width:200px">发卡成功</p>');
					$("#cardList").html("");
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	}

});

$(function(){
	new MainView();
})