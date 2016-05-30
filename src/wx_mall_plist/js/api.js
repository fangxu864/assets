/**
 * Author: huangzhiyang
 * Date: 2016/5/30 19:32
 * Description: ""
 */
var Debug = true;
var Ajax = require("COMMON/js/util.ajax");
var Promise = require("COMMON/js/util.promise");
var Api = {
	api : "wx/api/v0.0.3/order.php?action=topic_list",
	getTopic : function(){
		var defer = Promise();
		if(Debug){
			setTimeout(function(){
				defer.resolve(["爱上古迹", "逐海踏浪", "度假山庄", "激情漂流", "城市观光", "乐游山水", "文化追根", "主题乐园", "温泉养生", "水世界", "激情漂流"])
			},1000)
		}else{

		}
		return defer.promise;
	}
};
module.exports = Api;