/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:48
 * Description: ""
 */
var Dialog = require("COMMON/modules/dialog-simple");
var dialog_content = require("./index.xtpl");
var Main = function(){
	this.dialog = new Dialog({
		width : 680,
		height : 350,
		content : dialog_content,
		drag : true,
		events : {
			
		}
	})
};
Main.prototype = {
	open : function(opt){
		this.dialog.open(opt);
	}
};
module.exports = Main;