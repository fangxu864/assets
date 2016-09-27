/**
 * Created by Administrator on 15-11-19.
 */
require("../css/orderquery.css");
var Query = require("./modules/query");
var queryor = null;
var Main = RichBase.extend({
	init : function(){
		queryor = new Query();
	}
});

$(function(){new Main();});
$(function ($) {
	$("#fs_select_box span.t").on("click",function(e){
		var _this=$(this);
		e.stopPropagation();
		_this.toggleClass("up");
		_this.toggleClass("down");
		var ul= $("#fs_select_box ul.select");
		if(ul.css("display")=="none"){
			ul.show(100);
			ul.on("click","li",function (e) {
				$("#distorsInp").val("");
				$("#distorsInp").attr("data-distorid","");
				_this.html($(this).html());
				_this.attr("search_type",$(this).attr("search_type"));
			});
			$(document).on("click.closeul",function () {
				_this.toggleClass("up");
				_this.toggleClass("down");
				ul.hide();
				ul.off();
				$(document).off("click.closeul");
			})
		}else{
			ul.hide(100);
			ul.off();
			$(document).off("click.closeul");
		}
	})

});
$(function ($) {
	$("#distorsInp").on("input propertychange",function () {
		if($(this).val()==""){
			$(this).attr("data-distorid","");
		}else{
			$(this).attr("data-distorid","999999999999999");
		}
	})
});


