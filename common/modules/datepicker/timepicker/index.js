/**
 * Author: huangzhiyang
 * Date: 2016/9/23 9:45
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Timepicker = PFT.Util.Class({
	EVENTS : {
		"click .slideStage .timeSpan" : "onTimeSpanClick",
		"mouseenter .timeLine .navBtn" : "onNavBtnMouseEnter"
	},
	init : function(opt){
		this.container.html(Tpl);
	},
	onTimeSpanClick : function(e){
		var tarSpan = $(e.currentTarget);
		var num = tarSpan.text();
		tarSpan.parents(".timeLine").children(".showBox").find(".num").text(num);
	},
	onNavBtnMouseEnter : function(e){
		var tarBtn = $(e.currentTarget);
		var slideBox = tarBtn.siblings(".slideStage").children(".slideBox");
		slideBox.animate({left:"-=100px"})
	},
	slide : function(tarDom){

	}
});
module.exports = Timepicker;