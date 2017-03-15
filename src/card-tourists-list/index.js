require("./index.scss");

//组件
var simulate = require("./simulate");
var Pagination = require("COMMON/modules/pagination-x");
var Calendar = require("COMMON/modules/calendar");   //没有精确到秒
var Select = require("./select_scroll");
var Loading = require("COMMON/js/util.loading.pc.js"); 

var Datapicker = require("COMMON/modules/datepicker");  //精确到秒的日历组件

//tpl
var operatorTpl = require("./tpl/operator.xtpl");
var listTpl = require("./tpl/list.xtpl");

//service层
var GetList = require("./service/GetList_service.js");



var Main = PFT.Util.Class({

	container : $("#cardTouristsListWrap"),
	EVENTS : {
		"click #operator" : "onOperatorClick",  //操作员
		"click #checkOut" : "onCheckOut"  //查询
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
		// this.handleList();
		//默认激活日期
		var NowDate = new Date();
		var year = NowDate.getFullYear();
		var month = NowDate.getMonth() + 1;
		var day = NowDate.getDate();
		this.deFaultInTime = year + "-" + month + "-" + day + " 00:00:00";
		this.deFaultOutTime = year + "-" + month + "-" + day + " 23:59:59";
		var nowDate = this.getNowFormatDate();//用于日历组件
		$("#actTimein").val(this.deFaultInTime);
		$("#actTimeout").val(this.deFaultOutTime);
		//日历组件部分
		var datapicker = new Datapicker();
		$(".actTimein").on("click",function(){
			datapicker.show(nowDate,{
				picker : $(".actTimein")
			});	
		})
		$(".actTimeout").on("click",function(){
			datapicker.show(nowDate,{
				picker : $(".actTimeout")
			});	
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
	//获得当天的时间
	getNowFormatDate : function(){
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				+ " " + date.getHours() + seperator2 + date.getMinutes()
				+ seperator2 + date.getSeconds();
		return currentdate;
	},
	handleList : function(){
		
		var html = Loading("请稍等");
		var that = this;

		//模拟数据
		GetList({},{
			loading : function(){
				$("table.accountList").html(html);
			},
			complete : function(){
			},
			success : function(res){
				console.log(res);
				var code = res.code;
				var list = res.data.list;
				var msg = res.msg;

				console.log(list);

				that.renderList(list);  //渲染列表

			},
			//200但无数据
			empty : function(){
			},
			//不是200
			fail : function(){
			}
		});


		return false

		PFT.Util.Ajax("/r/product_parkcard/getTouristList",{
			type : "POST",
			dataType : "json",
			params : {
				opid : that.OID, 
				begin : that.beginStamp,
				end : that.endStamp,
				status : that.status,
				export : that.exports,
				physicsno : that.CardId,
				page : that.page,
				pagesize : 15 
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


	},
	renderList : function(list){
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
			$("#statusBox").attr("data-status",status);
		});
	},
	//处理操作员
	handleOperator : function(){

		PFT.Util.Ajax("/r/product_parkcard/getOpId",{
			type : "POST",
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
				var list = res.data;
				var operatorTemplate = PFT.Util.ParseTemplate(operatorTpl);
				var operatorHtml = operatorTemplate({ list : list });
				$("#operatorListBox").append(operatorHtml);
				$(".operatorItem").on("click",function(){
					$("#operatorListBox").css("display","none");
					$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
					$("#operator").val($(this).text());
					$("#operator").attr("data-id",$(this).attr("data-id"));
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
	},
	//查询
	onCheckOut : function(page){
		var beginTime = $("#actTimein").val(); //有默认时间
		var endTime = $("#actTimeout").val(); //有默认时间
		//化为时间戳
		this.beginStamp = this.parseDateToStamp(beginTime);
		this.endStamp = this.parseDateToStamp(endTime);
		//物理卡号
		// var CardId = $(".solidCardId").val();//物理卡号Id
		this.CardId ="12312312312";   //模拟固定卡号
		//操作员
		this.OID = $("#operator").attr("data-id");
		if( this.OID == "0"){
			alert("请选择操作员");
		}
		// 状态
		var status = $("#statusBox").attr("data-status");
		if(status == "all"){
			this.status = "0";
		}else if(status == "useing"){
			this.status = "1";
		}else if(status == "used"){
			this.status = "2";
		}
		//是否导出
		this.exports = "0" ;//默认为0
		//页数默认为1
		if(!page){
			this.page = "1" ;
		}

		

		//模拟请求

		this.handleList();


		//时间cuo化为日期开始//用于渲染列表
		// beginStamp = Number(beginStamp);
		// beginStamp = new Date(beginStamp*1000);
		// var newDate = this.parseStampToDate(beginStamp);
		//时间cuo化为日期结束


	},

	parseDateToStamp : function(date){
		date = new Date(Date.parse(date.replace(/-/g, "/")));
		date = date.getTime();
		date = String(date);
		date = date.substr(0,10);
		return date		
	},
	parseStampToDate : function(stamp){
		var   year=stamp.getFullYear();     
		var   month=stamp.getMonth()+1;     
		var   date=stamp.getDate();     
		var   hour=stamp.getHours();     
		var   minute=stamp.getMinutes();     
		var   second=stamp.getSeconds();     
		return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;  
	}

});

$(function(){
    new Main();
});

