/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Checkbox = require('../common/js/checkbox');

var Datepicker = require("COMMON/modules/datepicker");

var Main = PFT.Util.Class({
	init : function(){
		//应用模块选择
		new Checkbox({
			selector: '#appList .checkbox'
		});

		var _this = this;
		this.datepicker = new Datepicker();



		//生效日期
		$('#effectiveDate').on('click', function() {
			var minEffectDate = _this.dateFormat( new Date(), 'yyyy-MM-dd'),
				opts = {};

			opts.defaultDate = $(this).val();
			opts.picker = $("#effectiveDate");
			opts.min = minEffectDate;

			_this.showDatepicker(opts);
		});
		$('#expiryDate').on('click', function() {
			var minEffectDate = $('#effectiveDate').val() ? $('#effectiveDate').val() : _this.dateFormat( new Date(), 'yyyy-MM-dd'),
				opts = {};

			opts.defaultDate = $(this).val();
			opts.picker = $("#expiryDate");
			opts.min = minEffectDate;

			_this.showDatepicker(opts);
		});
	},
	dateFormat: function (dateObj, fmt) {
	    var o = {
	        "M+": dateObj.getMonth() + 1, //月份
	        "d+": dateObj.getDate(), //日
	        "h+": dateObj.getHours(), //小时
	        "m+": dateObj.getMinutes(), //分
	        "s+": dateObj.getSeconds(), //秒
	        "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
	        "S": dateObj.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	},
	showDatepicker: function (opts) {
		var defaultDate = opts.defaultDate ? opts.defaultDate : '',
			min 		= opts.min ? opts.min : _this.dateFormat( new Date(), 'yyyy-MM-dd');

		this.datepicker.show( defaultDate,{
		    picker : opts.picker,				//必选
		    top : 0,							//可选，相对偏移量
		    left : 0,							//可选，相对偏移量
		    min : min,							//可选，默认为空""
		    todayBeforeDisable : false,			//可选，今天之前的日期都不显示
		    todayAfterDisable : false,			//可选，今天之后的日期都不显示
		})
	}
});

$(function () {
	new Main();
})