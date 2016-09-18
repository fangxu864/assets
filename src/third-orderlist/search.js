/**
 * Author: huangzhiyang
 * Date: 2016/9/14 9:41
 * Description: ""
 */
var Calendar = require("COMMON/modules/calendar");
var Search = PFT.Util.Class({
	container : "#searchContainer",
	EVENTS : {
		"focus .datepickerInp" : "onDatepickerInpFocus",
		"click .searchBtn" : "onSearchBtnClick",
		"keyup .baseOrderInp" : "onBaseOrderInpKeyup"
	},
	init : function(){

		var container = this.container;

		this.__disable = false;
		this.beginTimeInp = $("#beginTimeInp");
		this.endTimeInp = $("#endTimeInp");
		this.orderInp = $("#orderInp");
		this.thirdOrderInp = $("#thirdOrderInp");
		this.searchBtn = $("#searchBtn");

		this.datepicker = new Calendar();
		this.datepicker.on("select",function(data){

		})
	},
	onDatepickerInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		var date = tarInp.val();
		var min="",max="";
		if(tarInp.hasClass("begin")){
			max = this.endTimeInp.val();
		}else{
			min = this.beginTimeInp.val();
		}
		this.datepicker.show(date,{
			picker : tarInp,
			top : 1,
			max : max,
			min : min
		});
	},
	onSearchBtnClick : function(e){
		this.search();
	},
	onBaseOrderInpKeyup : function(e){
		this.search();
	},
	search : function(){
		if(this.__disable) return false;
		var beginTime = this.beginTimeInp.val();
		var endTime = this.endTimeInp.val();
		var order = $.trim(this.orderInp.val());
		var thirdOrder = $.trim(this.thirdOrderInp.val());

		this.trigger("search",{
			bDate : beginTime,
			eDate : endTime,
			orderid : order,
			thirdid : thirdOrder
		})
	},
	disable : function(){
		this.searchBtn.addClass("disable");
		this.__disable = true;
	},
	enable : function(){
		this.searchBtn.removeClass("disable");
		this.__disable = false;
	}
});

module.exports = Search;