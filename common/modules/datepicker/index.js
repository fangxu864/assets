/**
 * Author: huangzhiyang
 * Date: 2016/9/13 17:46
 * Description: ""
 */
var datepicker = null;
var Datepicker = PFT.Util.Class({
	init : function(opt){
		var d = Datepicker({

		});
		d.show("2016-05-12",{
			picker : "",
			top : 0,
			left : 0,
			time
		})
	}
});


module.exports = function(opt){
	if(!datepicker) datepicker = new Datepicker(opt);
	return datepicker;
}
