/**
 * Author: huangzhiyang
 * Date: 2016/7/29 9:32
 * Description: ""
 */
require("./index.scss");
var tpl=require("./index.xtpl");
var Calendar = require("COMMON/modules/calendar");
var Pagination = require("COMMON/modules/pagination");
var Select = require("COMMON/modules/select");
require("COMMON/modules/DragConOver")($);



var DealSum={
	//初始化
	init:function(){
		var _this=this;
		$(".dealsum_box").html(tpl);
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
		this.trader_inp=$("#trader");
		this.clear_btn=$(".clear_trader_box");
		this.toExcel=$("#to_excel");
		this.iframe_index=0;//定义iframe的索引；
		this.present_page=1;
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
		//获取昨天的日期
		this.yestoday=new Date(now.getTime() -24 * 3600 * 1000).Format("yyyy-MM-dd");
		//获取明天的日期
		this.tomorrow = new Date(now.getTime() +24 * 3600 * 1000).Format("yyyy-MM-dd");
		//获取上周的日期
		this.lastWeek = new Date(now.getTime() - 7 * 24 * 3600 * 1000).Format("yyyy-MM-dd");
		//获取上月的日期
		this.lastMonth = new Date(now.getTime() - 30 * 24 * 3600 * 1000).Format("yyyy-MM-dd");
		//初始化input内容
		this.stime_inp.val(_this.lastWeek);
		this.etime_inp.val(_this.yestoday);
		//日历插件部分
		var calendar = new Calendar();
		this.stime_inp.on("click",function(e){
			var max_day=_this.etime_inp.val();
			max_day=new Date( Date.parse(max_day.replace(/-/g,'/'))+24 * 3600 * 1000 ).Format("yyyy-MM-dd");

			calendar.show(_this.stime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $("#start_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                       //日历box偏移量
				left : 0,                     //日历box偏移量
				// min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
				max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			});
			return this;
		});
		this.etime_inp.on("click",function(e){
			var min_day=_this.stime_inp.val();
			// console.log(   new Date( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).Format("yyyy-MM-dd")   );
			min_day=new Date( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).Format("yyyy-MM-dd");

			calendar.show(_this.etime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
				picker : $("#end_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
				top : 0,                       //日历box偏移量
				left : 0,                     //日历box偏移量
				min : min_day,              //2016-06-20往前的日期都不可选 会自动挂上disable类名
				max : _this.today,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
				onBefore : function(){},     //弹出日历前callback
				onAfter : function(){}       //弹出日历后callback
			})
		});
		/*》》》如果账户为管理员，显示交易用户搜索框*/
		/*查询是否为管理员*/
		$.ajax({
			url: "/r/Finance_TradeRecord/isMaster",    //请求的url地址
			dataType: "json",                        //返回格式为json
			async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
			data: {                                    //参数值

			},
			type: "GET",                               //请求方式
			beforeSend: function() {
				//请求前的处理
			},
			success: function(req) {
				console.log(req.code);
				if(req.code==0){
					$(".dealsumContainer .dealTimeBox .line1").css("display","block");
					var select=new Select({
						source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
						ajaxType : "get",
						ajaxParams : {
							action : "fuzzyGetDname_c",
							dtype : "1",
							danme : ""
						},
						filterType : "ajax",  //指定过滤方式为ajax
						field : {
							id : "id",
							name : "dname",
							keyword : "dname"
						},
						trigger : $(".dealsumContainer .dealTimeBox .line1 .rt input"),

						filter : true,
						adaptor : function(res){
							var reslut = { code:200};
							reslut["data"] = res;
							return reslut;
						}
					});
				}
			},
			complete: function() {
				//请求完成的处理
			},
			error: function() {
				//请求出错处理
			}
		});
		/*《《《如果账户为管理员，显示交易用户搜索框*/
		this.bind();
		this.query_btn.click();
		// 表格拖动部分
		$("#tb_top").DragConOver({
			direction:"x",
			callBack:function(dValue){

				clearTimeout(_this.timer)

				if($(".tb_bottom_box").css("display")=="block"){

					$("#tb_bottom").css("left",$("#tb_bottom").position().left+dValue.x+"px")
				}

			}
		});
		$("#tb_bottom").DragConOver({
			direction:"x",
			callBack:function(dValue){
				clearTimeout(_this.timer)
				$("#tb_top").css("left",$("#tb_top").position().left+dValue.x+"px")
			}
		});
		//右侧点击滚动按钮
		this.roll_right_btn.mousedown(function(){
			clearTimeout(_this.timer)
			_this.timer=setInterval(function () {
				if($(".tb_bottom_box").css("display")=="block") {
					$("#tb_bottom").css("left", $("#tb_bottom").position().left - 2 + "px");
				}
				$("#tb_top").css("left",$("#tb_top").position().left-2+"px");
				// _this.roll_left_btn.css("display","block");
				//下面两个if的意思是不让表格向左移动出容器
				if(Math.abs($("#tb_top").position().left)>Math.abs($("#tb_top").outerWidth()-$("#tb_top").offsetParent().innerWidth())){
					if($(".tb_bottom_box").css("display")=="block") {
						$("#tb_bottom").css("left", -Math.abs($("#tb_bottom").outerWidth() - $("#tb_bottom").offsetParent().innerWidth()) + "px")
					}
					$("#tb_top").css("left",-Math.abs($("#tb_top").outerWidth()-$("#tb_top").offsetParent().innerWidth())+"px")
					// _this.roll_left_btn.css("display","none");
				}
				if($("#tb_top").offsetParent().innerWidth()-$("#tb_top").innerWidth()>=0){
					if($(".tb_bottom_box").css("display")=="block") {
						$("#tb_bottom").css("left", "0");
					}
					$("#tb_top").css("left","0");
					// _this.roll_right_btn.css("display","none");
				}
			},1);
			$(document).mouseup(function(){
				clearTimeout(_this.timer);
				$(document).unbind();
			});
		});
		//左侧点击滚动按钮
		this.roll_left_btn.mousedown(function(){
			clearTimeout(_this.timer)
			_this.timer=setInterval(function(){
				if($(".tb_bottom_box").css("display")=="block") {
					$("#tb_bottom").css("left", $("#tb_bottom").position().left + 2 + "px");
				}
				$("#tb_top").css("left",$("#tb_top").position().left+2+"px");
				// _this.roll_right_btn.css("display","block");
				//下面的if是意思是不让表格向右移动出容器、
				if($("#tb_top").position().left>0){
					if($(".tb_bottom_box").css("display")=="block") {
						$("#tb_bottom").css("left", "0");
					}
					$("#tb_top").css("left","0");
					// _this.roll_left_btn.css("display","none");
				}
			},1)
			$(document).mouseup(function(){
				clearTimeout(_this.timer);
				$(document).unbind();
			});
		})
	},
	//事件绑定
	bind:function(){
		var _this=this;
		this.rweek_span.click(function () {
			_this.stime_inp.val(_this.lastWeek);
			_this.etime_inp.val(_this.yestoday);
		});
		this.rmonth_span.click(function(){
			_this.stime_inp.val(_this.lastMonth);
			_this.etime_inp.val(_this.yestoday);
		});
		$("#deal_count").click(function () {
			_this.dealType=0;
		});
		$("#deal_trade").click(function () {
			_this.dealType=1;
		});
		this.query_btn.click(function () {
			//两个ajax,第一个请求汇总数据，第二个请求每日详细数据
			$.ajax({
				url: "/r/Finance_TradeRecord/getListForTradeRecord/",    //请求的url地址
				dataType: "json",                        //返回格式为json
				async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
				data: {                                    //参数值
					"search_type": _this.dealType,
					"btime":_this.stime_inp.val(),
					"etime":_this.etime_inp.val(),
					"page":1,
					"searchFid":_this.trader_inp.attr("data-id")
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
					$.ajax({
						url: "/r/Finance_TradeRecord/getListDetail/",    //请求的url地址
						dataType: "json",                        //返回格式为json
						async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
						data: {                                    //参数值
							"search_type": _this.dealType,
							"btime":_this.stime_inp.val(),
							"etime":_this.etime_inp.val(),
							"page":1,
							"searchFid":_this.trader_inp.attr("data-id")
						},
						type: "GET",                               //请求方式
						beforeSend: function() {
							//请求前的处理
						},
						success: function(req) {
							_this.dealDataTB2(req)
						},
						complete: function() {
							//请求完成的处理
						},
						error: function() {
							//请求出错处理
							alert("请求出错了！")
						}
					});
				},
				error: function() {
					//请求出错处理
					alert("请求出错了！")
				}
			});



			$("#tb_top").css("left","0");

			$("#tb_bottom").css("left","0");

			_this.diffDays=_this.GetDateDiff(_this.stime_inp.val(),_this.etime_inp.val());
			var p=new Pagination({
				"id":"pag_box",                                     //分页器盒子的容器
				"data_total_num":_this.diffDays,                   //数据总数量
				"per_page_num":10,                                  //每页显示的数据条数
				"present_page":1,                                   //当前页数
				"callBack":function (present_page) {               //用户点击按钮时的回调函数，参数为当前分页器的页码；
					_this.present_page=present_page;
					$.ajax({
						url: "/r/Finance_TradeRecord/getListDetail/",    //请求的url地址
						dataType: "json",                        //返回格式为json
						async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
						data: {                                    //参数值
							"search_type": _this.dealType,
							"btime":_this.stime_inp.val(),
							"etime":_this.etime_inp.val(),
							"page":present_page,
							"searchFid":_this.trader_inp.attr("data-id")
						},
						type: "GET",                               //请求方式
						beforeSend: function() {
							//请求前的处理
						},
						success: function(req) {
							_this.dealDataTB2(req)
						},
						complete: function() {
							//请求完成的处理
						},
						error: function() {
							//请求出错处理
							alert("请求出错了！")
						}
					});
			}
			})

		});
		this.day_detail_btn.click(function () {
			$(".tb_bottom_box").stop(true,true);
			$(".tb_bottom_box").fadeToggle("20");
			$("#pag_box").fadeToggle("20");
			$("#day_detail_btn").toggleClass("day_detail_btn2");
			$("#day_detail_btn").toggleClass("day_detail_btn1")
			if($(".tb_bottom_box").css("display")=="block") {
				$("#tb_bottom").css("left", $("#tb_top").position().left + "px");
			}


		});
		// this.trader_inp.on("input propertychange",function(){
		// 	console.log("bianhuale")
		// 	if($(this).val()!=""){
		// 		_this.clear_btn.css("display","block");
		// 	}else{
		// 		_this.clear_btn.css("display","none");
		// 	}
		// });
		this.clear_btn.on("click",function () {
			_this.trader_inp.val("");
			_this.trader_inp.attr("data-id","")
		});
		//导出
		this.toExcel.on("click",function () {

			var paramsArr=[];
			var params={
				"search_type": _this.dealType,
				"btime":_this.stime_inp.val(),
				"etime":_this.etime_inp.val(),
				"page":_this.present_page,
				"searchFid":_this.trader_inp.attr("data-id")||"",
				"flag":1
			};
			for(var key in params){
				var str=key+"="+params[key];
				paramsArr.push(str);
			}
			console.log(paramsArr);
			console.log(paramsArr.join("&"));


			var url='/r/Finance_TradeRecord/exportExcelTrade/?'+paramsArr.join("&");
			_this.iframe_index++;
			var name='iframe'+_this.iframe_index;
			var html='<iframe class="iframe_downfile" name="'+name+'"></iframe>';
			$(".iframe_wrap").append(html);
			window.open(url,name)
		})
	},
	//处理上表数据
	dealDataTB1:function (req) {
         
		//定义一个容纳表头name类型的数组
		this.theadNametype=[];
		if(req.data==false){
			alert("数据错误");
			return false;
		}
		this.totalIncome_span.text(req.data.total.totalIncome);
		this.totalExpend_span.text(req.data.total.totalExpense);

		$("#tb_top thead tr").empty();//清空顶部表格表头
		$("#tb_bottom thead tr").empty();//清空底部表格表头
		$("#tb_top tbody tr.income").empty();//清空顶部表格第“收入”行
		$("#tb_top tbody tr.expend").empty();//清空顶部表格“支出”行
		var data=req.data;
		for(var key in data){
			if(key!="total"){
				var txt1=" <th>"+data[key]["name"]+"</th>";
				this.theadNametype.push(key);
				$("#tb_top thead tr").append(txt1);
				$("#tb_bottom thead tr").append(txt1);

				var txt2_in, txt2="";
				if(data[key].income==null||data[key].income==0){
					txt2_in=0;
					txt2= '<td class="zero_data_td">+'+txt2_in+'</td>';
				}else{
					txt2_in=data[key].income;
					txt2= '<td>+'+txt2_in+'</td>';
				}
				$("#tb_top tbody tr.income").append(txt2);

				var txt3_out, txt3;
				if(data[key].expense==null||data[key].expense==0){
					txt3_out=0;
					txt3= '<td class="zero_data' +
						'_td">-'+txt3_out+'</td>'
				}else{
					txt3_out=data[key].expense;
					txt3='<td>-'+txt3_out+'</td>';
				}

				$("#tb_top tbody tr.expend").append(txt3);

			}
		}
	},
	//处理下表数据
	dealDataTB2:function (req){

		var _this=this;

		$(".tb_bottom_box .lt .lt_con").empty();//清空底部表格左边时间收入支出内容
		$("#tb_bottom tbody ").empty();//清空底部表格tbody
		$(".tb_bottom_box .rt_r .con").empty();


		var data=req.data;

		var theadArr=_this.theadNametype;


		var isNothing=true;
		for(var key in data){
			var html = "";
			// if(data[key].length!=0||1){
				isNothing=false;
				$('.dealsumContainer .tb_bottom_box .nodata').css("display","none");

				//加时间
				var leftPart = "";
				var tim=key;
				if(tim!=undefined){
					tim="20"+tim;
					//20150808
					tim=tim.substr(0,4)+"-"+tim.substr(4,2)+"-"+tim.substr(6,2);
				}else{
					tim="日期不见了"
				}
				leftPart += '<div class="line"><div class="tr_time">'+tim+'</div>';
				// $(".tb_bottom_box .lt .lt_con").append(txt1);
				//加每日总收入

				var txt2Value=data[key].income!=undefined?data[key].income:0;
				// var txt2='<div class="tr_income">+'+txt2Value+'</div>';
				// $(".tb_bottom_box .lt .lt_con").append(txt2);
				leftPart += '<div class="tr_income">+'+txt2Value+'</div>';

				//加每日总支出
				var txt3Value=data[key].expense!=undefined?data[key].expense:0;
				var txt3=' <div class="tr_expend">-'+txt3Value+'</div></div>';

				leftPart += txt3;

				$(".tb_bottom_box .lt .lt_con").prepend(leftPart);

                var incomeCon="",expendCon="",in_ex_con="";
				for(var i=0;i<theadArr.length;i++){
					var ishere=false;
					for(var key2 in data[key]){
						if(theadArr[i]==[key2]){
							ishere=true;
							incomeCon+='<td>+'+data[key][key2].income+'</td>';
							expendCon+='<td>-'+data[key][key2].expense+'</td>';
						}
					}
					if(ishere===false){
						incomeCon+='<td class="zero_data_td">+'+0+'</td>';

						expendCon+='<td class="zero_data_td">-'+0+'</td>';
					}
				}

			    in_ex_con=' <tr class="income" title="当日收入">'+incomeCon+'</tr>'+' <tr class="expend" title="当日支出">'+expendCon+'</tr>';
				// //加收入tr
				// $("#tb_bottom tbody").append(' <tr class="income" title="当日收入">'+incomeCon+'</tr>');
				// //加支出tr
				// $("#tb_bottom tbody").append(' <tr class="expend" title="当日支出">'+expendCon+'</tr>');

			    $("#tb_bottom tbody").prepend( in_ex_con );
				
				//在右侧加空div

				$(".tb_bottom_box .rt_r .con").append('<div class="tr"></div>');



			}
		// }
		if(isNothing){
			// $("#tb_bottom tbody").html("<span class='nodata'>未查询到数据......</span>")
			$('.dealsumContainer .tb_bottom_box .nodata').css("display","block");
		}
	},
	//计算两个日期间的天数
	GetDateDiff:function(startDate,endDate) {
		var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
		var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
		var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
		return  dates;
	}
};
$(function ($) {
	DealSum.init();
});






