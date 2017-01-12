/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
module.exports = function(parent){

	var container = $('<div id="UserInfoBox" class="UserInfoBox modBox"></div>').appendTo(parent);

	var UserInfo = PFT.Util.Class({
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			console.log(this.container);
			this.render();
		},
		render : function(data){
			var html = this.template(data || {});
			this.container.html(html);
		}
	});


	return new UserInfo;
};