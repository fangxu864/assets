/**
 * Author: huangzhiyang
 * Date: 2016/5/24 17:15
 * Description: ""
 */
var api = {
	adaptor : function(url){
		var hostname = window.location.hostname.split(".")[0];
		if(hostname=="wx"){

		}else{ //独立域名、二级域名

		}
	},
	get : function(controller,action){
		if(!controller) return "";
		if(action) return "/r/"+controller+"/"+action+"/";
		return function(action){
			return "/r/"+controller+"/"+action+"/";
		}
	}



};
module.exports = api;