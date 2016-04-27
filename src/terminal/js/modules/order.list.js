/**
 * Created by Administrator on 16-3-31.
 */
var Api = require("./api.js");
var orderListTpl = require("../../view/order.item.html");
var Calendar = require("COMMON/modules/calendar/calendar.js");
var OrderList = RichBase.extend({
	init : function(){
		this.listUl = $("#myOrderList");
		this.template = _.template(orderListTpl);
		this.calendar = new Calendar();
		this.bindEvents();
	},
	dateInp : null,
	bindEvents : function(){
		var that = this;
		this.listUl.on("click",".checkBtn",function(e){
			that.onCheckBtnClick(that,e);
		})
		this.listUl.on("focus",".countInp",function(e){
			that.onCountInpFocus(that,e);
		});
		this.listUl.on("blur",".countInp",function(e){
			that.onCountInpBlur(that,e);
		})
		this.listUl.on("click",".termTimeWrap",function(e){
			var tarInp = $(e.currentTarget).find(".termTimeInp");
			var date = tarInp.val();
			var offset = tarInp.offset();
			that.calendar.show(date,{
				onBefore : function(){
					that.dateInp = tarInp;
					that.calendar.position({
						top : offset.top+$(e.currentTarget).height()+2,
						left : offset.left-6
					});
				}
			});
		})
		this.calendar.on("click",function(data){
			that.dateInp.val(data.date)
			that.calendar.close()
		})
	},
	onCountInpFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		tarInp.attr("data-lastval",tarInp.val())
	},
	onCountInpBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val())*1;
		var lastVal = tarInp.attr("data-lastval");
		var min = 0;
		var max = tarInp.attr("data-maxnum")*1;
		var result = that.validate_countInp(tarInp);
		if(!result) return tarInp.val(lastVal);

	},
	//点击验证按钮
	onCheckBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var parent = tarBtn.parents(".inCon");
		var ordernum = tarBtn.attr("data-mainordernum");
		var salerid = Api.getSalerid();
		var check_method = parent.find("input[type=radio]:checked").val();
		var ticketLi = parent.find(".ticketUl .ticketLi");
		var list = (function(){
			var list = {};
			var total = 0;
			ticketLi.each(function(){
				var item = $(this);
				var inp = item.find(".countInp");
				var ordernum = inp.attr("data-ordernum");
				var tnum = inp.val();
				total += tnum*1;
				list[ordernum] = tnum;
			});
			return total==0 ? 0 : list;
		})();
		var rtime = parent.find(".termTimeInp").val() || "";
		var errorTip = parent.find(".errorTip");
		if(list==0) return ticketLi.length==1 ? alert("验证票数不能为0") : alert("验证票数不能全为0");
		Api.terminal({
			check_method : check_method,
			salerid : salerid,
			ordernum : ordernum,
			list : list,
			rtime : rtime
		},{
			loading : function(){
				errorTip.hide();
				tarBtn.addClass("disable").text("正在验证...");
			},
			removeLoading : function(){
				tarBtn.removeClass("disable").text("验 证");
			},
			success : function(res){
				PFT.Help.AlertTo("success",'<p style="width:200px">验证成功</p>');
				that.query(Api.getSalerid(),$("#termSearInp").val());
//				parent.find(".ticketLi").each(function(){
//					var tarLi = $(this);
//					var countInp = tarLi.find(".countInp");
//					var has_terminal_num = countInp.val()*1;
//					var un_terminal = tarLi.find(".trnameCol .un_terminal_tnum");
//					var total = tarLi.find(".total_tnum");
//					var total_num = total.text() * 1;
//					var un_terminal_num = un_terminal.text()*1;
//					if(check_method==0){ //取消余票
//						un_terminal.text(0);
//						total.text(total_num-(un_terminal_num-has_terminal_num))
//						countInp.val(0);
//					}else if(check_method==1){ //保留余票
//						un_terminal.text(un_terminal_num-has_terminal_num);
//						countInp.val(un_terminal_num-has_terminal_num);
//					}
//					that.setCountInpMax();
//				})
			},
			unlogin : function(res){
				errorTip.show().html('登录状态已过期，请重新<a style="margin:0 2px;" href="dlogin_n.html">登录</a>');
			},
			fail : function(res){
				tarBtn.text("重新验证");
				errorTip.show().html(res.msg);
			}
		})
	},
	query : function(salerid,voucher){
		var that = this;
		Api.queryOrder(salerid,voucher,{
			loading : function(){ that.render("loading",null)},
			removeLoading : function(){ that.render("removeLoading",null)},
			success : function(res){
				var orders = res.orders;
				for(var i in orders){
					var order = orders[i];
					order["batch_check"] = 1; //支持分批验证
					order["refund_audit"] = 0;//支持改单验证
					var tickets = order.tickets;
					for(var t in tickets){
						var ticket = tickets[t];
						var batch_check = ticket.batch_check;
						var refund_audit = ticket.refund_audit;
						if(batch_check==0) order["batch_check"] = 0;
						if(refund_audit==1) order["refund_audit"] = 1;
					}
				}
				that.render("success",res);
			},
			empty : function(res){ that.render("empty",res)},
			fail : function(res){ that.render("fail",res)},
			unlogin : function(res){ that.render("unlogin",res)}
		})
	},
	//设置每张票验证的最大票数
	setCountInpMax : function(){
		this.listUl.find(".countInp").each(function(){
			var tarLi = $(this);
			var parent = tarLi.parents(".ticketLi");
			var max = parent.find(".un_terminal_tnum").text()*1;
			tarLi.attr("data-maxnum",max);
		})
	},
	//校验countInp输入的数字的有效性
	validate_countInp : function(tarInp){
		var val = tarInp.val()*1;
		var min = 0;
		var max = tarInp.attr("data-maxnum")*1;
		if(!PFT.Help.isPositiveNum(val,true) || val<min || val>max) return false;
		return true;
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
			html = this.template({data:data.orders});
			listUl.html(html);
		}else if(type=="empty"){
			listUl.html('<li class="sta empty"><span class="t">查无匹配订单</span></li>');
		}else if(type=="unlogin"){
			listUl.html('<li class="sta unlogin"><span class="t">未登录或登录状态已过期，请重新<a style="margin:0 3px;" href="dlogin_n.html">登录</a></span></li>');
		}else if(type=="fail"){
			var msg = data.msg || Api.AJAX_ERROR_TEXT;
			listUl.html('<li class="sta fail"><span class="t">'+msg+'</span></li>');
		}
	}
});
module.exports = OrderList;