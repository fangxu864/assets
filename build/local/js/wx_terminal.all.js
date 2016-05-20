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
	 * Created by Administrator on 15-10-8.
	 */
	__webpack_require__(69);
	__webpack_require__(71);
	__webpack_require__(73);
	var Product = __webpack_require__(75);
	var productList = null;
	var TerminalFast = __webpack_require__(80);
	var terminalFast = null;
	var TerminalNormal = __webpack_require__(83);
	var terminalNormal = null;
	var TodayOrder = __webpack_require__(84);
	var todayOrder = null;
	var Main = RichBase.extend({
		init : function(){},
		EVENTS : {
			"tap" : {
				"#modelTab .tabItem" : "onTabItemSwitch"
			}
		},
		bootstrap : function(){
			productList = new Product({container:$("#prodListPage")});
			productList.bootstrap();
			productList.on("product.load.success",function(res){
				var title = res.list[0]["title"];
				var saleerid = res.list[0]["salerid"];
				$("#productname").text(title).attr("data-salerid",saleerid);
			});
			terminalFast = new TerminalFast();
			terminalFast.bootstrap();
			terminalNormal = new TerminalNormal({container:$("#normalPage")});
			terminalNormal.bootstrap();
			todayOrder = new TodayOrder({container:$("#todayOrderPage")});
			this.initRouter();
		},
		initRouter : function(){
			var that = this;
			this.router = new PFT.Router({
				"default" : function(){
					productList.close();
					todayOrder.close();
				},
				"openProdList" : function(){
					productList.show();
					todayOrder.close();
				},
				"todayChecked" : function(){
					todayOrder.show();
					productList.close();
				}
			})
		},
		onTabItemSwitch : function(that,e){
			var tarItem = $(e.currentTarget);
			if(tarItem.hasClass("active")) return false;
			var type = tarItem.attr("data-type");
			var tarPage = $("#mainCon").children("."+type);
			tarItem.addClass("active").siblings().removeClass("active");
			tarPage.addClass("active").show().siblings().hide().removeClass("active");
		}
	});
	
	
	$(function(){
	
		new Main().bootstrap();
	
	})

/***/ },

/***/ 69:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 71:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 73:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-9-21.
	 */
	var TerminalCore = __webpack_require__(76);
	var Product = RichBase.extend({
		statics : {
			api : "../m/voucher_check.php",
			timeout : 5 * 60 * 1000,
			reloadProduct : false,
			searchInpChangeTimeout : 100,
			getProductData : function(){
				return this.__Data || (this.__Data==[]);
			},
			setProductData : function(data){
				if(!data || !(data instanceof Array)) return false;
				this.__Data = data;
			},
			showMask : function(){
				$("#gmaskLayer").show().css("z-index",100002);
			},
			hideMask : function(){
				$("#gmaskLayer").hide().css("z-index",-1);
			},
			showLogin : function(){
				$("#loginWrap").show().css("z-index",100001);
			},
			hideLogin : function(){
				$("#loginWrap").hide().css("z-index",-1);
			}
		},
		EVENTS : {
			"input" : {
				".prodSearchInp" : "onSearchInpChange"
			},
			"tap" : {
				".clearBtn" : "onClearBtnTap",
				".listUl .item" : "onItemTap"
			}
		},
		searchInpChangeTimer : null,
		init : function(opt){
			this.container = opt.container;
			this.listUl = this.container.find(".listUl");
			this.clearBtn = $("#searchProdBox").find(".clearBtn");
		},
		bootstrap : function(){
			var that = this;
			login.on("login.success",function(data){
				if(that.statics.reloadProduct){
					that.statics.reloadProduct = false;
					that.loadProduct();
				}
			});
			this.Core = new TerminalCore();
			this.loadProduct();
		},
		onSearchInpChange : function(that,e){
			clearTimeout(that.searchInpChangeTimer);
			that.searchInpChangeTimer = setTimeout(function(){
				var tarInp = $(e.currentTarget);
				var val = tarInp.val();
				var clearBtn = that.clearBtn;
				if(val){
					that.renderHtml(that.filter(val));
					clearBtn.show();
				}else{
					that.renderHtml(that.filter());
					clearBtn.hide();
				}
			},that.statics.searchInpChangeTimeout);
		},
		onClearBtnTap : function(that,e){
			var tarBtn = $(e.currentTarget);
			$("#prodSearchInp").val("").focus();
			tarBtn.hide();
			that.renderHtml(that.filter());
		},
		onItemTap : function(that,e){
			var tarItem = $(e.currentTarget);
			tarItem.addClass("active").siblings().removeClass("active");
			var title = tarItem.find(".t").text();
			var salerid = tarItem.attr("data-id");
			$("#productname").attr("data-salerid",salerid).text(title);
			that.fire("item.tap",tarItem);
			window.history.go(-1);
		},
		filter : function(keyword){
			var oData = this.statics.getProductData();
			var result = [];
			if(!keyword) return oData;
			for(var i in oData){
				var d = oData[i];
				var title = d["title"];
				if(title.indexOf(keyword)>-1){
					result.push(d);
				}
			}
			return result;
		},
		loadProduct : function(){
			var that = this;
			this.Core.loadProduct({
				loading : function(){
					that.statics.showMask();
				},
				removeLoading : function(){
					that.statics.hideMask();
				},
				success : function(res){
					var list = res.list;
					that.renderHtml(list);
					that.statics.setProductData(list);
					setTimeout(function(){
						that.fire("product.load.success",res);
					},10)
				},
				empty : function(res){
					alert("查无景区产品,请重新进入页面");
				},
				unlogin : function(res){
					that.statics.showLogin();
					that.statics.reloadProduct = true;
				},
				error : function(res){	alert("请求出错,请稍后重试")},
				timeout : function(res){ alert("请求超时,请稍后重试")},
				serverError : function(res){ alert("请求出错,请稍后重试")}
			})
		},
		renderHtml : function(data){
			var that = this;
			var tpl  =$("#productItemTpl").html();
			var html = "";
			for(var i in data){
				var d = data[i];
				html += that.parseTemplate(tpl,d);
			}
			if(!html) html = '<li style="height:150px;line-height:150px; text-align:center"><i class="iconfont" style="font-size:18px; margin-right:2px; vertical-align:middle">&#xe669;</i><span class="t" style="font-size:14px; vertical-align:middle">查无产品...</span></li>'
			that.listUl.html(html);
		},
		show : function(){ this.container.show();},
		close : function(){ this.container.hide();}
	});
	module.exports = Product;


