/**
 * Author: huangzhiyang
 * Date: 2016/9/26 21:14
 * Description: ""
 */
var UtilClass = require("COMMON/js/util.class");
var State = require("./state");

UtilClass({
	container : "#shopMsgBox",
	EVENTS : {
		".flagBtn" : "onFlagBtnClick"
	},
	init : function(){
		this.clickQuery = $("#clickQueryHidInp").val();
	},
	onFlagBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var action = tarBtn.attr("data-action");
		var state = State[action];
		if(!state) return false;

	}
});

