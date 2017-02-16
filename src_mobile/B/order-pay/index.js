
require("./index.scss");

var Order_pay = PFT.Util.Class({
	container : $("#orderPayBox"),
	init : function(opt){         
		console.log("支付");
		var _this=this;
	},
	params :{
		token:PFT.Util.getToken(),

	},
	EVENTS : {                    
	},

});


$(function(){
	new Order_pay();
});





