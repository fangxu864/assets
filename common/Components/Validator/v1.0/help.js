/**
 * Author: huangzhiyang
 * Date: 2016/12/26 15:49
 * Description: ""
 */
module.exports = {
	toString : Object.prototype.toString,
	isArray : function(array){
		return this.toString.call(array)==="[object Array]";
	},
	isObject : function(object){
		return this.toString.call(object)==="[object Object]";
	}
};