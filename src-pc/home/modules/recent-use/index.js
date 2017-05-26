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
		container : $('<div id="RecentUseBox" class="RecentUseBox modBox"></div>').hide().appendTo(parent),
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			var KEY = PFT.Util.getRecentAppStorageKey();
			var Apps = window.localStorage.getItem(KEY);
			if(Apps){
				 Apps = Apps.split(",");
				 this.render(Apps);
			}
		},
		render : function(data){
			var html = this.template({list:data});
			this.container.show().html(html);
		}
	});
	return new RecentUse;

};