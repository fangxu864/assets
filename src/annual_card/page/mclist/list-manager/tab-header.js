/**
 * Author: huangzhiyang
 * Date: 2016/6/29 15:48
 * Description: ""
 */
var State = require("../state.js");
var Header = Backbone.View.extend({
	el : $("#tahHeaderContainer"),
	events : {
		"click .cardType" : "onCardTypeClick",
		"click #searchBtn" : "onSearchBtnClick",
		"click #outExcel" : "onOutExcelClick",
		"click #clearSearchBtn" : "onClearSearchBtnClick",
		"keyup #searchInp" : "onSearchInpKeyup",
		"focus #searchInp" : "onSearchInpFocus"
	},
	initialize : function(opt){
		this.state = opt.state;
		this.searchInp = $("#searchInp");
		this.searchBtn = $("#searchBtn");
		this.clearSearchBtn = $("#clearSearchBtn");
	},
	onCardTypeClick : function(e){
		var tarBtn = $(e.currentTarget);
		// if(tarBtn.hasClass("active")) return false;
		var cur_active = this.$el.find(".cardType").filter(".active");
		var from_active_status = cur_active.length ? cur_active.attr("data-status") : -1;
		var status = tarBtn.attr("data-status");
		tarBtn.addClass("active").siblings().removeClass("active");
		this.trigger("switch",{fromStatus:from_active_status,toStatus:status});
	},
	onSearchBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		this.trigger("searchBtnClick",{searchBtn:tarBtn});
	},
	onSearchInpFocus : function(e){
		var val = $.trim($(e.currentTarget).val());
		if(val){
			this.clearSearchBtn.show();
		}else{
			this.clearSearchBtn.hide();
		}
	},
	onSearchInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		if(val){
			this.clearSearchBtn.show();
		}else{
			this.clearSearchBtn.hide();
		}
	},
	onClearSearchBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var status = this.getCurrentState();
		var state = State[status] || (State[status]={});
		var searchInp = this.searchInp;
		state["keyword"] = "";
		searchInp.val("");
		this.trigger("searchBtnClick",{searchBtn:this.searchBtn});
		tarBtn.hide();
	},
	onOutExcelClick:function () {
		var status=$(".stateBox .active").attr("data-status");
		var downUrl="/r/product_AnnualCard/getUploadMember/?status="+status;
		this.outExcel(downUrl);
	},
	active : function(status){
		this.$el.find(".cardType[data-status="+status+"]").trigger("click");
	},
	getStatus : function(){
		var status = [];
		this.$el.find(".cardType").each(function(){
			var item = $(this);
			var s = item.attr("data-status");
			status.push(s);
		})
		return status;
	},
	setCount : function(status,count){
		if(arguments.length!=2) return false;
		$("#cardTypeTab_"+status).find(".num").css("display","inline").text("（"+count+"）");
	},
	getKeyword :function(){
		return $.trim(this.searchInp.val());
	},
	setKeyword : function(keyword){
		this.searchInp.val(keyword);
	},
	getSupplySelectVal : function(){
		return $("#supplySelect").val();
	},
	setSupplySelectVal : function(val){
		$("#supplySelect").val(val);
	},
	getCurrentState : function(){
		return this.$el.find(".cardType").filter(".active").attr("data-status");
	},
	//导出excel
	outExcel:function (downloadUrl) {
		var iframeName="iframe"+new Date().getTime();
		$("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
		window.open(downloadUrl, iframeName);
	},
});
module.exports = Header;