/***/ },

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-9-28.
	 */
	var AdaptOrder = __webpack_require__(77);
	var TerminalCore = RichBase.extend({
		fn : new Function,
		AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
		AJAX_ERROR_TEXT : "请求出错，请稍后重试",
		statics : {
			PAYTYPE : {
				"0" : "账户余额支付",
				"1" : "支付宝支付",
				"2" : "授信支付",
				"3" : "产品自销",
				"4" : "现场支付",
				"5" : "微信支付"
			},
			PAYSTATUS : {
				0 : "景区到付",
				1 : "已成功",
				2 : "未支付"
			},
			ORDERSTATUS : {
				"0" : "未使用",
				"1" : "已使用",
				"2" : "已过期",
				"3" : "已取消",
				"4" : "凭证码被替代",
				"5" : "被终端撤销(已取消)",
				"6" : "被终端撤销(已使用)",
				"7" : "已部分使用"
			},
			api : "../m/voucher_check.php",
			queryOrderApi : "../m/terminal.php?debug=2",
			timeout : 5 * 60 * 1000,
			showMask : function(){
				$("#gmaskLayer").show().css("z-index",100002);
			},
			hideMask : function(){
				$("#gmaskLayer").hide().css("z-index",-1);
			},
			showLogin : function(){
				$("#loginWrap").show().css("z-index",100001);
			},
			hideLogin : function(){
				$("#loginWrap").hide().css("z-index",-1);
			},
			getSalerid : function(){
	//			return "867000";
				return $("#productname").attr("data-salerid") || "";
			},
			tpl : {
				orderItem : __webpack_require__(78),
				terminalSuccess : __webpack_require__(79)
			}
		},
		init : function(){},
		isObjectEmpty : function(obj){
			var result = true;
			for(var i in obj){
				result = false;
				break;
			}
			return result;
		},
		getObjectLength : function(obj){
			var obj = obj || {};
			var len = 0;
			for(var i in obj){
				len+=1;
			}
			return len;
		},
		/**
		 * 验票
		 * @param params
		 *    params: check_method  1=保留余票  0=取消余票
		 *    params: salerid 产品id(景区id)
		 *    params: ordernum 订单号
		 *    params: list   子订单列表
		 *    params: rtime  过期订单
		 * @param opt
		 */
		terminal : function(params,opt){
			var that = this;
			var api = this.statics.queryOrderApi;
			var params = params || {};
			var opt = opt || {};
			var fn = this.fn;
			var check_method = params.check_method || 0;
			var salerid = params.salerid || "";
			var ordernum = params.ordernum || "";
			var list = params.list || ""; //字符串string
			var rtime = params.rtime || "";
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var unlogin = opt.unlogin || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_ERROR_TEXT)};
			var data = {
				check : 1,
				salerid : salerid,
				ordernum : ordernum,
				check_method : check_method,
				list : list,
				rtime : rtime
			};
			PFT.Ajax({
				url : api,
				type : "post",
				dataType : "json",
				data : {
					data : JSON.stringify(data)
				},
				ttimeout : this.statics.ttimeout,
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(){ timeout()},
				serverError : function(){ serverError()}
			},function(res){
				var res = res || {};
				var status = res.status;
				var code = res.code;
				var msg = res.msg;
				if(status=="success"){
					success(res);
				}else if(status=="fail" && code==0){ //登录过期
					unlogin(res);
				}else{
					res["msg"] = msg || that.AJAX_ERROR_TEXT;
					fail(res);
				}
			})
		},
		//拉取景区产品数据
		loadProduct : function(opt){
			var that = this;
			var opt = opt || {};
			var fn = new Function;
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var error = opt.error || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			var unlogin = opt.unlogin || fn;
			var url = this.statics.api;
			var ttimeout = this.statics.ttimeout;
			PFT.Ajax({
				url : url,
				type : "post",
				dataType : "json",
				cache : true,
				data : { "act":"get_landlist"},
				ttimeout : ttimeout,
				loading : function(){
					loading();
					that.fire("product.loading");
				},
				removeLoading : function(){
					removeLoading();
					that.fire("product.removeLoading");
				},
				timeout : function(res){
					timeout(res);
					that.fire("product.timeout",res);
				},
				serverError : function(res){
					serverError(res);
					that.fire("product.serverError",res);
				}
			},function(res){
				var errormsg = res.errormsg;
				var status = res.sta;
				var list = res.list;
				if(status=="success"){
					if(list.length){
						success(res);
						that.fire("product.success",res);
					}else{
						empty(res);
						that.fire("product.empty",res);
					}
				}else if(errormsg=="unlogin"){
					unlogin(res);
					that.fire("product.unlogin",res);
				}else{
					error(res);
					that.fire("product.error",res);
				}
			})
		},
		/**
		 * 查询某个产品下的订单
		 * @param salerid  产品编号
		 * @param number   证码，电话号码，身份证  三者任意一种
		 */
		queryOrder : function(salerid,number,opt){
			if(!salerid || !number){
				alert("缺省salerid景区6位帐号 或 voucher凭证码/手机号/身份证");
				return false;
			}
			number = $.trim(number);
			var that = this;
			var fn = new Function;
			var opt = opt || {};
			var api = this.statics.queryOrderApi;
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var unlogin = opt.unlogin || fn;
			var empty = opt.empty || fn;
			var success = opt.success || fn;
			var error = opt.error || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : api,
				type : "get",
				dataType : "json",
				data : {
					query : 1,
					salerid : salerid,
					voucher : number
				},
				ttimeout : that.statics.timeout,
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(){ timeout()},
				serverError : function(){ serverError()}
			},function(res){
				var res = res || {};
				//debug
				//res = '{"status":"success","orders":{"3288333":{"ordernum":"3288333","code":"642364","mcode":"642364","ptype":"A","pmode":"2","status":"7","landid":"15358","series":"0","endtime":"2016-04-28","ordertel":"18359183441","ordername":"\u5c0f","ordertime":"2016-04-28 11:21:38","begintime":"2016-04-28","paystatus":"1","checktime":"2016-04-28 11:22:24","tickets":[{"tid":33449,"tnum":0,"tnum_s":2,"name":"\u6210\u4eba\u7968","tprice":"3","ordernum":"3288333","status":1,"batch_check":"0","refund_audit":"1"},{"tid":33450,"tnum":0,"tnum_s":1,"name":"\u8001\u4eba\u7968","tprice":"3","ordernum":"3288334","status":"1","batch_check":"0","refund_audit":"1"}]}}}';
				//res = '{"status":"success","orders":{"3288333":{"ordernum":"3288333","code":"642364","mcode":"642364","ptype":"A","pmode":"2","status":"7","landid":"15358","series":"0","endtime":"2016-04-28","ordertel":"18359183441","ordername":"\u5c0f","ordertime":"2016-04-28 11:21:38","begintime":"2016-04-28","paystatus":"1","checktime":"2016-04-28 11:22:24","tickets":[{"tid":33449,"tnum":0,"tnum_s":2,"name":"\u6210\u4eba\u7968","tprice":"3","ordernum":"3288333","status":1,"batch_check":"0","refund_audit":"1"},{"tid":33450,"tnum":0,"tnum_s":1,"name":"\u8001\u4eba\u7968","tprice":"3","ordernum":"3288334","status":"1","batch_check":"0","refund_audit":"1"}]}}}';
				//res = JSON.parse(res);
				//res.orders["1343434"] = res.orders["3288333"];
				var status = res.status;
				var code = res.code;
				if(status=="success"){
					var orders = res.orders;
					if(orders && !that.isObjectEmpty(orders)){
						for(var i in orders){
							var order = orders[i];
							AdaptOrder.adapt(order);
						}
						success(orders);
					}else{
						empty(res);
					}
				}else if(status=="fail" && code==0){
					unlogin(res);
				}else if(status=="fail" && res.msg){
					error(res);
				}
			})
		}
	});
	module.exports = TerminalCore;

