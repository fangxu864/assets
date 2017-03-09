require("./index.scss");

// var Mock = require("mockjs");	

var simulate = require("./simulate");

var Pagination = require("COMMON/modules/pagination-x");

var Calendar = require("COMMON/modules/calendar");

var Main = PFT.Util.Class({

	init : function(){

		//在发送请求之前拦截请求,模拟数据
		simulate.init();

		var calendar = new Calendar();

		









		var Pagination = require("COMMON/modules/pagination-x");
		var pagination = new Pagination({
			container : "#pagCon",  //必须，组件容器id
			count : 7,                //可选  连续显示分页数 建议奇数7或9
			showTotal : true,         //可选  是否显示总页数
			jump : true	              //可选  是否显示跳到第几页
		});
		
		pagination.on("page.switch",function(toPage,currentPage,totalPage){

			// toPage :      要switch到第几页
		    // currentPage : 当前所处第几页
		    // totalPage :   当前共有几页

			// console.log(toPage);
			// console.log(currentPage);
			// console.log(totalPage);

			pagination.render({current:toPage,total:10});

		})
		
		// 主方法：(也是唯一对外显露的方法) 把分页器当前状态渲染到页面上
		pagination.render({current:1,total:10});

		PFT.Util.Ajax("http://1.cn",{
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

