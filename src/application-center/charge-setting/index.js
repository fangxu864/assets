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
		_this.datepicker = new Datepicker();

		var minEffectDate = new Date(),
			minEffectDateArr = [];

		minEffectDateArr.push(minEffectDate.getFullYear());
		minEffectDateArr.push(minEffectDate.getMonth() + 1);
		minEffectDateArr.push(minEffectDate.getDate());

		//生效日期
		$('#effectiveDate').on('click', function() {
			_this.datepicker.show("",{
			    picker : $("#effectiveDate"),              //必选
			    top : 0,                     //可选，相对偏移量
			    left : 0,                    //可选，相对偏移量
			    min : minEffectDateArr.join('-'),          //可选，默认为空""
			    todayBeforeDisable : false,  //可选，今天之前的日期都不显示
			    todayAfterDisable : false,   //可选，今天之后的日期都不显示
			})
		});
		$('#expiryDate').on('click', function() {
			_this.datepicker.show("2016-09-20",{
			    picker : $("#expiryDate"),              //必选
			    top : 0,                     //可选，相对偏移量
			    left : 0,                    //可选，相对偏移量
			    min : "2016-09-10",          //可选，默认为空""
			    todayBeforeDisable : false,  //可选，今天之前的日期都不显示
			    todayAfterDisable : false,   //可选，今天之后的日期都不显示
			})
		});
	},

});

$(function () {
	new Main();
})