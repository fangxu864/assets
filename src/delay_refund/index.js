
require("./index.scss")

console.log("延迟退款");

var Main =  PFT.Util.Class({
    // container : $("#container"),  
    EVENTS : {                    
    },
    init : function(opt){         
		this.send();
    },
	send : function(){
		//可以用
		PFT.Util.Ajax("/r/Order_Handler/refundList",{
			type : "POST",
			dataType : "json",
			params : {
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				console.log(res);
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})
	}
});






$(function(){
	new Main()
})




