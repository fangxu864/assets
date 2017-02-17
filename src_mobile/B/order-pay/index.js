
require("./index.scss");
var ParseTemplate=require("COMMON/js/util.parseTemplate")
var Template={
	orderdetail:ParseTemplate(require("./tpl/payorderdetail.xtpl"))
}

var Order_pay = PFT.Util.Class({
	container : $("#orderPayBox"),
	init : function(opt){         
		console.log("支付");
		var _this=this;
		_this.loadOrderDetail();
	},
	params :{
		token:PFT.Util.getToken(),

	},
	dom:{
		div:{
			orderInfo:"#orderInfo",
		}
	},
	EVENTS : {

	},
	loadOrderDetail: function(){
		var _this=this;
		PFT.Util.Ajax(
			'/r/MicroPlat_Order/pay',
		{
			type:"POST",
			dataType:"json",
			params:{

			},
			loading:function(){
				var loading="<p>加载中,请稍后...</p>"
				$(_this.dom.div.orderInfo).html(loading);
			},
			success:function(res){
				if(res.code==200){
					var html=Template.orderdetail({data:res.data});
					$(_this.dom.div.orderInfo).html(html);
				}else{

				}
			}
		})
	}

});


$(function(){
	new Order_pay();
});





