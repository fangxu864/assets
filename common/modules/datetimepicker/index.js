/**
 * Author: huangzhiyang
 * Date: 2016/9/22 18:35
 * Description: ""
 */
var Datepicker = PFT.Util.Class({
	init : function(opt){
		opt = opt || {};
		this.container = opt.container;
	}
});

//datepicker.open("",{
//	picker : "",
//	min : "",
//	max : "",
//	hour : "",
//	minute : "",
//	second : "",
//	todayBeforeDisable : true,
//	todayAfterDisable : true,
//	onBefore : function(){},
//	onAfter : function(){}
//});

var _datepicker = null;
module.exports = function(){
	if(_datepicker) return _datepicker;
	_datepicker = new Datepicker({
		container : "#container"
	});
	return _datepicker;
}



