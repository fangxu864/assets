/**
 * Author: huangzhiyang
 * Date: 2016/11/4 17:23
 * Description: ""
 *
 * how to use:
 * PFT.Mobile.Alert("您的帐号登录状态已过期，请重新登录");
 * PFT.Mobile.Alert("您的帐号登录状态已过期，请重新登录","温馨提示");
 *
 * 模拟window.alert，在手机端，如果需要alert，请用PFT.Mobile.Alert()替代原生window.alert;
 * @param msg       要alert的信息 (必填)
 * @param header    alert时，顶部的title (可选)
 * @constructor
 */
require("./index.scss");
function Alert(msg,header){
	var zIndex = 5000;
	var $body = $("body");

	var show = function(){
		alertBox.addClass("entry");
		alertMask.addClass("entry");
		setTimeout(function(){
			alertBox.removeClass("entry").addClass("transition");
			alertMask.removeClass("entry").addClass("transition");
			setTimeout(function(){
				alertBox.removeClass("transition").addClass("leave");
				alertMask.removeClass("transition").addClass("leave");
			},200)
		},20);
	};

	var close = function(){
		alertBox.removeClass("transition").addClass("leave");
		alertMask.removeClass("transition").addClass("leave");
		setTimeout(function(){
			alertBox.removeClass("leave");
			alertMask.removeClass("leave");
		},300)
	};

	//创建dom元素  单例
	var alertBox = $("#pui-m-alertBox");
	if(!alertBox.length){
		alertBox = $('<div id="pui-m-alertBox" class="pui-m-alertBox"></div>').css({
			zIndex : zIndex + 1
		}).appendTo($body);
		alertBox.on("click",".alertFoot",function(e){
			close();
		})
	}
	alertBox.html("");

	var alertMask = $("#pui-m-alertMask");
	if(!alertMask.length) alertMask = $('<div id="pui-m-alertMask" class="pui-m-alertMask"></div>').css({
		zIndex : zIndex
	}).appendTo($body);

	if(header){
		var headerBox = $('<div class="alertHeaderBox"></div>').appendTo(alertBox);
		if(typeof header=="function"){
			header = header();
			headerBox.append(header);
		}else if(typeof header=="string"){
			headerBox.append(header);
		}else if(header.length){ //jq元素
			headerBox.append(header);
		}else if(header.nodeType==1){ //dom元素
			headerBox.append($(header));
		}
	}

	var conBox = $('<div class="alertConBox"></div>').appendTo(alertBox);
	msg = typeof msg=="string" ? msg : typeof msg=="function" ? msg() : null;
	if(msg) conBox.append(msg);

	var foot = $('<div class="alertFoot">确定</div>').appendTo(alertBox);


	show();


}

module.exports = Alert;


