/**
 * Author: huangzhiyang
 * Date: 2016/5/30 10:30
 * Description: ""
 */
/**
 * ·â×°alert
 * @string type  success fail  warn
 * @string content
 * @number duration
 * @function callback
 * @returns {boolean}
 * @constructor
 */
function Alert(type,content,duration,callback){
	var type  = type || "success";
	var duration = duration || 1 * 1000;
	var timer = null;
	if(!content) return false;
	var wrap = $("#gTopAlertContainer");
	if(!wrap.length){
		wrap = $('<div style="display:none" id="gTopAlertContainer"></div>');
		var styleTxt = '#gTopAlertContainer{ position:fixed; z-index:1000; left:50%; top:-35px; height:35px; padding:0 30px; line-height:35px; font-size:14px; color:#fff; text-align:center; background:#fff;-webkit-box-shadow:1px 1px 2px rgba(0,0,0,.3);box-shadow:1px 1px 2px rgba(0,0,0,.3);}#gTopAlertContainer p{ width:180px;}#gTopAlertContainer.success{ background:#3eba40}#gTopAlertContainer.fail{ background:#df262a}#gTopAlertContainer.error{ background:#df262a}'
		var style = $('<style type="text/css">'+styleTxt+'</style>');
		$("body").append(wrap);
		$("head").append(style);
	}
	wrap.hide();
	wrap.removeClass("success").removeClass("error").removeClass("fail").removeClass("wran");
	wrap.addClass(type);
	wrap.html(content);
	setTimeout(function(){
		wrap = $("#gTopAlertContainer");
		var width = wrap.outerWidth(true);
		var height = wrap.outerHeight(true);
		wrap.show().css({"marginLeft":-width/2,"top":-height-2});
		wrap.animate({top:0},"normal",function(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				wrap.animate({top:-height-2},"normal",function(){
					callback && callback();
					clearTimeout(timer);
				})
			},duration)
		})
	},0)
}
module.exports = Alert;