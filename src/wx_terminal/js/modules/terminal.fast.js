/**
 * Created by Administrator on 15-10-8.
 */
var KeyBoard = require("./keyBoard.js");
var TerDialog = require("./dialog.js");
var TerminalCore = require("./terminal.core.js");
var keyBoard = null;
var dialog = null;
var Core = null;
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
var ajax_fail = function(res){
	var res = res || {};
	var msg = res.msg || AJAX_ERROR_TEXT;
	alert(msg);
};
var ajax_timeout = function(){
	alert("请求超时，请稍后重试");
};
var ajax_serverError = function(){
	alert("请求出错，请稍后重试");
};
var TerminalFast = RichBase.extend({
	statics : {
		getSalerid : function(){
			return $("#productname").attr("data-salerid") || "";
		},
		showMask : function(){
			$("#gmaskLayer").show().css("z-index",100002);
		},
		hideMask : function(){
			$("#gmaskLayer").hide().css("z-index",-1);
		},
		showLogin : function(){
			$("#loginWrap").show().css("z-index",100001);
		},
		hideLogin : function(){
			$("#loginWrap").hide().css("z-index",-1);
		}
	},
	init : function(){},
	bootstrap : function(){
		var that = this;
		keyBoard = new KeyBoard({container:$("#keyboradComp")});
		dialog = new TerDialog({container:$("#terminalSucPage")});
		Core = new TerminalCore();
		keyBoard.on("tap.num",function(val){
			$("#codeInp").val(val);
		});
		keyBoard.on("tap.back",function(val){
			$("#codeInp").val(val);
		});
		keyBoard.on("tap.empty",function(val){
			$("#codeInp").val(val);
		});
		keyBoard.on("tap.valify",function(val){
			that.valify_ma(val);
		});
		var dialog_con_order_list_tpl = TerminalCore.tpl.terminalSuccess;
		this.dialog_con_order_list_template = _.template(dialog_con_order_list_tpl);
		var orderItemtpl = TerminalCore.tpl.orderItem;
		this.template = _.template(orderItemtpl);
	},
	render_dialog_orderItem : function(order,can_check){
		var template = this.dialog_con_order_list_template;
		var order_can_check = typeof can_check=="undefined" ? this.order_can_check(order) : can_check;
		return template({
			data : {
				order : order,
				can_check : order_can_check
			}
		})
	},
	render_dialog_orders : function(orders){
		var that = this;
		var html = "";
		var orders = orders || {};
		for(var i in orders){
			var order = orders[i];
			html += that.render_dialog_orderItem(order);
		}
		return html;
	},
	showDialog_orderQuery : function(title,con){
		dialog.show({
			top : 30,
			bottom : 30,
			title : title,
			content : con,
			btns : [{
				text : "确定",
				type : "yes",
				handler : function(tarBtn){
					dialog.close();
				}
			}]
		})
	},
	valify_single_order : function(order){
		var that = this;
		var statics = this.statics;
		var batch_check = order.batch_check;   //batch_check==1:支持分批验证   batch_check==0:不支持分批验证
		var check_method = batch_check==1 ? 1 : 0; //<!-- 如果支持分批验证，则默认选中保留余票 --><!-- 如果不支持分批验证，则默认选中取消余票 -->
		var ordernum = order.ordernum;
		var salerid = this.statics.getSalerid();
		var rtime = order.endtime || "";
		var list = (function(){
			var tickets = order.tickets;
			var res = {};
			for(var i in tickets){
				var ticket = tickets[i];
				var ordernum = ticket["ordernum"];
				var tnum = ticket["tnum"];
				res[ordernum] = tnum;
			}
			return res;
		})();
		var data = {
			check_method : check_method,
			ordernum : ordernum,
			salerid : salerid,
			rtime : rtime,
			list : list
		};
		Core.terminal(data,{
			loading : function(){statics.showMask()},
			removeLoading : function(){statics.hideMask()},
			success : function(res){
				alert("验证成功");
				Core.queryOrder(salerid,$("#codeInp").val(),{
					success : function(orders){
						var title = '<i class="iconfont">&#xe62c;</i><span class="t">验证成功</span>';
						var content = that.render_dialog_orders(orders);
						that.showDialog_orderQuery(title,content);
					}
				})
			},
			unlogin : function(){ that.statics.showLogin();},
			fail : function(res){ ajax_fail(res)},
			timeout : function(){ ajax_timeout()},
			serverError : function(){ ajax_serverError()}
		})
	},
	valify_some_orders : function(salerid,ma,orders){
		$("#modelTab").find(".normalTabItem").trigger("tap");
		$("#searchInp").val(ma);
		$("#clearSearBtn").show();
		$("#searchResultWrap").children(".listUl").html(this.template({data:orders}));
//		var that = this;
//		var title = "请选择以下订单验证";
//		var content = this.render_dialog_orders(orders);
//		dialog.show({
//			top : 30,
//			bottom : 30,
//			title : title,
//			content : content,
//			onTerminalBtnTap : function(tarBtn){
//				var salerid = that.statics.getSalerid();
//				var ordernum = tarBtn.attr("data-ordernum");
//				var check_method = tarBtn.attr("data-checkmethod");
//				var rtime = tarBtn.attr("data-endtime");
//				var list = (function(){
//					var res = {};
//					tarBtn.parents(".terimalItem").find(".ticketLine").each(function(){
//						var ticket = $(this);
//						var ordernum = ticket.attr("data-ordernum");
//						var tnum = ticket.attr("data-tnum");
//						res[ordernum] = tnum;
//					})
//					return res;
//				})();
//				if(!salerid || tarBtn.hasClass("valifyed")) return false;
//				Core.terminal({
//					salerid : salerid,
//					ordernum : ordernum,
//					check_method : check_method,
//					rtime : rtime,
//					list : list
//				},{
//					loading : function(){ tarBtn.text("验证中...")},
//					removeLoading : function(){tarBtn.text("验证")},
//					success : function(){
//						tarBtn.addClass("valifyed").text("验证成功");
//						alert("验证成功");
//						var statics = that.statics;
//						Core.queryOrder(statics.getSalerid(),$("#codeInp").val(),{
//							loading : function(){statics.showMask()},
//							removeLoading : function(){statics.hideMask()},
//							success : function(orders){
//								var con = that.render_dialog_orders(orders);
//								$("#terminalSucPage").find(".listUl").html(con);
//							},
//							empty : function(){},
//							error : function(res){ ajax_fail(res)},
//							unlogin : function(){ statics.showLogin()},
//							timeout : function(){ ajax_timeout()},
//							serverError : function(){ ajax_serverError()}
//						})
//					},
//					unlogin : function(){that.statics.showLogin()},
//					fail : function(res){ajax_fail(res)},
//					timeout : function(res){ajax_timeout()},
//					serverError : function(res){ajax_serverError()}
//				})
//			},
//			btns : [{
//				text : "确定",
//				type : "yes",
//				handler : function(tarBtn){
//					dialog.close();
//				}
//			}]
//		})
	},
	//验证
	valify_ma : function(ma){
		var that = this;
		var statics = this.statics;
		var salerid = statics.getSalerid();
		if(!ma || !salerid) return false;
		Core.queryOrder(salerid,ma,{
			loading : function(){statics.showMask()},
			removeLoading : function(){statics.hideMask()},
			success : function(orders){
				var orders_num = Core.getObjectLength(orders);
				if(orders_num==0) return false;
				if(orders_num==1){ //快速验证时，如果查出来的订单只有一个，则直接验证掉
					for(var i in orders){
						var order = orders[i];
						//先判断该订单是否被验证过(是否可验证)
						var can_check = order["can_check"]; //先判断这个订单是否可验证
						if(can_check){ //如果可验证
							that.valify_single_order(order);
						}else{ //如果不可验证，则弹窗列出查询订单匹配的结果
							var con = that.render_dialog_orderItem(order,can_check);
							that.showDialog_orderQuery("以下为查询出的匹配订单",con);
						}
					}
				}else{ //如果有2个或2个以上订单，其实就是进入改单验证模式
					that.valify_some_orders(salerid,ma,orders);
				}
			},
			empty : function(){ alert("查无订单")},
			error : function(res){ ajax_fail(res)},
			unlogin : function(){ statics.showLogin()},
			timeout : function(){ ajax_timeout()},
			serverError : function(){ ajax_serverError()}
		})
	}
});
module.exports = TerminalFast;