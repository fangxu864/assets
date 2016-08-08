/**
 * Author: huangzhiyang
 * Date: 2016/7/29 9:32
 * Description: ""
 */
require("./index.scss");
// var PaginationSimple = require("COMMON/modules/pagination-simple");
var Calendar = require("COMMON/modules/calendar");
require("COMMON/modules/DragConOver")($);
// var Loading = require("COMMON/js/util.loading.pc.js");
// var DealSummary=function(){
// 	this.now = new Date(); //当前日期
// 	this.nowDayOfWeek = this.now.getDay(); //今天本周第几天
// 	this.nowDay = this.now.getDate(); //当前日
// 	this.nowMonth =this.now.getMonth(); //当前月
// 	this.nowYear = this.now.getFullYear(); //当前年
// 	this.initialize();
// }
// DealSummary.prototype={
// 	__cache:{
// 		fromDate:null,
// 		toDate:null,
// 		searchType:null
// 	},
// 	initialize:function(){
// 		var that=this;
// 		this.queryBtn=$("#queryBtn");
// 		this.summaryBtn=$("#summaryDetailBtn");
// 		this.queryInp=$("#queryInp");
// 		this.datePickerInp=$(".datePickerInp");
// 		this.fromDateInp=$("#fromDate");
// 		this.toDateInp=$("#toDate");
// 		this.beginTime= $.trim(that.fromDateInp.val())
// 		this.endTime= $.trim(that.toDateInp.val())
// 		this.thisWeekBtn=$("#thisWeek");
// 		this.thisMonthBtn=$("#thisMonth");
// 		this.totalIncome=$("#totalIncome");
// 		this.totalExpend=$("#totalExpend");
//
// 		this.Calendar = new Calendar();
// 		this.Calendar.on("select",function(data){});
// 		this.pagination = new PaginationSimple({
// 			container : $("#paginationContainer"),
// 			keyup : false
// 		})
// 		this.pagination.on("next",function(data){
// 			var toPage = data.toPage;
// 			that.getListDetail(toPage);
// 		})
// 		this.pagination.on("prev",function(data){
// 			var toPage = data.toPage;
// 			that.getListDetail(toPage);
// 		})
// 		//this.pagination.show();
// 		this.fromDateInp.val(that.getWeekStartDate());
// 		this.toDateInp.val(that.getWeekEndDate());
// 		this.getListForTradeRecord(0);
// 		that.getListDetail(0);
// 		this.bindEvent();
// 	},
// 	bindEvent:function(){
// 		var that=this;
// 		$("#leftBtn").css({"color":"#00597b"});
// 		var count=0;
// 		$("#rightBtn").on("click",function(e){
// 			count+=1;
// 			var marginLeftValue=count*930;
// 			console.log(count)
// 			$("#dealSumTable").animate({marginLeft:-marginLeftValue},"slow");
// 			$("#leftBtn").css({"color":"#fff"});
// 			//$("#rightBtn").css({"color":"#00597b"});
// 		});
// 		$("#leftBtn").on("click",function(e){
// 			$("#dealSumTable").animate({marginLeft:'0px'},"slow")
// 			$("#leftBtn").css({"color":"#00597b"});
// 			$("#rightBtn").css({"color":"#fff"});
// 		})
// 		this.queryBtn.on("click",function(e){
// 			var tarBtn=$(e.currentTarget);
// 			if(tarBtn.hasClass("disable")) return false;
// 			var search_type;
// 			if($("#dealAccount:checked").length){
// 				search_type=0;
// 			}else{
// 				search_type=1;
// 			}
// 			that.getListForTradeRecord(search_type);
// 			that.getListDetail(search_type);
// 		})
// 		this.datePickerInp.on("focus",function(e){
// 			var calendar = that.Calendar;
// 			var tarInp=$(e.currentTarget);
// 			var date=tarInp.val();
// 			var siblingInp=tarInp.siblings(".datePickerInp");
// 			var siblingDate = siblingInp.val();
// 			var opt = {
// 				picker : tarInp,
// 				top : 1
// 			};
// 			if(tarInp.hasClass("begin") && siblingDate){
// 				opt["max"] = siblingDate;
// 			}else if(tarInp.hasClass("end")){
// 				opt["min"] = siblingDate;
// 			}
// 			calendar.show(date,opt);
// 		})
// 		this.thisWeekBtn.on("click",function(e){
// 			that.fromDateInp.val(that.getWeekStartDate());
// 			that.toDateInp.val(that.getWeekEndDate());
// 		})
// 		this.thisMonthBtn.on("click",function(e){
// 			that.fromDateInp.val(that.getMonthStartDate());
// 			that.toDateInp.val(that.getMonthEndDate());
// 		})
// 		this.summaryBtn.on("click",function(e){
// 			var tarBtn=$(e.currentTarget);
// 			if(tarBtn.hasClass("disable")) return false;
// 			$("#sumDetailTable").toggle();
// 		})
// 	},
// 	getListForTradeRecord :function(search_type){
// 		var that=this;
// 		var begintime=$.trim(that.fromDateInp.val())
// 		var endtime= $.trim(that.toDateInp.val())
// 		PFT.Util.Ajax("/r/Finance_TradeRecord/getListForTradeRecord/",{
// 			params : {
// 				btime : begintime,
// 				etime : endtime,
// 				search_type:search_type
// 			},
// 			loading:function(){},
// 			complete:function(){},
// 			success:function(res){
// 				res=res||{};
// 				var data=res.data;
// 				if(res.code==200){
// 					that.renderTotal(data);
// 				}
// 				else{
// 					alert(res.msg);
// 				}
// 			}
// 		})
// 	},
// 	renderTotal:function(data){
// 		var that=this;
// 		var htmlThead='<td style="width:24px;">kon</td>';
// 		var htmlIncome='<td class="incomeText">收入</td>';
// 		var htmlExpend='<td class="expendText">支出</td>';
// 		var total=data.total;
// 		var totalIncome=total["totalIncome"];
// 		var totalExpense=total["totalExpense"];
// 		that.totalIncome.text(totalIncome);
// 		that.totalExpend.text(totalExpense);
// 		for( var i in data){
// 			if(i!="total"){
// 				var t=data[i];
// 				var income=t["income"];
// 				var expend=t["expense"];
// 				if(expend>0){
// 					expend=-expend;
// 				}
// 				var name=t["name"];
// 				htmlThead+='<td>'+name+'</td>';
// 				htmlIncome+='<td>'+income+'</td>';
// 				htmlExpend+='<td>'+expend+'</td>';
// 			}
// 		}
// 		$("#dealSumThead").html(htmlThead);
// 		$("#income").html(htmlIncome);
// 		$("#expend").html(htmlExpend);
// 	},
// 	getListDetail:function(search_type){
// 		var that=this;
// 		var begintime=$.trim(that.fromDateInp.val())
// 		var endtime= $.trim(that.toDateInp.val())
// 		PFT.Util.Ajax("/r/Finance_TradeRecord/getListDetail/",{
// 			params : {
// 				btime : begintime,
// 				etime : endtime,
// 				search_type:search_type
// 			},
// 			loading:function(){},
// 			complete:function(){},
// 			success:function(res){
// 				res=res||{};
// 				var data=res.data;
// 				if(res.code==200){
// 					that.renderDetail(data);
// 				}
// 				else{
// 					alert(res.msg);
// 				}
// 			}
// 		})
// 	},
// 	renderDetail:function(data){
// 		var that=this;
// 		var htmlThead='<td>日期</td><td>收入/支出</td>';
// 		var htmlIncome='';
// 		var htmlExpend='<td></td>';
// 		var incomeHtml='';
// 		var expendHtml='';
// 		for(var i in data){
// 			var t=data[i];
// 			var dealIncome=t["income"];
// 			var dealExpend=-t["expense"];
// 			var dealTime=t["time"];
// 			for( var j in t){
// 				var a=t[j];
// 				var income=a["income"];
// 				var expense=a["expense"];
// 				if(expense>0){
// 					expense=-expense;
// 				}
// 				var name=a["name"];
// 				htmlThead+='<td>'+name+'</td>';
// 				incomeHtml+='<td>'+income+'</td>';
// 				expendHtml+='<td>'+expense+'</td>';
// 			}
// 			htmlIncome+='<td>'+dealTime+'</td><td>'+dealIncome+'</td>'+incomeHtml;
// 			htmlExpend+='<td>'+dealExpend+'</td>'+expendHtml;
// 		}
//
// 		$("#summaryThead").html(htmlThead);
// 		$("#detailIncome").html(htmlIncome);
// 		$("#detailExpend").html(htmlExpend);
// 	},
// 	formatDate:function(date) {
// 		var myyear = date.getFullYear();
// 		var mymonth = date.getMonth()+1;
// 		var myweekday = date.getDate();
//
// 		if(mymonth < 10){
// 			mymonth = "0" + mymonth;
// 		}
// 		if(myweekday < 10){
// 			myweekday = "0" + myweekday;
// 		}
// 		return (myyear+"-"+mymonth + "-" + myweekday);
// 	},
// 	getMonthDays:function(myMonth){
// 		var that=this;
// 		var monthStartDate = new Date(that.nowYear, myMonth, 1);
// 		var monthEndDate = new Date(that.nowYear, myMonth + 1, 1);
// 		var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
// 		return days;
// 	},
//
// 	//本周
// 	getWeekStartDate:function() {
// 		var that=this;
// 		var weekStartDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek+1);
// 		return this.formatDate(weekStartDate);
// 	},
// 	getWeekEndDate:function() {
// 		var that=this;
// 		var weekEndDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek+7);
// 		return this.formatDate(weekEndDate);
// 	},
// 	//本月
// 	getMonthStartDate:function(){
// 		var that=this;
// 		var monthStartDate = new Date(that.nowYear, that.nowMonth, 1);
// 		return this.formatDate(monthStartDate);
// 	},
// 	getMonthEndDate:function(){
// 		var that=this;
// 		var monthEndDate = new Date(that.nowYear, that.nowMonth, that.getMonthDays(that.nowMonth));
// 		return this.formatDate(monthEndDate);
// 	}
// }
// $(function(){
// 	new DealSummary();
// })


