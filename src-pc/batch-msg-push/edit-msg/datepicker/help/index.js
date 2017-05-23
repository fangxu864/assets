/**
 * Author: huangzhiyang
 * Date: 2016/9/23 9:17
 * Description: ""
 */
exports.getUUID = (function(){
	var __uid = 0;
	return function(){
		return __uid++;
	}
})();
