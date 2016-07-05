/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var detailTpl = require("./detail.xtpl");
var MainView = Backbone.View.extend({
	el : $("#detailContainer"),
	initialize : function(){
		this.memberid = PFT.Util.UrlParse()["id"];
		this.getDetail(this.memberid);
	},
	template : _.template(detailTpl),
	getDetail : function(memberid){
		var that = this;
		if(!memberid) return false;
		PFT.Util.Ajax(Api.Url.memdetail.detail,{
			params : {
				memberid : memberid
			},
			loading : function(){
				var loading = LoadingPc("加载中，请稍后..",{
					tag : "div",
					height : 500,
					css : {
						"background" : "#fff"
					}
				});
				that.$el.html(loading);
			},
			complete : function(){
				that.$el.html("");
			},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					that.$el.html(that.template({data:data}));
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	getHistory : function(memberid,page,page_size){
		if(!memberid || !page) return false;
		page_size = page_size || 20;

	}
});

$(function(){
	new MainView;
})