/**
 * Author: huangzhiyang
 * Date: 2016/11/4 17:23
 * Description: ""
 *
 * how to use:
 * PFT.Mobile.Confirm("您的帐号登录状态已过期，是否重新登录");
 * PFT.Mobile.Confirm("您的帐号登录状态已过期，是否重新登录","温馨提示");
 *
 * 模拟window.confirm，在手机端，如果需要confirm，请用PFT.Mobile.Confirm()替代原生window.confirm;
 * @param msg       要alert的信息 (必填)
 * @param header    alert时，顶部的title (可选)
 * @constructor
 */
require("./index.scss");
function Confirm(msg,header,opt){
	var zIndex = 5000;
	var $body = $("body");
	var yesText = "确定";
	var cancelText = "取消";




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
			alertBox.removeClass("leave");
			alertMask.removeClass("leave");
		},300)
	};


	//创建dom元素  单例
	var alertBox = $("#pui-m-confirmBox");
	if(!alertBox.length){
		alertBox = $('<div id="pui-m-confirmBox" class="pui-m-confirmBox"></div>').css({
			zIndex : zIndex + 1
		}).appendTo($body);
		alertBox.on("click",".confirmFoot .btn",function(e){

			close();
		})
	}
	alertBox.html("");

	var alertMask = $("#pui-m-confirmMask");
	if(!alertMask.length) alertMask = $('<div id="pui-m-confirmMask" class="pui-m-confirmMask"></div>').css({
		zIndex : zIndex
	}).appendTo($body);

	if(Object.prototype.toString.call(header)=="[object Object]"){

	}else if(header){
		var headerBox = $('<div class="confirmHeaderBox"></div>').appendTo(alertBox);
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

	var conBox = $('<div class="confirmConBox"></div>').appendTo(alertBox);
	msg = typeof msg=="string" ? msg : typeof msg=="function" ? msg() : null;
	if(msg) conBox.append(msg);

	var foot = $('<div class="confirmFoot"><span class="cancelBtn btn cancel">'+cancelText+'</span><span class="yesBtn btn yes">'+yesText+'</span></div>').appendTo(alertBox);


	show();


}

module.exports = Confirm;


