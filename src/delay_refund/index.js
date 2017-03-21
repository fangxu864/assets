
require("./index.scss")

var listTpl = require("./list.xtpl");
console.log("延迟退款");

var Main =  PFT.Util.Class({
    container : $("#delayRefund"),  
    EVENTS : {                    
		"click #searchBtn2" : "onsearch"
    },
    init : function(opt){         
		this.listTemplate = PFT.Util.ParseTemplate(listTpl);  //预解析模板，缓存在template中   template是一个方法
    },
	onsearch : function(){

		// var ordernum = $("#ordernum").val();
		// if( ordernum == ""){
		// 	alert("请填写订单");
		// 	return false
		// }

		var ordernum = "4005526";		

		var that = this;
		//可以用
		PFT.Util.Ajax("/r/Order_Handler/refundList",{
			type : "POST",
			dataType : "json",
			params : {
				//先为空
				ordernum : ordernum
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				console.log(res);
				var html = that.listTemplate({ list : res.data });
				$("#tbody").html(html);
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})
	}
});

$(function(){
	new Main()
})