/***/ },

/***/ 77:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-27.
	 */
	var AdaptOrder = {
		/**
		 * 判断该订单是否支持分批验证
		 * @param order
		 * @returns {boolean} true:支持   false:不支持
		 */
		batch_check : function(order){
			if(!order) return alert("缺少order参数");
			var result = true;
			var order = order || {};
			var tickets = order.tickets;
			for(var i in tickets){
				var ticket = tickets[i];
				var batch_check = ticket.batch_check;
				//只要有一张票不支分批验证，则认定此订单不支持分批验证
				//除非所有票都支持分批验证，才可判定此订单支持分批验证
				if(batch_check==0){ // 1=支持分批  0=不支持
					result = false;
					break;
				}
			}
			return result;
		},
		/**
		 * 判断该订单退票时是否需要审核  如需审核就无法修改票数
		 * @param order
		 * @returns {boolean} true:需审核   false:不需审核
		 */
		refund_audit : function(order){
			if(!order) return alert("缺少order参数");
			var result = false;
			var order = order || {};
			var tickets = order.tickets;
			for(var i in tickets){
				var ticket = tickets[i];
				var refund_audit = ticket.refund_audit;
				//只要有一张票退票时需要审核，则认定此订单退票需审核
				//除非所有票都不需审核，才可判定此订单不需审核
				if(refund_audit==1){ //1=需审核  0=不需审核
					result = true;
					break;
				}
			}
			return result;
		},
		/**
		 * 判断此订单是否可以验证
		 * 判断一个订单是否可以验证，如果此订单内的，只要一张票可以验证，即判定此订单可以验证
		 * 除非此订单下的所有票都不能验证，才能判定此订单不可验证
		 * @param order  true:可验证   false:不能验证
		 */
		check_terminal : function(order){
			// 判断一个订单是否可以验证，如果此订单内的，只要一张票可以验证，即判定此订单可以验证
			// 除非此订单下的所有票都不能验证，才能判定此订单不可验证
			var result = false;
			var tickets = order.tickets || [];
			for(var i in tickets){
				var ticket = tickets[i];
				var status = ticket.status;
				var tnum = ticket.tnum;
				if((status==0 || status==2 || status==7) && (tnum>0)){ // 只有 未使用 | 已过期 | 部分使用  的订单可以验证
					result = true;
					break;
				}
			}
			return result;
		},
		/**
		 * 在订单json里加入4个字段
		 *   batch_check: 是否支持分批验证       true=支持  false=不支持
		 *   can_check  : 判断此订单是否可以验证  ture=可以   false=不可以
		 *   readonly   : 是否可以修改票数       readonly=""->可以     readonly="readonly"->不可以
		 *   tip        : 当不能修改票数时，提示用户为什么不能修改票数
		 * @param order
		 * @returns {*}
		 */
		adapt : function(order){
			if(!order) return alert("缺少order参数");
			var batch_check = this.batch_check(order);
			var can_check = this.check_terminal(order);
			var ptype = order.ptype;
			if(!ptype) return alert("缺少ptype");
			var readonly = "";
			var tip = "";
			order["batch_check"] = batch_check; //判断此订单是否支持分批验证
			order["can_check"] = can_check;     //判断此订单是否可验证
			if(batch_check){//如果支持分批验证
				//所有类型的订单都可以修改票数
				readonly = "";
			}else{//不支持分批验证
				var refund_audit = this.refund_audit(order);
				if(ptype=="F"){ //如果是套票，都不能修改票数
					readonly = "readonly";
					tip = "套票产品，不支持修改票数";
				}else if(ptype=="C"){//酒店
					if(order.tickets.length>1){ //如果是酒店产品且是联票时(票类不止一种)也不能修改票数
						readonly = "readonly";
						tip = "酒店产品的联票订单不支持修改票数";
					}else{//如果是单票
						if(refund_audit){//退票需审核(即不可修改票数)
							readonly = "readonly";
							tip = "退票需审核，不支持修改票数";
						}else{//不需审核(可修改票数)
							readonly = "";
						}
					}
				}else{//其它类型的产品
					if(refund_audit){//退票需审核(即不可修改票数)
						readonly = "readonly";
						tip = "退票需审核，不支持修改票数";
					}else{//不需审核(可修改票数)
						readonly = "";
					}
				}
			}
			order["readonly"] = readonly;
			order["tip"] = tip;
			return order;
		}
	};
	module.exports = AdaptOrder;

