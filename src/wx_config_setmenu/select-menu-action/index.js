/**
 * Author: huangzhiyang
 * Date: 2016/7/29 11:13
 * Description: ""
 */
require("./index.scss");
var tpl = require("./index.xtpl");
var Mix = require("COMMON/js/util.mix.js");
var Pubsub = require("COMMON/js/util.pubsub.js");
var Bind = function(func, context, var_args) {
	var slice = [].slice;
	var a = slice.call(arguments, 2);
	return function(){
		return func.apply(context, a.concat(slice.call(arguments)));
	};
};
function Main(){
	this.init()
}
Main.prototype = Mix({
	init : function(){
		$("body").append(tpl);
		this.mask = $("#menuActionDialogMask")
		this.container = $("#menuActionDialogContainer");
		this.title = $("#menuActionTitleText");
		this.closeBtn = $("#menuActionClaseBtn");
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".menuActionClaseBtn",Bind(this.close,this))
		this.container.on("click",".footerBtnGroup .no",Bind(this.close,this))
	},
	open : function(parentid,id,text){
		this.fire("openBefore");
		this.container.show();
		this.mask.fadeIn();
		this.fire("openAfter");
	},
	close : function(){
		this.fire("closeBefore");
		this.container.hide();
		this.mask.fadeOut();
		this.fire("closeAfter");
	}
},Pubsub);

module.exports = Main;