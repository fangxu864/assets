/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:01
 * Description: ""
 */
require("./index.scss")
var Dialog = require("./bank-dialog");
var BankManager = function(){
	this.bankListUl = $("#bankListUl");
	this.addBankBtn = $("#addbk");
	this.Dialog = new Dialog();
	this.bindEvents();
}
BankManager.prototype = {
	bindEvents : function(){
		var that = this;
		var Dialog = this.Dialog;
		//添加银行�?
		this.addBankBtn.on("click",function(e){
			var type = $(e.currentTarget).attr("type");
			Dialog.open({
				mode : "create",
				type : type
			});
		})
		this.bankListUl.on("click",".click_li",function(e){
			var tarLi = $(e.currentTarget);
			tarLi.addClass("checked").siblings("li").removeClass("checked");
		})
		//配置银行�?
		this.bankListUl.on("click",".card_config",function(e){
			var tarBtn = $(e.currentTarget);
			var province_id = tarBtn.attr("bank_province");
			var city_id = tarBtn.attr("bank_city");
			var bank_id = tarBtn.attr("bank_id");
			var card_number = tarBtn.attr("bank_num");
			var username = tarBtn.attr("username");
			var subBank_id = tarBtn.attr("code");
			var type = tarBtn.attr("type");
			var acc_type = tarBtn.attr("acc_type");
			Dialog.open({
				mode : "edit",
				bank_id : bank_id,
				subBank_id : subBank_id,
				province_id : province_id,
				city_id : city_id,
				card_number : card_number,
				account_name : username,
				type : type,
				card_type : acc_type
			})
		})
		//删除银行�?
		this.bankListUl.on("click",".delete",function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			if(!confirm("确定要删除该银行卡？")) return false;
			var bankname = tarBtn.attr("bankname");
			that.deleteCard(bankname,tarBtn);
		})
		this.Dialog.on("submit",function(data){
			var submitBtn = data.submitBtn;
			var submitData = data.submitData;
			var mode = data.mode;
			that.submit(submitBtn,submitData,mode)
		})

	},
	//添加、配置银行卡
	submit : function(submitBtn,submitData,mode){
		var tip = mode=="create" ? "添加" : "配置";
		PFT.Util.Ajax("call/handle.php?from=withdraw_card",{
			type : "post",
			params : submitData,
			loading : function(){
				submitBtn.addClass("disable");
			},
			complete : function(){
				submitBtn.removeClass("disable");
			},
			success : function(res){
				res = res || {};
				if(res.outcome==1){
					window.location.reload();
				}else{
					alert(tip+"失败，失败原因：\n"+(res.msg || PFT.AJAX_ERROR_TEXT));
				}
			}
		})
	},
	deleteCard : function(bankname,tarBtn){
		if(!bankname) return false;
		var url = "call/handle.php?from=withdraw_dele&bankaccount="+bankname;
		PFT.Util.Ajax(url,{
			loading : function(){
				tarBtn.addClass("disable").text("正在删除...");
			},
			complete : function(){
				tarBtn.removeClass("disable").text("删除");
			},
			success : function(res){
				res = res || {};
				if(res.outcome==1){
					window.location.reload();
				}else{
					alert("删除失败");
				}
			}
		})
	}
};

$(function(){
	new BankManager();
})