/***/ },

/***/ 78:
/***/ function(module, exports) {

	module.exports = "<% var STATUS={\r\n    0 : { text:\"未使用\",           color:\"#3eba40\"},\r\n        1 : { text:\"已使用\",           color:\"#f37138\"},\r\n        2 : { text:\"已过期\",           color:\"#e12424\"},\r\n        3 : { text:\"已取消\",           color:\"#f37138\"},\r\n        4 : { text:\"凭证码被替代\",      color:\"#f37138\"},\r\n        5 : { text:\"被终端撤销(已取消)\", color:\"#f37138\"},\r\n        6 : { text:\"被终端撤销(已使用)\", color:\"#f37138\"},\r\n        7 : { text:\"已部分使用\",        color:\"#f37138\"}\r\n    };%>\r\n    <% _.each(data,function(item){ %>\r\n        <%console.log(item)%>\r\n        <li class=\"orderItem\">\r\n            <div class=\"titBox\">\r\n                <p class=\"line\">\r\n                    <span class=\"lt\">订单号：</span><span class=\"ordernum rt\"><%=item.ordernum%></span>\r\n                </p>\r\n                <p class=\"line\">\r\n                    <span class=\"lt\">联系人：</span><span class=\"ordername rt\"><%=item.ordername%><span class=\"tel\"><%=item.ordertel%></span></span>\r\n                </p>\r\n                <p class=\"line\">\r\n                    <span class=\"lt\">游玩时间：</span><span class=\"begintime rt\"><%=item.begintime%></span>\r\n                </p>\r\n            </div>\r\n            <% if(item.tip){ %>\r\n                <p style=\"text-align:right; margin-top:12px; margin-right:10px; color:#e12424\" class=\"refundTip\">*<%=item.tip%></p>\r\n            <% } %>\r\n            <ul class=\"ticketUl\">\r\n                <% _.each(item.tickets,function(ticket){ %>\r\n                    <li class=\"ticItem\">\r\n                        <div class=\"con\">\r\n                            <div class=\"lt\">\r\n                                <p class=\"tname\"><%=ticket.name%></p>\r\n                                <p class=\"desc\">\r\n                                    <span>共<i class=\"num\"><%=ticket.tnum_s%></i>张</span>\r\n                                    <span class=\"flag status_<%=ticket.status%>\" style=\"color:#fff; padding:0 3px; background:<%=STATUS[ticket.status]['color']%>\"><%=STATUS[ticket.status][\"text\"]%></span>\r\n                                    <span style=\"display:none\">已使用<i class=\"num unterminal\"><%=ticket.tnum_s-ticket.tnum<0 ? 0 :ticket.tnum_s-ticket.tnum%></i>张</span>\r\n                                    <span>待验证<i class=\"num unterminal\"><%=ticket.tnum%></i>张</span>\r\n                                </p>\r\n                            </div>\r\n                            <div class=\"countBox\">\r\n                                <div class=\"con\">\r\n                                    <input type=\"text\" name=\"\" id=\"\" <%=item.readonly%> data-max=\"<%=ticket.tnum%>\" data-min=\"0\" data-ordernum=\"<%=ticket.ordernum%>\" class=\"countInp\" value=\"<%=ticket.tnum%>\"/>\r\n                                    <a class=\"btn plus disable\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe649;</i></a>\r\n                                    <a class=\"btn minus <%=item.readonly=='readonly' ? 'disable' : ''%>\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe6b5;</i></a>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </li>\r\n                <% }) %>\r\n            </ul>\r\n            <div style=\"display:none\" class=\"checkMethodBox\">\r\n                <!-- 如果支持分批验证，则默认选中保留余票 -->\r\n                <!-- 如果不支持分批验证，则默认选中取消余票 -->\r\n                <!-- item.batch_check==true时 支持分批验证 -->\r\n                <input type=\"radio\" <%=item.batch_check ? \"\" : \"checked\"%> name=\"check_method\" value=\"0\" id=\"check_method_<%=item.ordernum%>_0\"/><label style=\"margin-right:25px\" for=\"check_method_<%=item.ordernum%>_0\">取消余票</label>\r\n                <input type=\"radio\" <%=item.batch_check ? \"checked\" : \"\"%> name=\"check_method\" value=\"1\" id=\"check_method_<%=item.ordernum%>_1\"/><label for=\"check_method_<%=item.ordernum%>_1\">保留余票</label>\r\n            </div>\r\n            <div class=\"botBox\">\r\n                <div class=\"btnBox\">\r\n                    <% if((item.ptype==4 && item.paystatus==0) || (item.ptype==4 && item.paystatus==2)){ %>\r\n                        <span class=\"flag flag_xianchangPay\">现场支付</span>\r\n                    <% }else{ %>\r\n                        <span class=\"flag pmode_<%=item.paystatus%>\"><%={\r\n                                0 : \"景区到付\",\r\n                            1 : \"已支付\",\r\n                            2 : \"未支付\"\r\n                        }[item.paystatus]%></span>\r\n                    <% } %>\r\n                    <a class=\"terminalBtn <%=item.can_check ? '' : 'disable'%>\" data-endtime=\"<%=item.endtime ? item.endtime : ''%>\" data-checkmethod=\"<%=item.batch_check ? 1 : 0%>\" data-ordernum=\"<%=item.ordernum%>\" href=\"javascript:void(0)\">验证</a>\r\n                </div>\r\n                <div class=\"msgBox\"></div>\r\n            </div>\r\n        </li>\r\n    <% }) %>";

/***/ },

