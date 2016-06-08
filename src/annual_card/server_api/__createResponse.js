/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:04
 * Description: ""
 */
module.exports = function(code,data,msg){
	var code = code || 0;
	var data = data || {};
	var msg = msg || "";
	return JSON.stringify({
		code : code,
		data : data,
		msg : msg
	})
}