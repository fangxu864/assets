/**
 * Author: huangzhiyang
 * Date: 2016/5/25 18:20
 * Description: ""
 */
module.exports = function(){
	var result = {
		width : 0,
		height : 0
	};
	if(window.innerWidth){
		result.width = window.innerWidth;
		result.height = window.innerHeight;
	}else if(document.documentElement && document.documentElement.clientWidth){
		result.width = document.documentElement.clientWidth;
		result.height = document.documentElement.clientHeight;
	}else{
		result.width = document.body.clientWidth;
		result.height = document.body.clientHeight;
	}
	return result;
}