/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-21.
	 */
	var Core = __webpack_require__(1);
	var Query = __webpack_require__(2);
	var Queryor = null;
	var Main = RichBase.extend({
		init : function(){
			var that = this;
			Queryor = new Query();
			var gotopBtn = $("#gotopBtn");
			var advanceSearchBox = $("#advanceSearchBox");
	//		var leftBar = $("#special_w").children(".left_memb");
			var leftBar = $("#siteLeftBar").children(".left_memb");
			var leftBarH = leftBar.height();
			var ListContainer = new PFT.ListContainer({
				container : $(window),
				distanceToBottom : 0
			});
			ListContainer.on("scrollAtBottom",function(data){
				if(Queryor.get_ifAllowScrollToMore()) Queryor.getMore();
			})
			ListContainer.on("scroll",function(data){
				var scrollTop = data.scrollTop;
				if(scrollTop>200){
					gotopBtn.fadeIn("normal");
				}else{
					gotopBtn.fadeOut("normal");
				}
				if(scrollTop>leftBarH){
					leftBar.addClass("fixed");
				}else{
					leftBar.removeClass("fixed");
				}
				if(scrollTop>184){
					$("#fixDisSwitchor_backup").show();
					$("#fixDisSwitchor").addClass("fixed");
				}else{
					$("#fixDisSwitchor_backup").hide();
					$("#fixDisSwitchor").removeClass("fixed");
				}
			})
	
			gotopBtn.on("click",function(e){
				$("html,body").animate({scrollTop:0})
			})
	
			Queryor.initGet();
	
			if($("#fixDisSwitchor").length){
				var Jidiao = __webpack_require__(5);
				var dispatch = $("#disDname_text");
				this.jidiao = new Jidiao();
				this.jidiao.on("dis.change",function(data){
					var id = data.id;
					var account = data.account;
					var dname = data.dname;
					dispatch.attr("data-id",id).attr("data-account",account).text(dname);
					Queryor.initGet();
				})
				$("#switchDisBtn").on("click",function(e){
					if($(this).hasClass("disable")) return false;
					var id = dispatch.attr("data-id");
					var account = dispatch.attr("data-account");
					var dname = dispatch.text();
					that.jidiao.showPop({
						id : id,
						account : account,
						dname : dname
					});
				})
			}
	
		}
	})
	
	$(function(){ new Main()})

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-10-21.
	 */
	var Core = RichBase.extend({
		statics : {
			AJAX_TIMEOUT : 10 * 1000,
			PAGE_SIZE : 5,
			DEFAULT_IMG : "http://www.12301.cc/images/defaultThum.jpg",
			LOADING_IMG : "http://www.12301.cc/images/icons/gloading.gif",
			api : {
				query : "api/inside/plist.php",
				query_debug : "api/inside/plist_dev.php"
			}
		}
	
	});
	module.exports = Core;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-21.
	 */
	var Core = __webpack_require__(1);
	var Searchor = __webpack_require__(3);
	var searchor = null;
	var ListManager = __webpack_require__(4);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-10-21.
	 */
	var Searchor = RichBase.extend({
		statics : {
			getParams : function(){
				var params = {};
				var keyword = this.getKeyword();
				var ptype = this.getPtype();
				var provid = this.getProvid();
				var cityid = this.getCityid();
				var topic = this.getTopic();
				params["ltitle"] = keyword;
				params["ptype"] = ptype;
				params["provice"] = provid;
				params["city"] = cityid;
				params["topic"] = topic;
				return params;
			},
			getKeyword : function(){
				return $("#searchInp").val();
			},
			getPtype : function(){
				return $("#ptypeParmUl").children(".active").attr("data-ptype") || "";
			},
			getProvid : function(){
				return $("#proviceParamUl").children(".active").attr("data-provice") || "";
			},
			getCityid : function(){
				return $("#cityParamUl").children(".active").attr("data-city") || "";
			},
			getTopic : function(){
				return $("#topicParamUl").children(".active").attr("data-topic") || "";
			}
		},
		EVENTS : {
			"click" : {
				".advanceSearchBox .toggleBtn" : "onAdanceSearchMoreClick",
				".advanceSearchBox .item" : "onAdanceSearchItemClick",
				".searchBtn" : "onSearchBtnClick",
				".recoverSearchBtn" : "onRecoverSearchBtnClick"
			}
		},
		init : function(opt){
			this.container = opt.container;
			var moreSearchTrigger = this.moreSearchTrigger = $("#moreSearchTrigger");
			var advanceSearchBox = this.advanceSearchBox = $("#advanceSearchBox");
		},
		initSearchItem : function(data){
			var themes = data.themes;
			var provs = data.provices;
			var dthemes = {};
			var dprovs = {};
			for(var i in themes){
				dthemes[i] = {};
				dthemes[i]["name"] = i;
				dthemes[i]["count"] = themes[i];
			}
			for(var i in provs){
				dprovs[i] = {};
				dprovs[i]["name"] = provs[i]["name"];
			}
			var provsHtml = this.builtSearchItem({
				title : "所在省份",
				param : "provice",
				data : dprovs
			});
	//		var citysHtml = this.builtSearchItem({
	//			title : "所在城市",
	//			param : "city",
	//			data : citys
	//		});
			var tmemesHtml = this.builtSearchItem({
				title : "旅游主题",
				param : "topic",
				data : dthemes
			});
			this.advanceSearchBox.children(".con").append(tmemesHtml);
			this.initSelect(data);
		},
		initSelect : function(data){
			var that = this;
			var data = this.statics.Provice_City_Cache = data.provices || {};
			var provs = [{province:"",text:"不限"}];
			var getCitysByProvid = function(id){
				var res = [{city:"",text:"不限"}];
				if(!data[id]) return res;
				var citys = data[id]["citys"];
				for(var i in citys){
					var d = citys[i];
					var js = {};
					js["city"] = i;
					js["text"] = d.name;
					res.push(js);
				}
				return res;
			};
			for(var i in data){
				var d = data[i];
				var js = {};
				js["province"] = i;
				js["text"] = d.name;
				provs.push(js);
			}
			this.pSelect = new PFT.UI.Select({
				triggerInp : $("#pSelectTrigger"),
				iconBtn : $("#pSelectTriggerIcon"),
				paramId : "province",
				isFilter : false,
				tpl : function(){
					return '<li class="ui-select-option" data-province="<%=province%>"><span class="t"><%=text%></span></li>'
				},
				filter : function(data,keyword){},
				data : provs
			})
			this.cSelect = new PFT.UI.Select({
				triggerInp : $("#cSelectTrigger"),
				iconBtn : $("#cSelectTriggerIcon"),
				paramId : "city",
				isFilter : true,
				tpl : function(){
					return '<li class="ui-select-option" data-city="<%=city%>"><span class="t"><%=text%></span></li>'
				},
				filter : function(data,keyword){
					var res = [];
					for(var i in data){
						var d = data[i];
						var text = d["text"];
						if(text.indexOf(keyword)>-1) res.push(d);
					}
					return res;
				},
				data : []
			})
			this.pSelect.on("option.click",function(data){
				var provinceId = data.id;
				var citys = getCitysByProvid(provinceId);
				that.cSelect.setData(citys);
				that.cSelect.updateListUl();
			})
		},
		onAdanceSearchMoreClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			tarBtn.toggleClass("on");
			tarBtn.prev().toggleClass("on");
		},
		onAdanceSearchItemClick : function(that,e){
			var tarItem = $(e.currentTarget);
			if(tarItem.hasClass("active")) return false;
			tarItem.addClass("active").siblings().removeClass("active");
		},
		onSearchBtnClick : function(that,e){
			that.fire("search",that.statics.getParams());
		},
		onRecoverSearchBtnClick : function(that,e){
			that.resetAllSearch();
			that.fire("reset");
		},
		resetAllSearch : function(){
			$("#searchInp").val("");
			$("#ptypeParmUl").children(".first").addClass("active").siblings().removeClass("active");
	//		$("#proviceParamUl").children(".first").addClass("active").siblings().removeClass("active");
	//		$("#cityParamUl").children(".first").addClass("active").siblings().removeClass("active");
			$("#topicParamUl").children(".first").addClass("active").siblings().removeClass("active");
			this.pSelect.refresh();
		},
		builtSearchItem : function(opt){
			var title = opt.title;
			var param = opt.param;
			var data = opt.data;
			var html = "";
			if(data && Object.prototype.toString.call(data)=="[object Object]" && !PFT.Help.isEmptyObj(data)){
				html += '<div class="line"><div class="inCon"><div class="lt">'+title+'</div><ul id="'+param+'ParamUl" class="listUl '+param+'ParamUl">';
				html += '<li class="item first active"><a href="javascript:;" data-'+param+'="">全部</a></li>';
				for(var i in data){
					var d = data[i];
					var name = d["name"];
					html += '<li class="item" data-'+param+'="'+i+'"><a href="javascript:;"><span class="name">'+name+'</span></a></li>';
				}
				html += '</ul></div><a class="toggleBtn" href="javascript:;"><span class="t">更多</span><i class="iconfont down">&#xe673;</i><i class="iconfont up">&#xe695;</i></a></div>';
			}
			return html;
		}
	});
	module.exports = Searchor;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-10-22.
	 */
	var ListManager = RichBase.extend({
		statics : {
			MAX_TICKETUL_SIZE : 3
		},
		EVENTS : {
			"click" : {
				".ticTypeToggleBtn" : "onTicTypeToggleBtnClick",
				".slideTicketUlBtn" : "onSlideTicketUlBtnClick",
				".getMoreBtn" : "onGetMoreBtnClick",
				".ticketUl .refBtn" : "onRefreshPriceBtnClick"
			}
		},
		onTicTypeToggleBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			var parent = tarBtn.parents(".line");
			var tipBox = parent.children(".ticketTypeMsgBox");
			tarBtn.toggleClass("on");
			tipBox.slideToggle();
		},
		onSlideTicketUlBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return e.stopPropagation();
			tarBtn.toggleClass("on");
			var ticketUl = tarBtn.prev(".ticketUl");
			var oHeight = ticketUl.attr("data-oheight");
			var sHeight = ticketUl.attr("data-sheight");
			if(tarBtn.hasClass("on")){
				ticketUl.css({height:"auto"})
			}else{
				ticketUl.animate({height:sHeight});
			}
		},
		init : function(opt){
	//		this.container = opt.container;
			this.container = $("#orderListUl");
			this.autoFixTicketUl();
		},
		onGetMoreBtnClick : function(that,e){
			that.fire("getMoreBtn.click")
		},
		//获取实时价格
		onRefreshPriceBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var pid = tarBtn.attr("data-pid");
			var aid = tarBtn.attr("data-aid");
			var tid = tarBtn.attr("data-tid");
			var fsid = tarBtn.attr("data-fsid");
			var fsaccount = tarBtn.attr("data-fsaccount");
			if(!pid || !aid ||!tid) return false;
			var loadingImg = "http://www.12301.cc/images/icons/gloading.gif";
			var line = tarBtn.parents(".line");
			var col_4 = line.children(".col_4");
			var col_5 = line.children(".col_5");
			var data = {
				act : "RefreshPrice",
				pid : pid,
				aid : aid,
				tid : tid
			};
			if(fsid && fsaccount){
				data["fsid"] = fsid;
				data["fsaccount"] = fsaccount;
			}
			PFT.Ajax({
				url : "api/inside/plist.php",
				type : "get",
				dataType : "json",
				data : data,
				loading : function(){
					tarBtn.addClass("disable");
					col_4.append('<img style="width:22px" class="loading" src="'+loadingImg+'"/>').find(".priceBox").hide();
					col_5.append('<img style="width:22px" class="loading" src="'+loadingImg+'"/>').find(".priceBox").hide();
				},
				removeLoading : function(){
					tarBtn.removeClass("disable");
					col_4.find('.loading').remove().end().find(".priceBox").show();
					col_5.find('.loading').remove().end().find(".priceBox").show();
				},
				timeout : function(res){},
				serverError : function(res){}
			},function(res){
				var status = res.status;
				var msg = res.msg;
				var data = res.data || {};
				if(status=="success"){
					var js = data.js || {};
					var ls = data.ls || {};
					var jsp = js.p;
					var lsp = ls.p;
					col_4.find(".num").text(lsp);
					col_5.find(".num").text(jsp);
				}else{
	
				}
			})
		},
		autoFixTicketUl : function(){
			var that = this;
			var MAX_TICKETUL_SIZE = this.statics.MAX_TICKETUL_SIZE;
			this.container.children().children(".ticketBox").children(".ticketUl").each(function(){
				var tarUl = $(this);
				if(!tarUl.hasClass("fix")){
					tarUl.addClass("fix");
					var lines = tarUl.children();
					var line_len = lines.length;
					if(line_len>MAX_TICKETUL_SIZE){
						var lineHeight = lines.first().height();
						var sHeight = lineHeight * MAX_TICKETUL_SIZE + 3;
						var oHeight = (lineHeight+1) * line_len;
						tarUl.height(sHeight).attr("data-oheight",oHeight).attr("data-sheight",sHeight);
						tarUl.next(".slideTicketUlBtn").removeClass("disable");
					}
				}
			})
		}
	});
	module.exports = ListManager;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-3-16.
	 */
	var Jidiao = RichBase.extend({
		CacheData : {
			"" : null
		},
		keyupTimer : null,
		KEY_UP_TIMER : 200,
		PLACE_HOLDER : "分销商名称 / 帐号 / 手机号",
		loadingImg : "http://www.12301.cc/images/icons/loading_small.gif",
		init : function(){
			this.popBox = $("#disSelectorWrap");
			this.maskPage = $("#gMasker");
			this.downSelector = $("#disSelectUlWrap");
			this.downSelectorUl = $("#disSelectUl");
			this.searchBox = $("#disSelectUlWrap-searchBox");
			this.searchInp = $("#disSelect_searchInp");
			this.closeBtn = $("#disSelectorWrap-closeBtn");
			this.disSelectorTrigger = $("#disSelectorTrigger");
			this.disSelectorTrigger_text = $("#disSelectorTrigger_text");
			this.bindEvent();
		},
		bindEvent : function(){
			var that = this;
			//点击遮罩
			this.maskPage.on("click",function(e){
				that.slideUpSelector();
				return false;
			})
			//点击pop
			this.popBox.on("click",function(e){
				that.slideUpSelector();
				return false;
			});
			//点击右上角关闭按钮
			this.popBox.on("click",".closeBtn",function(e){
				that.slideUpSelector(function(){
					that.hidePop();
				});
				return false;
			})
			//点击下拉selector
			this.popBox.on("click",".disSelectorTrigger",function(e){
				var target = $(this);
				if(target.hasClass("loading")) return false;
				target.toggleClass("active");
				that.slideToggleSelectUl();
				return false;
			})
			//点击取消按钮
			this.popBox.on("click",".btnGroup .no",function(e){
				that.closeBtn.trigger("click");
				return false;
			})
			//点击确定按钮
			this.popBox.on("click",".btnGroup .yes",function(e){
				var disSelectorTrigger_text = that.disSelectorTrigger_text;
				var id = disSelectorTrigger_text.attr("data-id");
				var account = disSelectorTrigger_text.attr("data-account");
				var dname = disSelectorTrigger_text.text();
				that.fire("dis.change",{
					id : id,
					account : account,
					dname : dname
				});
				that.closeBtn.trigger("click");
				return false;
			})
			this.on("pop.slideDown.before",function(){
				that.onPopSlideDownBefore();
			})
			this.on("pop.slideDown.after",function(){
				// do something...
			})
			//搜索框
			this.searchInp.on("keyup",function(e){
				var keyCode = e.keyCode;
				if(keyCode==38 || keyCode==40) return false;
				if(keyCode==13){
					that.onNavDownUp(keyCode);
				}else{
					clearTimeout(that.keyupTimer);
					that.keyupTimer = setTimeout(function(){
						that.onSearchInpKeyup(that,e);
					},that.KEY_UP_TIMER)
				}
			})
			this.searchInp.on("keydown",function(e){
				var keyCode = e.keyCode;
				if(keyCode==38 || keyCode==40){
					that.onNavDownUp(keyCode);
				}
			})
			//点击搜索结果ul item
			this.downSelectorUl.on("click",".disItem",function(e){
				that.onDisItemClick(that,e);
			});
			//兼容ie6-9的placeholder问题
			this.fixPlaceholder();
		},
		fixPlaceholder : function(){
			var searchInp = this.searchInp;
			var placeholder = this.PLACE_HOLDER;
			if(!"placeholder" in document.createElement("input")){
				searchInp.on("focus",function(e){
					var tarInp = $(this);
					var val = $.trim(tarInp.val());
					if(val==placeholder) tarInp.val("");
				})
				searchInp.on("blur",function(e){
					var tarInp = $(this);
					var val = $.trim(tarInp.val());
					if(!val) tarInp.val(placeholder);
				})
			}
		},
		onDisItemClick : function(that,e){
			var tarItem = $(e.currentTarget);
			var id = tarItem.attr("data-id");
			var account = tarItem.attr("data-account");
			var dname = tarItem.find(".col_1").text();
			this.selectDisItem(id,dname,account);
		},
		//对搜索结果列表用键盘上下键导航
		onNavDownUp : function(keyCode){
			var downSelectorUl = this.downSelectorUl;
			if(downSelectorUl.children().first().hasClass("sta")) return false;
			var activeItem = downSelectorUl.children(".active");
			if(keyCode==13){
				if(!activeItem.length) return false;
				this.selectDisItem(activeItem.attr("data-id"),activeItem.find(".col_1").text(),activeItem.attr("data-account"));
			}else{
				if(!activeItem.length){
					activeItem = downSelectorUl.children().first();
					activeItem.addClass("active").siblings().removeClass("active");
				}else{
					var toItem = keyCode==38 ? activeItem.prev() : activeItem.next();
					if(!toItem.length) toItem = activeItem;
					toItem.addClass("active").siblings().removeClass("active");
				}
	//			var tarItem = downSelectorUl.children(".active");
	//			var tarItemH = tarItem.height()+1;
	//			var Ul_h = $("#disSelectUl").height();
	//			var top = tarItem.position().top+tarItemH;
	//			if(top>Ul_h){
	//				document.getElementById("disSelectUl").scrollTop = (top-Ul_h);
	//			}
			}
		},
		//搜索过滤
		onSearchInpKeyup : function(that,e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			var cacheData = that.CacheData[val];
			if(cacheData){ //如果已经有缓存了，直接走缓存
				var list = cacheData.list;
				var type = list.length ? "success" : "empty";
				that.downSelectorUl.html(that.renderList(type,cacheData.list));
			}else{
				JiDiaoAjax.getList({
					keyword : val,
					loading : function(){
						that.searchBox.addClass("loading");
					},
					removeLoading : function(){
						that.searchBox.removeClass("loading");
					},
					success : function(res){
						var data = res.data;
						that.CacheData[val] = data;
						that.downSelectorUl.html(that.renderList("success",data.list));
					},
					empty : function(res){
						var data = res.data;
						that.CacheData[val] = data;
						that.downSelectorUl.html(that.renderList("empty",data.list));
					},
					fail : function(res){
						var msg = res.msg;
						that.downSelectorUl.html(that.renderList("fail",msg));
					}
				})
			}
		},
		onPopSlideDownBefore : function(){
			var that = this;
			if(!this.CacheData[""]){ //首次加载分销商列表
				var keyword = "";
				JiDiaoAjax.getList({
					keyword : keyword,
					loading : function(){
						that.disSelectorTrigger.addClass("loading");
	//					that.disSelectorTrigger_text.text("正在加载分销商，请稍后...")
					},
					removeLoading : function(){
						that.disSelectorTrigger.removeClass("loading");
	//					that.disSelectorTrigger_text.text("")
					},
					success : function(res){
						var data = res.data;
						that.CacheData[keyword] = data;
						that.downSelectorUl.html(that.renderList("success",data.list));
					},
					empty : function(res){
						var data = res.data;
						that.CacheData[keyword] = data;
						that.downSelectorUl.html(that.renderList("empty",data));
					},
					fail : function(res){
						var msg = res.msg;
						that.downSelectorUl.html(that.renderList("fail",msg));
					}
				})
			}
		},
		//选中分销商列表里的item
		selectDisItem : function(id,dname,account){
			$("#resultUl-disItem-"+id).addClass("active").siblings().removeClass("active");
			this.disSelectorTrigger_text.text(dname).attr("data-id",id).attr("data-account",account);
			this.disSelectorTrigger.removeClass("active");
			this.slideToggleSelectUl();
		},
		renderList : function(type,data){
			var html = "";
			if(type=="success"){
				for(var i in data){
					var d = data[i];
					var id = d["id"];
					var account = d["account"];
					var mobile = d["mobile"];
					var dname = d["dname"] || mobile;
					var concact = d["concact"] ? (d["concact"]+" / ") : "";
					html += '<li id="resultUl-disItem-'+id+'" class="disItem" data-id="'+id+'" data-account="'+account+'">';
					html += 	'<span class="col col_1">'+dname+'</span>';
					html += 	'<span class="col col_2">'+concact+mobile+'</span>';
					html += '</li>';
				}
			}else if(type=="empty"){
				html = '<li class="sta empty">查无匹配结果...</li>';
			}else if(type=="fail"){
				data = data || "请求出错，请稍后重试";
				html = '<li class="sta fail">'+data+'</li>';
			}
			return html;
		},
		showPop : function(opt){
			var that = this;
			var opt = opt || {};
			var id = opt.id;
			var account = opt.account;
			var dname = opt.dname;
			this.disSelectorTrigger_text.attr("data-id",id).attr("data-account",account).text(dname);
			that.fire("pop.slideDown.before");
			this.maskPage.fadeIn();
			this.popBox.show().animate({top:100},200,function(){
				that.fire("pop.slideDown.after");
			});
		},
		hidePop : function(){
			var that = this;
			this.popBox.animate({top:-800},200,function(){
				that.popBox.hide();
				that.maskPage.hide();
			})
		},
		slideUpSelector : function(callback){
			$("#disSelectorTrigger").removeClass("active");
			this.downSelector.slideUp(130,function(){
				callback && callback();
			});
		},
		slideToggleSelectUl : function(callback){
			this.downSelector.slideToggle(130,function(){
				callback && callback();
			})
		}
	});
	module.exports = Jidiao;

/***/ }
/******/ ]);
//# sourceMappingURL=yorderlist.all.6.0.1.js.map