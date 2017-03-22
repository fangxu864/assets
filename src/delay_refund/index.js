
require("./index.scss")
// 组件
var Dialog = require("COMMON/modules/dialog-simple");  //遮罩框
var Loading = require("COMMON/js/util.loading.pc.js");
var Datapicker = require("COMMON/modules/datepicker");  //精确到秒的日历组件
//tpl
var listTpl = require("./tpl/list.xtpl");
var agreeDialogTpl = require("./tpl/agreeDislogCon.xtpl");
var disagreeDialogTpl = require("./tpl/disagreeDislogCon.xtpl");
//开始
var Main =  PFT.Util.Class({
    container : $("#delayRefund"),  
    EVENTS : {                    
		"click #searchBtn2" : "onsearch"
    },
    init : function(opt){         
		var that = this;
		this.page = 1;
		this.listTemplate = PFT.Util.ParseTemplate(listTpl);  
		this.loading = Loading("请稍等",{
			height : 100
		});
		//初始化遮罩框
        this.agreeDialog = new Dialog({
			header : '<span class="dialogHeader">同意</span>',
            width : 420,
            height : 320,
            closeBtn : true,
            content : agreeDialogTpl,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46
        });
		this.disagreeDialog = new Dialog({
			header : '<span class="dialogHeader">拒绝</span>',
            width : 420,
            height : 320,
            closeBtn : true,
            content : disagreeDialogTpl,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46
        });
		this.bindEvent();
    },
	bindEvent : function(){
		var that = this;
		//同意弹窗
		$("#agreeDialog .dialog-btn.yes").on("click",function(){
			that.agree();
		});
		$("#agreeDialog .dialog-btn.no").on("click",function(){
			//发送请求
			that.agreeDialog.close();
		});
		//不同意弹窗
		$("#disagreeDialog .dialog-btn.yes").on("click",function(){
			// 发送请求
			that.disagree();
		});
		$("#disagreeDialog .dialog-btn.no").on("click",function(){
			that.disagreeDialog.close();
		});
	},
	agree : function(){
		var that = this;
		var memo = that.agreeDialog.container.find("#dialog_reson_textarea1").val();
		var id = that.agreeDialog.container.attr("data-id");
		PFT.Util.Ajax("/r/Order_Handler/manualRefund",{
			type : "POST",
			dataType : "json",
			params : {
				id : id,
				memo : memo
			},
			loading : function(){
				$("#tempInfo").html(that.loading);
			},
			complete : function(){
				$("#tempInfo").html("暂无信息");
			},
			success : function(res){
			},
			timeout : function(){ alert("请求超时") },
			serverError : function(){ alert("请求出错")}
		})
	},
	disagree : function(){
		var that = this;
		var memo = that.disagreeDialog.find("#dialog_reson_textarea2").val();
		var id = that.disagreeDialog.container.attr("data-id");
		PFT.Util.Ajax("/r/Order_Handler/refuseRefund",{
			type : "POST",
			dataType : "json",
			params : {
				id : id,
				memo : memo
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				
			},
			timeout : function(){ alert("请求超时") },
			serverError : function(){ alert("请求出错")}
		})
	},
	onsearch : function(){
		// var ordernum = $("#ordernum").val();
		// if( ordernum == ""){
		// 	alert("请填写订单");
		// 	return false
		// }

		// var ordernum = "4005526";  //模拟		

		var that = this;

		//可以用
		PFT.Util.Ajax("/r/Order_Handler/refundList",{
			type : "POST",
			dataType : "json",
			params : {
				// ordernum : ordernum
				page : that.page,
				pagesize : 2
			},
			loading : function(){
				$("#tempInfo").html(that.loading);
			},
			complete : function(){
				$("#tempInfo").html("暂无信息");
			},
			success : function(res){
				console.log(res);
				that.handleSearchList(res);
			},
			timeout : function(){ alert("请求超时") },
			serverError : function(){ alert("请求出错")}
		})
	},
	handleSearchList : function(res){
		var that = this;
		var html = that.listTemplate({ list : res.data.list });
		$("#tbody").html(html);
		$("#listTable").css("display","block");
		$("#tempInfo").css("display","none");
		this.transAllTimeStamp();	
		$(".doActionBtn.agree").on("click",function(e){
			var target = $(e.target);
			var id = target.attr("data-id");
			var aggreeCon = that.agreeDialog.container;
			aggreeCon.attr("data-id",id);
			that.agreeDialog.open();
		});
		$(".doActionBtn.disagree").on("click",function(e){
			var target = $(e.target);
			var id = target.attr("data-id");
			console.log(id);
			var disaggreeCon = that.disagreeDialog.container;
			disaggreeCon.attr("data-id",id);
			that.disagreeDialog.open();
		});
	},
	transAllTimeStamp : function(){
		var that = this;
		var timeStamps = $("#tbody").find(".timeStamp");
		console.log(timeStamps);
		timeStamps.each(function(i,item){
			var stamp = timeStamps.eq(i).text();
			var time = trans(stamp);
			timeStamps.eq(i).text(time);
		});
		function trans(Stamp){
			var time = Number(Stamp);
			time = new Date(time*1000);
			var newDate = that.parseStampToDate(time);
			return newDate
		}
	},
	parseStampToDate : function(stamp){
		var   year=stamp.getFullYear();     
		var   month=stamp.getMonth()+1;     
		var   date=stamp.getDate();     
		var   hour=stamp.getHours();     
		var   minute=stamp.getMinutes();     
		var   second=stamp.getSeconds();     

		console.log(minute);
		console.log(second);

		if( hour == 0 ){
			hour = "-";
		}
		if( minute == 0 ){
			minute = "-";
		}
		if( second == 0 ){
			second = "-";
		}

		return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;  
	}

});

$(function(){
	new Main()
})


