/**
 * Created by Administrator on 15-10-8.
 */

var TerminalCore = require("./terminal.core.js");
var TerminalNormal = RichBase.extend({
	EVENTS : {
		"tap" : {
			".searchBtn" : "onSearchBtnTap",
			".clearSearBtn" : "onClearBtnTap",
			".orderItem .countBox .btn" : "onCountBtnTap",
			".orderItem .terminalBtn" : "onTerminalBtnTap"
		},
		"input" : {
			".searchInp" : "onSearchInputChange"
		},
		"blur" : {
			".orderItem .countBox .countInp" : "onCountInputBlur"
		},
		"focus" : {
			".orderItem .countBox .countInp" : "onCountInputFocus"
		}
	},
	init : function(opt){
		var that = this;
		this.container = opt.container;
		this.searchInp = $("#searchInp");
		this.searchBtn = this.container.find(".searchBtn");
		this.clearBtn = this.container.find(".clearSearBtn");
		this.listUl = this.container.find(".listUl");
		this.Core = new TerminalCore();
		this.tpl = TerminalCore.tpl.orderItem;
	},
	bootstrap : function(opt){

	},
	onSearchBtnTap : function(that,e){
		var keyword = that.searchInp.val();
		if(!keyword){
			that.listUl.html("");
			return that.searchInp.focus();
		}
		that.search(keyword);
	},
	onSearchInputChange : function(that,e){
		var val = that.searchInp.val();
		if(val){
			that.clearBtn.show();
		}else{
			that.clearBtn.hide();
		}
	},
	onCountInputFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.attr("data-lastval",$.trim(tarInp.val()));
	},
	onCountInputInput : function(that,e){
		that.onCountInputBlur(that,e);
	},
	onCountInputBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		if(tarInp.hasClass("disable") || tarInp.prop("readonly")) return false;
		var newVal = $.trim(tarInp.val());
		var oldVal = tarInp.attr("data-lastval");
		that.onCountInpChange(tarInp,newVal,oldVal);
	},
	onClearBtnTap : function(that,e){
		that.searchInp.val("").focus();
		that.clearBtn.hide();
		that.listUl.html("");
	},
	onCountBtnTap : function(that,e){
		var tarBtn = $(e.currentTarget);
		var countInp = tarBtn.siblings(".countInp");
		if(tarBtn.hasClass("disable") || countInp.hasClass("disable") || countInp.prop("readonly")) return false;
		var val = countInp.val() * 1;
		var newVal = tarBtn.hasClass("plus") ? (val+1) : (val-1);
		that.onCountInpChange(countInp,newVal,val);
	},
	onCountInpChange : function(tarInp,newVal,oldVal){
		var resVal = "";
		var newVal = String(newVal).length==0 ? oldVal : newVal*1;
		var max = tarInp.attr("data-max") * 1;
		var min = tarInp.attr("data-min") * 1;
		var parents = tarInp.parents(".countBox");
		if(!PFT.Help.isPositiveNum(String(newVal),true) || newVal<min || newVal>max){
			resVal = oldVal;
		}else{
			resVal = newVal;
		}
		tarInp.val(resVal);
		parents.find(".btn").removeClass("disable");
		if(resVal==min) parents.find(".minus").addClass("disable");
		if(resVal==max) parents.find(".plus").addClass("disable");
	},
	onTerminalBtnTap : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable") || tarBtn.hasClass("success") || tarBtn.hasClass("loading")) return false;
		var salerid = TerminalCore.getSalerid();
		var ordernum = tarBtn.attr("data-ordernum");
		if(!salerid || !ordernum) return console.log("缺少salerid或ordernum");
		var tickets = {};
		var parent = tarBtn.parents(".orderItem");
		var flag_xianchangPay = parent.find(".flag_xianchangPay");
		if(flag_xianchangPay.length){
			var result = window.confirm("此订单须现场支付，请确保游客已付款。是否继续？");
			if(!result) return false;
		}
		var total_tic_num = 0;
		parent.find(".countInp").each(function(){
			var tarInp = $(this);
			var ordernum = tarInp.attr("data-ordernum");
			var num = tarInp.val();
			total_tic_num += num*1;
			tickets[ordernum] = num;
		})
		if(total_tic_num==0) return alert("验证票数不能全为0");
		that.terminal(salerid,ordernum,tickets,tarBtn);
	},
	//普通验证 改单验证
	terminal : function(salerid,ordernum,tickets,tarBtn){
		var that = this;
		var check_method = tarBtn.attr("data-checkmethod");
		var rtime = tarBtn.attr("data-endtime") || "";
		var data = {
			check_method : check_method,
			salerid : salerid,
			ordernum : ordernum,
			list : tickets,
			rtime : rtime
		};
		this.Core.terminal(data,{
			loading : function(){
				tarBtn.addClass("loading");
				tarBtn.html('<i class="iconfont loading" style="vertical-align:middle; margin-right:2px;">&#xe644;</i><span class="t">正在验证...</span>')
			},
			removeLoading : function(){
				tarBtn.removeClass("loading");
				tarBtn.html('验证')
			},
			timeout : function(){
				alert("请求超时，请稍后重试");
			},
			serverError : function(){
				alert("请求失败，请稍后重试");
			},
			success : function(res){
				that.terminalSuccess(tarBtn);
			},
			fail : function(res){
				var msg = res.msg || "验证失败";
				tarBtn.parent().next().html(msg);
			}
		})
	},
	terminalSuccess : function(tarBtn){
		alert("验证成功");
		this.search(this.searchInp.val());
	},
	search : function(keyword){
		var that = this;
		var Core = this.Core;
		var salerid = TerminalCore.getSalerid();
		var listUl = this.listUl;
		Core.queryOrder(salerid,keyword,{
			loading : function(){
				listUl.html('<li class="sta loading"><i class="iconfont loading">&#xe644;</i><span class="t">正在查询...</span></li>');
			},
			removeLoading : function(){ listUl.html('')},
			success : function(res){
				that.renderHtml(res);
			},
			unlogin : function(){
				TerminalCore.showLogin();
			},
			empty : function(res){
				listUl.html('<li class="sta"><i class="iconfont">&#xe669;</i><span class="t">查无订单...</span></li>');
			},
			error : function(res){
				alert("查询失败，请稍后重试！")
			},
			timeout : function(res){
				alert("请求超时，请稍后重试！")
			},
			serverError : function(res){
				alert("请求出错，请稍后重试！")
			}
		});
	},
	renderHtml : function(data){
		var tpl = this.tpl;
		var template = _.template(tpl);
		var html = template({data:data});
		this.listUl.html(html);
	}
});
module.exports = TerminalNormal;