/***/ 79:
/***/ function(module, exports) {

	module.exports = "<li style=\"text-align:left\" class=\"dialog_order_item terimalItem\">\r\n    <% _.each(data.order.tickets,function(ticket){ %>\r\n        <p data-ordernum=\"<%=ticket.ordernum%>\" data-tnum=\"<%=ticket.tnum%>\" class=\"ticketLine\">\r\n            <span class=\"tname\"><%=ticket.name%></span>\r\n            共<span class=\"num\"><%=ticket.tnum_s%></span>张\r\n            <% var dcls = ticket.status!=3 ? \"inline\" : \"none\"; %>\r\n            <span style=\"display:none; margin-left:5px;\">已使用<span class=\"num\"><%=ticket.tnum_s-ticket.tnum%></span>张</span>\r\n            <span style=\"margin-left:5px\">待验证<span class=\"num\"><%=ticket.tnum%></span>张</span>\r\n                <span class=\"flag flag_<%=ticket.status%> status_<%=ticket.status%>\"><%={\r\n                        \"0\" : \"未使用\",\r\n                    \"1\" : \"已使用\",\r\n                    \"2\" : \"已过期\",\r\n                    \"3\" : \"已取消\",\r\n                    \"4\" : \"凭证码被替代\",\r\n                    \"5\" : \"被终端撤销(已取消)\",\r\n                    \"6\" : \"被终端撤销(已使用)\",\r\n                    \"7\" : \"已部分使用\"\r\n                }[ticket.status]%></span>\r\n        </p>\r\n    <% }) %>\r\n    <a class=\"terminalBtn <%=data.can_check ? '' : 'hidden'%>\" href=\"javascript:void(0)\"\r\n       data-ordernum=\"<%=data.order.ordernum%>\"\r\n       data-checkmethod=\"\"\r\n       data-endtime=<%=data.order.endtime%>\r\n    >验证</a>\r\n</li>";

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-8.
	 */
	var KeyBoard = __webpack_require__(81);
	var TerDialog = __webpack_require__(82);
	var TerminalCore = __webpack_require__(76);
	var keyBoard = null;
	var dialog = null;
	var Core = null;
	var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
	var ajax_fail = function(res){
		var res = res || {};
		var msg = res.msg || AJAX_ERROR_TEXT;
		alert(msg);
	};
	var ajax_timeout = function(){
		alert("请求超时，请稍后重试");
	};
	var ajax_serverError = function(){
		alert("请求出错，请稍后重试");
	};
	var TerminalFast = RichBase.extend({
		statics : {
			getSalerid : function(){
				return $("#productname").attr("data-salerid") || "";
			},
			showMask : function(){
				$("#gmaskLayer").show().css("z-index",100002);
			},
			hideMask : function(){
				$("#gmaskLayer").hide().css("z-index",-1);
			},
			showLogin : function(){
				$("#loginWrap").show().css("z-index",100001);
			},
			hideLogin : function(){
				$("#loginWrap").hide().css("z-index",-1);
			}
		},
		init : function(){},
		bootstrap : function(){
			var that = this;
			keyBoard = new KeyBoard({container:$("#keyboradComp")});
			dialog = new TerDialog({container:$("#terminalSucPage")});
			Core = new TerminalCore();
			keyBoard.on("tap.num",function(val){
				$("#codeInp").val(val);
			});
			keyBoard.on("tap.back",function(val){
				$("#codeInp").val(val);
			});
			keyBoard.on("tap.empty",function(val){
				$("#codeInp").val(val);
			});
			keyBoard.on("tap.valify",function(val){
				that.valify_ma(val);
			});
			var dialog_con_order_list_tpl = TerminalCore.tpl.terminalSuccess;
			this.dialog_con_order_list_template = _.template(dialog_con_order_list_tpl);
			var orderItemtpl = TerminalCore.tpl.orderItem;
			this.template = _.template(orderItemtpl);
		},
		render_dialog_orderItem : function(order,can_check){
			var template = this.dialog_con_order_list_template;
			var order_can_check = typeof can_check=="undefined" ? this.order_can_check(order) : can_check;
			return template({
				data : {
					order : order,
					can_check : order_can_check
				}
			})
		},
		render_dialog_orders : function(orders){
			var that = this;
			var html = "";
			var orders = orders || {};
			for(var i in orders){
				var order = orders[i];
				html += that.render_dialog_orderItem(order);
			}
			return html;
		},
		showDialog_orderQuery : function(title,con){
			dialog.show({
				top : 30,
				bottom : 30,
				title : title,
				content : con,
				btns : [{
					text : "确定",
					type : "yes",
					handler : function(tarBtn){
						dialog.close();
					}
				}]
			})
		},
		valify_single_order : function(order){
			var that = this;
			var statics = this.statics;
			var batch_check = order.batch_check;   //batch_check==1:支持分批验证   batch_check==0:不支持分批验证
			var check_method = batch_check==1 ? 1 : 0; //<!-- 如果支持分批验证，则默认选中保留余票 --><!-- 如果不支持分批验证，则默认选中取消余票 -->
			var ordernum = order.ordernum;
			var salerid = this.statics.getSalerid();
			var rtime = order.endtime || "";
			var list = (function(){
				var tickets = order.tickets;
				var res = {};
				for(var i in tickets){
					var ticket = tickets[i];
					var ordernum = ticket["ordernum"];
					var tnum = ticket["tnum"];
					res[ordernum] = tnum;
				}
				return res;
			})();
			var data = {
				check_method : check_method,
				ordernum : ordernum,
				salerid : salerid,
				rtime : rtime,
				list : list
			};
			Core.terminal(data,{
				loading : function(){statics.showMask()},
				removeLoading : function(){statics.hideMask()},
				success : function(res){
					alert("验证成功");
					Core.queryOrder(salerid,$("#codeInp").val(),{
						success : function(orders){
							var title = '<i class="iconfont">&#xe62c;</i><span class="t">验证成功</span>';
							var content = that.render_dialog_orders(orders);
							that.showDialog_orderQuery(title,content);
						}
					})
				},
				unlogin : function(){ that.statics.showLogin();},
				fail : function(res){ ajax_fail(res)},
				timeout : function(){ ajax_timeout()},
				serverError : function(){ ajax_serverError()}
			})
		},
		valify_some_orders : function(salerid,ma,orders){
			$("#modelTab").find(".normalTabItem").trigger("tap");
			$("#searchInp").val(ma);
			$("#clearSearBtn").show();
			$("#searchResultWrap").children(".listUl").html(this.template({data:orders}));
	//		var that = this;
	//		var title = "请选择以下订单验证";
	//		var content = this.render_dialog_orders(orders);
	//		dialog.show({
	//			top : 30,
	//			bottom : 30,
	//			title : title,
	//			content : content,
	//			onTerminalBtnTap : function(tarBtn){
	//				var salerid = that.statics.getSalerid();
	//				var ordernum = tarBtn.attr("data-ordernum");
	//				var check_method = tarBtn.attr("data-checkmethod");
	//				var rtime = tarBtn.attr("data-endtime");
	//				var list = (function(){
	//					var res = {};
	//					tarBtn.parents(".terimalItem").find(".ticketLine").each(function(){
	//						var ticket = $(this);
	//						var ordernum = ticket.attr("data-ordernum");
	//						var tnum = ticket.attr("data-tnum");
	//						res[ordernum] = tnum;
	//					})
	//					return res;
	//				})();
	//				if(!salerid || tarBtn.hasClass("valifyed")) return false;
	//				Core.terminal({
	//					salerid : salerid,
	//					ordernum : ordernum,
	//					check_method : check_method,
	//					rtime : rtime,
	//					list : list
	//				},{
	//					loading : function(){ tarBtn.text("验证中...")},
	//					removeLoading : function(){tarBtn.text("验证")},
	//					success : function(){
	//						tarBtn.addClass("valifyed").text("验证成功");
	//						alert("验证成功");
	//						var statics = that.statics;
	//						Core.queryOrder(statics.getSalerid(),$("#codeInp").val(),{
	//							loading : function(){statics.showMask()},
	//							removeLoading : function(){statics.hideMask()},
	//							success : function(orders){
	//								var con = that.render_dialog_orders(orders);
	//								$("#terminalSucPage").find(".listUl").html(con);
	//							},
	//							empty : function(){},
	//							error : function(res){ ajax_fail(res)},
	//							unlogin : function(){ statics.showLogin()},
	//							timeout : function(){ ajax_timeout()},
	//							serverError : function(){ ajax_serverError()}
	//						})
	//					},
	//					unlogin : function(){that.statics.showLogin()},
	//					fail : function(res){ajax_fail(res)},
	//					timeout : function(res){ajax_timeout()},
	//					serverError : function(res){ajax_serverError()}
	//				})
	//			},
	//			btns : [{
	//				text : "确定",
	//				type : "yes",
	//				handler : function(tarBtn){
	//					dialog.close();
	//				}
	//			}]
	//		})
		},
		//验证
		valify_ma : function(ma){
			var that = this;
			var statics = this.statics;
			var salerid = statics.getSalerid();
			if(!ma || !salerid) return false;
			Core.queryOrder(salerid,ma,{
				loading : function(){statics.showMask()},
				removeLoading : function(){statics.hideMask()},
				success : function(orders){
					var orders_num = Core.getObjectLength(orders);
					if(orders_num==0) return false;
					if(orders_num==1){ //快速验证时，如果查出来的订单只有一个，则直接验证掉
						for(var i in orders){
							var order = orders[i];
							//先判断该订单是否被验证过(是否可验证)
							var can_check = order["can_check"]; //先判断这个订单是否可验证
							if(can_check){ //如果可验证
								that.valify_single_order(order);
							}else{ //如果不可验证，则弹窗列出查询订单匹配的结果
								var con = that.render_dialog_orderItem(order,can_check);
								that.showDialog_orderQuery("以下为查询出的匹配订单",con);
							}
						}
					}else{ //如果有2个或2个以上订单，其实就是进入改单验证模式
						that.valify_some_orders(salerid,ma,orders);
					}
				},
				empty : function(){ alert("查无订单")},
				error : function(res){ ajax_fail(res)},
				unlogin : function(){ statics.showLogin()},
				timeout : function(){ ajax_timeout()},
				serverError : function(){ ajax_serverError()}
			})
		}
	});
	module.exports = TerminalFast;

/***/ },

