/**
 * Author: huangzhiyang
 * Date: 16-5-9 下午2:16
 * Description: ""
 */
require("../css/bind_bank_dialog.css");
var Dialog = require("COMMON/modules/easydialog");
var DialogCard = require("./view/dialog.bank.card.js");
var DialogCardModel = require("./model/dialog.bank.card.model.js");
var MainView = Backbone.View.extend({
	el : "#accountWrap",
	events : {
		"click #addbk" : "onAddBankBtnClick"
	},
	initialize : function(){
		this.dialogCard = new DialogCard({
			dialog : Dialog,
			model : new DialogCardModel
		})
	},
	onAddBankBtnClick : function(){
		this.dialogCard.open();
	}
});




$(function(){
	new MainView();
})


