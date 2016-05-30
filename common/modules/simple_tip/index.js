/**
 * Author: huangzhiyang
 * Date: 2016/5/27 18:56
 * Description: ""
 */
/**
 * 封装alert
 * @string type  success fail  warn
 * @string content
 * @number duration
 * @function callback
 * @returns {boolean}
 * @constructor
 */
require("./style.css");
function Alert(type,content,duration,callback){
	var type  = type || "success";
	var duration = duration || 1 * 1000;
	if(!content) return false;
	var wrap = $("#gTopAlertContainer");
	if(!wrap.length){
		wrap = $('<div id="gTopAlertContainer"></div>');
		$("body").append(wrap);
	}
	wrap.removeClass("success").removeClass("error").removeClass("fail");
	wrap.addClass(type);
	wrap.html(content);
	setTimeout(function(){
		wrap = $("#gTopAlertContainer");
		var width = wrap.outerWidth(true);
		var height = wrap.outerHeight(true);
		wrap.css({"marginLeft":-width/2,"top":-height-2});
		wrap.animate({top:0},"normal",function(){
			var Delay = new PFT_GLOBAL.U.Delay();
			Delay.set(function(){
				wrap.animate({top:-height-2},"normal",function(){
					callback && callback();
				})
			},duration)
		})
	},0)
}
module.exports = Alert;