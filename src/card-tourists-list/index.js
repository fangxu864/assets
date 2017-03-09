require("./index.scss");

// var Mock = require("mockjs");	

var simulate = require("./simulate");

var Pagination = require("COMMON/modules/pagination-x");

var Calendar = require("COMMON/modules/calendar");


var Select = require("COMMON/modules/select_scroll");

var Main = PFT.Util.Class({

	init : function(){

		//在发送请求之前拦截请求,模拟数据
		simulate.init();

		var select = new Select({
			id:"div1",
			arr:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
			callback:function(){}
		});

		console.log(select);


		



		var calendar = new Calendar();

		var $input = $(".actTimein");

		console.log(calendar);

		$(".actTimein").on("click",function(){

			calendar.show("2017-03-09",{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $(".actTimein"),             //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                     //日历box偏移量
				left : 0,                    //日历box偏移量
				// min : "201-06-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
				// max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			})


		});


		$(".actTimeout").on("click",function(){

			calendar.show("2017-03-09",{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $(".actTimeout"),             //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                     //日历box偏移量
				left : 0,                    //日历box偏移量
				// min : "201-06-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
				// max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			})

		});

		calendar.on("select",function(data){
			console.log(data)
		})


		$(".operator").on("focus",function(){




		});




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

