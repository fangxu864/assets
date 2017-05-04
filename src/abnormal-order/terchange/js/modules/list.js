/**
 * Created by Administrator on 16-3-25.
 */
var Api = require("./api.js");
var List = RichBase.extend({
	trigger : null,
	AJAX_TIMEOUT : "请求超时，请稍后重试",
	AJAX_SERVERERROR : "请求出错，请稍后重试",
	loadingImg : 'http://www.12301.cc/images/icons/gloading.gif',
	init : function(opt){
		var self = this;
		this.container = $("#tbody");
		this.navigation = opt.navigation;
		this.dialog = new PFT.Dialog({
			speed : 100,
			EVENTS : {
				"click" : {
					".btn-group .dialog-btn" : function(that,e){
						self.onDialogBtnClick(that,e)
					}
				}
			}
		});
		this.dialog_tpl = $("#dialog-tpl").html();
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".doActionBtn",function(e){
			that.onDoActionClick(that,e);
		})
		this.container.on("click",".repushBtn",function(e){
			that.onRepushBtnClick(that,e);
		})
	},
	onDialogBtnClick : function(that,e){
		var self = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("no")){ //取消
			that.close();
		}else{
			var note = $("#dialog_reson_textarea").val();
			var auditid = tarBtn.attr("data-auditid");
			var packorder = tarBtn.attr("data-packorder");
			var dstatus = tarBtn.attr("data-status");
			var ordernum = tarBtn.attr("data-ordernum");
			var tnum = tarBtn.attr("data-tnum");
			var stype = tarBtn.attr("data-stype");
			var ifpack = tarBtn.attr("data-ifpack");
			var trigger = tarBtn.attr("data-trigger");
			var stime = tarBtn.attr("data-stime");
			if(dstatus==2 && !note){ //如果是拒绝，要求必须备注拒绝理由
				return alert("请输入拒绝理由");
			}
			self.updateAudit({
				auditid : auditid,
				dstatus : dstatus,
				packorder : packorder,
				stype : stype,
				note : note,
				ifpack : ifpack,
				ordernum : ordernum,
				tnum : tnum,
				stime:stime
			})
			that.close();
		}
	},
	//点击同意或拒绝按钮
	onDoActionClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var type = tarBtn.hasClass("agree") ? "agree" : "disagree";
		var title = tarBtn.hasClass("agree") ? "同意撤改" : "拒绝撤改";
		var placeholder = tarBtn.hasClass("agree") ? "可以在这里输入备忘" : "可以在这里输入拒绝理由";
		var auditid = tarBtn.attr("data-auditid");
		var packorder = tarBtn.attr("data-packorder");
		var concatid = tarBtn.attr("data-concatid");
		var ifpack = tarBtn.attr("data-ifpack");
		var dstatus = tarBtn.attr("data-status");
		var stype = tarBtn.attr("data-stype");
		var ordernum = tarBtn.attr("data-ordernum");
		var tnum = tarBtn.attr("data-tnum");
		var stime = tarBtn.attr("data-stime");
		that.dialog.open({
			offset : -100,
			title : title,
			content : that.parseTemplate(that.dialog_tpl,{
				type : type,
				placeholder : placeholder,
				auditid : auditid,
				packorder : packorder,
				concatid : concatid,
				ifpack : ifpack,
				dstatus : dstatus,
				stype : stype,
				ordernum : ordernum,
				tnum : tnum,
				stime : stime
			}),
			onAfterOpen : function(dialog,container){
				that.trigger = tarBtn;
			}
		})
	},
	//点击再次推送
	onRepushBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable") || tarBtn.hasClass("fail")) return false;
		var ordernum = tarBtn.attr("data-ordernum");
		var tnum = tarBtn.attr('data-tnum');
		var dstatus = tarBtn.attr('data-dstatus');
		that.repush({
			tarBtn : tarBtn,
			ordernum : ordernum,
			dstatus: dstatus,
			tnum : tnum
		})
	},
	repush : function(opt){
		var that = this;
		var tarBtn = opt.tarBtn;
		var ordernum = opt.ordernum;
		var dstatus = opt.dstatus;
		var tnum = opt.tnum;
		Api.repush({
			params : {
				ordernum : ordernum,
				dstatus : dstatus,
				tnum : tnum
			},
			loading : function(){ tarBtn.addClass("disable").html("请稍后...")},
			removeLoading : function(){ tarBtn.removeClass("disable").html("再次推送")},
			success : function(res){
				PFT.Help.AlertTo("success",'<p style="180px">推送成功</p>');
			},
			fail : function(res){
				var msg = res.msg;
				alert(msg);
				tarBtn.html('推送失败').addClass("fail");
			}
		});
	},
	//同意&&拒绝
	updateAudit : function(opt){
		var that = this;
		var opt = opt || {};
		var auditid = opt.auditid;
		var concat_id = opt.concatid;
		var packorder = opt.packorder;
		var ifpack = opt.ifpack;
		var dstatus = opt.dstatus;
		var ordernum = opt.ordernum;
		var tnum = opt.tnum;
		var stime = opt.stime;
		var note = opt.note;
		var trigger = this.trigger;
		var parent = trigger.parent();
		var orginHtml = parent.html();
		var stype = opt.stype;
		var loading = function(){
			parent.html('<img class="loadingImg" src="'+that.loadingImg+'"/>');
		};
		var removeLoading = function(){
			parent.html(orginHtml);
		};
		var success = function(res){
			parent.html("已处理").prev().html(dstatus==1?"<span class='success'>成功</span>":"<span class='refuse'>拒绝</span>");
		};
		var fail = function(res){
			alert(res.msg);
		};
		if(stype==0 || stype==1){
			Api.audit(Api.api.terminal_revoke,{
				params : {
					'Did': auditid,
					'Dreason': note,
					'Ddstatus': dstatus
				},
				loading : function(){ loading() },
				removeLoading : function(){ removeLoading() },
				success : function(res){ success(res) },
				fail : function(res){ fail(res) }
			})
		}else{ //stype=2|3
			Api.audit(Api.api.jh_refund_audit,{
				params : {
					'auditid': auditid,
					'dstatus': dstatus,
					'ordernum': ordernum,
					'tnum': tnum,
					'action' : "update_audit",
					'dreason': note
				},
				loading : function(){ loading() },
				removeLoading : function(){ removeLoading() },
				success : function(res){
					var params = null;
					var main_order = (ifpack == 2) ? packorder : ordernum;
					if (stype == 3) {
						params = {
							from: 'order_cancel',
							ordernum: main_order,
							audit: true,
							stime: stime
						};
					} else if (stype == 2) {
						tnum = (ifpack == 2) ? 0 : tnum;
						params = {
							from: 'order_alter',
							ordernum: main_order,
							tids: {},
							audit: true,
							stime: stime
						};
						params['tids'][main_order]=tnum;
					}
					if(res.code==200 && dstatus==1){
						Api.audit(Api.api.handle,{ //先请求handle.php
							params : params,
							loading : function(){ loading()},
							removeLoading : function(){ removeLoading()},
							success : function(res){ success(res);},
							fail : function(res){ fail(res);}
						})
					}else{
						success(res);
					}
				},
				fail : function(res){ fail(res) }
			});
		}
	},
	query : function(page,params){
		var that = this;
		var searchBtn = $("#searchBtn");
		Api.getList(page,params,{
			loading : function(){
				searchBtn.addClass("disable");
				that.render("loading");
			},
			removeLoading : function(){
				searchBtn.removeClass("disable");
				that.render("removeLoading");
			},
			success : function(res){
				var data = res.data;
				var currentPage = data.page || 1;
				var totalItemNum = data.total;
				var limit = data.limit;
				var totalPage = Math.ceil(totalItemNum/limit); //向上取整
				var list = data.audit_list;
				that.navigation.render({current:currentPage,total:totalPage});
				that.render("success",list);
			},
			empty : function(res){
				that.render("empty");
				that.navigation.render({current:1,total:0});
			},
			unlogin : function(res){
				that.render("unlogin",res.msg);
			},
			fail : function(res){
				that.render("fail",res.msg);
			}
		})
	},
	render : function(type,data){
		var tpl = $("#listTpl-"+type).html();
		var container = this.container;
		if(type=="success"){
			var template = _.template(tpl);
			container.html(template({data:data}));
		}else if(type=="loading"){
			container.html(tpl);
		}else if(type=="removeLoading"){
			container.html("");
		}else if(type=="unlogin"){
			container.html(tpl);
		}else if(type=="empty"){
			container.html(tpl);
		}else if(type=="fail"){
			var template = _.template(tpl);
			container.html(template({msg:data}));
		}
	}
});
module.exports = List;