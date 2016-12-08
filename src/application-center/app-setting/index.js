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

$(function(){
    $(document).on('click', '.checkbox', function(e){
        e.preventDefault ? e.preventDefault() : e.returnValue = false ;

        if($(this).is('.disabled')) {
            return false;
        } else {
            $(this).toggleClass('checked').children(':checkbox').prop('checked',!!$(this).is('.checked'));
            var myFn = $.trim($(this).attr('data-fn'));
            if(myFn && typeof window.myFn == 'function') {
                window.myFn.call(this);
            }
        }
    });
});