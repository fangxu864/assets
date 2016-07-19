/**
 * Created by Administrator on 15-10-20.
 */
require("COMMON/css/base/reset_old_fix.scss");
require("../css/style.css");
var Api = require("./modules/api.js");
var Product = require("./modules/product.js");
var OrderList = require("./modules/order.list.js");
var Main = RichBase.extend({
	init : function(){
		this.searchOrderBtn = $("#termSearBtn");
		this.voucherInp = $("#termSearInp");
		this.product = new Product({container:$("#productListPage")});
		this.orderList = new OrderList();
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.searchOrderBtn.on("click",function(e){
			that.onSearchOrderBtnClick(that,e);
		})
		if(!"placeholder" in document.createElement("input")){ //如果不支持placeholder
			var placeholder = "凭证码 / 手机号";
			this.voucherInp.on("focus",function(e){
				var tarInp = $(e.currentTarget);
				if(tarInp.val()==placeholder) tarInp.val("");
			})
			this.voucherInp.on("blur",function(e){
				var tarInp = $(e.currentTarget);
				if(!tarInp.val()) tarInp.val(placeholder);
			})
		}
	},
	onSearchOrderBtnClick : function(that,e){
		var searchBtn = that.searchOrderBtn;
		var voucher = $.trim(that.voucherInp.val());
		if(searchBtn.hasClass("disable") || !voucher) return false;
		that.orderList.query(Api.getSalerid(),voucher);
	}
});

$(function(){ new Main();})


