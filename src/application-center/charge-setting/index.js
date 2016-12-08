/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Datepicker = require("COMMON/modules/datepicker");

// 建议一个页面只new一次datepicker

var datepicker = new Datepicker();

datepicker.show("2016-09-20",{
    picker : '#effectiveDate',              //必选
    top : 0,                     //可选，相对偏移量
    left : 0,                    //可选，相对偏移量
    min : "2016-09-10",          //可选，默认为空""
    min : "2016-09-20",          //可选，默认为空""
    todayBeforeDisable : false,  //可选，今天之前的日期都不显示
    todayAfterDisable : false,   //可选，今天之后的日期都不显示
})


datepicker.show("2016-09-20",{
    picker : '#expiryDate',              //必选
    top : 0,                     //可选，相对偏移量
    left : 0,                    //可选，相对偏移量
    min : "2016-09-10",          //可选，默认为空""
    min : "2016-09-20",          //可选，默认为空""
    todayBeforeDisable : false,  //可选，今天之前的日期都不显示
    todayAfterDisable : false,   //可选，今天之后的日期都不显示
})

datepicker.show("2016-09-20",opt);

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/app-box.tpl"))
};
var Main = PFT.Util.Class({
	init : function(){
		this.renderAppBox({
			id : "121",
			name : "微商城",
			iconCls : "sMall",
			priceText : ""

		})








	},
	renderAppBox : function(data){
		var html = Template.appBox(data);
		console.log(html);
	}
});
