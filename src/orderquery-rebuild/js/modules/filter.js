/**
 * Created by Administrator on 15-11-19.
 */
// var ExcelDown=require("../../exceldown/index.js");
require("../../layer/layer.js");
var Common = require("./common.js");
var common = new Common();
var When = require("./when.js");
var when = new When();
var SortBar = require("./sortbar.js");
var Api = require("./api.js");
var api = new Api();
var Distors = require("./distors.js");
//引入./src/vacationmode/tooltip-msg模块
var VacationMode = require("../../../vacationmode/tooltip-msg");
var DatePicker = require("COMMON/modules/datepicker");
var Filter = RichBase.extend({
	statics : {

	},
	EVENTS : {
		"click" : {
			".mluSelectBox .name_select_box" : "onMluSelectClick",
			"#searchBtn" : "onSearchBtnClick",
			"#timeNodeBox .clear" : "onTimeNodeClick",
			"#timeNodeBox .yestoday" : "onTimeNodeClick",
			"#timeNodeBox .today" : "onTimeNodeClick",
			"#timeNodeBox .week" : "onTimeNodeClick",
			"#timeNodeBox .prevWeek" : "onTimeNodeClick",
			"#timeNodeBox .month" : "onTimeNodeClick",
			"#timeNodeBox .prevMonth" : "onTimeNodeClick",
			"#keywordInp" : "onKeywordClick",
			"#distorsInp" : "onDistorsInpClick",
			"#clearSearchBtn" : "onClearSearchBtnClick",
			"#filter_radioGroup_gmode .radioGroup" : "onFilterRadioGroupGmodeClick"
		},
		"keyup" : {
			"#keywordInp" : "onKeywordKeyUp",
			"#distorsInp" : "onDistorsInpKeyUp"
		},
		"focus" : {
			"#keywordInp" : "onKeywordFocus",
			"#distorsInp" : "onDistorsInpFocus"
		},
		"blur" : {
			"#distorsInp" : "onDistorsInpBlur"
		}
	},
	init : function(){
		var that = this;
		this.container = $("#filterWrap");
		this.timeSelectBox = $("#time_select_box");
		this.timeSelectPop = $("#timeSelectPop");
		this.nameSelectBox = $("#name_select_box");
		this.nameSelectPop = $("#nameSelectPop");
		this.distorSelectPop = $("#distorSelectPop");
		this.searchInp = $("#keywordInp");
		this.distorsInp = $("#distorsInp");
		this.clearSearchBtn = $("#clearSearchBtn");

		this.timeSelectPop.on("click",".select-item",function(e){
			var tarItem = $(e.currentTarget);
			var val = tarItem.attr("data-val");
			var text = tarItem.text();
			that.timeSelectBox.attr("data-val",val).find(".t").text(text);
		})
		this.nameSelectPop.on("click",".select-item",function(e){
			var tarItem = $(e.currentTarget);
			var val = tarItem.attr("data-val");
			var text = tarItem.text();
			var param = tarItem.data("data-param");
			that.nameSelectBox.attr("data-param",param).attr("data-val",val).find(".t").text(text);
			that.searchInp.attr("data-selectval",val);
			if(val==3){
				that.searchInp.val("");
				that.clearSearchBtn.css("display","none");
			}
		});
		this.distorSelectPop.on("click",".distorItem",function(e){
			var tarItem = $(e.currentTarget);
			var id = tarItem.attr("data-id");
			var name = tarItem.text();
			that.distorsInp.val(name).attr("data-distorid",id);
		})

		this.timeSelectPop.children().first().trigger("click");
		this.nameSelectPop.children().first().trigger("click");

		this.sortBar = new SortBar();
		this.sortBar.on("sort.change",function(data){
			that.fire("filter.param.change",that.getFilterParam());
		})

		this.distors = new Distors();

		$(document).on("click",function(){
			that.timeSelectPop.hide();
			that.nameSelectPop.hide();
			that.distors.close();
			that.timeSelectBox.removeClass("on").find(".triBtn").removeClass("on");
			that.nameSelectBox.removeClass("on").find(".triBtn").removeClass("on");
		})

//		$("#datetimepicker_begin").datetimepicker({
//			locale: 'zh-cn',
//			ignoreReadonly : true,
//			startDate : "%y-%M-%d 23:59:59"
//		})
//		$("#datetimepicker_end").datetimepicker({
//			format: 'yyyy-MM-dd HH:mm:ss PP',
//			locale: 'zh-cn',
//			ignoreReadonly : true
//		})




		//导出数据
		$("#exportExeclBtn").on("click",function(e){
			that.onExportBtnClick(that,e);
		})
		//统计
		$("#tongjiBtn").on("click",function(e){
			that.onTongjiBtnClick(that,e)
		})
		window.iframe_name_index=0;
		//2016-09-27  志阳新增 替换新的日历组件
		this.initDatepicker();

		//2016-09-27  志阳新增 假日模式
		VacationMode.init({
			beginTimeHoverTrigger : $("#datetimepicker_begin"),
			endTimeHoverTrigger : $("#datetimepicker_end"),
			reportHoverTrigger : $("#exportExeclBtn")
		});


	},
	initDatepicker : function(){
		var that = this;
		var datepicker = this.datepicker = new DatePicker();
		$("#datetimepicker_begin").on("click",function(e){
			var tarInp = $("#btimeInp");
			var endInp = $("#etimeInp");
			var endtime = endInp.val();
			var date = tarInp.val();
			if(!date) date = DatePicker.CalendarCore.gettoday() + " 00:00:00";
			var max = endtime ? endtime.substr(0,10) : "";
			datepicker.open(date,{
				picker : tarInp,
				todayAfterDisable : false,
				// max : max,
				onAfter : function(val,oldVal){
					var beginDate = val.substr(0,10);
					var endDate = endtime.substr(0,10);
					var queryLimit = $("#queryLimitHidInp").val();
					var queryLimitTip = $("#queryLimitTipHidInp").val();
					var begin_str = +new Date(beginDate);
					var end_str = +new Date(endDate);
					if(endDate && beginDate && queryLimit==1){
						if(end_str-begin_str >= (30*24*60*60*1000)){
							alert(queryLimitTip || "最多只能查询30天以内数据");
							tarInp.val(oldVal);
						}
					}
				}
			});
		})
		$("#datetimepicker_end").on("click",function(e){
			var tarInp = $("#etimeInp");
			var beginInp = $("#btimeInp");
			var beingTime = beginInp.val();
			var beginDate = beingTime.substr(0,10);
			var date = tarInp.val();
			if(!date) date = DatePicker.CalendarCore.gettoday() + " 23:59:59";
			var min = beingTime ? beingTime.substr(0,10) : "";
			datepicker.open(date,{
				picker : tarInp,
				todayAfterDisable : false,
				// min : min,
				onAfter : function(val,oldVal){
					var endDate = val.substr(0,10);
					var queryLimit = $("#queryLimitHidInp").val();
					if(endDate && beginDate && queryLimit==1){
						var begin_str = +new Date(beginDate);
						var end_str = +new Date(endDate);
						var queryLimitTip = $("#queryLimitTipHidInp").val();
						if(end_str-begin_str >= (30*24*60*60*1000)){
							alert(queryLimitTip || "最多只能查询30天以内数据");
							tarInp.val(oldVal);
						}
					}
				}
			});
		})
	},
	getFilterParam : function(){
		
		var result = {};
		var timeSelectBox = this.timeSelectBox;
		var nameSelectBox = this.nameSelectBox;
		result[timeSelectBox.attr("data-param")] = timeSelectBox.attr("data-val");
		result[nameSelectBox.attr("data-param")] = nameSelectBox.attr("data-val");
		//订单状态radio
		var checkRadio = $("#filter_radioGroup_line").find("input:checked");
		var checkRadio_param = checkRadio.attr("data-param");
		var checkRadio_val = checkRadio.attr("data-val");
		if(checkRadio_param && checkRadio_val) result[checkRadio_param] = checkRadio_val;
		//供销渠道radio
		var gx_checkRadio = $("#filter_radioGroup_gmode").find("input:checked");
		var gx_checkRadio_param = gx_checkRadio.attr("data-param");
		var gx_checkRadio_val = gx_checkRadio.attr("data-val");
		if(gx_checkRadio_param && typeof gx_checkRadio_val!=="undefined") result[gx_checkRadio_param] = gx_checkRadio_val;

		//sale_mode select
		var sale_mode_select = $("#sale_mode_select");
		var sale_mode_checkRadio_param = sale_mode_select.attr("name");
		var sale_checkRadio_val = sale_mode_select.val();
		if(sale_mode_checkRadio_param && typeof sale_checkRadio_val!=="undefined") result[sale_mode_checkRadio_param] = sale_checkRadio_val;

		//keyword
		var keywordInp = this.searchInp;
		var keyword = nameSelectBox.attr("data-val")!=="3" ? $.trim(keywordInp.val()) : keywordInp.attr("data-distorid");
		if(keyword) result[keywordInp.attr("data-param")] = keyword;
		//time
		var begintime = $("#btimeInp");
		var endtime = $("#etimeInp");
		var beginTimeVal = $.trim(begintime.val());
		var endTimeVal = $.trim(endtime.val());
		if(beginTimeVal) beginTimeVal = this._fixDateTime(beginTimeVal);
		if(endTimeVal) endTimeVal = this._fixDateTime(endTimeVal);
		result[begintime.attr("data-param")] = beginTimeVal;
		result[endtime.attr("data-param")] = endTimeVal;
		//sort
		var sort = this.sortBar.getParam();
		for(var i in sort) result[i] = sort[i];

		//2016-04-08 将分销商/供应商分离出来
		var distorsInp = this.distorsInp;
		result[distorsInp.attr("data-param")] = distorsInp.attr("data-distorid")
		/*2016.08.11新加代码，加了一个search_type参数*/
		result["search_type"]=$("#fs_select_box span.t").attr("search_type");
		// console.log(result)

		return result;
	},
	_fixDateTime : function(dateTime){
		var result = "";
		if(!dateTime) return false;
		dateTime = $.trim(dateTime);
		var date = dateTime.split(" ")[0];
		var time = dateTime.split(" ")[1];
		var dateArr = date.split("-");
		var year = dateArr[0];
		var month = dateArr[1];
		var day = dateArr[2];
		if(month.length<2) month = "0"+month;
		result = year+"-"+month+"-"+day+" "+time;
		return result;
	},
	onSearchBtnClick : function(that,e){
		$("#tongjiBar").hide();
		that.fire("filter.param.change",that.getFilterParam());
	},
	onMluSelectClick : function(that,e){
		e.stopPropagation();
		var tarBox = $(e.currentTarget);
		var param = tarBox.attr("data-param");
		var selectPop = param=="time_type" ? that.timeSelectPop : that.nameSelectPop;
		if(param=="time_type"){
			selectPop = that.timeSelectPop;
			that.nameSelectPop.hide();
			that.nameSelectBox.removeClass("on").find(".triBtn").removeClass("on");
		}else{
			selectPop = that.nameSelectPop;
			that.timeSelectPop.hide();
			that.timeSelectBox.removeClass("on").find(".triBtn").removeClass("on");
		}
		tarBox.toggleClass("on").find(".triBtn").toggleClass("on");
		if(tarBox.hasClass("on")){
			selectPop.show();
		}else{
			selectPop.hide();
		}
		$("#keywordInp").attr("data-selectval",param);
	},
	onKeywordKeyUp : function(that,e){
		var tarInp = $(e.currentTarget);
		var selectVal = tarInp.attr("data-selectval");
		var val = tarInp.val();
		if(selectVal==3) that.distors.filter(val);
		if(val){
			that.clearSearchBtn.css("display","block");
		}else{
			that.clearSearchBtn.css("display","none");
		}
	},
	onKeywordFocus : function(that,e){
		e.stopPropagation();
		e.preventDefault();
		var tarInp = $(e.currentTarget);
		var selectVal = tarInp.attr("data-selectval");
//		if(selectVal==3) that.distors.show();
	},
	onKeywordClick : function(that,e){
		e.stopPropagation();
		e.preventDefault();
	},
	onDistorsInpClick : function(that,e){
		e.stopPropagation();
		e.preventDefault();
	},
	onClearSearchBtnClick : function(that,e){
		that.clearSearchBtn.css("display","none");
		that.searchInp.val("").focus();
		that.searchInp.attr("data-distorid","");
	},
	onFilterRadioGroupGmodeClick : function(that,e){
		var sale_mode_select = $("#sale_mode_select");
		sale_mode_select.val("0")
	},
	onDistorsInpFocus : function(that,e){
		e.stopPropagation();
		e.preventDefault();
		var tarInp = $(e.currentTarget);
		tarInp.parents(".rt").addClass("active");
		that.distors.show();
	},
	onDistorsInpBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.parents(".rt").removeClass("active");
	},
	onDistorsInpKeyUp : function(that,e){
		var val = $(e.currentTarget).val();
		val = $.trim(val);
		that.distors.filter(val);
	},
	//导出数据
	onExportBtnClick : function(that,e){
		var params = that.getFilterParam();
		var paramArr = [];
		for(var i in params){
			paramArr.push(i+"="+params[i])
		}
		// paramArr.push("excel=1");
		$.ajax({
			url: "module/zax/ProOrder_new.php?",    //请求的url地址
			dataType: "json",   //返回格式为json
			async: true,     //请求是否异步，默认为异步，这也是ajax重要特性
			data: params,    //参数值
			type: "post",   //请求方式
			beforeSend: function() {
				//请求前的处理
			},
			success: function(req) {
				//请求成功时处理
				var pages=Math.ceil(req.total.all_torder/7000);
				if(pages>1){
					openDealData(pages);
				}else{
					downFile(1)
				}
			},
			complete: function() {
				//请求完成的处理
			},
			error: function() {
				//请求出错处理
			}
		});

		function openDealData(pages){
			// var pageHtml="";
			// for(var i=1;i<=pages;i++){
			// 	pageHtml+='<div class="page no_down" index="'+i+'">'+i+'</div>'
			// }
			var htmlc='<div class="pages_wrap">'+
				// '<div class="con">'+pageHtml+'</div>'+
				'<div class="con"></div>'+
				'<div class="clear"></div> </div> <div class="btn_wrap"> <div class="lt"></div> <div class="ok_btn clickable">下载该页</div> <div class="all_btn clickable">下载全部</div> </div>'
			layer.open({
				type: 1,
				title: "数据较多，需分页进行下载，请选择所需页",
				closeBtn: 1,
				// shadeClose: true,
				area: '500px',
				skin: '',
				content: htmlc,
				moveType: 1,
				end:function(){
						$(".select_down_pages .pages_wrap .con").off("click.click_pages");
						$(".select_down_pages .btn_wrap .ok_btn").off("click.ok_down");
						$(".select_down_pages .btn_wrap .all_btn").off("click.down_all")
				}
			});

			/*渲染页码弹出层部分*/
			var okBtn=$(".layui-layer-content .btn_wrap .ok_btn");//下载该页按钮
			var down_all_btn=$(".layui-layer-content .btn_wrap .all_btn");//下载全部 的按钮

			var pageCon= $(".layui-layer-content .pages_wrap .con");
			pageCon.html("");//清空页码容器
			var html="";
			for(var i=1;i<=pages;i++){
				html+='<div class="page no_down" index="'+i+'">'+i+'</div>'
			}
			pageCon.html(html);
			$(".layui-layer-content .btn_wrap .lt").text('*共计 '+pages+' 页，每页约有 '+7000+' 条数据');
			down_all_btn.addClass("clickable");
			okBtn.addClass("clickable");
			down_all_btn.removeClass("notclick");
			okBtn.removeClass("notclick");
			$(".layui-layer-content .pages_wrap .con .no_down").eq(0).addClass("active");//给未下载的第一个页码添加active类
			/*打开页码弹出层*/

			/*页码弹出层事件监听部分*/
			var cur_page;
			pageCon.on("click.click_pages",".no_down",function(){
				$(".layui-layer-content .pages_wrap .con .no_down").removeClass("active");
				cur_page=$(this);
				$(this).addClass("active")
			});
			okBtn.on("click.ok_down",function () {
				var excel_page=$(".layui-layer-content .pages_wrap .con .active").attr("index");
				if(!excel_page){
					down_all_btn.removeClass("clickable");
					okBtn.removeClass("clickable");
					down_all_btn.addClass("notclick");
					okBtn.addClass("notclick");
				}else{
					cur_page=$(".layui-layer-content .pages_wrap .con .active");
					cur_page.removeClass("no_down");
					cur_page.addClass("downed");
					cur_page.removeClass("active");
					downFile(excel_page);
					$(".layui-layer-content .pages_wrap .con .no_down").eq(0).addClass("active");//给未下载的第一个页码添加active类

					excel_page=$(".layui-layer-content .pages_wrap .con .active").attr("index");
					if(!excel_page){
						down_all_btn.removeClass("clickable");
						okBtn.removeClass("clickable");
						down_all_btn.addClass("notclick");
						okBtn.addClass("notclick");
					}
				}
			});
			down_all_btn.on("click.down_all",function(){
				var no_down=$(".layui-layer-content .pages_wrap .con .no_down");
				no_down.removeClass("no_down");
				no_down.removeClass("active");
				no_down.addClass("downed");

				down_all_btn.removeClass("clickable");
				okBtn.removeClass("clickable");
				down_all_btn.addClass("notclick");
				okBtn.addClass("notclick");


				okBtn.off("click.ok_down");
				for(var i=0;i<no_down.length;i++){
					var excel_page=no_down.eq(i).attr("index");
					downFile(excel_page)
				}
			});
		}
		function downFile(excel_page) {
			window.iframe_name_index++;
			// console.log( window.iframe_name_index);
			var iframe_name="iframe"+ window.iframe_name_index;
			var iframe_html=' <iframe class="iframe_down" name="'+iframe_name+'"></iframe>';
			$(".iframe_wrap").append(iframe_html);
			paramArr.push("excel=1");
			paramArr.push("page="+excel_page);
			var downloadUrl = "module/zax/ProOrder_new.php?"  + paramArr.join("&");
			window.open(downloadUrl, iframe_name);
		}
	},
	//统计
	onTongjiBtnClick : function(that,e){
		var tongjiBar = $("#tongjiBar");
		var params = that.getFilterParam();
		var tarBtn = $(e.currentTarget);
		params['total']=1;
		if(tarBtn.hasClass("loading")) return false;
		PFT.Ajax({
			url : "module/zax/ProOrder_new.php",
			type : "post",
			dataType : "json",
			data : params,
			loading : function(){
				tongjiBar.hide();
				tarBtn.addClass("loading").find("a").text("正在统计...");
			},
			removeLoading : function(){
				tarBtn.removeClass("loading").find("a").text("查看统计");
			},
			timeout : function(){
				alert("请求超时，请稍后重试");
			},
			serverError : function(){
				alert("请求出错，请稍后重试");
			}
		},function(res){
			var msg = res.msg;
			var list = res.list;
			if(msg==200 && list){
				var torder = list.torder || "-";
				var tnum = list.tnum || "-";
				///买入金额
				var money_buy = list.money_1 || "-";
				//卖出金额
				var money_sell = list.money || "-";
				$("#total_order").html(torder);
				$("#total_num").html(tnum);
				$("#total_money_buy").html(money_buy);
				$("#total_money_sell").html(money_sell);
				$("#total_money").html(money_sell)
				tongjiBar.show();
			}else{
				tongjiBar.hide();
				alert(msg);
			}
		})
	},
	onTimeNodeClick : function(that,e){
		if(!common.canAjax) return false;
		var tarBtn = $(e.currentTarget);
		var btime = $("#btimeInp");
		var etime = $("#etimeInp");
		var now = new Date();
		var hour = now.getHours();
		var minus = now.getMinutes();
		var seconds = now.getSeconds();
		if(seconds<10) seconds = "0"+seconds;
		var begintime = " 00:00:00";
		var endtime = " 23:59:59";
		if(hour<10) hour = "0"+hour;
		if(minus<10) minus = "0"+minus;
		// var nowtime = " "+hour+":"+minus+":"+seconds;
		//2016.9.2需求更改，今天的结束时间为23：59:59
		var nowtime=" 23:59:59";
		if(tarBtn.hasClass("clear")){
			btime.val("");
			etime.val("");
		}else if(tarBtn.hasClass("yestoday")){
			var yestoday = when.yestoday();
			btime.val(yestoday + begintime);
			etime.val(yestoday + endtime);
		}else if(tarBtn.hasClass("today")){
			var today = when.today();
			btime.val(today + begintime);
			etime.val(today + nowtime);
		}else if(tarBtn.hasClass("week")){
			var week = when.week();
			btime.val(week[0]+begintime);
			etime.val(week[1]+endtime);
		}else if(tarBtn.hasClass("prevWeek")){
			var prevWeek = when.lastweek();
			btime.val(prevWeek[0]+begintime);
			etime.val(prevWeek[1]+endtime);
		}else if(tarBtn.hasClass("month")){
			var month = when.month();
			btime.val(month[0]+begintime);
			etime.val(month[1]+endtime);
		}else if(tarBtn.hasClass("prevMonth")){
			var prevMonth = when.lastmonth();
			btime.val(prevMonth[0]+begintime);
			etime.val(prevMonth[1]+endtime);
		}
		$("#tongjiBar").hide();
		that.fire("filter.param.change",that.getFilterParam());
	}

});
module.exports = Filter;