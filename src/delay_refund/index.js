
require("./index.scss")
var listTpl = require("./list.xtpl");
console.log("延迟退款");
var Dialog = require("COMMON/modules/dialog-simple");  //遮罩框
var agreeDialogTpl = require("./agreeDislogCon.xtpl");
var disagreeDialogTpl = require("./disagreeDislogCon.xtpl");
var Loading = require("COMMON/js/util.loading.pc.js");
var Main =  PFT.Util.Class({
    container : $("#delayRefund"),  
    EVENTS : {                    
		"click #searchBtn2" : "onsearch"
    },
    init : function(opt){         
		var that = this;
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
		var ordernum = "4005526";		
		var that = this;
		//可以用
		PFT.Util.Ajax("/r/Order_Handler/refundList",{
			type : "POST",
			dataType : "json",
			params : {
				ordernum : ordernum
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
	}

});

$(function(){
	new Main()
})




