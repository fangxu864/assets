/**
 * Created by Administrator on 15-10-21.
 */
var Core = require("./core.js");
var Searchor = require("./search.js");
var searchor = null;
var ListManager = require("./list.manager.js");
var Query = RichBase.extend({
	fn : new Function,
	statics : {
		INIT_SEARCH_ITEMS : false,
		SCROLL_TO_GETMORE_MAX_PAGE : 5,
		PAGESIZE : 5,
		hasMore : true,
		dataIsLoading : false,
		cache : true,
		cacheData : {},
		getCurrentPage : function(){
			return this.currentPage*1 || (this.currentPage=1);
		},
		setCurrentPage : function(page){
			if(!page) return false;
			this.currentPage = page*1;
		},
		setParam_last : function(last){
			if(last) this.last = last;
		},
		getParam_last : function(){
			return this.last || "";
		},
		tpl : {
			getMoreBtn : function(){
				return '<li id="getMoreBtn" class="getMoreBtn"><a href="javascript:;">点击加载更多</a></li>'
			}
		}
	},
	allowScrollToMore : true,
	get_ifAllowScrollToMore : function(){
		return this.allowScrollToMore;
	},
	set_ifAllowScrollToMore : function(boolean){
		this.allowScrollToMore = boolean;
	},
	init : function(){
		var that = this;
		var cache = this.statics.cache;
		var cacheData = this.statics.cacheData;
		this.listUl = $("#orderListUl");
		this.listManager = new ListManager({container:$("#orderListUl")});
		searchor = new Searchor({container:$("#searchWrap")});
		searchor.on("search",function(data){
			var params = that.serializeParams(Searchor.getParams());
			var _cacheData = cacheData[params];
			if(cache && _cacheData){
				that.statics.setCurrentPage(_cacheData["currentPage"]);
				that.statics.hasMore = _cacheData["hasMore"];
				that.updateListUl(_cacheData["lands"]);
			}else{
				that.initGet();
			}
		})
		searchor.on("reset",function(data){
			var params = that.serializeParams(Searchor.getParams());
			var _cacheData = cacheData[params];
			if(cache && _cacheData){
				that.statics.setCurrentPage(_cacheData["currentPage"]);
				that.statics.hasMore = _cacheData["hasMore"];
				that.updateListUl(_cacheData["lands"]);
			}else{
				that.initGet();
			}
		})
		this.listManager.on("getMoreBtn.click",function(e){
			that.getMore();
		})
	},
	//取后端数据核心方法
	fetchData : function(opt){
		var that = this;
		var fn = this.fn;
		var opt = opt || {};
		var page = opt.page || 1;
		var api = $("#debugInp").val()==1 ? Core.api.query_debug : Core.api.query;
		var pagesize = opt.pagesize || Core.PAGE_SIZE;
		var ttimeout = Core.AJAX_TIMEOUT;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var fail = opt.fail || fn;
		var timeout = opt.timeout || fn;
		var unlogin = opt.unlogin || fn;
		var serverError = opt.serverError || fn;
		var data = Searchor.getParams() || {};

		//2016-03-18新增 传入分销商id 及帐号account
		var disDname_text = $("#disDname_text");
		var fsid = disDname_text.attr("data-id");
		var fsaccount = disDname_text.attr("data-account");
		if(fsid) data["fsid"] = fsid;
		if(fsaccount) data["fsaccount"] = fsaccount;

		data["currentPage"] = page;
		data["pageSize"] = pagesize;
		data["last"] = this.statics.getParam_last();
		PFT.Ajax({
			url : api,
			type : "get",
			dataType : "json",
			data : data,
			ttimeout : ttimeout,
			loading : function(){
				that.statics.dataIsLoading = true;
				loading();
			},
			removeLoading : function(){
				that.statics.dataIsLoading = false;
				removeLoading()
			},
			timeout : function(res){
				timeout(res);
			},
			serverError : function(res){
				serverError(res);
			}
		},function(res){
			var res = that.calculatePrice(res);
			var status = res.status;
			var page = res.currentPage * 1;
			var list = res.lands;
			that.statics.setCurrentPage(page);
			if(res.code==0) return unlogin(res);
			if(status=="success"){
				var params = that.serializeParams(data);
				var cacheData = that.statics.cacheData;
				that.statics.setParam_last(res.last || "")
				if(!PFT.Help.isEmptyObj(list)){
					that.statics.hasMore = true;
					success(res);
					//加入缓存
					if(that.statics.cache){
						var lands = res.lands;
						if(!cacheData[params]) cacheData[params] = {};
						cacheData[params]["currentPage"] = page;
						cacheData[params]["hasMore"] = true;
						if(!cacheData[params]["lands"]) cacheData[params]["lands"] = {};
						for(var i in lands) cacheData[params]["lands"][i] = lands[i];
					}
				}else{
					that.statics.hasMore = false;
					empty(res);
					if(that.statics.cache && cacheData[params]) cacheData[params]["hasMore"] = false;
				}
				if(!that.statics.INIT_SEARCH_ITEMS){
					that.statics.INIT_SEARCH_ITEMS = true;
					searchor.initSearchItem(res);
				}
			}else{
				fail(res);
			}
		})
	},
	serializeParams : function(params){
		var ltitle = params.ltitle || "";
		var ptype = params.ptype || "";
		var provice = params.provice || "";
		var city = params.city || "";
		var topic = params.topic || "";
		return "ltitle="+ltitle+"&ptype="+ptype+"&provice="+provice+"&city="+city+"&topic="+topic;
	},
	initGet : function(){
		var that = this;
		var listUl = this.listUl;
		var loadingImg = Core.LOADING_IMG;
		this.statics.setCurrentPage(1);
		this.fetchData({
			page : 1,
			loading : function(){
				listUl.html('<li class="status initGetLoading"><img class="loadingImg" src="'+loadingImg+'" alt=""/><span class="t">正在加载数据...</span></li>')
			},
			removeLoading : function(){
				listUl.html("");
			},
			success : function(res){
				that.updateListUl(res.lands);
			},
			empty : function(res){
				listUl.html('<li id="" class="status getMoreEmpty">没有更多产品了...</li>');
			},
			unlogin : function(res){
				var r = window.confirm("登录状态已过期，是否返回重新登录？");
				if(r) window.location.href = "dlogin_n.html";
			},
			fail : function(res){ alert("请求出错，请稍后重试")},
			timeout : function(res){ alert("请求超时，请稍后重试")},
			serverError : function(res){
				//alert("请求出错，请稍后重试");
			}
		})
	},
	getMore : function(){
		var that = this;
		if(!this.statics.hasMore || this.statics.dataIsLoading) return false;
		var listUl = this.listUl;
		var currentPage = this.statics.getCurrentPage();
		var loadingImg = Core.LOADING_IMG;
		that.statics.hasMore = false;
		this.fetchData({
			page : currentPage+1,
			loading : function(){
				$("#getMoreBtn").remove();
				listUl.append('<li id="getMoreLoadingStatus" class="status getMoreLoading"><img class="loadingImg" src="'+loadingImg+'" alt=""/><span class="t">正在加载数据...</span></li>')
			},
			removeLoading : function(){
				$("#getMoreLoadingStatus").remove();
			},
			success : function(res){
				that.updateListUl(res.lands,"append");
			},
			empty : function(res){
				listUl.append('<li id="" class="status getMoreEmpty">没有更多产品了...</li>');
			},
			unlogin : function(res){
				var r = window.confirm("登录状态已过期，是否返回重新登录？");
				if(r) window.location.href = "dlogin_n.html";
			},
			fail : function(res){ alert("请求出错，请稍后重试")},
			timeout : function(res){ alert("请求超时，请稍后重试")},
			serverError : function(res){ alert("请求出错，请稍后重试")}
		})
	},
	//计算票里最低的价格(结算价)
	calculatePrice : function(res){
		var data = res.lands;
		for(var i in data){
			var tickets = data[i]["ticket"];
			var minPrice = "undefined";
			for(var t in tickets){
				var tic = tickets[t];
				var jsprice = tic["js"] * 1;
				if(minPrice==="undefined") minPrice = jsprice;
				if(minPrice>=jsprice) minPrice = jsprice;
			}
			data[i]["minprice"] = minPrice;
		}
		return res;
	},
	renderHtml : function(data){
		var dispatch = $("#disDname_text");
		var fsid = dispatch.attr("data-id");
		var fsaccount = dispatch.attr("data-account");
		var fsname = dispatch.text();
		for(var i in data){
//			data[i]["fsid"] = (fsid && fsaccount) ? ("&fsid="+fsid) : "";
//			data[i]["fsaccount"] = (fsid && fsaccount) ? ("&fsaccount="+fsaccount) : "";
//			data[i]["fsname"] = (fsid && fsaccount && fsname) ? ("&fsname="+fsname) : "";
			data[i]["fsid"] = (fsid && fsaccount) ? fsid : "";
			data[i]["fsaccount"] = (fsid && fsaccount) ? fsaccount : "";
			data[i]["fsname"] = (fsid && fsaccount && fsname) ? fsname : "";
		}
		var tpl = $("#orderlist_item_tpl").html();
		var template = _.template(tpl);
		var html = template({data:data});
		return html;
	},
	updateListUl : function(data,type){
		var that = this;
		var html = this.renderHtml(data);
		var listUl = this.listUl;
		var statics = this.statics;
		var maxPage = statics.SCROLL_TO_GETMORE_MAX_PAGE;
		var currentPage = statics.getCurrentPage();
		if(currentPage>=maxPage){
			that.set_ifAllowScrollToMore(false);
			html += statics.tpl.getMoreBtn();
		}else{
			that.set_ifAllowScrollToMore(true)
		}
		if(type!=="append"){
			listUl.html(html);
		}else{
			listUl.append(html);
		}
		setTimeout(function(){
			that.listManager.autoFixTicketUl();
		},100)
	}
});
module.exports = Query;