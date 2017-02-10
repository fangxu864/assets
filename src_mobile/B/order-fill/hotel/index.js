

var tpl = require("./index.xtpl");

module.exports = function(parent){


	var container = $(tpl).appendTo(parent);

	console.log(tpl);

	var Hotel = PFT.Util.Class({
		container : container,
		init : function(){
		}
	});


	return new Hotel;

}


















