/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/app-box.tpl"))
};
var Main = PFT.Util.Class({
	init : function(){

	}
});

var Checkbox = function(opts) {
	var option = {
		selector: '.checkbox',
		callbacks: null
	};

	this.opts = $.extend({}, option, opts);

	this.init();
}
Checkbox.prototype = {
	init: function () {
		var _this = this,
			callbacks = _this.opts.callbacks;

	    $(document).on('click', _this.opts.selector, function(e){
	        e.preventDefault ? e.preventDefault() : e.returnValue = false ;

	        if($(this).is('.disabled')) {
	            return false;
	        } else {
	            $(this).toggleClass('checked').children(':checkbox').prop('checked', !!$(this).is('.checked'));
	            var myFn = $.trim($(this).attr('data-fn'));

	            if(myFn && typeof callbacks[myFn] == 'function') {
	                callbacks[myFn].call(this, _this);
	            }
	        }
	    });
	},
	unCheck: function ( ele ) {
		$(ele).removeClass('checked').children(':checkbox').prop('checked', false);
	}
}

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