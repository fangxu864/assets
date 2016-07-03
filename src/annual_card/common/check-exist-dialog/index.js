/**
 * Author: huangzhiyang
 * Date: 2016/6/27 18:55
 * Description: ""
 */
require("./index.scss");
var SDialog = require("COMMON/modules/dialog-simple");
var tpl = require("./index.xtpl");
var Dialog = function(){
	var that = this;
	this.submitData = {};
	this.SDialog = new SDialog({
		width : 520,
		height : 280,
		content : tpl,
		drag : true,
		events : {
			"click #replaceBtn" : function(e){
				that.onReplaceBtnClick(e);
			},
			"click #messageBtn" : function(e){
				that.onMessageBtnClick(e);
			}
		}
	});
};
Dialog.prototype = {
	open : function(opt){
		opt = opt || {};
		var mobile = opt.mobile;
		var idCard = opt.idCard;
		var name = opt.name;
		var left = opt.left;
		this.submitData = opt.submitData;
		this.SDialog.open({
			onBefore : function(){
				$("#existDialog_mobile").text(mobile);
				$("#existDialog_idCard").text(idCard);
				$("#existDialog_name").text(name+"（"+left+"）");
			}
		});
	},
	close : function(){
		this.SDialog.close();
	},
	on : function(type,handler){
		this.SDialog.on(type,handler);
	},
	//替换并且直接下单
	onReplaceBtnClick : function(e){
		this.SDialog.trigger("replaceAndSubmit",this.submitData,this);
	},
	//取消
	onMessageBtnClick : function(e){
		this.close();
	}
};
module.exports = Dialog;