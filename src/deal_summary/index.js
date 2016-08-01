/**
 * Author: huangzhiyang
 * Date: 2016/7/29 9:32
 * Description: ""
 */
require("./index.scss");
var PaginationSimple = require("COMMON/modules/pagination-simple");
var Calendar = require("COMMON/modules/calendar");
var Loading = require("COMMON/js/util.loading.pc.js");
var DealSummary=function(){
	this.now = new Date(); //当前日期
	this.nowDayOfWeek = this.now.getDay(); //今天本周第几天
	this.nowDay = this.now.getDate(); //当前日
	this.nowMonth =this.now.getMonth(); //当前月
	this.nowYear = this.now.getFullYear(); //当前年
	this.initialize();
}
DealSummary.prototype={
	__cache:{
		fromDate:null,
		toDate:null,
		searchType:null
	},
	initialize:function(){
		var that=this;
		this.queryBtn=$("#queryBtn");
		this.summaryBtn=$("#summaryDetailBtn");
		this.queryInp=$("#queryInp");
		this.datePickerInp=$(".datePickerInp");
		this.fromDateInp=$("#fromDate");
		this.toDateInp=$("#toDate");
		this.beginTime= $.trim(that.fromDateInp.val())
		this.endTime= $.trim(that.toDateInp.val())
		this.thisWeekBtn=$("#thisWeek");
		this.thisMonthBtn=$("#thisMonth");
		this.totalIncome=$("#totalIncome");
		this.totalExpend=$("#totalExpend");

		this.Calendar = new Calendar();
		this.Calendar.on("select",function(data){});
		this.pagination = new PaginationSimple({
			container : $("#paginationContainer"),
			keyup : false
		})
		this.pagination.on("next",function(data){
			var toPage = data.toPage;
			that.getListDetail(toPage);
		})
		this.pagination.on("prev",function(data){
			var toPage = data.toPage;
			that.getListDetail(toPage);
		})
		//this.pagination.show();
		this.fromDateInp.val(that.getWeekStartDate());
		this.toDateInp.val(that.getWeekEndDate());
		this.getListForTradeRecord(0);
		this.bindEvent();
	},
	bindEvent:function(){
		var that=this;
		this.queryBtn.on("click",function(e){
			var tarBtn=$(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var search_type;
			if($("#dealAccount:checked").length){
				search_type=0;
			}else{
				search_type=1;
			}
			that.getListForTradeRecord(search_type);
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
		this.thisWeekBtn.on("click",function(e){
			that.fromDateInp.val(that.getWeekStartDate());
			that.toDateInp.val(that.getWeekEndDate());
		})
		this.thisMonthBtn.on("click",function(e){
			that.fromDateInp.val(that.getMonthStartDate());
			that.toDateInp.val(that.getMonthEndDate());
		})
		this.summaryBtn.on("click",function(e){
			var tarBtn=$(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			$("#sumDetailTable").toggle();
		})
	},
	getListForTradeRecord :function(search_type){
		var that=this;
		var begintime=$.trim(that.fromDateInp.val())
		var endtime= $.trim(that.toDateInp.val())
		PFT.Util.Ajax("/r/Finance_TradeRecord/getListForTradeRecord/",{
			params : {
				btime : begintime,
				etime : endtime,
				search_type:search_type
			},
			loading:function(){},
			complete:function(){},
			success:function(res){
				res=res||{};
				var data=res.data;
				if(res.code==200){
					that.renderTotal(data);
				}
				else{
					alert(res.msg);
				}
			}
		})
	},
	renderTotal:function(data){
		var that=this;
		var total=data.total;
		for(var i in total){
			var t=total[i];
			var totalIncome=t["totalIncome"];
			var totalExpense=t["totalExpense"];
		}
		that.totalIncome.text(totalIncome);
		that.totalExpend.text(totalExpense);
	},
	getListDetail:function(search_type){
		var that=this;
		var begintime=$.trim(that.fromDateInp.val())
		var endtime= $.trim(that.toDateInp.val())
		PFT.Util.Ajax("/r/Finance_TradeRecord/getListDetail/",{
			params : {
				btime : begintime,
				etime : endtime,
				search_type:search_type,
				account_type:-1
			},
			loading:function(){},
			complete:function(){},
			success:function(res){
				res=res||{};
				var data=res.data;
				if(res.code==200){
					that.renderTotal(data);
				}
				else{
					alert(res.msg);
				}
			}
		})
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
	}
}
$(function(){
	new DealSummary();
})