/***/ 81:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-9-28.
	 */
	var KeyBoard = RichBase.extend({
		statics : {
			getVal : function(){
				return this.result || (this.result="");
			},
			setVal : function(val){
				if(!val) return false;
				var oval = this.getVal();
				if(val=="empty") return this.result = "";
				if(val=="back") return this.result = oval.substring(0,oval.length-1);
				this.result = oval+val;
			}
		},
		EVENTS : {
			"tap" : {
				".keyBox" : "onKeyboxTap"
			}
		},
		init : function(opt){
			this.container = opt.container;
		},
		onKeyboxTap : function(that,e){
			var tarKey = $(e.currentTarget);
			if(tarKey.hasClass("num")){
				that.statics.setVal(tarKey.attr("data-key"));
				that.fire("tap.num",that.statics.getVal());
			}else if(tarKey.hasClass("empty")){
				that.statics.setVal("empty");
				that.fire("tap.empty",that.statics.getVal());
			}else if(tarKey.hasClass("back")){
				that.statics.setVal("back");
				that.fire("tap.back",that.statics.getVal());
			}else if(tarKey.hasClass("valify")){
				that.fire("tap.valify",that.statics.getVal());
				//that.statics.setVal("empty");
			}
			that.fire("tap",that.statics.getVal());
		}
	});
	
	module.exports = KeyBoard;

