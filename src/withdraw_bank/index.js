/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:01
 * Description: ""
 */
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
		this.addBankBtn.on("click",function(e){
			Dialog.open();
		})
	}
};

$(function(){
	new BankManager();
})