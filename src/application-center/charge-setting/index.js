/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Checkbox = require('../common/js/checkbox');

var Datepicker = require("COMMON/modules/datepicker");

var ajaxUrls = require('../common/js/ajaxurl.js');

var ParseTemplate = PFT.Util.ParseTemplate;

var Template = {
	option : ParseTemplate(require("./tpl/option.xtpl")),
	checkbox: ParseTemplate(require("./tpl/checkbox.xtpl")),
};

var Main = PFT.Util.Class({
	dom: {
			paneltitle: '#panelTitle',
			appname: 	'#appName',
			applist: 	'#appList',
			appmode: 	'#appMode',
			appcharge: 	'#appCharge',
			begin: 		'#effectiveDate',
			end: 		'#expiryDate'
	},
	init : function(){
		var _this = this;

		var dom = _this.dom;

		var url = window.location.href,
			urlArr = url.split('?'),
			isEdit = urlArr.length > 1 ? true : false,
			id = isEdit ? urlArr[1].split('=')[1] : null;

		if( isEdit ) {
			$(dom.paneltitle).html('编辑资费');
			$(dom.appname).show();
			$(dom.applist).hide();

			_this.ajaxGetData({
				id: id,
				success: function( resData ) {
					$(dom.appname).html( resData.name );
					_this.ajaxGetMode( resData.mode );
					$(dom.appcharge).val( resData.fee );
					$(dom.begin).val( resData.begin_time );
					$(dom.end).val( resData.end_time );
				}
			})
		} else {
			$(dom.paneltitle).html('新增资费');
			$(dom.appname).hide();
			$(dom.applist).show();

			_this.ajaxGetApps();
			_this.ajaxGetMode();
		}

		_this.datepicker = new Datepicker();

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

	// 获取付费模式
	ajaxGetMode: function( defaultmode ) {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getMode , {
			success: function(res) {

				if(res.code == 200) {
					_this.renderSelect( res.data , defaultmode );
				} else {
					// opts.error && opts.error( res.code );
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
		})
	},

	// 获取所有模块
	ajaxGetApps: function() {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.appList , {
			success: function(res) {

				if(res.code == 200) {
					_this.renderCheckbox( res.data );
				} else {
					// opts.error && opts.error( res.code );
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
		});
	},

	// 获取初始数据
	ajaxGetData: function (opts) {
		PFT.Util.Ajax( ajaxUrls.singleCharge , {
			params: {
				traiff_id: opts.id
			},
			loading: function(){

			},
			success: function(res) {
				if(res.code == 200) {
					opts.success( res.data );
				} else {
					// opts.error && opts.error( res.code );
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
		})
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
	},
	renderSelect : function( data, defaultmode ){
		var html = Template.option({ data: data , defaultmode: defaultmode });
		$(this.dom.appmode).append(html);
	},
	renderCheckbox: function( data ) {
		var html = Template.checkbox({ data: data });
		$(this.dom.applist).html(html);

		//应用模块选择
		new Checkbox({
			selector: this.dom.applist + ' .checkbox'
		});
	}
});

$(function () {
	new Main();
})