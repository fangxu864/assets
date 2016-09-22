/**
 * Author: huangzhiyang
 * Date: 2016/9/21 12:05
 * Description: ""
 */
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