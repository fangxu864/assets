/**
 * Author: huangzhiyang
 * Date: 2017/1/13 14:31
 * Description: ""
 */
require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
module.exports = function(parent){
	var RecentUse = PFT.Util.Class({
		debug : true,
		container : $('<div id="RecentUseBox" class="RecentUseBox modBox"></div>').appendTo(parent),
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			var Apps = window.localStorage.getItem("PFT-RECENT-APP_A").split(",");
			this.render(Apps);
		},
		render : function(data){
			var html = this.template({list:data});
			this.container.html(html);
		}
	});
	return new RecentUse;

};