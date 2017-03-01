/**
 * Author: huangzhiyang
 * Date: 2016/7/29 17:25
 * Description: ""
 */
module.exports = function(func, context, var_args) {
	var slice = [].slice;
	var a = slice.call(arguments, 2);
	return function(){
		return func.apply(context, a.concat(slice.call(arguments)));
	};
};