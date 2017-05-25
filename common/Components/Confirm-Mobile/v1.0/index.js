/**
 * Author: huangzhiyang
 * Date: 2016/11/4 17:23
 * Description: ""
 *
 * how to use:
 * 		PFT.Mobile.Confirm("您的帐号登录状态已过期，是否重新登录",function(result){
 * 				if(result==true){
 * 					dosomething();
 * 				}else{
 * 					donothing();
 * 				}
 * 		},{
 *			header : "温馨提示",
 *			yesText : "ok是的",
 *			cancelText : "不了"
 * 		});
 * PFT.Mobile.Confirm("您的帐号登录状态已过期，是否重新登录","温馨提示");
 *
 * 模拟window.confirm，在手机端，如果需要confirm，请用PFT.Mobile.Confirm()替代原生window.confirm;
 * @param msg               要alert的信息 (必填)
 * @param callback(result)  回调函数，用户点击确定或取消，都在这个回调里执行你的业务代码  回调函数的参数result为true || false   点击确定为true  点击取消为false
 * @param opt               opt.header   弹出窗顶部title标题  (可选)
 * @param opt               opt.yesText  确定按钮可自定义文字  (可选)
 * @param opt               opt.cancelText  取消按钮可自定义文字  (可选)
 * @constructor
 */
require("./index.scss");
function Confirm(msg,callback,opt){
	var zIndex = 5000;
	var $body = $("body");
	var yesText = "确定";
	var cancelText = "取消";
	callback = callback || function(){};

	var show = function(){
		alertBox.addClass("entry");
		alertMask.addClass("entry");
		setTimeout(function(){
			alertBox.removeClass("entry").addClass("transition");
			alertMask.removeClass("entry").addClass("transition");
		},20);
	};

	var close = function(){
		alertBox.removeClass("transition").addClass("leave");
		alertMask.removeClass("transition").addClass("leave");
		setTimeout(function(){
			alertBox.removeClass("leave").off().remove();
			alertMask.removeClass("leave").off().remove();
		},300)
	};


	//创建dom元素  单例
	var alertBox = $("#pui-m-confirmBox");
	if(!alertBox.length){
		alertBox = $('<div id="pui-m-confirmBox" class="pui-m-confirmBox"></div>').css({
			zIndex : zIndex + 1
		}).appendTo($body);
		alertBox.on("click",".confirmFoot .btn",function(e){
			var tarBtn = $(e.currentTarget);
			close();
			if(tarBtn.hasClass("yes")){
				callback(true);
			}else{
				callback(false);
			}
		})
	}
	alertBox.html("");

	var alertMask = $("#pui-m-confirmMask");
	if(!alertMask.length) alertMask = $('<div id="pui-m-confirmMask" class="pui-m-confirmMask"></div>').css({
		zIndex : zIndex
	}).appendTo($body);

	if(Object.prototype.toString.call(opt)=="[object Object]"){
		var header = opt.header;
		yesText = opt.yesText ? opt.yesText : yesText;
		cancelText = opt.cancelText ? opt.cancelText : cancelText;
		if(header){
			var headerBox = $('<div class="confirmHeaderBox"></div>').appendTo(alertBox);
			headerBox.append(header);
		}
	}

	var conBox = $('<div class="confirmConBox"></div>').appendTo(alertBox);
	msg = typeof msg=="string" ? msg : typeof msg=="function" ? msg() : null;
	if(msg) conBox.append(msg);

	var foot = $('<div class="confirmFoot"><span class="cancelBtn btn cancel">'+cancelText+'</span><span class="yesBtn btn yes">'+yesText+'</span></div>').appendTo(alertBox);


	show();


}

module.exports = Confirm;