var DealSum={
	init:function(){
		var _this=this;
		/*查询部分*/
		//获取元素
		this.stime_inp=$("#start_time");
		this.etime_inp=$("#end_time");
		this.rweek_span=$("#thisWeek");
		this.rmonth_span=$("#thisMonth");
		this.dealType=0;
		this.query_btn=$("#queryBtn");
		this.totalIncome_span=$("#totalIncome");
		this.totalExpend_span=$("#totalExpend");
		this.roll_left_btn=$(".roll_left");
		this.roll_right_btn=$(".roll_right");
		this.day_detail_btn=$("#day_detail_btn");
		//日历部分
		//扩展日期对象，新增格式化方法
		Date.prototype.Format = function (fmt) { //author: meizz
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"h+": this.getHours(), //小时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
			};
			//RegExp.$1第一个 以括号为标志 的 子匹配字符串；
			if (/(y+)/i.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (var k in o){
				if (new RegExp("(" + k + ")").test(fmt)){
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		};
		var now=new Date();
		//获取今天的日期
		this.today=now.Format("yyyy-MM-dd");
		//获取上周的日期
		this.lastWeek = new Date(now.getTime() - 7 * 24 * 3600 * 1000).Format("yyyy-MM-dd");
		//获取上月的日期
		this.lastMonth = new Date(now.getTime() - 30 * 24 * 3600 * 1000).Format("yyyy-MM-dd");
		//日历插件部分
		var calendar = new Calendar();
		this.stime_inp.on("click",function(e){
			calendar.show(_this.today,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $("#start_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                       //日历box偏移量
				left : 0,                     //日历box偏移量
				// min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
				// max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			});
			return this;
		});
		this.etime_inp.on("click",function(e){
			calendar.show(_this.today,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $("#end_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                       //日历box偏移量
				left : 0,                     //日历box偏移量
				// min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
				// max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			})
		});
		//初始化input内容
		this.stime_inp.val(_this.lastWeek);
		this.etime_inp.val(_this.today);
		this.bind();
		this.query_btn.click();
		// 表格拖动部分
		$("#tb_top").DragConOver({
			direction:"x",
			callBack:function(dValue){
				$("#tb_bottom").css("left",$("#tb_bottom").position().left+dValue.x+"px")
			}
		});
		$("#tb_bottom").DragConOver({
			direction:"x",
			callBack:function(dValue){
				$("#tb_top").css("left",$("#tb_top").position().left+dValue.x+"px")
			}
		});
		//右侧点击滚动按钮
		this.roll_right_btn.mousedown(function(){
			clearTimeout(_this.timer)
			_this.timer=setInterval(function () {
				$("#tb_bottom").css("left",$("#tb_bottom").position().left-2+"px");
				$("#tb_top").css("left",$("#tb_top").position().left-2+"px");
				// _this.roll_left_btn.css("display","block");
				//下面两个if的意思是不让表格向左移动出容器
				if(Math.abs($("#tb_bottom").position().left)>Math.abs($("#tb_bottom").outerWidth()-$("#tb_bottom").offsetParent().innerWidth())||Math.abs($("#tb_top").position().left)>Math.abs($("#tb_top").outerWidth()-$("#tb_top").offsetParent().innerWidth())){
					$("#tb_bottom").css("left",-Math.abs($("#tb_bottom").outerWidth()-$("#tb_bottom").offsetParent().innerWidth())+"px")
					$("#tb_top").css("left",-Math.abs($("#tb_top").outerWidth()-$("#tb_top").offsetParent().innerWidth())+"px")
					// _this.roll_left_btn.css("display","none");
				}
				if($("#tb_bottom").offsetParent().innerWidth()-$("#tb_bottom").innerWidth()>=0||$("#tb_top").offsetParent().innerWidth()-$("#tb_top").innerWidth()>=0){
					$("#tb_bottom").css("left","0");
					$("#tb_top").css("left","0");
					// _this.roll_right_btn.css("display","none");
				}
			},1)
		});
		this.roll_right_btn.mouseup(function(){
			clearTimeout(_this.timer)
		});
		//右侧点击滚动按钮
		this.roll_left_btn.mousedown(function(){
			clearTimeout(_this.timer)
			_this.timer=setInterval(function(){
				$("#tb_bottom").css("left",$("#tb_bottom").position().left+2+"px");
				$("#tb_top").css("left",$("#tb_top").position().left+2+"px");
				// _this.roll_right_btn.css("display","block");
				//下面的if是意思是不让表格向右移动出容器、
				if($("#tb_bottom").position().left>0||$("#tb_top").position().left>0){
					$("#tb_bottom").css("left","0");
					$("#tb_top").css("left","0");
					// _this.roll_left_btn.css("display","none");
				}
			},1)
		})
		this.roll_left_btn.mouseup(function () {
			clearTimeout(_this.timer)
		})


	},
	bind:function(){
		var _this=this;
		this.rweek_span.click(function () {
			_this.stime_inp.val(_this.lastWeek);
			_this.etime_inp.val(_this.today);
		});
		this.rmonth_span.click(function(){
			_this.stime_inp.val(_this.lastMonth);
			_this.etime_inp.val(_this.today);
		});
		$("#deal_count").click(function () {
			_this.dealType=0;
		});
		$("#deal_trade").click(function () {
			_this.dealType=1;
		});
		this.query_btn.click(function () {
			$.ajax({
				url: "/r/Finance_TradeRecord/getListForTradeRecord/",    //请求的url地址
				dataType: "json",                        //返回格式为json
				async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
				data: {                                    //参数值
					"search_type": _this.dealType,
					"btime":_this.stime_inp.val(),
					"etime":_this.etime_inp.val()
				},
				type: "GET",                               //请求方式
				beforeSend: function() {
					//请求前的处理
				},
				success: function(req) {
					_this.dealDataTB1(req)
				},
				complete: function() {
					//请求完成的处理
				},
				error: function() {
					//请求出错处理
				}
			});
			$.ajax({
				url: "/r/Finance_TradeRecord/getListDetail/",    //请求的url地址
				dataType: "json",                        //返回格式为json
				async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
				data: {                                    //参数值
					"search_type": _this.dealType,
					"btime":_this.stime_inp.val(),
					"etime":_this.etime_inp.val()
				},
				type: "GET",                               //请求方式
				beforeSend: function() {
					//请求前的处理
				},
				success: function(req) {
					console.log(req);

				},
				complete: function() {
					//请求完成的处理
				},
				error: function() {
					//请求出错处理
				}
			});
			
		})
		this.day_detail_btn.click(function () {
			$(".tb_bottom_box").stop(true,true);
			$(".tb_bottom_box").toggle("50");
			$("#day_detail_btn").toggleClass("day_detail_btn2")
			$("#day_detail_btn").toggleClass("day_detail_btn1")

		})
		

	},

	dealDataTB1:function (req) {
		this.totalIncome_span.text(req.data.total.totalIncome);
		this.totalExpend_span.text(req.data.total.totalExpense);

		$("#tb_top thead tr").empty();//清空顶部表格表头
		$("#tb_top tbody tr.income").empty();//清空顶部表格第“收入”行
		$("#tb_top tbody tr.expend").empty();//清空顶部表格“支出”行
		var data=req.data;
		for(var key in data){
			if(key!="total"){
				var txt1=" <th>"+data[key]["name"]+"</th>"
				$("#tb_top thead tr").append(txt1);
				var txt2= '<td>+'+data[key].income+'</td>';
				$("#tb_top tbody tr.income").append(txt2);
				var txt3= '<td>-'+data[key].expense+'</td>';
				$("#tb_top tbody tr.expend").append(txt3);

			}
		}
	}

};

$(function ($) {
	DealSum.init();
});






