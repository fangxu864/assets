/**
 * Created by Administrator on 16-3-24.
 */
var Calendar = require("./calendar.js");
var Filter = RichBase.extend({
	triggerInp : null,
	init : function(){
		this.filterTopBox = $("#filterTopBox");
		this.mask = $("#gMasker");
		this.submitBtn = $("#searchBtn");
		this.form = $("#filterForm");
		this.calendar = new Calendar({
			container:$("#calendarPopBox"),
			mult : false
		})
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		var calendar = this.calendar;
		var mask = this.mask;
		var submitBtn = this.submitBtn;
		mask.on("click",function(e){
			$(this).hide();
			calendar.close();
		})
		submitBtn.on("click",function(e){
			that.onSearchBtnClick(that,e);
		})
		calendar.on("click",function(data){
			that.triggerInp.val(data.date);
			mask.trigger("click")
		})
		this.filterTopBox.on("focus",".timeInp",function(e){
			var tarInp = $(e.currentTarget);
			var val = tarInp.val();
			var pos = tarInp.offset();
			var top = pos.top+tarInp.outerHeight();
			var left = pos.left;
			calendar.show(val,{
				onAfter : function(){
					that.triggerInp = tarInp;
					mask.show();
					calendar.position({
						top : top,
						left : left
					});
				}
			});
		})
	},
	onSearchBtnClick : function(that,e){
		var submitBtn = that.submitBtn;
		if(submitBtn.hasClass("disable")) return false;
		var params = that.getFilterParams();
		that.fire("searchBtn.click",{params:params});
	},
	getFilterParams : function(){
		return this.form.serialize();
	}
});
module.exports = Filter;