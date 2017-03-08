require("./index.scss");

var Mock = require("mockjs");	

var simulate = require("./simulate");

var Main = PFT.Util.Class({

	init : function(){

		//在发送请求之前拦截请求
		simulate.init();

		PFT.Util.Ajax("http://g.cn",{
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
    new Main();
});

