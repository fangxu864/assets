/**
 * Author: huangzhiyang
 * Date: 2016/5/30 19:31
 * Description: ""
 */
var List = Backbone.View.extend({
	initialize : function(opt){
		this.Api = opt.Api;

	}
});
module.exports = function(opt){
	var opt = opt || {};
	var Api = opt.Api;
	return new List({Api:Api});
}