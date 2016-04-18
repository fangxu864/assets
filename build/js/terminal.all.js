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
	 * Created by Administrator on 15-10-20.
	 */
	__webpack_require__(16);
	__webpack_require__(18);
	var Api = __webpack_require__(20);
	var Product = __webpack_require__(21);
	var OrderList = __webpack_require__(22);
	var Main = RichBase.extend({
		init : function(){
			this.searchOrderBtn = $("#termSearBtn");
			this.voucherInp = $("#termSearInp");
			this.product = new Product({container:$("#productListPage")});
			this.orderList = new OrderList();
			this.bindEvents();
		},
		bindEvents : function(){
			var that = this;
			this.searchOrderBtn.on("click",function(e){
				that.onSearchOrderBtnClick(that,e);
			})
			if(!"placeholder" in document.createElement("input")){ //如果不支持placeholder
				var placeholder = "凭证码 / 手机号";
				this.voucherInp.on("focus",function(e){
					var tarInp = $(e.currentTarget);
					if(tarInp.val()==placeholder) tarInp.val("");
				})
				this.voucherInp.on("blur",function(e){
					var tarInp = $(e.currentTarget);
					if(!tarInp.val()) tarInp.val(placeholder);
				})
			}
		},
		onSearchOrderBtnClick : function(that,e){
			var searchBtn = that.searchOrderBtn;
			var voucher = $.trim(that.voucherInp.val());
			if(searchBtn.hasClass("disable") || !voucher) return false;
			that.orderList.query(Api.getSalerid(),voucher);
		}
	});
	
	$(function(){ new Main();})
	
	


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 17 */,
/* 18 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 19 */,
/* 20 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-3-31.
	 */
	var Api = {
		DEFAULT_IMG : "http://www.12301.cc/images/defaultThum.jpg",
		LOADING_IMG : "http://www.12301.cc/images/icons/gloading.gif",
		PMODE : { //订单的支付方式
			"0" : "账户余额支付",
			"1" : "支付宝支付",
			"2" : "授信支付",
			"3" : "产品自销",
			"4" : "现场支付",
			"5" : "微信支付"
		},
		PAYSTATUS : { //当前订单的支付状态
			0 : "景区到付",
			1 : "已成功",
			2 : "未支付"
		},
		ORDERSTATUS : { //当前订单的状态
			"0" : "未使用",
			"1" : "已使用",
			"2" : "已过期",
			"3" : "已取消",
			"4" : "凭证码被替代",
			"5" : "被终端撤销(已取消)",
			"6" : "被终端撤销(已使用)"
		},
		fn : new Function,
		api : {
			//获取产品
			fetchProduct : "terminal_chk.html",
			//验证&搜索订单
			//terminal : "call/terminal.php",
	//		terminal : "api/index.php?f=terminal",
	//		queryOrder : "api/index.php?f=terminal"
			terminal : function(){
				return $("#apiHideInp").val()
			},
			queryOrder : function(){
				return $("#apiHideInp").val()
			}
		},
		AJAX_TIMEOUT : 1000 * 60, //秒
		AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
		AJAX_ERROR_TEXT : "请求出错，请稍后重试",
		isObjectEmpty : function(obj){
			var result = true;
			for(var i in obj){
				result = false;
				break;
			}
			return result;
		},
		getSid : function(){
			return $("#gsid").val() || "";
		},
		getSalerid : function(){
			return $.trim($("#term_prodNum").text()) || "";
		},
		getVoucher : function(){
			return $.trim($("#termSearInp").val());
		},
		checkIsAdmin : function(){ return $("#isAdmin").val()},
		//载入产品
		fetchProduct : function(params,opt){
			var that = this;
			var params = params || {};
			var opt = opt || {};
			var api = this.api.fetchProduct;
			var fn = this.fn;
			var keyword = params.keyword || "";
			var sid = params.sid || "";
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var timeout = opt.timeout || function(){ alert(this.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(this.AJAX_ERROR_TEXT)};
			var empty = opt.empty || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var xhr;
			xhr = PFT.Ajax({
				url : api,
				type : "get",
				dataType : "json",
				ttimeout : that.AJAX_TIMEOUT * 1000,
				data : {
					"action" : "queryproduct",
					"keyword" : keyword,
					"sid" : sid
				},
				loading : function(){
					loading();
				},
				removeLoading : function(){
					removeLoading();
				},
				timeout : function(res) {
					timeout(res);
				},
				serverError : function(res) {
					serverError(res);
				}
			},function(res){
				if(res.status=="success"){
					if(res.list && res.list.length>0){
						success(res);
					}else{
						empty(res);
					}
				}else{
					fail(res);
				}
			})
			return xhr;
		},
		/**
		 * 前后端数据请求核心接口
		 * @param salerid(必须)   商家编码
		 * @param voucher(必须)   输入的查询字段  凭证码&手机号&订单号    当cmode为3时，只能输入订单查询
		 */
		queryOrder : function(salerid,voucher,opt){
			var that = this;
			if(!salerid || !voucher) return false;
			salerid = $.trim(salerid);
			voucher = $.trim(voucher);
			var api = this.api.queryOrder();
			var fn = this.fn;
			var opt = opt || {};
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var unlogin = opt.unlogin || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_ERROR_TEXT)};
			var data = {
				query : 1,
				salerid : salerid,
				voucher : voucher
			};
			PFT.Ajax({
				url : api,
				type : "get",
				dataType : "json",
				data : data,
				ttimeout : that.AJAX_TIMEOUT,
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ console.log("timeout"); timeout(res)},
				serverError : function(res){ console.log("timeout"); serverError(res)}
			},function(res){
				var res = res || {};
				var status = res.status;
				var code = res.code;
				if(status=="success"){
					var orders = res.orders;
					if(orders && !that.isObjectEmpty(orders)){
						success(res);
					}else{
						empty(res);
					}
				}else if(status=="fail" && code==0){
					unlogin(res);
				}else if(status=="fail" && res.msg){
					fail(res);
				}
			})
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
			var api = this.api.terminal();
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
					data : PFT.Help.JSON.stringify(data)
				},
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
		}
	};
	module.exports = Api;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-10-20.
	 */
	var Api = __webpack_require__(20);
	var Product = RichBase.extend({
		statics : {
			SEARCH_FLAG : true,
			cacheData : null
		},
		EVENTS : {
			"click" : {
				"" : "onContainerClick",
				".productListBox" : "onProductListBoxClick",
				".listUl .pItem" : "onItemClick"
			},
			"keyup" : {
				".searchInp" : "onSearchInpKeyup"
			}
		},
		//当产品数大于50个时，开启搜索功能(admin默认开启搜索)
		PRODUCT_COUNT_TRIGGER_SEARCH : 50,
		cacheData : null,
		init : function(opt){
			var that = this;
			this.container = opt.container;
			this.selectBox = this.container.children();
			this.searchBox = this.container.find(".searchBox");
			this.listUl = this.container.find(".listUl");
			this.searchInp = this.container.find(".searchInp");
			this.triggerInp = $("#prodSearchInp");
			var sid = Api.getSid();
			this.triggerInp.on("click",function(){
				if(sid) return false;
				that.showSelect();
			})
			Api.fetchProduct({sid:sid},{
				loading : function(){
					that.showProdStatus();
					$("#prodBoxStatus").html('<img class="loading" src="'+Api.LOADING_IMG+'"/><span class="t">正在加载产品...</span>');
				},
				removeLoading : function(){ that.hideProdStatus()},
				success : function(res){
					var list = res.list;
					that.statics.cacheData = list;
					that.render(list);
					//当产品数大于50个时，开启搜索功能(admin默认开启搜索)
					if(sid || (!Api.checkIsAdmin() && list.length<50)){
						that.searchBox.hide();
					}else{
						that.searchBox.show();
					}
					setTimeout(function(){
						that.listUl.children().first().trigger("click");
					},10)
				},
				empty : function(res){
					that.showProdStatus();
					$("#prodBoxStatus").show().html('<span class="t">没有产品...</span>');
				},
				fail : function(res){
					alert(res.msg || Api.AJAX_ERROR_TEXT);
				}
			})
		},
		onContainerClick : function(that,e){
			that.closeSelect();
		},
		onProductListBoxClick : function(that,e){
			e.stopPropagation();
			e.preventDefault();
		},
		//搜索
		onSearchInpKeyup : function(that,e){
			var tarInp = that.searchInp;
			var val =tarInp.val();
			var data = that.filterData(val);
			that.render(data);
		},
		onItemClick : function(that,e){
			var tarItem = $(e.currentTarget);
			var id = tarItem.attr("data-id");
			var salerid = tarItem.attr("data-salerid");
			var terminal = tarItem.attr("data-terminal");
			var text = tarItem.text();
			var imgSrc = tarItem.attr("data-img");
			tarItem.addClass("active").siblings().removeClass("active");
			$("#term_prodId").text(id);
			$("#term_termNum").text(terminal);
			$("#term_prodNum").text(salerid);
			that.triggerInp.val(text);
			that.loadPhotoImg(id,imgSrc);
			that.closeSelect();
		},
		filterData : function(keyword){
			var cacheData = this.statics.cacheData;
			var result = [];
			if(!keyword) return cacheData;
			for(var i in cacheData){
				var d = cacheData[i];
				var title = d["title"];
				if(title.indexOf(keyword)>-1) result.push(d);
			}
			return result;
		},
		posSelect : function(){
			var triggerInp = this.triggerInp;
			var offset = triggerInp.offset();
			this.selectBox.css({
				left : offset.left,
				top : offset.top + 36
			})
		},
		showSelect : function(){
			this.container.show();
			this.searchInp.focus();
			this.posSelect();
		},
		closeSelect : function(){
			this.container.hide();
		},
		showProdStatus : function(){
			$("#prodPhoto").hide();
			$("#prodMsg").hide();
			$("#prodBoxStatus").show();
		},
		hideProdStatus : function(){
			$("#prodPhoto").show();
			$("#prodMsg").show();
			$("#prodBoxStatus").hide();
		},
		//更换产品/景区  加载photo img
		loadPhotoImg : function(id,imgpath){
			if(!imgpath) return false;
			var container = $("#prodPhoto");
			var oimg = $("#photoImg"+id);
			var img = container.children(".loading");
			$(img).attr("src",imgpath);
			if(oimg.length){
				oimg.show().siblings().hide();
			}else{
				PFT.Help.LoadImage(container,imgpath,{
					loading : function(){
						container.children(".loading").show().siblings().hide();
					},
					success : function(container,src,img){
						container.children().hide();
						img = $(img);
						img.attr("id","photoImg"+id).attr("width",container.width()).attr("height",container.height()).show().appendTo(container);
					},
					error : function(){
						container.children(".error").show().siblings().hide();
					}
				})
			}
		},
		render : function(data){
			var html = this.buildHtml(data);
			if(!html) html = '<li style="height:100px; line-height:100px; text-align:center; border-bottom:0 none">没有匹配数据</li>';
			this.listUl.html(html);
		},
		buildHtml : function(data){
			var html = "";
			for(var i in data){
				var d = data[i];
				var id = d["id"];
				var salerid = d["salerid"];
				var terminal = d["terminal"];
				var imgpath = d["imgpath"];
				var title = d["title"] || "无标题产品";
				html += '<li class="pItem" data-id="'+id+'" data-salerid="'+salerid+'" data-terminal="'+terminal+'" data-img="'+imgpath+'">'+title+'</li>';
			}
			return html;
		}
	});
	module.exports = Product;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-3-31.
	 */
	var Api = __webpack_require__(20);
	var orderListTpl = __webpack_require__(23);
	var Calendar = __webpack_require__(24);
	var OrderList = RichBase.extend({
		init : function(){
			this.listUl = $("#myOrderList");
			this.template = _.template(orderListTpl);
			this.calendar = new Calendar();
			this.bindEvents();
		},
		dateInp : null,
		bindEvents : function(){
			var that = this;
			this.listUl.on("click",".checkBtn",function(e){
				that.onCheckBtnClick(that,e);
			})
			this.listUl.on("focus",".countInp",function(e){
				that.onCountInpFocus(that,e);
			});
			this.listUl.on("blur",".countInp",function(e){
				that.onCountInpBlur(that,e);
			})
			this.listUl.on("click",".termTimeWrap",function(e){
				var tarInp = $(e.currentTarget).find(".termTimeInp");
				var date = tarInp.val();
				var offset = tarInp.offset();
				that.calendar.show(date,{
					onBefore : function(){
						that.dateInp = tarInp;
						that.calendar.position({
							top : offset.top+$(e.currentTarget).height()+2,
							left : offset.left-6
						});
					}
				});
			})
			this.calendar.on("click",function(data){
				that.dateInp.val(data.date)
				that.calendar.close()
			})
		},
		onCountInpFocus : function(that,e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			tarInp.attr("data-lastval",tarInp.val())
		},
		onCountInpBlur : function(that,e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val())*1;
			var lastVal = tarInp.attr("data-lastval");
			var min = 0;
			var max = tarInp.attr("data-maxnum")*1;
			var result = that.validate_countInp(tarInp);
			if(!result) return tarInp.val(lastVal);
	
		},
		//点击验证按钮
		onCheckBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var parent = tarBtn.parents(".inCon");
			var ordernum = tarBtn.attr("data-mainordernum");
			var salerid = Api.getSalerid();
			var check_method = parent.find("input[type=radio]:checked").val();
			var ticketLi = parent.find(".ticketUl .ticketLi");
			var list = (function(){
				var list = {};
				var total = 0;
				ticketLi.each(function(){
					var item = $(this);
					var inp = item.find(".countInp");
					var ordernum = inp.attr("data-ordernum");
					var tnum = inp.val();
					total += tnum*1;
					list[ordernum] = tnum;
				});
				return total==0 ? 0 : list;
			})();
			var rtime = parent.find(".termTimeInp").val() || "";
			var errorTip = parent.find(".errorTip");
			if(list==0) return ticketLi.length==1 ? alert("验证票数不能为0") : alert("验证票数不能全为0");
			Api.terminal({
				check_method : check_method,
				salerid : salerid,
				ordernum : ordernum,
				list : list,
				rtime : rtime
			},{
				loading : function(){
					errorTip.hide();
					tarBtn.addClass("disable").text("正在验证...");
				},
				removeLoading : function(){
					tarBtn.removeClass("disable").text("验 证");
				},
				success : function(res){
					PFT.Help.AlertTo("success",'<p style="width:200px">验证成功</p>');
					parent.find(".ticketLi").each(function(){
						var tarLi = $(this);
						var countInp = tarLi.find(".countInp");
						var has_terminal_num = countInp.val()*1;
						var un_terminal = tarLi.find(".trnameCol .un_terminal_tnum");
						var total = tarLi.find(".total_tnum");
						var total_num = total.text() * 1;
						var un_terminal_num = un_terminal.text()*1;
						if(check_method==0){ //取消余票
							un_terminal.text(0);
							total.text(total_num-(un_terminal_num-has_terminal_num))
							countInp.val(0);
						}else if(check_method==1){ //保留余票
							un_terminal.text(un_terminal_num-has_terminal_num);
							countInp.val(un_terminal_num-has_terminal_num);
						}
						that.setCountInpMax();
					})
				},
				unlogin : function(res){
					errorTip.show().html('登录状态已过期，请重新<a style="margin:0 2px;" href="dlogin_n.html">登录</a>');
				},
				fail : function(res){
					tarBtn.text("重新验证");
					errorTip.show().html(res.msg);
				}
			})
		},
		query : function(salerid,voucher){
			var that = this;
			Api.queryOrder(salerid,voucher,{
				loading : function(){ that.render("loading",null)},
				removeLoading : function(){ that.render("removeLoading",null)},
				success : function(res){ that.render("success",res)},
				empty : function(res){ that.render("empty",res)},
				fail : function(res){ that.render("fail",res)},
				unlogin : function(res){ that.render("unlogin",res)}
			})
		},
		//设置每张票验证的最大票数
		setCountInpMax : function(){
			this.listUl.find(".countInp").each(function(){
				var tarLi = $(this);
				var parent = tarLi.parents(".ticketLi");
				var max = parent.find(".un_terminal_tnum").text()*1;
				tarLi.attr("data-maxnum",max);
			})
		},
		//校验countInp输入的数字的有效性
		validate_countInp : function(tarInp){
			var val = tarInp.val()*1;
			var min = 0;
			var max = tarInp.attr("data-maxnum")*1;
			if(!PFT.Help.isPositiveNum(val,true) || val<min || val>max) return false;
			return true;
		},
		render : function(type,data){
			var listUl = this.listUl;
			var html = "";
			if(type=="loading"){
				html = '<li class="sta loading"><img class="loadingImg" src="'+Api.LOADING_IMG+'" alt=""/><span class="t">请稍后...</span></li>';
				listUl.html(html);
			}else if(type=="removeLoading"){
				listUl.html("");
			}else if(type=="success"){
				html = this.template({data:data.orders});
				listUl.html(html);
			}else if(type=="empty"){
				listUl.html('<li class="sta empty"><span class="t">查无匹配订单</span></li>');
			}else if(type=="unlogin"){
				listUl.html('<li class="sta unlogin"><span class="t">未登录或登录状态已过期，请重新<a style="margin:0 3px;" href="dlogin_n.html">登录</a></span></li>');
			}else if(type=="fail"){
				var msg = data.msg || Api.AJAX_ERROR_TEXT;
				listUl.html('<li class="sta fail"><span class="t">'+msg+'</span></li>');
			}
		}
	});
	module.exports = OrderList;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<% _.each(data,function(item,index){ %>\r\n<li class=\"orderItem\" id=\"orderItem-<%=item.ordernum%>\" data-ordernum=\"<%=item.ordernum%>\">\r\n    <div class=\"oTit\">\r\n        联系人：<span class=\"contactor\"><%=item.ordername%></span><span class=\"mobile\">电话：<%=item.ordertel%></span>\r\n        <% if(item.status!=0){ %>\r\n            <span class=\"flag status_<%=item.status%>\"><%={\r\n                \"0\" : \"未使用\",\r\n                \"1\" : \"已使用\",\r\n                \"2\" : \"已过期\",\r\n                \"3\" : \"已取消\",\r\n                \"4\" : \"凭证码被替代\",\r\n                \"5\" : \"被终端撤销(已取消)\",\r\n                \"6\" : \"被终端撤销(已使用)\"\r\n            }[item.status]%></span>\r\n        <% } %>\r\n        <span class=\"flag pmode_<%=item.paystatus%>\"><%={\r\n            0 : \"景区到付\",\r\n            1 : \"已支付\",\r\n            2 : \"未支付\"\r\n        }[item.paystatus]%></span>\r\n    </div>\r\n    <div class=\"itemCon\">\r\n        <div class=\"ltCon\">\r\n            <p class=\"line\">\r\n                <span class=\"lt\">订单号：<span class=\"vhidden\">订</span></span>\r\n                <span class=\"rt\"><%=item.ordernum%></span>\r\n            </p>\r\n            <p class=\"line\">\r\n                <span class=\"lt\">下单时间：</span>\r\n                <span class=\"rt\"><%=item.ordertime%></span>\r\n            </p>\r\n            <p class=\"line\">\r\n                <span class=\"lt\">游玩时间：</span>\r\n                <span class=\"rt\"><%=item.begintime%></span>\r\n            </p>\r\n        </div>\r\n        <div class=\"inCon\">\r\n            <% var tickets=item.tickets;%>\r\n            <% if(tickets && tickets.length){ %>\r\n                <ul class=\"ticketUl\">\r\n                    <% _.each(tickets,function(ticket,ind){ %>\r\n                        <li class=\"ticketLi clearfix\">\r\n                            <div class=\"inpCtrol\">\r\n                                <input class=\"tinp countInp\" type=\"text\" value=\"<%=ticket.tnum%>\"\r\n                                       data-ptype=\"A\"\r\n                                       data-maxnum=\"<%=ticket.tnum%>\"\r\n                                       data-mainordernum=\"<%=tickets[0].ordernum%>\"\r\n                                       data-ordernum=\"<%=ticket.ordernum%>\"/>\r\n                                <span class=\"zhang\">张</span>\r\n                            </div>\r\n                            <div class=\"trnameCol\">\r\n                                <p class=\"tname\">【<%=ticket.name%>】</p>\r\n                                <p class=\"bt\">\r\n                                    共<em class=\"tnum total_tnum\"><%=ticket.tnum_s ? ticket.tnum_s : 10%></em>张\r\n                                    <i class=\"vt\"></i>\r\n                                    <%\r\n                                        var has_terminal=ticket.tnum_s-ticket.tnum;\r\n                                        if(has_terminal<0) has_terminal=0;\r\n                                    %>\r\n                                    已使用<em class=\"tnum has_terminal_tnum\"><%=has_terminal%></em>张\r\n                                    <i class=\"vt\"></i>\r\n                                    待验证<em class=\"tnum un_terminal_tnum\"><%=ticket.tnum%></em>张\r\n                                </p>\r\n                            </div>\r\n                        </li>\r\n                    <% }) %>\r\n                </ul>\r\n                <div class=\"checkMethodBox\">\r\n                    <% if(item.ptype!=\"F\"){ %>\r\n                        <input type=\"radio\" checked name=\"check_method\" value=\"0\" id=\"check_method_<%=item.ordernum%>_0\"/><label style=\"margin-right:15px\" for=\"check_method_<%=item.ordernum%>_0\">取消余票</label>\r\n                        <input type=\"radio\" name=\"check_method\" value=\"1\" id=\"check_method_<%=item.ordernum%>_1\"/><label for=\"check_method_<%=item.ordernum%>_1\">保留余票</label>\r\n                    <% }else{ %> <!--套票的子票只能保留余票，不能取消余票-->\r\n                        <input type=\"radio\" checked name=\"check_method\" value=\"1\" id=\"check_method_<%=item.ordernum%>_1\"/><label for=\"check_method_<%=item.ordernum%>_1\">保留余票</label>\r\n                    <% } %>\r\n                </div>\r\n                <div class=\"doActionBox\">\r\n                    <%\r\n                        var checkBtnCls = \"\";\r\n                        var orderStatus = item.status;\r\n                        var pmode = item.pmode;\r\n                        var payStatus = item.paystatus;\r\n                        if(orderStatus==1 || orderStatus==3 || orderStatus==5 || orderStatus==6 || (payStatus==2 && pmode!=4)){\r\n                            //已使用｜已取消｜被终端撤销(已取消)｜被终端撤销(已使用)|未支付\r\n                            //不能验证\r\n                            //已过期的订单(status==2)admin与普通帐号均可验证\r\n                            checkBtnCls = \"disable\";\r\n                        }\r\n                    %>\r\n                    <a class=\"checkBtn <%=checkBtnCls%>\" data-ptype=\"<%=item.ptype%>\" href=\"javascript:void(0)\" data-mainordernum=\"<%=tickets[0].ordernum%>\">验 证</a>\r\n                    <% if(item.endtime){ %>\r\n                        <span class=\"termTimeWrap\"><input readonly class=\"termTimeInp\" type=\"text\" value=\"<%=item.endtime%>\"/><i class=\"iconfont\">&#xe65b;</i></span>\r\n                    <% } %>\r\n                    <span class=\"errorTip\"></span>\r\n                </div>\r\n                <% if(item.pmode==4){ %>\r\n                    <p class=\"payTypeTip\">请先确认游客已现场付费，然后给予验证</p>\r\n                <% } %>\r\n            <% } %>\r\n        </div>\r\n    </div>\r\n</li>\r\n<% }) %>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-2-18.
	 */
	__webpack_require__(25);
	var CalendarCore = __webpack_require__(27);
	var fn = new Function();
	var Calendar = RichBase.extend({
		selected : {},
		curYearmonth : "",
		init : function(opt){
			var that = this;
			var opt = opt || {};
			//显示的容器
			this.container = opt.container || $('<div id="calendar-pop-container" class="calendar-pop-contaienr"></div>').appendTo($("body"));
			this.containerID = this.container.attr("id");
			this.selected[this.containerID] = [];
			//是否支持多选日期 默认不支持
			this.mult = typeof opt.mult=="boolean" ? opt.mult : false;
			//模板
			this.tpl = opt.tpl || __webpack_require__(28);
	
			this.template = _.template(this.tpl);
	
			this.maskID = this.containerID+"-mask";
	
			this.mask = $("#"+this.maskID);
			if(!this.mask.length){
				this.mask = $('<div id="'+this.maskID+'" class="calendar-mask"></div>');
				this.mask.appendTo($("body"));
			}
	
			this.bindEvents();
		},
		bindEvents : function(){
			var that = this;
			this.container.on("click",".calendar-td",function(e){
				that.onTdClick(that,e);
				return false;
			})
			this.container.on("click",".monthNavBtn",function(e){
				that.onMonthBtnClick(that,e);
				return false;
			})
			this.mask.on("click",function(e){
				that.close();
			})
		},
		showDate : function(yearmonth,opt){
			var that = this;
			var opt = opt || {};
			var containerID = this.containerID;
			var yearmonth = yearmonth || this.getYearMonth();
			var new_yearmonth = yearmonth.substring(0,7);
			var container = this.container;
			var onBefore = opt.onBefore || fn;
			var onAfter = opt.onAfter || fn;
			that.fire("showDate.before",yearmonth);
			onBefore();
			var html = this.render(new_yearmonth);
			container.html(html);
			that.fire("showDate.after",yearmonth);
			onAfter();
			this.setCurYearmonth(new_yearmonth);
			setTimeout(function(){
				$("#"+containerID+"-calendar-td-"+yearmonth).addClass("selected");
			},10)
		},
		//点击选中某天
		onTdClick : function(that,e){
			var mult = that.mult;
			var tarTd = $(e.currentTarget);
			if(tarTd.hasClass("empty")) return false;
			var day = tarTd.attr("data-day");
			var date = tarTd.attr("data-date");
			var week = tarTd.attr("data-week");
			var yearmonth = tarTd.attr("data-yearmonth");
			tarTd.toggleClass("selected");
			var type = tarTd.hasClass("selected") ? "select" : "cancel";
			if(!mult){
				that.container.find(".calendar-td").removeClass("selected"); //单选模式下先清空所有日期的选中状态
				if(type=="select") tarTd.addClass("selected");
			}
			var params = {
				tarDom : tarTd,
				type : type,
				date : date,
				week : week,
				day : day,
				yearmonth : yearmonth
			}
			var selected = that.selected[that.containerID];
			if(type=="select"){ //选中
				if(!mult){ //如果只能单先，需先把上次选中的清理掉
					selected.splice(0,1);
				}
				selected.push(params);
			}else{ //取消选中
				for(var i in selected){
					var select = selected[i];
					var d = select.tarDom.attr("data-date");
					if(date==d){
						selected.splice(i,1);
						break;
					}
				}
			}
			that.setCurYearmonth(yearmonth+"-"+day);
			that.fire("click",params)
		},
		onMonthBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			var curYearMonth = that.getCurYearmonth();
			var toYearMonth = tarBtn.hasClass("next") ? CalendarCore.nextMonth(curYearMonth) : CalendarCore.prevMonth(curYearMonth);
			that.showDate(toYearMonth);
		},
		getYearMonth : function(date){
			var date = date ||  CalendarCore.gettoday();
			var yearmonth = date.length==10 ? date.substring(0,7) : date;
			return yearmonth;
		},
		render : function(yearmonth){
			if(!yearmonth) return "";
			var containerID = this.containerID;
			var date = CalendarCore.outputDate(yearmonth);
			var html = this.template({data:{
				containerID : containerID,
				yearmonth : yearmonth,
				dates : date
			}});
			return html;
		},
		//获取当前日历上显示的年月份
		getCurYearmonth : function(){
			return this.curYearmonth;
		},
		setCurYearmonth : function(yearmonth){
			this.curYearmonth = yearmonth;
			$("#"+this.containerID+"-top-calendar-date").text(this.curYearmonth);
		},
		position : function(data){
			var top = data.top;
			var left = data.left;
			this.container.css({
				top : top,
				left : left
			})
		},
		show : function(date,opt){
			this.container.show();
			this.showDate(date,opt);
			this.mask.show();
		},
		close : function(){
			this.container.hide();
			this.mask.hide();
		}
	});
	module.exports = Calendar;

/***/ },
/* 25 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 26 */,
/* 27 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-6-29.
	 */
	var CalendarCore={
		strpad:function(str){
			str=String(str);
			if(str.length==1){
				return "0"+str;
			}else{
				return str;
			}
		},
		/**
		 * 输出日期
		 * @param yearmonth
		 * @param type
		 *   todayValid : 今天可用
		 *   todayUnvalid : 今天不可用
		 *   allValid : 所有日期可用
		 *
		 * @returns {string}
		 */
		outputHtml:function(yearmonth,type){
			var that = this;
			var type = type || "todayValid";
			if(!yearmonth) yearmonth = this.gettoday();
			yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
			var nowtime=new Date();
			nowtime.setHours(0,0,0,0);
			nowtime=nowtime.getTime();//凌晨时间
			var begintime=yearmonth+"-01";
			begintime=begintime.split("-");
			begintime=begintime.join("/");
			var beginDate=new Date(begintime);
			var year=beginDate.getFullYear();
			var month=beginDate.getMonth()+1;
			var lastmonth=(month-1==0)?12:month-1;
			var nextmonth=(month+1==13)?1:month+1;
			var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
			var monthdays=days;
			var emptydays=beginDate.getDay();
			var endtime=yearmonth+"-"+days;
			endtime=endtime.split("-");
			endtime=endtime.join("/");
			var endDate=new Date(endtime);
			days+=beginDate.getDay()+(7-endDate.getDay());
			beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
			var nextday = new Date(this.gettoday()).getTime().toString();
			var lastmonth_none="lastmonth_none";
			var nextmonth_none="nextmonth_none";
			var html='<div class="calendar" id="calendarContent"><div class="monthbox">'+
				'<div id="calendarHead" class="title calendarHead" data-date="'+year+"-"+month+'"><span class="lastmonth '+lastmonth_none+'"><a title="'+lastmonth+'月">&nbsp;</a></span><span class="nextmonth '+nextmonth_none+'"><a title="'+nextmonth+'月">&nbsp;</a></span><span class="year">'+year+'年'+month+'月</span><span class="close"></span></div>'+
				'<table>'+
				'<tr>'+
				'<th class="weeken">日</th>'+
				'<th>一</th>'+
				'<th>二</th>'+
				'<th>三</th>'+
				'<th>四</th>'+
				'<th>五</th>'+
				'<th class="weeken">六</th>'+
				'</tr>';
			for(var i=0,j=0;i<days-1;i++){
				if(i%7==0){
					html+='<tr>';
				}
				var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
				var price="";
				var priceT="";
				var valid="";
				var validT="";
				var remain;
				var beginDate_time = beginDate.getTime();
				var beginDate_day = that.strpad(beginDate.getDate());
				if(i<emptydays||i>=monthdays+emptydays){
					html+='<td><div class="detail"></div></td>';
				}else if(type=="allValid"){ //所有可用
					html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
					html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}else{
					html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}
	//			if(i<emptydays||i>=monthdays+emptydays){
	//				html+='<td><div class="detail"></div></td>';
	//			}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
	//				html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
	//			}else{
	//				html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
	//			}
				if(i%7==6){
					html+='</tr>';
				}
				beginDate.setTime(beginDate.getTime()+24*3600000);
			}
			html+="</table></div>";
			return html;
		},
		outputDate : function(yearmonth){
			var that = this;
			if(!yearmonth) yearmonth = this.gettoday();
			yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
			var nowtime=new Date();
			nowtime.setHours(0,0,0,0);
			nowtime=nowtime.getTime();//凌晨时间
			var begintime=yearmonth+"-01";
			begintime=begintime.split("-");
			begintime=begintime.join("/");
			var beginDate=new Date(begintime);
			var month=beginDate.getMonth()+1;
			var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
			var monthdays=days;
			var emptydays=beginDate.getDay();
			var endtime=yearmonth+"-"+days;
			endtime=endtime.split("-");
			endtime=endtime.join("/");
			var endDate=new Date(endtime);
			days+=beginDate.getDay()+(7-endDate.getDay());
			beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
			var resultArr = [];
			var dateArr = [];
			for(var i=0;i<days-1;i++){
				var json = {};
				var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
				var beginDate_day = that.strpad(beginDate.getDate());
				json["weeken"] = (i%7);
				if(i<emptydays){
					json["day"] = "";
					json["month"] = month-1;
				}else if(i>=monthdays+emptydays){
					json["day"] = "";
					json["month"] = month+1;
				}else if(beginDate.getTime()<nowtime){
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "before";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}else if(beginDate.getTime()==nowtime){
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "today";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}else{
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "after";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}
				dateArr.push(json);
				if(dateArr.length==7){
					resultArr.push(dateArr);
					dateArr=[];
				}
				beginDate.setTime(beginDate.getTime()+24*3600000);
			}
			return resultArr;
		},
		getnowdate : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			m = this.strpad(m);
			var d = date.getDate();
			d = this.strpad(d);
			return y+"-"+m+"-"+d;
		},
		nextday : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			var a = new Date(y,m,0);
			var maxDay = a.getDate();
			var nextday = d+1;
			if(nextday>maxDay){
				nextday = "01";
				m++;
				if(m>12){
					m = "01";
					y++;
				}
			}
			nextday = this.strpad(nextday);
			m = this.strpad(m);
			return y+"-"+m+"-"+nextday;
		},
		nextMonth : function(yearmonth){
			return this._siblingMonth(yearmonth,"next");
		},
		prevMonth : function(yearmonth){
			return this._siblingMonth(yearmonth,"prev");
		},
		_siblingMonth : function(yearmonth,nextOrPrev){ //2015-06
			yearmonth = yearmonth || "";
			if(yearmonth.length==7){
				yearmonth = yearmonth;
			}else if(yearmonth.length==10){
				yearmonth = yearmonth.substring(0,7);
			}else{
				yearmonth = this.gettoday().substring(0,7);
			}
			if(!nextOrPrev) nextOrPrev = "next";
			var time=yearmonth+"-01";
			time=time.split("-");
			time=time.join("/");
			time=new Date(time);
			var lasttime=new Date(time.getFullYear(),time.getMonth()-1,1);
			var lastmonth=lasttime.getFullYear()+"-"+this.strpad(lasttime.getMonth()+1);
			var nexttime=new Date(time.getFullYear(),time.getMonth()+1,1);
			var nextmonth=nexttime.getFullYear()+"-"+this.strpad(nexttime.getMonth()+1);
			return nextOrPrev=="next" ? nextmonth : lastmonth;
		},
		gettoday : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			m = this.strpad(m);
			var d = date.getDate();
			d = this.strpad(d);
			return y+"-"+m+"-"+d;
		},
		getCurYearmonth : function(){
			return $("#calendarHead").attr("data-date")
		}
	};
	module.exports = CalendarCore;

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<%\r\n    var yearmonth=data.yearmonth,dates=data.dates;\r\n    var containerID = data.containerID;\r\n    var ym = yearmonth.split(\"-\");\r\n    var year = ym[0];\r\n    var month = ym[1];\r\n%>\r\n<div id=\"<%=containerID%>-topCalendar\" class=\"calendarHead\">\r\n    <div class=\"con\"><span id=\"<%=containerID%>-top-calendar-date\" class=\"top-calendar-date\"></span></div>\r\n    <a id=\"<%=containerID%>-monthNavBtnNext\" class=\"monthNavBtn next\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe60d;</i></a>\r\n    <a id=\"<%=containerID%>-monthNavBtnPrev\" class=\"monthNavBtn prev\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe60c;</i></a>\r\n</div>\r\n<div id=\"<%=containerID%>-calendar-panel-<%=yearmonth%>\" class=\"calendar-panel\">\r\n    <table id=\"calendar-table-<%=yearmonth%>\"  class=\"calendar-table\">\r\n        <thead id=\"<%=containerID%>-calendar-thead-<%=yearmonth%>\" class=\"calendar-thead\">\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"0\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-0\">日</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"1\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-1\">一</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"2\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-2\">二</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"3\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-3\">三</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"4\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-4\">四</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"5\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-5\">五</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"6\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-6\">六</label>\r\n        </th>\r\n        </thead>\r\n        <tbody id=\"<%=containerID%>-calendar-tbody-<%=yearmonth%>\" class=\"calendar-tbody\">\r\n            <%_.each(dates,function(tr){%>\r\n                <tr>\r\n                    <%_.each(tr,function(td){%>\r\n                        <%\r\n                            var date = td.date;\r\n                            var day = td.day;\r\n                            var weeken = td.weeken;\r\n                            var yearmonth = td.yearmonth;\r\n                        %>\r\n                        <%if(day){%>\r\n                            <td class=\"calendar-td day\" data-day=\"<%=day%>\" data-date=\"<%=date%>\" data-yearmonth=\"<%=yearmonth%>\" data-week=\"<%=weeken%>\" id=\"<%=containerID%>-calendar-td-<%=date%>\">\r\n                                <div class=\"tdCon\">\r\n                                    <span class=\"dayNum\"><%=day%></span>\r\n                                </div>\r\n                            </td>\r\n                        <%}else{%>\r\n                            <td class=\"calendar-td empty\"></td>\r\n                        <%}%>\r\n                    <% }) %>\r\n                </tr>\r\n             <% }) %>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n";

/***/ }
/******/ ]);
//# sourceMappingURL=terminal.all.js.map