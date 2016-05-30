/**
 * Author: huangzhiyang
 * Date: 2016/5/30 18:03
 * Description: ""
 */
require("./style.scss");
var Search = Backbone.View.extend({
	initialize : function(){
		$("#page-index").append($(require("./tpl.html")));
	}
});
module.exports = function(){
	return new Search();
}