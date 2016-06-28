/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var item_tpl = require("./list.item.tpl");
var Api = require("../../common/api.js");
var PaginationSimple = require("COMMON/modules/pagination-simple");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	__cache : {},
	template : _.template(item_tpl),
	events : {
		"click .deleteBtn" : "onDeleteBtnClick"
	},
	initialize : function(){
		var that = this;
		this.listUl = $("#tbody");
		this.pagination = new PaginationSimple({
			container : $("#paginationContainer"),
			keyup : false
		})
		this.pagination.on("next",function(data){

		})
		this.pagination.on("prev",function(data){

		})
		this.pid = PFT.Util.UrlParse()["pid"] || "";
		this.getAnnualCardList(1);
	},
	onDeleteBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var virtual_number = tarBtn.attr("data-virtual");
		if(!virtual_number) return alert("缺少虚拟卡号");
		this.deleteAnnualCard(virtual_number,tarBtn);
	},
	//获取相关产品已生成好的卡片
	getAnnualCardList : function(page,pagesize){
		var that = this;
		var pid = this.pid;
		if(!pid) return alert("缺少产品id");
		page = page || 1;
		pagesize = pagesize || 20;
		var cache = this.__cache[pid];
		//如果已有缓存，则直接走缓存
		if(cache){
			that.updateListUl(cache.list);
			this.pagination.render({current:cache.page,total:cache.total_page});
		}else{
			PFT.Util.Ajax(Api.Url.storage.getList,{
				params : {
					pid : pid,
					page : page,
					page_size : pagesize
				},
				loading : function(){ that.updateListUl("loading")},
				complete : function(){ that.listUl.html("");},
				success : function(res){
					res = res || {};
					var code = res.code;
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					var data = res.data;
					var list = data.cards;
					var current_page = data.page || 1;
					var total_page = data.total_page || 0;
					if(code==200){
						that.updateListUl(list);
						that.pagination.render({current:current_page,total:total_page});
						//存入缓存
						that.__cache[pid] = data;
						if(page==1){
							$("#cardStorage_num").text(data.physics);
							$("#virtualStorage_num").text(data.virtual);
							$("#titleText").text(data.title);
						}
					}else{
						that.updateListUl(msg);
					}
				}
			})
		}
	},
	//删除生成好的卡片
	deleteAnnualCard : function(virtual_no,tarBtn){
		var that = this;
		if(!virtual_no) return false;
		PFT.Ajax(Api.Url.storage.deleteAnnualCard,{
			params : {
				virtual_no : virtual_no
			},
			loading : function(){ tarBtn.addClass("disable").text("正在删除..")},
			complete : function(){ tarBtn.removeClass("disable").text("删除")},
			success : function(res){
				res = res || {};
				var code = res.code;
				var msg = res.msg || PFT.AJAX_SERVER_ERROR_TEXT;
				if(code==200){
					PFT.Util.STip("success",'<p style="width:200px">删除成功</p>');
					tarBtn.parents(".listItem").remove();
					var currentPage = that.pagination.getValue().current;
					that.removeCacheItem(currentPage,virtual_no);
				}else{
					alert(msg);
				}
			}
		})
	},
	//删除缓存里的某一item itemId即为虚拟卡号
	removeCacheItem : function(page,itemId){
		var that = this;
		var cache = this.__cache;
		if(!cache) return false;
		cache = cache[page];
		if(!cache) return false;
		var list = cache.list;
		for(var i in list){
			var d = list[i];
			var virtual = d["virtual_no"];
			if(virtual==itemId){
				that.__cache[page]["list"].splice(i,1);
			}
		}
	},
	//更新列表
	updateListUl : function(data){
		var html = this.template({data:data});
		this.listUl.html(html);
	}

})
$(function(){
	new MainView();
})

