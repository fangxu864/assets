/**
 * Author: huangzhiyang
 * Date: 2016/7/19 17:41
 * Description: ""
 */
require("./index.scss");
var PaginationSimple = require("COMMON/modules/pagination-simple");
var Calendar = require("COMMON/modules/calendar");
var Loading = require("COMMON/js/util.loading.pc.js");
var RedpacketWithdraw=function(){
	this.now = new Date(); //当前日期
	this.nowDayOfWeek = this.now.getDay(); //今天本周的第几天
	this.nowDay = this.now.getDate(); //当前日
	this.nowMonth =this.now.getMonth(); //当前月
	this.nowYear = this.now.getFullYear(); //当前年
	this.lastMonthDate = new Date(); //上月日期
	this.lastMonthDate.setDate(1);
	this.lastMonthDate.setMonth(this.lastMonthDate.getMonth()-1);
	this.lastMonth = this.lastMonthDate.getMonth();
	this.initialize();
}
RedpacketWithdraw.prototype={
	__cache : {
		today : null,
		thisweek : null,
		lastweek : null,
		thismonth : null,
		lastmonth : null
	},
	initialize:function(){
		var that=this;
		this.queryBtn=$("#queryBtn");
		this.checkBtn=$("#checkSta");
		this.queryInp=$("#queryInp");
		this.datePickerInp=$(".datePickerInp");
		this.fromDateInp=$("#fromDate");
		this.toDateInp=$("#toDate");
		this.beginTime= $.trim(that.fromDateInp.val())
		this.endTime= $.trim(that.toDateInp.val())
		this.todayBtn=$("#today");
		this.thisWeekBtn=$("#thisWeek");
		this.lastWeekBtn=$("#lastWeek");
		this.thisMonthBtn=$("#thisMonth");
		this.lastMonthBtn=$("#lastMonth");

		this.Calendar = new Calendar();
		this.Calendar.on("select",function(data){});
		this.pagination = new PaginationSimple({
			container : $("#paginationContainer"),
			keyup : false
		})
		this.pagination.on("next",function(data){
			var toPage = data.toPage;
			that.getAnnualCardList(toPage);
		})
		this.pagination.on("prev",function(data){
			var toPage = data.toPage;
			that.getAnnualCardList(toPage);
		})
		this.fromDateInp.val(that.getWeekStartDate());
		this.toDateInp.val(that.getWeekEndDate());
		this.getWithdrawRecord("thisweek");
		this.bindEvent();
	},
	bindEvent:function(){
		var that=this;
		this.queryBtn.on("click",function(e){
			var tarBtn=$(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			that.getWithdrawRecord();
		})
		this.queryInp.on("keyup",function(e){
			if(e.keyCode==13) that.getWithdrawRecord();
		})
		this.checkBtn.on("click",function(e){
			var tarBtn=$(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			$("#recordBox").toggle();
		})
		this.datePickerInp.on("focus",function(e){
			var calendar = that.Calendar;
			var tarInp=$(e.currentTarget);
			var date=tarInp.val();
			var siblingInp=tarInp.siblings(".datePickerInp");
			var siblingDate = siblingInp.val();
			var opt = {
				picker : tarInp,
				top : 1
			};
			if(tarInp.hasClass("begin") && siblingDate){
				opt["max"] = siblingDate;
			}else if(tarInp.hasClass("end")){
				opt["min"] = siblingDate;
			}
			calendar.show(date,opt);
		})
		this.todayBtn.on("click",function(e){
			that.fromDateInp.val(that.formatDate(that.now));
			that.toDateInp.val(that.formatDate(that.now));
			if(!that.__cache.today){
				that.getWithdrawRecord("today");
			}else{
				that.renderList(that.__cache.today.list);
				that.getRecordAndSum();
			}
		})
		this.thisWeekBtn.on("click",function(e){
			that.fromDateInp.val(that.getWeekStartDate());
			that.toDateInp.val(that.getWeekEndDate());
			if(!that.__cache.thisweek){
				that.getWithdrawRecord("thisweek");
			}else{
				that.renderList(that.__cache.thisweek.list);
				that.getRecordAndSum();
			}
		})
		this.lastWeekBtn.on("click",function(e){
			that.fromDateInp.val(that.getLastWeekStartDate());
			that.toDateInp.val(that.getLastWeekEndDate());
			if(!that.__cache.lastweek){
				that.getWithdrawRecord("lastweek");
			}else{
				that.renderList(that.__cache.lastweek.list);
				that.getRecordAndSum();
			}
		})
		this.thisMonthBtn.on("click",function(e){
			that.fromDateInp.val(that.getMonthStartDate());
			that.toDateInp.val(that.getMonthEndDate());
			if(!that.__cache.thismonth){
				that.getWithdrawRecord("thismonth");
			}else{
				that.renderList(that.__cache.thismonth.list);
				that.getRecordAndSum();
			}
		})
		this.lastMonthBtn.on("click",function(e){
			that.fromDateInp.val(that.getLastMonthStartDate());
			that.toDateInp.val(that.getLastMonthEndDate());
			if(!that.__cache.lastmonth){
				that.getWithdrawRecord("lastmonth");
			}else{
				that.renderList(that.__cache.lastmonth.list);
				that.getRecordAndSum();
			}
		})
	},

	getRecordAndSum: function(){
		var sumNum=0;
		var recordNum=$("#withdrawList").children("tr").length;
		$("#recordNum").text(recordNum);
		$("#withdrawList .withdrawNum").each(function(){
			sumNum+=parseInt($(this).text());
		})
		$("#sumNum").text(sumNum);
	},
	getWithdrawRecord:function(dateType,page,pagesize){
		var that=this;
		var begintime=$.trim(that.fromDateInp.val())
		var endtime= $.trim(that.toDateInp.val())
		page = page || 1;
		pagesize = pagesize || 10;
		PFT.Util.Ajax("/r/Mall_AllDis/redpackList/",{
			params:{
				beginTime:begintime,
				endTime:endtime,
				page:page,
				pageSize:pagesize
			},
			loading:function(){
				var html = Loading("努力加载中，请稍后...",{
					id : "withdrawListLoading",
					width : 798
				});
				$("#LoadingBox").append(html);
			},
			complete:function(){
				$("#withdrawListLoading").remove();
			},
			success:function(res){
				res=res||{};
				var data=res.data;
				var list=data.list;
				var currentPage = data.cur_page;
				var totalPage = data.total_page;
				var total = data.total;
				if(res.code==200){
					that.renderList(list);
					that.getRecordAndSum();
					that.pagination.render({current:currentPage,total:totalPage});

					if(dateType=="today"){
						that.__cache.today = data;
					}
					if(dateType=="thisweek"){
						that.__cache.thisweek = data;
					}
					if(dateType=="lastweek"){
						that.__cache.lastweek = data;
					}
					if(dateType=="thismonth"){
						that.__cache.thismonth = data;
					}
					if(dateType=="lastmonth"){
						that.__cache.lastmonth = data;
					}
				}
				else{
					alert(res.msg);
				}
			}
		})
	},
	renderList:function(list){
		var that=this;
		var html="";
		for(var i in list){
			var d=list[i];
			var create_time=d["create_time"];
			var date=new Date(parseInt(create_time));
			var time=that.formatTime(date);
			var supply=d["supply"];
			var name=d["nickname"];
			var type=d["type"];
			var way;
			if(type==1){way="手动提现" }else{way="自动发放"}
			var money=d["money"];
			var sum=money/100;
			var keyword= $.trim(that.queryInp.val());
			if(supply.indexOf(keyword)>-1){
				html+='<tr>';
				html+='<td>'+time+'</td>';
				html+='<td>'+supply+'</td>';
				html+='<td>'+name+'</td>';
				html+='<td>'+way+'</td>';
				html+='<td class="withdrawNum">'+sum+'</td>';
				html+='</tr>';
			}
		}
		if(html){
			$("#withdrawList").html(html);
			$("#noMatch").text("");
			that.pagination.show();
		}
		else{
			$("#withdrawList").html('');
			$("#noMatch").text("无匹配商户");
			that.pagination.hide();
		}
	},
	formatDate:function(date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth()+1;
		var myweekday = date.getDate();

		if(mymonth < 10){
			mymonth = "0" + mymonth;
		}
		if(myweekday < 10){
			myweekday = "0" + myweekday;
		}
		return (myyear+"-"+mymonth + "-" + myweekday);
	},
	getMonthDays:function(myMonth){
		var that=this;
		var monthStartDate = new Date(that.nowYear, myMonth, 1);
		var monthEndDate = new Date(that.nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
		return days;
	},

	//本周
	getWeekStartDate:function() {
		var that=this;
		var weekStartDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek+1);
		return this.formatDate(weekStartDate);
	},
	getWeekEndDate:function() {
		var that=this;
		var weekEndDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek+7);
		return this.formatDate(weekEndDate);
	},
	//上周
	getLastWeekStartDate:function() {
		var that=this;
		var weekStartDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek-6);
		return this.formatDate(weekStartDate);
	},
	getLastWeekEndDate:function() {
		var that=this;
		var weekEndDate = new Date(that.nowYear, that.nowMonth, that.nowDay - that.nowDayOfWeek);
		return this.formatDate(weekEndDate);
	},
	//本月
	getMonthStartDate:function(){
		var that=this;
		var monthStartDate = new Date(that.nowYear, that.nowMonth, 1);
		return this.formatDate(monthStartDate);
	},
	getMonthEndDate:function(){
		var that=this;
		var monthEndDate = new Date(that.nowYear, that.nowMonth, that.getMonthDays(that.nowMonth));
		return this.formatDate(monthEndDate);
	},
	//上月
	getLastMonthStartDate:function(){
		var that=this;
		var lastMonthStartDate = new Date(that.nowYear, that.lastMonth, 1);
		return this.formatDate(lastMonthStartDate);
	},
	getLastMonthEndDate:function(){
		var that=this;
		var lastMonthEndDate = new Date(that.nowYear, that.lastMonth, that.getMonthDays(that.lastMonth));
		return this.formatDate(lastMonthEndDate);
	},
	//格式化创建时间
	formatTime:function(now){
		var   year=now.getFullYear();
		var   month=now.getMonth()+1;
		var   date=now.getDate();
		var   hour=now.getHours();
		var   minute=now.getMinutes();
		var   second=now.getSeconds();
		if(month < 10){
			month = "0" + month;
		}
		if(date < 10){
			date = "0" + date;
		}
		if(hour < 10){
			hour = "0" + hour;
		}
		if(minute < 10){
			minute = "0" + minute;
		}
		if(second < 10){
			second = "0" + second;
		}
		return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
	}

}
$(function(){
	new RedpacketWithdraw();
})