/**
 * Author: huangzhiyang
 * Date: 2016/7/15 15:04
 * Description: ""
 */
module.exports = function(dest,source){
	for(var i in source){
		if(typeof dest[i]==="undefined"){
			dest[i] = source[i];
		}
	}
	return dest;
}