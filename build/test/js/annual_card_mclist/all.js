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
/******/ 	__webpack_require__.p = "http://static.12301.test/assets/build/test/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(41);
	var ListManager = __webpack_require__(43);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
	
		},
		initialize : function(){
			var that = this;
			this.ListManager = new ListManager();
		}
	});
	
	$(function(){
		new MainView();
	})
	


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/15 15:36
	 * Description: 此项目所有与后端交互数据的接口都汇总到这里
	 */
	var fn = function(){};
	var Api = {
		Url : {
			//发布年卡产品
			PublishCardProd : {
				submit : "/r/product_scenic/save/",
				//图片上传
				uploadFile : "/r/product_AnnualCard/uploadImg/",
				//编辑状态，获取年卡产品详细信息
				getInfo : "/r/product_scenic/get/"
			},
			//年卡套餐-即票类编辑
			PackageInfo : {
				//添加&修改票类
				updateTicket : "/r/product_ticket/UpdateTicket/",
				//拉取已存在的票类
				getPackageInfoList : "/r/product_ticket/ticket_attribute/",
				//获取产品列表
				getLands : "/r/product_AnnualCard/getLands/",
				//获取票类列表
				getTickets : "/r/product_AnnualCard/getTickets/",
				//删除票类
				deleteTicket : "/route/index.php?c=product_ticket&a=set_status"//"/r/product_ticket/set_status"
			},
			//卡片录入相关接口
			EntryCard : {
				//获取供应商的年卡产品列表
				getProdList : "/r/product_AnnualCard/getAnnualCardProducts/",
				//录入卡片
				createAnnualCard : "/r/product_AnnualCard/createAnnualCard/",
				//获取相关产品已生成好的卡片
				getAnnualCards : "/r/product_AnnualCard/getAnnualCards/"
	
			},
			//下单页面
			makeOrder : {
				//预定页面请求卡片信息接口
				getCardsForOrder : "/r/product_AnnualCard/getCardsForOrder/",
				//预定页面请求订单信息接口
				getOrderInfo : "/r/product_AnnualCard/getOrderInfo/",
				//如果购买虚拟卡，订单提交之前需要先请你去这个接口，判断会员是否已经绑定过其他年卡
				isNeedToReplace : "/r/product_AnnualCard/isNeedToReplace/",
				submit : "/formSubmit_v01.php"
			},
			//获取某个产品的虚拟卡的库存
			getVirtualStorage : "/r/product_AnnualCard/getVirtualStorage/",
			//库存明细页
			storage : {
				//获取库存列表
				getList : "/r/product_AnnualCard/getAnnualCardStorage/",
				//删除生成好的卡片
				deleteAnnualCard : "/r/product_AnnualCard/deleteAnnualCard/"
			},
			//下单成功页
			ordersuccess : {
				getOrderDetail : "/r/product_AnnualCard/orderSuccess/"
			},
			//激活页面
			active : {
				checkCard : "/r/product_AnnualCard/activeCheck/",
				getVCode : "/r/product_AnnualCard/sendVcode/",
				activateForPc : "/r/product_AnnualCard/activateForPc/"
			},
			//会员卡列表管理
			mclist : {
				getList : "/r/product_AnnualCard/getMemberList/"
			},
			//会员详情页面
			memdetail : {
				detail : "/r/product_AnnualCard/getMemberDetail/",
				history : "/r/product_AnnualCard/getHistoryOrder/"
			}
		},
		defaults : {
			type : "get",
			ttimout : 60 * 1000,
			loading : fn,
			complete : fn,
			success : fn,
			fail : fn,
			timeout : fn,
			serverError : fn
		}
	};
	module.exports = Api;


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/7 10:09
	 * Description: 订阅发布模型
	 */
	var E = {
		fn : {},
		on : function(type,fn){
			var fns = this.fn[type] || (this.fn[type]=[]);
			fns.push(fn);
		},
		fire : function(type){
			var fns = this.fn[type];
			if(!fns) return false;
			var args = arguments;
			var len = args.length;
			var argus,scope;
			if(len==1){
				argus = "";
				scope = this;
			}else if(len==2){
				argus = args[len-1];
				scope = this;
			}else if(len==3){
				argus = args[len-2];
				scope = args[len-1];
			}
			for(var i in fns){
				var fn = fns[i];
				fn.call(scope,argus);
			}
		},
		trigger : function(){
			this.fire.apply(this,arguments);
		}
	};
	module.exports = E;

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/22 18:43
	 * Description: ""
	 */
	module.exports = function(destination,source){
		for(var n in source){
			if(source.hasOwnProperty(n)){
				destination[n]=source[n];
			}
		}
		return destination;
	}

