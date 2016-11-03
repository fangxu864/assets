/**
 * Author: huangzhiyang
 * Date: 2016/11/3 11:06
 * Description: ""
 */
var SheetCore = require("COMMON/modules/sheet-core/v1");
var Datepicker = require("COMMON/modules/datepicker-mobile/v1");
var CalendarCore = Datepicker.CalendarCore;
var SheetTpl = require("./index.xtpl");
var Search = PFT.Util.Class({
	init : function(){
		var that = this;
		var Sheet = this.Sheet = new SheetCore({
			EVENTS : {
				"click .dateTypeBtn" : function(e){
					that.onDateTypeBtnClick(e);
				},
				"click .dateInp" : function(e){
					that.onDateInpClick(e);
				},
				"click .doSearchBtn" : function(e){
					that.onDoSearchBtnClick(e);
				},
				"click .removeAllBtn" : function(e){
					that.onRemoveAllBtnClick(e);
				}
			},
			height : $(window).height()-$("#fixTabHead").height(),
			content : SheetTpl,
			zIndex : 1,
			noBtn : true
		})
		this.datepicker = new Datepicker({
			zIndex : 11
		});
		this.beginDateInp = $("#beginDateInp");
		this.endDateInp = $("#endDateInp");



	},
	onDateTypeBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("active")) return false;
		tarBtn.addClass("active").siblings().removeClass("active");
	},
	onDateInpClick : function(e){
		var tarInp = $(e.currentTarget);
		var beginDate = this.beginDateInp.val();
		var endDate = this.endDateInp.val();
		var tarDate = tarInp.hasClass("begin") ? beginDate : endDate;
		this.datepicker.show(tarDate,{
			picker : tarInp
		});
	},
	onDoSearchBtnClick : function(e){
		var data = {
			beginDate : this.beginDateInp.val(),
			endDate : this.endDateInp.val(),
			type : $("#searchSheetContainer").find(".dateTypeGroup").children(".active").attr("data-type")
		};
		this.trigger("search",data);
		this.close();
	},
	onRemoveAllBtnClick : function(e){
		this.beginDateInp.val("");
		this.endDateInp.val("");
		this.trigger("reset");
		this.close();
	},
	show : function(beginDate,endDate){
		this.Sheet.show();
		var today = CalendarCore.gettoday();
		beginDate ? this.beginDateInp.val(beginDate) : this.beginDateInp.val(today);
		endDate ? this.endDateInp.val(endDate) : this.endDateInp.val(today);
	},
	close : function(){
		this.Sheet.close();
	}
});
module.exports = Search;