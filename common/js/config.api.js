/**
 * Author: huangzhiyang
 * Date: 2016/5/24 17:15
 * Description: ""
 */
var api = {
	get : function(controller,action){
		if(!controller) return "";
		var action = (action+"/") || "";
		return "r/"+controller+"/"+action;
	}
};
module.exports = api;