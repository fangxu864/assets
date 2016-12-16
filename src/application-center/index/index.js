/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var AppList = require("./applist.js");

// var Template = {
// 	appBox : PFT.Util.ParseTemplate(require("./tpl/app-box.tpl"))
// };

var Main = PFT.Util.Class({
	init : function(){
		// this.renderAppBox({
		// 	id : "121",
		// 	name : "微商城",
		// 	iconCls : "sMall",
		// 	priceText : ""

		// })
			
		new AppList();

	},
	renderAppBox : function(data){
		// var html = Template.appBox(data);
		// console.log(html);
	}
});


$(function(){
	new Main();
});



