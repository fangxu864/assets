/**
 * Author: huangzhiyang
 * Date: 2016/9/21 12:05
 * Description: ""
 */
require("./index.scss");
var Tpl = require("../../../terminal/view/order.item.html");
console.log(Tpl)
var Terminal = PFT.Util.Class({
	container : "#tabPanel-terminal",
	init : function(){},
	disable : function(){
		this.container.hide();
	},
	enable : function(){
		this.container.show();
	}
});
module.exports = Terminal;