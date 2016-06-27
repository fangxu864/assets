/**
 * Author: huangzhiyang
 * Date: 2016/6/17 15:24
 * Description: ""
 */
/**
 * pc端全局loading效果
 * @param text loading时显示的文字
 * @param opt  附加选项
 * @constructor
 */
var Loading = function(text,opt){
	text = text || "请稍后...";
	opt = opt || {}
	var tag = opt.tag || "div";
	var width = opt.width+"px" || "100%";
	var height = opt.height || 150;
	var loadingImg = opt.loadingImg || {};
	var imgWidth = loadingImg.width || 24;
	var top = loadingImg.top || 0;
	var className = opt.className || "";
	var td_colspan = opt.colspan || 1;
	var id = opt.id || "";
	var html = "";
	var css = opt.css || {};
	var style = "";
	for(var i in css) style += i+":"+css[i]+"; ";
	var imgSrc = 'http://static.12301.cc/assets/build/images/gloading.gif';
	html += '<'+tag+' id="'+id+'" style="width:'+width+'; height:'+height+'px; line-height:'+height+'px; text-align:center; '+style+'" class="'+className+'">';
	if(tag=="tr"||tag=="td") html += '<td colspan="'+td_colspan+'">';
	html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
	html +=     '<span class="t">'+text+'</span>';
	if(tag=="tr"||tag=="td") html += '</td>';
	html += '</'+tag+'>';
	return html;
};
module.exports = Loading;