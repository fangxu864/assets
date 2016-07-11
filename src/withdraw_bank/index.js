/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:01
 * Description: ""
 */
var Dialog = require("./bank-dialog");
var Api = require("./api.js");
var BankManager = function(){
	this.bankListUl = $("#bankListUl");
	this.addBankBtn = $("#addbk");
	this.Dialog = new Dialog();
	this.bindEvents();
}
BankManager.prototype = {
	__bankList : null,
	__province : null,
	bindEvents : function(){
		var that = this;
		var Dialog = this.Dialog;
		this.addBankBtn.on("click",function(e){
			Dialog.open();
			if(!that.__bankList && !that.__province) that.getList();
		})
	},
	getList : function(){
		Api.getList({
			loading : function(){},
			complete : function(){},
			success : function(res){
				var data = res.data;
				
			}
		})
	}
};

$(function(){
	new BankManager();
})