/***/ },
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 15:24
	 * Description: ""
	 */
	/**
	 * pc端全局loading效果
	 * @param text loading时显示的文字
	 * @param opt  附加选项
	 * @constructor
	 */
	var Loading = function(text,opt){
		text = text || "请稍后...";
		opt = opt || {}
		var tag = opt.tag || "div";
		if(tag=="td") tag = "tr";
		var width = opt.width+"px" || "100%";
		var height = opt.height || 150;
		var loadingImg = opt.loadingImg || {};
		var imgWidth = loadingImg.width || 24;
		var top = loadingImg.top || 0;
		var className = opt.className || "";
		var td_colspan = opt.colspan || 1;
		var id = opt.id || "";
		var html = "";
		var css = opt.css || {};
		var style = "";
		for(var i in css) style += i+":"+css[i]+"; ";
		var imgSrc = 'http://static.12301.cc/assets/build/images/gloading.gif';
		html += '<'+tag+' id="'+id+'" style="width:'+width+'; height:'+height+'px; line-height:'+height+'px; text-align:center; '+style+'" class="'+className+'">';
		if(tag=="tr"||tag=="td") html += '<td style="text-align:center" colspan="'+td_colspan+'">';
		html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
		html +=     '<span class="t">'+text+'</span>';
		if(tag=="tr"||tag=="td") html += '</td>';
		html += '</'+tag+'>';
		return html;
	};
	module.exports = Loading;

