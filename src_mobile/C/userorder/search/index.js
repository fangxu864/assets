/**
 * Author: huangzhiyang
 * Date: 2016/11/3 11:06
 * Description: ""
 */
var SheetCore = require("COMMON/modules/sheet-core/v1");
var Datepicker = require("COMMON/modules/datepicker-mobile/v1");
var SheetTpl = require("./index.xtpl");
var Search = PFT.Util.Class({
	init : function(){
		var that = this;
		var Sheet = this.Sheet = new SheetCore({
			EVENTS : {
				"click .dateTypeBtn" : function(e){
					that.onDateTypeBtnClick(e);
				}
			},
			height : $(window).height()-$("#fixTabHead").height(),
			content : SheetTpl,
			zIndex : 1,
			noBtn : true
		})
	},
	onDateTypeBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
	},
	show : function(beginDate,endDate){
		this.Sheet.show();
	}
});
module.exports = Search;