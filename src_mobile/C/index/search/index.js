/**
 * Author: huangzhiyang
 * Date: 2016/10/17 17:27
 * Description: ""
 */
var Search = PFT.Util.Class({
	init : function(){
		var container = $('<div id="searchListPage" class="searchListPage"></div>');
		this.$body = $("body");
		this.$body.append(container);
	},
	show : function(){

	},
	hide : function(){}
});
module.exports = Search;