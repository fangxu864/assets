/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 */
require("./index.scss");

var UserInfo = require("./modules/userinfo");
var RecentUse = require("./modules/recent-use");


var Main = PFT.Util.Class({
	container : $("#G_Body"),
	init : function(){

		this.inContainer = $('<div id="inBodyCon" class="inBodyCon"></div>');
		this.pageMain = $('<div id="pageMain" class="pageMain"></div>');
		this.rightBar = $('<div id="rigbtBar" class="rigbtBar"></div>');
		this.inContainer.append(this.pageMain).append(this.rightBar);

		this.container.append(this.inContainer);

		this.userInfo = UserInfo(this.pageMain);

		this.recentUse = RecentUse(this.pageMain);


	}
});


$(function(){

	new Main;

})

