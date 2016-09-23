/**
 * Author: huangzhiyang
 * Date: 2016/8/3 9:27
 * Description: ""
 */
module.exports = function(obj){
	var _isEmpty = true;
	for(var i in obj){
		_isEmpty = false;
		break;
	}
	return _isEmpty;
};