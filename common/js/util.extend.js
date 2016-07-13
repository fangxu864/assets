/**
 * Author: huangzhiyang
 * Date: 2016/6/22 18:43
 * Description: ""
 */
module.exports = function(destination,source){
	for(var n in source){
		if(source.hasOwnProperty(n)){
			destination[n]=source[n];
		}
	}
	return destination;
}