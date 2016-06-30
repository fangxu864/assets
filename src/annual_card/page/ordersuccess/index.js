/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var tpl = require("./tpl.xtpl");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	template : _.template(tpl),
	initialize : function(){
		this.ordernum = PFT.Util.UrlParse()["ordernum"] || "";
		if(!this.ordernum) return alert("缺少ordernum");
		this.getOrderDetail(this.ordernum);
	},
	getOrderDetail : function(ordernum){
		if(!ordernum) return false;
		var that = this;
		PFT.Util.Ajax(Api.Url.ordersuccess.getOrderDetail,{
			params : {
				ordernum : ordernum
			},
			loading : function(){ that.render("loading")},
			complete : function(){ that.render("complete")},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					that.render(data);
				}else{
					that.render("fail",res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	render : function(data){
		var html = "";
		var template = this.template;
		if(data=="loading"){
			html = LoadingPc("努力加载中，请稍后..",{
				width : this.$el.width(),
				height : 300,
				css : {
					"background" : "#fff"
				}
			});
		}else if(data=="complete"){
			html = "";
		}else if(data=="fail"){
			html = '<div style="width:100%; height:300px; line-height:300px; text-align:center">'+arguments[1]+'</div>';
		}else{
			html = template({data:data});
		}
		this.$el.html(html);
	}
});

$(function(){
	new MainView();
})
