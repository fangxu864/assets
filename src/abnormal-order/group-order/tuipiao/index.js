/**
 * Author: huangzhiyang
 * Date: 2016/9/21 12:05
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./order.item.html");
var AdaptOrder = require("./adaptOrder");
var Api = require("COMMON/busi/terminal/core/api");
var Loading = require("COMMON/js/util.loading.pc");
var Loading_Text = Loading("努力加载中...",{
	height : 300
});
var TuiPiao = PFT.Util.Class({
	container : "#tabPanel-tuipiao",
	EVENTS : {
		"click #tuipiao-searchBtn" : "onSearchBtnClick",
		"click #tuipiao-order-listUl .checkBtn " : "onTuiBtnClick",
		"keyup .query-orderInp" : "onQueryOrderInpKeyup"
	},
	init : function(opt){
		this.groupBussSelect = $("#groupBussSelect");
		this.terminalOrderInp = $("#tuipiao-orderInp");
		this.listUl = $("#tuipiao-order-listUl");
		this.searchBtn = $("#tuipiao-searchBtn");
		this.datepicker = opt.datepicker;
		this.Datepicker = opt.Datepicker;

		// var data = {
		// 	"status": "success",
		// 	"orders": {
		// 		"6864532": {
		// 			"ordernum": "6864532",
		// 			"code": "571296",
		// 			"mcode": "571296",
		// 			"ptype": "A",
		// 			"pmode": "3",
		// 			"status": "0",
		// 			"landid": "26985",
		// 			"series": "0",
		// 			"endtime": "2016-10-27",
		// 			"ordertel": "15060406416",
		// 			"ordername": "222222",
		// 			"ordertime": "2016-09-27 15:35:41",
		// 			"begintime": "2016-09-27",
		// 			"paystatus": "1",
		// 			"checktime": "0000-00-00 00:00:00",
		// 			"ifprint": "0",
		// 			"tickets": [
		// 				{
		// 					"tid": 58827,
		// 					"tnum": 1,
		// 					"tnum_s": 1,
		// 					"name": "001测试票",
		// 					"tprice": "1",
		// 					"ordernum": "6864532",
		// 					"status": "0",
		// 					"batch_check": "0",
		// 					"refund_audit": "0"
		// 				}
		// 			]
		// 		}
		// 	}
		// };
		// this.renderList(data.orders);

	},
	template : PFT.Util.ParseTemplate(Tpl),
	//点击退票按钮
	onTuiBtnClick : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;

		that.tuipiao(tarBtn);

	},
	onQueryOrderInpKeyup : function(e){
		if(e.keyCode!==13) return false;
		this.searchBtn.trigger("click");
	},
	onSearchBtnClick : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var orderid = $.trim(this.terminalOrderInp.val());
		var companyid = this.groupBussSelect.val();
		//var data = {
		//	"status": "success",
		//	"orders": {
		//		"6864532": {
		//			"ordernum": "6864532",
		//			"code": "571296",
		//			"mcode": "571296",
		//			"ptype": "A",
		//			"pmode": "3",
		//			"status": "0",
		//			"landid": "26985",
		//			"series": "0",
		//			"endtime": "2016-10-27",
		//			"ordertel": "15060406416",
		//			"ordername": "222222",
		//			"ordertime": "2016-09-27 15:35:41",
		//			"begintime": "2016-09-27",
		//			"paystatus": "1",
		//			"checktime": "0000-00-00 00:00:00",
		//			"ifprint": "0",
		//			"tickets": [
		//				{
		//					"tid": 58827,
		//					"tnum": 1,
		//					"tnum_s": 1,
		//					"name": "001测试票",
		//					"tprice": "1",
		//					"ordernum": "6864532",
		//					"status": "0",
		//					"batch_check": "0",
		//					"refund_audit": "0"
		//				}
		//			]
		//		}
		//	}
		//};
		//
		//return this.renderList(data.orders);
		this.queryOrder(orderid,companyid);

	},
	//查询订单
	queryOrder : function(orderid,companyid){

		var that = this;
		var listUl = this.listUl;
		PFT.Util.Ajax("/call/terminal.php",{
			type : "get",
			params : {
				orderid : orderid,
				companyid : companyid
			},
			loading : function(){ listUl.html(Loading_Text);},
			complete : function(){ listUl.html("");},
			success : function(res){
				res = res || {};
				var status=res.status;
				// var code = res.code;
				// var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(status=="success"){
					var orders = res.orders;
					if(orders && !that.isObjectEmpty(orders)){
						that.renderList(orders);
					}else{
						that.render("empty");
					}
				}else if(status=="fail" && code==0){
					that.render("unlogin");
				}else if(status=="fail"){
					that.render("fail",msg);
				}
			}
		})
	},
	//退票
	tuipiao : function(tarBtn){
		var that=this;
		var _params={};
		var ordernum=tarBtn.parents("li.orderItem").attr("data-ordernum");
		var un_terminal_tnum=tarBtn.parents("li.orderItem").find(".un_terminal_tnum").html();// 待验证的票数
		var inpNum=tarBtn.parents("li.orderItem").find(".countInp").val();                    //输入框中的票数
		console.log(un_terminal_tnum +"--"+ inpNum);
		if(parseInt(inpNum)===0){
			alert("退票数不能为0");
			tarBtn.parents("li.orderItem").find(".countInp").val("1");
			return false;
		}else if(parseInt(inpNum)>parseInt(un_terminal_tnum)){
			alert("退票数不能超过未退票数");
			tarBtn.parents("li.orderItem").find(".countInp").val(un_terminal_tnum);
			return false;
		}else if(parseInt(inpNum)<parseInt(un_terminal_tnum)){


			_params["from"]="order_alter";
			_params["tids"+"\["+ordernum+"\]"]=parseInt(un_terminal_tnum)-parseInt(inpNum);
			_params["ordernum"]=ordernum;
		}else if(parseInt(inpNum)===parseInt(un_terminal_tnum)){
			_params["from"]="order_cancel";
			_params["ordernum"]=ordernum;

		}

		var parent = tarBtn.parents(".inCon");
		// var ordernum = tarBtn.attr("data-mainordernum");
		// var salerid = tarBtn.attr("data-salerid");
		// var check_method = parent.find("input[type=radio]:checked").val();
		// var ticketLi = parent.find(".ticketUl .ticketLi");
		// var list = (function(){
		// 	var list = {};
		// 	var total = 0;
		// 	ticketLi.each(function(){
		// 		var item = $(this);
		// 		var inp = item.find(".countInp");
		// 		var ordernum = inp.attr("data-ordernum");
		// 		var tnum = inp.val();
		// 		total += tnum*1;
		// 		list[ordernum] = tnum;
		// 	});
		// 	return total==0 ? 0 : list;
		// })();
		// var rtime = parent.find(".termTimeInp").val() || "";
		var errorTip = parent.find(".errorTip");
		// if(list==0) return ticketLi.length==1 ? alert("验证票数不能为0") : alert("验证票数不能全为0");
		// var params = {
		// 	check_method : check_method,
		// 	salerid : salerid,
		// 	ordernum : ordernum,
		// 	list : list,
		// 	rtime : rtime
		// };
		$.ajax({
			url: "/call/handle.php",    //请求的url地址
			dataType: "json",                        //返回格式为json
			async: true,                              //请求是否异步，默认为异步，这也是ajax重要特性
			data: _params,
			type: "get",                               //请求方式
			beforeSend: function() {
				errorTip.hide();
				tarBtn.addClass("disable").text("正在退票...");
			},
			success: function(res) {
				PFT.Util.STip("success",'<p style="width:200px">退票成功</p>');
				var orderid = that.terminalOrderInp.val();
				var companyid = that.groupBussSelect.val();
				that.queryOrder(orderid,companyid);
			},
			complete: function() {
				//请求完成的处理
			},
			error: function(res) {
				tarBtn.text("重新验证");
				errorTip.show().html(res.responseText);
			}
		});
		// Api.terminal(params,{
		// 	loading : function(){
		// 		errorTip.hide();
		// 		tarBtn.addClass("disable").text("正在退票...");
		// 	},
		// 	removeLoading : function(){
		// 		tarBtn.removeClass("disable").text("退 票");
		// 	},
		// 	success : function(res){
		// 		PFT.Util.STip("success",'<p style="width:200px">验证成功</p>');
		// 		var orderid = that.terminalOrderInp.val();
		// 		var companyid = that.groupBussSelect.val();
		// 		that.queryOrder(orderid,companyid);
		// 	},
		// 	unlogin : function(res){
		// 		errorTip.show().html('登录状态已过期，请重新<a style="margin:0 2px;" href="dlogin_n.html">登录</a>');
		// 	},
		// 	fail : function(res){
		// 		tarBtn.text("重新验证");
		// 		errorTip.show().html(res.msg);
		// 	}
		// })
	},
	renderList : function(data){
		var now = this.Datepicker.CalendarCore.getNowDateTime();
		for(var i in data){
			var order = data[i];
			order && AdaptOrder.adapt(order);
			order["endtime"] = now;
		}
		this.render("success",data);
	},
	render : function(type,data){
		var listUl = this.listUl;
		var html = "";
		if(type=="loading"){
			html = '<li class="sta loading"><img class="loadingImg" src="'+Api.LOADING_IMG+'" alt=""/><span class="t">请稍后...</span></li>';
			listUl.html(html);
		}else if(type=="removeLoading"){
			listUl.html("");
		}else if(type=="success"){
			html = this.template({data:data});
			listUl.html(html);
		}else if(type=="empty"){
			listUl.html('<li class="sta empty"><span class="t">查无匹配订单</span></li>');
		}else if(type=="unlogin"){
			listUl.html('<li class="sta unlogin"><span class="t">未登录或登录状态已过期，请重新<a style="margin:0 3px;" href="dlogin_n.html">登录</a></span></li>');
		}else if(type=="fail"){
			listUl.html('<li class="sta fail"><span class="t">'+data+'</span></li>');
		}
	},
	disable : function(){
		this.container.hide();
	},
	enable : function(){
		this.container.show();
	},
	isObjectEmpty:function (obj) {
		var isEmpty=true;
		for (var i in obj){
			isEmpty=false;
		}
		return isEmpty
	}
});
module.exports = TuiPiao;