/***/ },

/***/ 82:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-9-29.
	 */
	var TerDialog = RichBase.extend({
		init : function(opt){
			this.container = opt.container;
		},
		show : function(opt){
			var that = this;
			var opt = opt || {};
			var top = opt.top;
			var bottom = opt.bottom;
			var title = typeof(opt.title)=="function" ? opt.title() : (opt.title || "提示");
			var content = typeof(opt.content)=="function" ? opt.content() : (opt.content || "内容");
			var btns = opt.btns || [{
				text : "确定",
				type : "yes",
				handler : function(){}
			}];
			var btnBox = this.container.find(".btnBox");
			var onTerminalBtnTap = opt.onTerminalBtnTap;
			if(btns.length==2){
				btnBox.addClass("doub");
			}else{
				btnBox.removeClass("doub");
			}
			this.container.show();
			if(top) this.container.children(".con").css("top",top);
			if(bottom) this.container.children(".con").css("bottom",bottom);
			this.container.find(".title").html(title);
			this.container.find(".listUl").html(content);
			this.container.off();
			for(var i in btns){
				var btn = btns[i];
				var text = btn["text"];
				var type = btn["type"];
				var handler = btn["handler"];
				var cls = type=="yes" ? "yesBtn" : "noBtn";
				btnBox.append('<a class="'+cls+' btn" href="javascript:void(0)">'+text+'</a>');
				if(type=="yes"){
					that.container.on("tap",".btnBox .yesBtn",function(e){
						var tarBtn = $(e.currentTarget);
						if(handler) handler(tarBtn);
					});
				}else if(type=="no"){
					that.container.on("tap",".btnBox .noBtn",function(e){
						var tarBtn = $(e.currentTarget);
						if(handler) handler(tarBtn);
					});
				}
			}
			this.container.on("tap",".listUl .terminalBtn",function(e){
				var tarBtn = $(e.currentTarget);
				if(onTerminalBtnTap) onTerminalBtnTap(tarBtn);
			});
		},
		close : function(){
			this.container.hide();
		}
	});
	module.exports = TerDialog;

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-8.
	 */
	
	var TerminalCore = __webpack_require__(76);
	var TerminalNormal = RichBase.extend({
		EVENTS : {
			"tap" : {
				".searchBtn" : "onSearchBtnTap",
				".clearSearBtn" : "onClearBtnTap",
				".orderItem .countBox .btn" : "onCountBtnTap",
				".orderItem .terminalBtn" : "onTerminalBtnTap"
			},
			"input" : {
				".searchInp" : "onSearchInputChange"
			},
			"blur" : {
				".orderItem .countBox .countInp" : "onCountInputBlur"
			},
			"focus" : {
				".orderItem .countBox .countInp" : "onCountInputFocus"
			}
		},
		init : function(opt){
			var that = this;
			this.container = opt.container;
			this.searchInp = $("#searchInp");
			this.searchBtn = this.container.find(".searchBtn");
			this.clearBtn = this.container.find(".clearSearBtn");
			this.listUl = this.container.find(".listUl");
			this.Core = new TerminalCore();
			this.tpl = TerminalCore.tpl.orderItem;
		},
		bootstrap : function(opt){
	
		},
		onSearchBtnTap : function(that,e){
			var keyword = that.searchInp.val();
			if(!keyword){
				that.listUl.html("");
				return that.searchInp.focus();
			}
			that.search(keyword);
		},
		onSearchInputChange : function(that,e){
			var val = that.searchInp.val();
			if(val){
				that.clearBtn.show();
			}else{
				that.clearBtn.hide();
			}
		},
		onCountInputFocus : function(that,e){
			var tarInp = $(e.currentTarget);
			tarInp.attr("data-lastval",$.trim(tarInp.val()));
		},
		onCountInputInput : function(that,e){
			that.onCountInputBlur(that,e);
		},
		onCountInputBlur : function(that,e){
			var tarInp = $(e.currentTarget);
			if(tarInp.hasClass("disable") || tarInp.prop("readonly")) return false;
			var newVal = $.trim(tarInp.val());
			var oldVal = tarInp.attr("data-lastval");
			that.onCountInpChange(tarInp,newVal,oldVal);
		},
		onClearBtnTap : function(that,e){
			that.searchInp.val("").focus();
			that.clearBtn.hide();
			that.listUl.html("");
		},
		onCountBtnTap : function(that,e){
			var tarBtn = $(e.currentTarget);
			var countInp = tarBtn.siblings(".countInp");
			if(tarBtn.hasClass("disable") || countInp.hasClass("disable") || countInp.prop("readonly")) return false;
			var val = countInp.val() * 1;
			var newVal = tarBtn.hasClass("plus") ? (val+1) : (val-1);
			that.onCountInpChange(countInp,newVal,val);
		},
		onCountInpChange : function(tarInp,newVal,oldVal){
			var resVal = "";
			var newVal = String(newVal).length==0 ? oldVal : newVal*1;
			var max = tarInp.attr("data-max") * 1;
			var min = tarInp.attr("data-min") * 1;
			var parents = tarInp.parents(".countBox");
			if(!PFT.Help.isPositiveNum(String(newVal),true) || newVal<min || newVal>max){
				resVal = oldVal;
			}else{
				resVal = newVal;
			}
			tarInp.val(resVal);
			parents.find(".btn").removeClass("disable");
			if(resVal==min) parents.find(".minus").addClass("disable");
			if(resVal==max) parents.find(".plus").addClass("disable");
		},
		onTerminalBtnTap : function(that,e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable") || tarBtn.hasClass("success") || tarBtn.hasClass("loading")) return false;
			var salerid = TerminalCore.getSalerid();
			var ordernum = tarBtn.attr("data-ordernum");
			if(!salerid || !ordernum) return console.log("缺少salerid或ordernum");
			var tickets = {};
			var parent = tarBtn.parents(".orderItem");
			var flag_xianchangPay = parent.find(".flag_xianchangPay");
			if(flag_xianchangPay.length){
				var result = window.confirm("此订单须现场支付，请确保游客已付款。是否继续？");
				if(!result) return false;
			}
			var total_tic_num = 0;
			parent.find(".countInp").each(function(){
				var tarInp = $(this);
				var ordernum = tarInp.attr("data-ordernum");
				var num = tarInp.val();
				total_tic_num += num*1;
				tickets[ordernum] = num;
			})
			if(total_tic_num==0) return alert("验证票数不能全为0");
			that.terminal(salerid,ordernum,tickets,tarBtn);
		},
		//普通验证 改单验证
		terminal : function(salerid,ordernum,tickets,tarBtn){
			var that = this;
			var check_method = tarBtn.attr("data-checkmethod");
			var rtime = tarBtn.attr("data-endtime") || "";
			var data = {
				check_method : check_method,
				salerid : salerid,
				ordernum : ordernum,
				list : tickets,
				rtime : rtime
			};
			this.Core.terminal(data,{
				loading : function(){
					tarBtn.addClass("loading");
					tarBtn.html('<i class="iconfont loading" style="vertical-align:middle; margin-right:2px;">&#xe644;</i><span class="t">正在验证...</span>')
				},
				removeLoading : function(){
					tarBtn.removeClass("loading");
					tarBtn.html('验证')
				},
				timeout : function(){
					alert("请求超时，请稍后重试");
				},
				serverError : function(){
					alert("请求失败，请稍后重试");
				},
				success : function(res){
					that.terminalSuccess(tarBtn);
				},
				fail : function(res){
					var msg = res.msg || "验证失败";
					tarBtn.parent().next().html(msg);
				}
			})
		},
		terminalSuccess : function(tarBtn){
			alert("验证成功");
			this.search(this.searchInp.val());
		},
		search : function(keyword){
			var that = this;
			var Core = this.Core;
			var salerid = TerminalCore.getSalerid();
			var listUl = this.listUl;
			Core.queryOrder(salerid,keyword,{
				loading : function(){
					listUl.html('<li class="sta loading"><i class="iconfont loading">&#xe644;</i><span class="t">正在查询...</span></li>');
				},
				removeLoading : function(){ listUl.html('')},
				success : function(res){
					that.renderHtml(res);
				},
				unlogin : function(){
					TerminalCore.showLogin();
				},
				empty : function(res){
					listUl.html('<li class="sta"><i class="iconfont">&#xe669;</i><span class="t">查无订单...</span></li>');
				},
				error : function(res){
					alert("查询失败，请稍后重试！")
				},
				timeout : function(res){
					alert("请求超时，请稍后重试！")
				},
				serverError : function(res){
					alert("请求出错，请稍后重试！")
				}
			});
		},
		renderHtml : function(data){
			var tpl = this.tpl;
			var template = _.template(tpl);
			var html = template({data:data});
			this.listUl.html(html);
		}
	});
	module.exports = TerminalNormal;

