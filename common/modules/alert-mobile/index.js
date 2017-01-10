/**
 * Author: huangzhiyang
 * Date: 2016/9/1 9:57
 * use in mobile
 *
 * 手机端模拟alert  ios效果
 *
 *
 * var Alert = PFT.Mobile.Alert;
 * Alert("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码",function(){
 * 		do something after show
 * })
 *
 * Alert("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码")
 *
 * Alert("您的帐号密码设置过于简单，存在被盗风险，请尽快修改密码")
 *
 *
 */
require("./index.scss");
var Alert = {
	show : function(title,content,onAfterShow){
		if($("#pftui-alert-container").length==0) this._create();
		this._show(title,content,onAfterShow);
	},
	hide : function(e){
		var eventType = this.eventType || (this.eventType = this._witchEndEvent());
		this.alertBox[0].addEventListener(eventType,this._onAlertBoxTransitionEnd,false);
		this.mask[0].addEventListener(eventType,this._onMaskTransitionEnd,false);
		this.alertBox.addClass("leave");
		this.mask.addClass("leave");
	},
	_onAlertBoxTransitionEnd : function(e){
		var alertBox = e.target;
		alertBox.removeEventListener(this.eventType,this._onAlertBoxTransitionEnd,false);
		alertBox.classList.remove("leave");
		alertBox.style.display = "none";
	},
	_onMaskTransitionEnd : function(e){
		var mask = e.target;
		mask.removeEventListener(this.eventType,this._onMaskTransitionEnd,false);
		mask.classList.remove("leave");
		mask.style.display = "none";
	},
	_witchEndEvent : function(){
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
	},
	_create : function(){
		var body = $("body");
		this.container = $('<div id="pftui-alert-container" class="pftui-alert-container"></div>');
		this.mask = $('<div class="pftui-alert-mask transition" style="display:none"></div>');
		this.alertBox = $('<div class="pftui-alert-box transition" style="display:none"></div>');
		this.hd = $('<div class="pftui-alert-hd"></div>');
		this.bd = $('<div class="pftui-alert-bd"></div>');
		this.fd = $('<div class="pftui-alert-fd">确定</div>');
		this.alertBox.append(this.hd).append(this.bd).append(this.fd);
		this.container.append(this.mask).append(this.alertBox).appendTo(body);
		this.fd.on("click",this.hide.bind(this));
	},
	_show : function(title,content,onAfterShow){
		var that = this;
		var args = arguments;
		var args_len = arguments.length;
		var tit = "";
		var con = "";
		var callback = null;
		this._onAlertBoxTransitionEnd = this._onAlertBoxTransitionEnd.bind(this);
		this._onMaskTransitionEnd = this._onMaskTransitionEnd.bind(this);
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
	}
};

module.exports = function(title,content,onAfterShow){
	Alert.show(title,content,onAfterShow)
};