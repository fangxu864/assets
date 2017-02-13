

var tpl = require("./index.xtpl");

module.exports = function(parent,aid,pid){


	var container = $(tpl).appendTo(parent);
	
	var Line = PFT.Util.Class({
		container : container,
		init : function(){
			this.aid = aid;
			this.pid = pid;
		}
	});


	return new Line;

}


