/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-9-30.
	 */
	var TerminalCore = __webpack_require__(76);
	var TodayOrder = RichBase.extend({
		statics : {
			cache : true,
			cacheData : {},
			getSalerid : function(){
				return TerminalCore.getSalerid();
			}
		},
		init : function(opt){
			this.container = opt.container;
			this.listUl = this.container.find(".listUl");
		},
		fetchData : function(salerid,page,opt){
			if(!salerid) return false;
			var page = page || 1;
			var opt = opt || {};
			var fn = new Function;
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var error = opt.error || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : TerminalCore.api,
				type : "post",
				dataType : "json",
				ttimeout : TerminalCore.timeout,
				data : {
					act : "day_orders",
					salerid : salerid
				},
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ timeout(res)},
				serverError : function(res){ serverError(res)}
			},function(res){
				var sta = res.sta;
				var errormsg = res.errormsg;
				var list = res.list;
				if(sta=="success" && !errormsg){
					if(list.length){
						success(res);
					}else{
						empty(res);
					}
				}else{
					error(res);
				}
			})
		},
		show : function(){
			var that = this;
			var salerid = this.statics.getSalerid();
			this.container.show().css("z-index",10001);
			if(!salerid) return false;
			var cacheData = this.statics.cacheData[salerid];
			if(this.statics.cache && cacheData){
				this.listUl.html(this.renderHtml(cacheData))
			}else{
				this.fetchData(salerid,1,{
					loading : function(){
						that.listUl.html('<li style="" class="loading sta"><i class="iconfont loading">&#xe644;</i><span class="t">正在加载数据...</span></li>');
					},
					removeLoading : function(){ that.listUl.html("")},
					success : function(res){
						var list = res.list;
						that.listUl.html(that.renderHtml(list));
						that.statics.cacheData[salerid] = list;
					},
					empty : function(){
						that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">今日没有已验证的订单</span></li>');
					},
					error : function(){
						that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求出错，请稍后重试</span></li>');
					},
					timeout : function(){
						that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求超时，请稍后重试</span></li>');
					},
					serverError : function(){
						that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求出错，请稍后重试</span></li>');
					}
				})
			}
		},
		close : function(){
			this.container.hide().css("z-index",10001);
		},
		renderHtml : function(data){
			var html = "";
			var tpl = $("#todayOrderTpl").html();
			var template = _.template(tpl);
			html = template({data:data});
			return html;
		}
	});
	module.exports = TodayOrder;


/***/ }

/******/ });
//# sourceMappingURL=wx_terminal.all.js.map