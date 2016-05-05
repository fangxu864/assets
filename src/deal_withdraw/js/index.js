/**
 * Created by Administrator on 16-5-5.
 */
var Dialog = require("COMMON/modules/easydialog");
var DialogCard = require("./modules/dialog.card.js");

var Main = {
	init : function(){
		this.bindEvents();
	},
	bindEvents : function(){
		DialogCard.open({
			title : "添加银行卡",
			dialog : Dialog
		});
	}
};


$(function(){
	Main.init()
})


