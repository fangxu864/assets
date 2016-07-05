/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var detailTpl = require("./detail.xtpl");
var historyTpl = require("./history-list-item.xtpl");
var Pagination = require("COMMON/modules/pagination-simple");
var MainView = Backbone.View.extend({
	el : $("#memDetailContainer"),
	initialize : function(){
		var that = this;
		var memberid = this.memberid = PFT.Util.UrlParse()["id"];
		this.pagination = new Pagination({
			container : "#paginationContainer",
			keyup : false,
			onNavigation : function(data){
				var toPage = data.toPage;
				that.getHistory(memberid,toPage);
			}
		});
		this.getDetail(memberid);
		this.getHistory(memberid);
	},
	template : _.template(detailTpl),
	history_template : _.template(historyTpl),
	cache : true,
	historyCache : {},
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
		if(!memberid) return false;
		page = page || 1;
		page_size = page_size || 20;
		var that = this;
		var container = $("#historyListContainer");
		var template = this.history_template;
		var pagination = this.pagination;
		var Cache = this.historyCache[page];
		if(Cache && this.cache){ //如果允许缓存并该页已请求过
			var currentPage = Cache.page;
			var totalPage = Cache.total_page;
			var list = Cache.list;
			var html = template({data:list});
			container.html(html);
			pagination.render({current:currentPage,total:totalPage});
		}else{
			PFT.Util.Ajax(Api.Url.memdetail.history,{
				params : {
					memberid : memberid,
					page : page,
					page_size : page_size
				},
				loading : function(){
					var loading = LoadingPc("加载中，请稍后..",{
						tag : "tr",
						height : 150,
						colspan : 8,
						css : {
							"background" : "#fff"
						}
					});
					container.html(loading);
					pagination.render(null)
				},
				complete : function(){
					container.html("");
				},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						var currentPage = data.page;
						var totalPage = data.total_page;
						var list = data.list || [];
						if(list.length==0) totalPage = 0;
						var html = template({data:list});
						container.html(html);
						pagination.render({current:currentPage,total:totalPage});
						that.historyCache[page] = data;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
	}
});

$(function(){
	new MainView;
})