/**
 * Author: huangzhiyang
 * Date: 2016/6/27 18:55
 * Description: ""
 */
var SDialog = require("COMMON/modules/dialog-simple");
var tpl = require("./index.xtpl");
var Dialog = function(){
	this.SDialog = new SDialog({
		width : "",
		height : "",
		content : "",
		events : {}
	});
};
Dialog.prototype = {
	open : function(){
		this.SDialog.open();
	},
	close : function(){
		this.SDialog.close();
	}
};
module.exports = Dialog;