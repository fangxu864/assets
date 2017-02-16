/**
 * Author: huangzhiyang
 * Date: 2016/9/27 11:39
 * Description: ""
 */
var TooltipMsg = require("../tooltip-msg");

$(function(){

	TooltipMsg.init({
		beginTimeHoverTrigger : $("#txtStartTime"),
		endTimeHoverTrigger : $("#txtEndTime"),
		reportHoverTrigger : $("#update")
	});





})