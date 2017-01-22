
require("./index.scss");

var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();



var Order_fill = PFT.Util.Class({

	container : $("#orderFill"),
	EVENTS : {
		"click #playDate":"getDate",
	},
	init : function(){


	},
	getDate : function () {
		var calendar = new Calendar();
		calendar.show("",{
			picker : $("#playDate"),
			top : 0,
			left : 0,
			onBefore : function(){},
			onAfter : function(){}
		})
	}

});


$(function(){
	new Order_fill();
});





