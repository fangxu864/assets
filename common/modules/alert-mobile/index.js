/**
 * Author: huangzhiyang
 * Date: 2016/9/1 9:57
 * use in mobile
 *
 * 手机端模拟alert  ios效果
 *
 *
 * var alert = new Alert();
 * var alert = new PFT.Mobile.Alert();
 *
 * alert.show("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码",function(){
 * 		do something after show
 * })
 *
 * alert.show("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码")
 *
 * alert.show("您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码")
 *
 *
 */
require("./index.scss");
function Alert(){
	var body = this.body = $("body");
	this.container = $('<div class="pftui-alert-container"></div>');
	this.mask = $('<div class="pftui-alert-mask transition" style="display:none"></div>');
	this.alertBox = $('<div class="pftui-alert-box transition" style="display:none"></div>');
	this.hd = $('<div class="pftui-alert-hd"></div>');
	this.bd = $('<div class="pftui-alert-bd"></div>');
	this.fd = $('<div class="pftui-alert-fd">确定</div>');
	this.fd.on("click",this.hide.bind(this));
	this.alertBox.append(this.hd).append(this.bd).append(this.fd);
	this.container.append(this.mask).append(this.alertBox).appendTo(body);
	this.eventType = this.witchEndEvent();
}
Alert.prototype = {
	show : function(title,content,onAfterShow){
		var that = this;
		var args = arguments;
		var args_len = arguments.length;
		var tit = "";
		var con = "";
		var callback = null;
		this.onAlertBoxTransitionEnd = this.onAlertBoxTransitionEnd.bind(this);
		this.onMaskTransitionEnd = this.onMaskTransitionEnd.bind(this);
		if(args_len==1){
			con = args[0];
		}else if(args_len==2){
			if(typeof args[1]=="string"){
				tit = args[0];
				con = args[1];
			}else{
				con = args[0];
				callback = args[1];
			}
		}else if(args_len==3){
			tit = args[0];
			con = args[1];
			callback = args[2]
		}
		tit ? this.hd.show().html(tit) : this.hd.hide();

		this.bd.html(con);

		this.alertBox.addClass("enter");
		this.mask.addClass("enter");
		setTimeout(function(){
			that.alertBox.removeClass("enter");
			that.mask.removeClass("enter");
		},50)
		this.alertBox[0].style = "";
		this.mask[0].style = "";

		callback && callback();

	},
	hide : function(e){
		var eventType = this.eventType;
		this.alertBox[0].addEventListener(eventType,this.onAlertBoxTransitionEnd,false);
		this.mask[0].addEventListener(eventType,this.onMaskTransitionEnd,false);
		this.alertBox.addClass("leave");
		this.mask.addClass("leave");
	},
	onAlertBoxTransitionEnd : function(e){
		var alertBox = e.target;
		alertBox.removeEventListener(this.eventType,this.onAlertBoxTransitionEnd,false);
		alertBox.classList.remove("leave");
		alertBox.style.display = "none";
	},
	onMaskTransitionEnd : function(e){
		var mask = e.target;
		mask.removeEventListener(this.eventType,this.onMaskTransitionEnd,false);
		mask.classList.remove("leave");
		mask.style.display = "none";
	},
	witchEndEvent : function(){
		var elem = document.createElement("div");
		var endEvent = {
			transition : "transitionend",
			WebkitTransition : "WebkitTransitionEnd"
		};
		for(var k in endEvent){
			if(elem.style[k]!=="undefined"){
				return endEvent[k];
			}
		}
	}
}

module.exports = Alert;