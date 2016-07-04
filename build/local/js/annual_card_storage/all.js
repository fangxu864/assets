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
/******/ 	__webpack_require__.p = "http://static.12301.local/assets/build/local/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(86);
	var item_tpl = __webpack_require__(88);
	var Api = __webpack_require__(5);
	var PaginationSimple = __webpack_require__(46);
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
				var toPage = data.toPage;
				that.getAnnualCardList(toPage);
			})
			this.pagination.on("prev",function(data){
				var toPage = data.toPage;
				that.getAnnualCardList(toPage);
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
			var cache = this.__cache[page];
			//如果已有缓存，则直接走缓存
			if(cache){
				that.updateListUl(cache.cards);
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
							that.__cache[page] = data;
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
			if(!confirm("确定要删除此卡片吗？")) return false;
			PFT.Util.Ajax(Api.Url.storage.deleteAnnualCard,{
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
			var list = cache.cards;
			for(var i in list){
				var d = list[i];
				var virtual = d["virtual_no"];
				if(virtual==itemId){
					that.__cache[page]["cards"].splice(i,1);
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
	


/***/ },

/***/ 5:
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
				getList : "/r/product_AnnualCard/getMemberList/",
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
			//会员详情页面
			memdetail : {
				detail : "/r/product_AnnualCard/getMemberDetail/"
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

/***/ 46:
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

/***/ 47:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 49:
/***/ function(module, exports) {

	module.exports = "<div class=\"navigationBar\">\r\n    <div class=\"navCon\">\r\n        <a href=\"javascript:void(0)\" class=\"navBtn next nextPageBtn disable\"><span class=\"iconfont\">&#xe60d;</span></a>\r\n        <a href=\"javascript:void(0)\" class=\"prevPageBtn navBtn prev disable\"><span class=\"iconfont\">&#xe60c;</span></a>\r\n        <div class=\"which\">\r\n            <span class=\"whichPageInp pagenum\">1</span>\r\n            <span class=\"var\"> / </span>\r\n            <span class=\"totalPageInp pagenum\">1</span>\r\n        </div>\r\n    </div>\r\n    <p style=\"display:none\" class=\"tip keyupTip\">亲，可以使用键盘前后方向键来翻页哟</p>\r\n</div>";

/***/ },

/***/ 86:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 88:
/***/ function(module, exports) {

	module.exports = "<% if(Object.prototype.toString.call(data)==\"[object Array]\"){ %>\r\n    <% if(data.length){ %>\r\n        <% _.each(data,function(item,index){ %>\r\n            <%\r\n                var create_time = new Date(item.create_time*1000);\r\n                var result = [];\r\n                var month = (create_time.getMonth()+1) * 1;\r\n                if(month<10) month = \"0\" + month;\r\n                result.push(create_time.getFullYear());\r\n                result.push(month);\r\n                result.push(create_time.getDate());\r\n                result = result.join(\"-\");\r\n            %>\r\n            <tr data-id=\"<%=item.id%>\" class=\"border-bottom listItem\">\r\n                <td class=\"virtual\"><%=item.virtual_no%></td>\r\n                <td class=\"card\"><%=item.card_no%></td>\r\n                <td class=\"physics\"><%=item.physics_no%></td>\r\n                <td class=\"createtime\"><%=result%></td>\r\n                <td><a data-virtual=\"<%=item.virtual_no%>\" href=\"javascript:void(0);\" class=\"deleteBtn\">删除</a></td>\r\n            </tr>\r\n        <% }) %>\r\n    <% }else{ %>\r\n        <tr class=\"status empty\"><td style=\"height:150px; text-align:center\" colspan=\"5\">暂无卡片...</td></tr>\r\n    <% } %>\r\n<% }else if(data==\"loading\"){ %>\r\n    <tr class=\"status loading\"><td style=\"height:150px; text-align:center\" colspan=\"5\">努力加载中...</td></tr>\r\n<% }else if(data==\"timeout\"){ %>\r\n    <tr class=\"status timeout\"><td style=\"height:150px; text-align:center\" colspan=\"5\">请求超时，请稍后重试...</td></tr>\r\n<% }else if(data==\"error\"){ %>\r\n    <tr class=\"status error\"><td style=\"height:150px; text-align:center\" colspan=\"5\">请求出错，请稍后重试...</td></tr>\r\n<% }else{ %>\r\n    <tr class=\"status fail\"><td style=\"height:150px; text-align:center\" colspan=\"5\"><%=data%></td></tr>\r\n<% } %>\r\n";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map