/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var Checkbox = require('../common/js/checkbox');

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/app-box.tpl"))
};
var Main = PFT.Util.Class({
	init : function(){

	}
});



$(function(){
	//是否免费试用
	new Checkbox({
		selector: '#chkboxFreeTrial',
		callbacks: {
			toggleFreeTrial: function () {
				if($(this).is('.checked')) {
					$('#daysFreeTrial').prop('disabled', false);
				} else {
					$('#daysFreeTrial').prop('disabled', true);
				}
			}
		}
	});

	//关联推荐
	new Checkbox({
		selector: '#recommendApp .checkbox',
		callbacks: {
			recommendLimited: function (cxt) {
				console.log(this.className)
				if($('#recommendApp').children('.checked').length > 3) {
					cxt.unCheck(this);
					alert('推荐应用不能超过3个');
				}
			}
		}
	});

});