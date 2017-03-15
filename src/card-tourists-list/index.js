require("./index.scss");

//组件
var simulate = require("./simulate");
var Pagination = require("COMMON/modules/pagination-x");
var Calendar = require("COMMON/modules/calendar");
var Select = require("./select_scroll");

//tpl
var operatorTpl = require("./tpl/operator.xtpl");
var listTpl = require("./tpl/list.xtpl");

//service层
var GetList = require("./service/GetList_service.js");

//loading组件
var Loading = require("COMMON/js/util.loading.pc.js") 

var Main = PFT.Util.Class({

	container : $("#cardTouristsListWrap"),
	EVENTS : {
		"click #operator" : "onOperatorClick"  //操作员
	},
	init : function(){

		var that = this;
		//在发送请求之前拦截请求,模拟数据
		simulate.init();

		//处理操作员
		this.handleOperator(); 
		//处理状态
		this.handleStatus();
		//处理列表
		this.handleList();

		//日历组件部分
		var calendar = new Calendar();
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

		//分页器组件部分
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
			that.handleList();

			pagination.render({current:toPage,total:10});

		})
		// 主方法：(也是唯一对外显露的方法) 把分页器当前状态渲染到页面上
		pagination.render({current:1,total:10});


	},

	handleList : function(){
		
		var html = Loading("请稍等");
		var that = this;

		GetList({},{
			loading : function(){
				$("table.accountList").html(html);
			},
			complete : function(){
			},
			success : function(res){
				that.renderList(res);  //渲染列表
			},
			//200但无数据
			empty : function(){
			},
			//不是200
			fail : function(){
			}
		});

	},
	renderList : function(res){
		var data = res.data;
		var list = data.list;
		var ListTemplate = PFT.Util.ParseTemplate(listTpl);
		var listHtml = ListTemplate({ list : list});		
		$("table.accountList").html(listHtml);
	},
	//处理状态
	handleStatus : function(){

		$(".statusItem").on("click",function(){
			$(this).siblings().find(".statusItemCircle").removeClass("selected");
			$(this).find(".statusItemCircle").addClass("selected");
			var status = $(this).attr("data-status");
		});

	},
	//处理操作员
	handleOperator : function(){

		PFT.Util.Ajax("http://operator.cn",{
			dataType : "json",
			params : {
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				var code = res.code;
				var msg = res.msg;
				var list = res.data.list;
				var operatorTemplate = PFT.Util.ParseTemplate(operatorTpl);
				var operatorHtml = operatorTemplate({ list : list });
				$("#operatorListBox").append(operatorHtml);
				$(".operatorItem").on("click",function(){
					$("#operatorListBox").css("display","none");
					$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
					$("#operator").val($(this).text());
				});
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})

		return false
		//真实请求
		
		PFT.Util.Ajax("/r/product_parkcard/getOpId",{
			dataType : "json",
			params : {
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				var code = res.code;
				var msg = res.msg;
				var list = res.data.list;
				var operatorTemplate = PFT.Util.ParseTemplate(operatorTpl);
				var operatorHtml = operatorTemplate({ list : list });
				$("#operatorListBox").append(operatorHtml);
				$(".operatorItem").on("click",function(){
					$("#operatorListBox").css("display","none");
					$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
					$("#operator").val($(this).text());
				});
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})


	},

	onOperatorClick : function(){
		var display = $("#operatorListBox").css("display");	
		if( display == "none" ){
			$("#operatorListBox").css("display","block");
			$(".unfoldBox i").removeClass("icon-unfold").addClass("icon-fold");
		}else if( display == "block" ){
			$("#operatorListBox").css("display","none");
			$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
		}

	}

});

$(function(){
    new Main();
});

