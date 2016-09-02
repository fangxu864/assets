/**
 * Author: huangzhiyang
 * Date: 2016/9/1 14:57
 * use in mobile
 *
 * 手机端模拟confirm  ios效果
 *
 *
 * var confirm = new Confirm();
 * var confirm = new PFT.Mobile.Confirm();
 * confirm.on("yes",function(){
 * 		console.log("用户点击了确定按钮");
 * })
 * confirm.on("cancel",function(){
 * 		console.log("用户点击了取消按钮");
 * })
 *
 * confirm.show("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，是否修改密码？",function(){
 * 		do something after show
 * })
 *
 * confirm.show("温馨提醒","您的帐号密码设置过于简单，存在被盗风险，是否修改密码？")
 *
 * confirm.show("您的帐号密码设置过于简单，存在被盗风险，是否修改密码？")
 *
 *
 *
 */
function Confirm(){
	this.result = null;
	var body = this.body = $("body");
	this.container = $('<div class="pftui-alert-container"></div>');
	this.mask = $('<div class="pftui-alert-mask transition" style="display:none"></div>');
	this.alertBox = $('<div class="pftui-alert-box transition" style="display:none"></div>');
	this.hd = $('<div class="pftui-alert-hd"></div>');
	this.bd = $('<div class="pftui-alert-bd"></div>');
	this.fd = $('<div class="pftui-alert-fd"></div>');
	this.yesBtn = $('<div class="pftui-confirm-btn yesBtn">确定</div>');
	this.cancelBtn = $('<div class="pftui-confirm-btn cancelBtn">取消</div>');
	this.fd.append(this.cancelBtn).append(this.yesBtn);
	this.fd.on("click",this.onBtnClick.bind(this));
	this.alertBox.append(this.hd).append(this.bd).append(this.fd);
	this.container.append(this.mask).append(this.alertBox).appendTo(body);
	this.eventType = this.witchEndEvent();
}
Confirm.prototype = PFT.Util.Mixin({
	show : function(){
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
		},0)
		this.alertBox[0].style = "";
		this.mask[0].style = "";

		callback && callback();
	},
	onBtnClick : function(e){
		var tarBtn = e.target;
		var classList = tarBtn.classList;
		if(classList.contains("yesBtn")){
			this.result = "yes";
		}else{
			this.result = "cancel";
		}
		this.hide(e);
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
		var type = this.result == "yes" ? "yes" : "cancel";
		this.trigger(type);
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
},PFT.Util.PubSub);


module.exports = Confirm;