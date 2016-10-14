/**
 * Author: huangzhiyang
 * Date: 2016/9/19 17:21
 * Description: ""
 */
require("./index.scss");
var Datepicker = require("COMMON/modules/datepicker");
var Query = require("./query");
var Terminal = require("./terminal");
var Tuipiao = require("./tuipiao");
var Main = PFT.Util.Class({
	container : "#rtContainer",
	EVENTS : {
		"click #tabHead .tabItem" : "onTabItemClick"
	},
	init : function(){
		var datepicker = new Datepicker;
		this.query = new Query({datepicker:datepicker,Datepicker:Datepicker});
		this.terminal = new Terminal({datepicker:datepicker,Datepicker:Datepicker});
		this.tuipiao = new Tuipiao({datepicker:datepicker,Datepicker:Datepicker});
		this.container.find("#tabHead .tabItem").first().trigger("click");
	},
	onTabItemClick : function(e){
		var tarItem = $(e.currentTarget);
		var pannel = tarItem.attr("data-pannel");
		if(tarItem.hasClass("active")) return false;
		tarItem.addClass("active").siblings().removeClass("active");

		pannel=="query" ? this.query.enable() : this.query.disable();
		pannel=="terminal" ? this.terminal.enable() : this.terminal.disable();
		pannel=="tuipiao" ? this.tuipiao.enable() : this.tuipiao.disable();
	}
});

$(function(){

	new Main();

})