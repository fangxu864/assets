/**
 * Author: huangzhiyang
 * Date: 2016/6/16 17:34
 * Description: ""
 */
require("./index.scss");
var tpl = require("./index.xtpl");
var Loading = {
	_create : function(){
		$("body").append(tpl);
		return $("#gLoadingBox");
	},
	show : function(text,callback){
		var args = arguments;
		if(typeof args[0]=="string"){
			text = text;
			callback = typeof callback=="function" ? callback : function(){};
		}else if(typeof args[0]=="function"){
			callback = text;
			text = "请稍后...";
		}else{
			text = "请稍后...";
			callback = function(){};
		}
		var box = $("#gLoadingBox");
		if(box.length){
			$("#gLoadingBox").css({display:block,zIndex:10001});
		}else{
			box = this._create();
			box.css({display:"block",zIndex:10001});
		}
		box.find(".c-toast_content").text(text);
		callback();
	},
	close : function(callback){
		$("#gLoadingBox").css({display:"none",zIndex:-1});
		callback && callback();
	}
};
module.exports = Loading;