/***/ },
/* 39 */,
/* 40 */,
/* 41 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 42 */,
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/29 16:29
	 * Description: ""
	 */
	var itemContainerTpl = __webpack_require__(44);
	var LoadingPc = __webpack_require__(38);
	var Api = __webpack_require__(5);
	var itemTpl = __webpack_require__(45);
	var Pagination = __webpack_require__(46);
	var State = __webpack_require__(50);
	var TabHeader = __webpack_require__(51);
	var Manager = Backbone.View.extend({
		el : $("#listSlideContainer"),
		events : {
			"click .doBtn" : "onDoBtnClick"
		},
		paginations : {},
		tableTh : {
			//激活状态
			1 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"],
			//未激活状态
			0 : ["售出时间","虚拟卡号/实体卡号 ","发卡商户","激活情况","操作"],
			//禁用状态
			2 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"],
			//挂失状态
			4 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"]
		},
		PAGE_SIZE : 15,
		initialize : function(opt){
			opt = opt || {};
			var that = this;
			this.state = State;
			this.itemWidth = this.$el.width();
			this.TabHeader = this.initTabHeader();
			this.TabHeader.on("switch",function(data){
				var fromStatus = data.fromStatus;
				var toStatus = data.toStatus;
				that.active(fromStatus,toStatus);
			});
			this.TabHeader.on("searchBtnClick",function(data){
				var searchBtn = data.searchBtn;
				if(searchBtn.hasClass("disable")) return false;
				var status = this.getCurrentState();
				var keyword = this.getKeyword();
				that.getList(status,1,keyword);
			});
			this.statusArr = this.TabHeader.getStatus();
			this.slideUl = this.$el.find(".slideUl");
			this.slideUl.width(this.itemWidth*this.statusArr.length);
			this.buildSlideItem(this.statusArr);
			this.TabHeader.active(1);
		},
		template : _.template(itemTpl),
		initTabHeader : function(){
			this.TabHeader = new TabHeader({state:State});
			return this.TabHeader;
		},
		//初始化各个pannel的pagination
		initPagination : function(status){
			var that = this;
			for(var i in status){
				var sta = status[i];
				that.paginations[sta] = new Pagination({
					container : "#paginationContainer_"+sta,
					keyup : false,
					onNavigation : function(data){
						var dir = data.dir;
						var fromPage = data.fromPage;
						var toPage = data.toPage;
						var keyword = that.TabHeader.getKeyword();
						var curState = that.TabHeader.getCurrentState();
						that.getList(curState,toPage,keyword);
					}
				});
			}
		},
		onDoBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			if(tarBtn.hasClass("loss")){//挂失
				this.doAction.loss.call(this,e);
			}else if(tarBtn.hasClass("inavail")){ //禁用
				this.doAction.inavail.call(this,e);
			}
		},
		buildSlideItem : function(status){
			var that = this;
			var template = _.template(itemContainerTpl);
			var tableTh = this.tableTh;
			var html = "";
			for(var i=0; i<status.length; i++){
				var _stus = status[i];
				var ths = tableTh[_stus];
				html += template({data:{
					width : that.itemWidth,
					status : _stus,
					ths : ths,
					loading : ""
				}});
			}
			this.slideUl.html(html);
			that.initPagination(status);
		},
		//要切换(激活哪个slide item)
		active : function(fromStatus,toStatus){
			var tarItem = $("#listItemLi_"+toStatus);
			var index = tarItem.index();
			var fromState = this.state[fromStatus];
			var toState = this.state[toStatus] || (this.state[toStatus]={});
			var supply = this.TabHeader.getSupplySelectVal();
			var keyword = this.TabHeader.getKeyword();
			var listData = toState.listData;
			//切换之前，先把当前pannel里的状态保存到state里
			if(fromState) fromState["supply"] = supply;
			if(fromState) fromState["keyword"] = keyword;
			var new_supply = toState.supply;
			var new_keyword = toState.keyword || "";
			this.TabHeader.setKeyword(new_keyword);
			this.TabHeader.setSupplySelectVal(new_supply);
			new_keyword ? $("#clearSearchBtn").show() : $("#clearSearchBtn").hide();
			if(!listData) this.getList(toStatus,1);
			this.slideUl.animate({left:-1*this.itemWidth*index},300);
		},
		getList : function(status,page,keyword){
			var that = this;
			var container = $("#listItemLi_"+status).find(".tbody");
			PFT.Util.Ajax(Api.Url.mclist.getList,{
				params : {
					status : status,
					page : page,
					page_size : that.PAGE_SIZE,
					identify : keyword
				},
				loading : function(){
					var height = 300;
					if(page!=1) height = container.height() || 300;
					var loading = LoadingPc("努力加载中，请稍后..",{
						tag : "tr",
						height : height,
						colspan : that.tableTh[status].length,
						css : {
							"text-align" : "center"
						}
					});
					container.html(loading);
					that.paginations[status].render(null);
				},
				complete : function(){},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						var list = data.list;
						if(list){
							that.state[status] = that.state[status] || (that.state[status]={});
							that.state[status]["listData"] = 1; //标识已请求过
							var html = that.template({data:{
								status : status,
								list : list,
								colspan : that.tableTh[status].length
							}});
							$("#tbody_"+status).html(html);
							
						}else{
							alert("请求出错，缺少list对象");
						}
						var currentPage = data.page;
						var totalPage = data.total_page;
						var total = data.total || 0;
						that.TabHeader.setCount(status,total);
						that.paginations[status].render({current:currentPage,total:totalPage});
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		doAction : {
			loss : function(e){ //挂失
	
			},
			inavail : function(e){ //禁用
	
			}
		}
	});
	module.exports = Manager;

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = "<li style=\"width:<%=data.width%>px\" id=\"listItemLi_<%=data.status%>\" class=\"listItemLi listItemLi_<%=data.status%>\">\r\n    <table id=\"listItemTable_<%=data.status%>\" class=\"listItemTable listItemTable_<%=data.status%>\">\r\n        <thead>\r\n        <tr>\r\n            <%_.each(data.ths,function(item,index){%>\r\n            <th><%=item%></th>\r\n            <% }) %>\r\n        </tr>\r\n        </thead>\r\n        <tbody id=\"tbody_<%=data.status%>\" class=\"tbody tbody_<%=data.status%>\">\r\n            <tr style=\"text-align:center\">\r\n                <td colspan=\"<%=data.ths.length%>\" style=\"text-align:center; border-bottom:0 none\"><%=data.loading%></td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n    <div id=\"paginationContainer_<%=data.status%>\" class=\"paginationContainer\"></div>\r\n</li>\r\n";

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<%\r\n   var status = data.status;\r\n   var list = data.list;\r\n   var colspan = data.colspan;\r\n%>\r\n<% if(list.length){ %>\r\n    <% _.each(list,function(item,index){ %>\r\n        <% var cls = (index+1)%2==0 ? \"even\" : \"odd\"; %>\r\n        <tr class=\"listItem <%=cls%>\">\r\n            <% if(status==0){ %>\r\n                <td><%=item.sale_time%></td>\r\n            <% }else{ %>\r\n                <td><%=item.account%></td>\r\n                <td><%=item.mobile%></td>\r\n            <% } %>\r\n            <td><%=item.virtual_no%> / <%=item.card_no%></td>\r\n            <td><%=item.supply%></td>\r\n            <td><%={\"1\":\"正常\",\"0\":\"未激活\",\"2\":\"禁用\",\"4\":\"挂失\"}[item.status]%></td>\r\n            <td class=\"font-blue doAction\">\r\n                <% if(item.status==0){ %>\r\n                    <span class=\"color:#ccc\">--</span>\r\n                <% }else{ %>\r\n                    <a style=\"margin-right:8px\" class=\"doBtn detail\" target=\"_blank\" href=\"annual_memdetail.html?id=<%=item.memberid%>\">查看</a>\r\n                <% } %>\r\n                <a style=\"display:none;margin-right:8px\" class=\"doBtn loss\" href=\"javascript:void(0);\">挂失</a>\r\n                <a style=\"display:none\" href=\"javascript:void(0);\" class=\"doBtn inavail\">禁用</a>\r\n            </td>\r\n        </tr>\r\n    <% }) %>\r\n<% }else{ %>\r\n    <tr>\r\n        <td colspan=\"<%=colspan%>\" style=\"height:300px; text-align:center\">查无匹配内容...</td>\r\n    </tr>\r\n<% } %>";

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/16 10:18
	 * Description: ""
	 */
	__webpack_require__(47);
	var Defaults = {
		container : "",               //组件要渲染到的容器
		onNext : function(){},        //要到下一页时触发回调
		onPrev : function(){},        //要到上一页时触发回调
		onNavigation : function(){},  //不论上一页或下一页都触发回调
		keyup : false                 //是否支持键盘左右键触发事件
	};
	/**
	 * 简单的分页组件
	 * @param opt
	 * @constructor
	 * eg:
	 *  var p = new Pagination({
	 * 		container : $("#container"),
	 * 		keyup : false,
	 * 		onNext : function(data){},
	 * 		onPrev : function(data){},
	 * 		onNavigation : function(data){}
	 *  })
	 *  p.on("next",function(data){})
	 *  p.on("prev",function(data){})
	 *  p.on("navigation",function(data){})
	 *  p.render({current:1,total:10})
	 */
	function Pagination(opt){
		this.opt = $.extend(Defaults,opt || {});
		this.init(this.opt);
	}
	Pagination.prototype = {
		init : function(opt){
			var that = this;
			this.tpl = __webpack_require__(49);
			this.container = typeof opt.container=="string" ? $("#"+opt.container.replace(/#/,"")) : opt.container;
			this.container.hide().html(this.tpl);
			this.currentPage = this.container.find(".whichPageInp");
			this.totalPage = this.container.find(".totalPageInp");
			this.nextBtn = this.container.find(".nextPageBtn");
			this.prevBtn = this.container.find(".prevPageBtn");
			if(opt.keyup){
				$(document).on("keyup",function(e){
					that.onKeyupToNav(e);
				});
				this.container.find(".keyupTip").show();
			}
			this.container.on("click",".navBtn",function(e){
				that.onNavBtnClick(e);
			})
		},
		onNavBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var current_page = this.currentPage.text() * 1;
			var dir = tarBtn.hasClass("next") ? "next" : "prev";
			var toPage = tarBtn.hasClass("next") ? (current_page+1) : (current_page-1);
			var data = {
				dir : dir,
				fromPage : current_page,
				toPage : toPage
			};
			if(dir=="next"){
				this.opt.onNavigation(data);
				this.opt.onNext(data);
				PFT.Util.PubSub.fire("navigation",data);
				PFT.Util.PubSub.fire("next",data);
			}else{
				this.opt.onNavigation(data);
				this.opt.onPrev(data);
				PFT.Util.PubSub.fire("navigation",data);
				PFT.Util.PubSub.fire("prev",data);
			}
		},
		onKeyupToNav : function(e){
			var keyCode = e.keyCode;
			var nextBtn = this.nextBtn;
			var prevBtn = this.prevBtn;
			var current = this.currentPage.text() * 1;
			var data = null;
			if(keyCode==39 && !nextBtn.hasClass("disable")){ //next
				data = {
					dir : "next",
					fromPage : current,
					toPage : current+1
				};
				this.opt.onNavigation(data);
				this.opt.onNext(data);
				PFT.Util.PubSub.fire("navigation",data);
				PFT.Util.PubSub.fire("next",data);
			}else if(keyCode==37 && !prevBtn.hasClass("disable")){ //prev
				data = {
					dir : "next",
					fromPage : current,
					toPage : current-1
				};
				this.opt.onNavigation(data);
				this.opt.onPrev(data);
				PFT.Util.PubSub.fire("navigation",data);
				PFT.Util.PubSub.fire("prev",data);
			}
		},
		on : function(type,callback){
			if(!type) return false;
			callback = typeof callback=="function" ? callback : function(){};
			PFT.Util.PubSub.on(type,callback);
		},
		show : function(){
			this.container.show();
		},
		hide : function(){
			this.container.hide();
		},
		getValue : function(){ //获取当前的页数值
			return{
				current : this.currentPage.text(),
				total : this.totalPage.text()
			}
		},
		render : function(data){ // data={current:1,total:1} data=null
			if(!data){
				this.nextBtn.addClass("disable");
				this.prevBtn.addClass("disable");
				this.hide();
				return;
			}
			var total = 1 * data.total;
			var current = 1 * data.current;
			var totalInp = this.totalPage;
			var currentInp = this.currentPage;
			var nextBtn = this.nextBtn;
			var prevBtn = this.prevBtn;
			if(total==0){
				this.nextBtn.addClass("disable");
				this.prevBtn.addClass("disable");
				this.hide();
				return;
			}
			this.show();
			totalInp.text(total);
			currentInp.text(current);
			if(current<total){
				if(current!=1){
					prevBtn.removeClass("disable");
				}else{
					prevBtn.addClass("disable");
				}
				nextBtn.removeClass("disable");
			}else{
				if(current!=1){
					prevBtn.removeClass("disable");
				}else{
					prevBtn.addClass("disable");
				}
				nextBtn.addClass("disable");
			}
		}
	};
	module.exports = Pagination;


/***/ },
/* 47 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 48 */,
/* 49 */
/***/ function(module, exports) {

	module.exports = "<div class=\"navigationBar\">\r\n    <div class=\"navCon\">\r\n        <a href=\"javascript:void(0)\" class=\"navBtn next nextPageBtn disable\"><span class=\"iconfont\">&#xe60d;</span></a>\r\n        <a href=\"javascript:void(0)\" class=\"prevPageBtn navBtn prev disable\"><span class=\"iconfont\">&#xe60c;</span></a>\r\n        <div class=\"which\">\r\n            <span class=\"whichPageInp pagenum\">1</span>\r\n            <span class=\"var\"> / </span>\r\n            <span class=\"totalPageInp pagenum\">1</span>\r\n        </div>\r\n    </div>\r\n    <p style=\"display:none\" class=\"tip keyupTip\">亲，可以使用键盘前后方向键来翻页哟</p>\r\n</div>";

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/30 17:11
	 * Description: ""
	 */
	var Extend = __webpack_require__(16);
	var PubSub = __webpack_require__(15);
	var State = Extend({},PubSub);
	module.exports = State;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/29 15:48
	 * Description: ""
	 */
	var State = __webpack_require__(50);
	var Header = Backbone.View.extend({
		el : $("#tahHeaderContainer"),
		events : {
			"click .cardType" : "onCardTypeClick",
			"click #searchBtn" : "onSearchBtnClick",
			"click #clearSearchBtn" : "onClearSearchBtnClick",
			"keyup #searchInp" : "onSearchInpKeyup",
			"focus #searchInp" : "onSearchInpFocus"
		},
		initialize : function(opt){
			this.state = opt.state;
			this.searchInp = $("#searchInp");
			this.searchBtn = $("#searchBtn");
			this.clearSearchBtn = $("#clearSearchBtn");
		},
		onCardTypeClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("active")) return false;
			var cur_active = this.$el.find(".cardType").filter(".active");
			var from_active_status = cur_active.length ? cur_active.attr("data-status") : -1;
			var status = tarBtn.attr("data-status");
			tarBtn.addClass("active").siblings().removeClass("active");
			this.trigger("switch",{fromStatus:from_active_status,toStatus:status});
		},
		onSearchBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			this.trigger("searchBtnClick",{searchBtn:tarBtn});
		},
		onSearchInpFocus : function(e){
			var val = $.trim($(e.currentTarget).val());
			if(val){
				this.clearSearchBtn.show();
			}else{
				this.clearSearchBtn.hide();
			}
		},
		onSearchInpKeyup : function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			if(val){
				this.clearSearchBtn.show();
			}else{
				this.clearSearchBtn.hide();
			}
		},
		onClearSearchBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			var status = this.getCurrentState();
			var state = State[status] || (State[status]={});
			var searchInp = this.searchInp;
			state["keyword"] = "";
			searchInp.val("");
			this.trigger("searchBtnClick",{searchBtn:this.searchBtn});
			tarBtn.hide();
		},
		active : function(status){
			this.$el.find(".cardType[data-status="+status+"]").trigger("click");
		},
		getStatus : function(){
			var status = [];
			this.$el.find(".cardType").each(function(){
				var item = $(this);
				var s = item.attr("data-status");
				status.push(s);
			})
			return status;
		},
		setCount : function(status,count){
			if(arguments.length!=2) return false;
			$("#cardTypeTab_"+status).find(".num").css("display","inline").text("（"+count+"）");
		},
		getKeyword :function(){
			return $.trim(this.searchInp.val());
		},
		setKeyword : function(keyword){
			this.searchInp.val(keyword);
		},
		getSupplySelectVal : function(){
			return $("#supplySelect").val();
		},
		setSupplySelectVal : function(val){
			$("#supplySelect").val(val);
		},
		getCurrentState : function(){
			return this.$el.find(".cardType").filter(".active").attr("data-status");
		}
	});
	module.exports = Header;

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map