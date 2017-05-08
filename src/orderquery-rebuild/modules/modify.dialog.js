/**
 * Created by Administrator on 15-12-3.
 */
var dialog = null;
var dialog_speed = 100;
var ModifyDialog = RichBase.extend({
	statics : {
		modifyBtn : null,
		isPositiveNum : function(count){
			count = String(count);
			var type="^[0-9]*[1-9][0-9]*$";
			var re = new RegExp(type);
			if(count.match(re) == null){
				return false;
			}
			return true;
		}
	},
	init : function(){},
	onCountInpChange : function(tarInp,newVal,oldVal){
		var parent = tarInp.parent();
		var addBtn = parent.children(".addBtn");
		var minuBtn =  parent.children(".minuBtn");
		var min = tarInp.attr("data-min");
		var max = tarInp.attr("data-max");
		var listUl = tarInp.parents(".tlist");
		var listLis = listUl.children();
		var tarListLi = tarInp.parents(".ticketLi");
		if(newVal==oldVal) return false;
		if(newVal>oldVal){ //增加
			if(addBtn.hasClass("disable")) return tarInp.val(oldVal);
			minuBtn.removeClass("disable");
			if(newVal<=max){
				tarInp.val(newVal);
				newVal==max ? addBtn.addClass("disable") : addBtn.removeClass("disable");
			}else{
				addBtn.addClass("disable");
			}
		}else{ //减少
			if(minuBtn.hasClass("disable")) return tarInp.val(oldVal);
			//新需求 2016-03-28
			//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
			//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
			// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
			if(min=="0|1"){
				if(listLis.length){ //如果是联票
					var siblingInps = tarListLi.siblings().find(".numInp");
					var min = (function(siblingInps){
						var min = 1;
						siblingInps.each(function(){
							var tarLi = $(this);
							var val = tarLi.val();
							if(val>0){
								min = 0;
								return false;
							}
						});
						return min;
					})(siblingInps);
				}else{ //如果是单票
					min = 1;
				}
			}
			if(newVal<=min){
				newVal = min;
				minuBtn.addClass("disable");
				if(newVal==1){
					tarListLi.siblings().find(".numInp").each(function(){
						var tarInp = $(this);
						if(tarInp.val()!="0") tarInp.removeClass("disable");
					})
				}
			}else{
				minuBtn.removeClass("disable");
			}
			if(newVal>=max){
				newVal=max;
				addBtn.addClass("disable");
			}else{
				addBtn.removeClass("disable");
			}
			tarInp.val(newVal);
		}
	},
	open : function(tarBtn,ordernum){
		var that = this;
		var title = $("#landTit_"+ordernum).text();
		var dialogTpl = $("#modTicDiaTpl").html();

		var isIncreasable = tarBtn.attr('data-increasable'),
			modRate = tarBtn.attr('data-mod-rate');

		var con = that.parseTemplate(dialogTpl,{ ticketList: "", isIncreasable: isIncreasable, modRate: modRate });
		var listTpl = $("#modTicDiaList").html();
		if(!dialog) dialog = that.createDialog( tarBtn );
		dialog.open({
			title : title,
			content : con,
			offset : -100,
			onBeforeOpen : function(){
				var tickets = tarBtn.attr("data-ticket").split("&");
				var list = "";
				var is_all_not_terminal = (function(tickets){ //判断联票是未验证(即其所有子票均未验证) 还是部分验证
					var result = true;
					for(var i in tickets){
						var t = tickets[i].split("|");
						var has_terminal_num = t[3];
						if(typeof has_terminal_num!="undefined"){
							has_terminal_num = has_terminal_num*1 || 0;
						}else{
							has_terminal_num = 0;
						}
						if(has_terminal_num!==0){
							result = false;
							break;
						}
					}
					return result;
				})(tickets);
				var tmin;
				if(is_all_not_terminal){ //未验证
					tmin = "0|1";
				}else{ //已验证
					tmin = "0";
				}

				//新需求 2016-03-28
				//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
				//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
				// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
				for(var i in tickets){
					var t = tickets[i].split("|");
					var tname = t[0];
					var tnum = t[1];
					var tid = t[2];
					var has_terminal_num = t[3];
					if(typeof has_terminal_num!="undefined"){
						has_terminal_num = has_terminal_num*1;
					}else{
						has_terminal_num = 0;
					}
					var readonly = tnum==1 ? "readonly" : "";
					var addBtnCls = "disable";
					var minusBtnCls = "";
					if(tnum==0) minusBtnCls = "disable";
					list += that.parseTemplate(listTpl,{
						tname : tname,
						tnum : tnum-has_terminal_num,
						has_terminal_num : has_terminal_num,
						tid : tid,
						tmin : tmin,
						addBtnCls : addBtnCls,
						minusBtnCls : minusBtnCls
					});
				}

				that.statics.modifyBtn = tarBtn;
				$("#ticModListUl").html(list);
				$("#modifyTicket_ordernum_hidInp").val(ordernum);
				$("#dialog-yes-btn").attr("data-ordernum",ordernum);
			}
		})
	},
	createDialog : function( tarBtn ){
		var self = this;
		var dialogTpl = $("#modTicDiaTpl").html();

		var isIncreasable = tarBtn.attr('data-increasable'),
			modRate = tarBtn.attr('data-mod-rate');

		var con = self.parseTemplate(dialogTpl,{ ticketList: "", isIncreasable: isIncreasable, modRate: modRate });

		dialog = new PFT.Dialog({
			content : con,
			speed : dialog_speed,
			EVENTS : {
				"click" : {
					//确认修改
					".modTicketDialogCon .modifyBtn" : function(that,e){
						e.preventDefault();
						that.close();
						self.fire("ticket.modify",{
							ordernum : $(e.currentTarget).attr("data-ordernum"),
							tarBtn : self.statics.modifyBtn
						});
					},
					//取消修改
					".modTicketDialogCon .cannelModifyBtn" : function(that,e){
						e.preventDefault();
						that.close();
					},
					//减票数
					".modTicketDialogCon .minuBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal-1;
						self.onCountInpChange(tarInp,newVal,oldVal);
					},
					//加票数
					".modTicketDialogCon .addBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal+1;
						self.onCountInpChange(tarInp,newVal,oldVal);
					}
				},
				"focus" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						tarInp.attr("data-lastval",tarInp.val());
					}
				},
				"blur" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						var val = tarInp.val() * 1;
						var lastVal = tarInp.attr("data-lastval") * 1;
						if(val==lastVal) return false;
						if(!self.statics.isPositiveNum(val)){
							tarInp.val(lastVal);
						}
						self.onCountInpChange(tarInp,val,lastVal);
					}
				}
			}
		});
		return dialog;
	}
});
module.exports = ModifyDialog;