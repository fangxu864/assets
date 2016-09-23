/**
 * Created by Administrator on 16-4-20.
 */
module.exports = function(url){
	if(!url) url = window.location.search.substr(1);
	var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
	var result = {};
	url.replace(reg,function(){
		var key = arguments[2];
		var val = arguments[3] || "";
		result[key] = val;
	})
	return result;
};
