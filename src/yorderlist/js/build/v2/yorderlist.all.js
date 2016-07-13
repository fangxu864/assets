/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
			Queryor = new Query();
			var gotopBtn = $("#gotopBtn");
			var advanceSearchBox = $("#advanceSearchBox");
			var ListContainer = new PFT.ListContainer({
				container : $(window),
				distanceToBottom : 0
			});
			ListContainer.on("scrollAtBottom",function(data){
				if(Queryor.get_ifAllowScrollToMore()) Queryor.getMore();
			})
			ListContainer.on("scroll",function(data){
				if(data.scrollTop>200){
					gotopBtn.fadeIn("normal");
				}else{
					gotopBtn.fadeOut("normal");
				}
			})

			gotopBtn.on("click",function(e){
				$("html,body").animate({scrollTop:0})
			})

			Queryor.initGet();
		}
	})

	$(function(){ new Main()})

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
				serverError : function(res){ alert("请求出错，请稍后重试")}
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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-21.
	 */
	var Searchor = RichBase.extend({
		statics : {
			Provice_City_Cache : {},
			cSelect : null,
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
	//			return $("#proviceParamUl").children(".active").attr("data-provice") || "";
				return $("#pSelectTrigger").attr("data-province") || "";
			},
			getCityid : function(){
	//			return $("#cityParamUl").children(".active").attr("data-city") || "";
				return $("#cSelectTrigger").attr("data-city") || "";
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
			var data = this.statics.Provice_City_Cache = data.provices;
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
/***/ function(module, exports, __webpack_require__) {

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
				".getMoreBtn" : "onGetMoreBtnClick"
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
			this.container = opt.container;
			this.autoFixTicketUl();
		},
		onGetMoreBtnClick : function(that,e){
			that.fire("getMoreBtn.click")
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

/***/ }
/******/ ]);