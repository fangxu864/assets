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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(34);
	var UserInfo = __webpack_require__(36);
	var CardList = __webpack_require__(37);
	var OrderInfo = __webpack_require__(39);
	var CheckExistDialog = __webpack_require__(7);
	var Api = __webpack_require__(5);
	var Format = function (date,fmt) { //author: meizz
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
			"click #submitBtn" : "onSubmitBtnClick"
		},
		initialize : function(){
			var that = this;
			this.submitBtn = $("#submitBtn");
			this.urlParams = PFT.Util.UrlParse();
			this.pid = this.urlParams["pid"];
			this.aid = this.urlParams["aid"];
			this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
			this.type = this.physics ? "physics" : "virtual";
			this.UserInfo = new UserInfo();
			this.CardList = new CardList();
			this.OrderInfo = new OrderInfo();
			this.CheckExistDialog = new CheckExistDialog();
			this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
				submitData["update"] = 1;
				that.submit(submitData);
				this.close();
			})
		},
		onSubmitBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var pid = this.pid;
			var aid = this.aid;
			var userinfo = this.UserInfo.getUserInfo();
			var name = userinfo.name;
			var mobile = userinfo.mobile;
			var id_card = userinfo.id_card;
			var note = userinfo.note;
			if(!pid || !aid) return false;
			if(name=="error" || mobile=="error" || id_card=="error") return false;
			var pay = $("#paytypeContainer").find("input[type=radio]:checked");
			//授信支付=2  帐户余额=0  在线支付=1  自供应=3
			var paymode = pay.length ? pay.val() : "3";
			var sid = this.CardList.getSid();
			if(!sid){
				var error = this.CardList.getCardsForOrder_ErrorText();
				return alert(error);
			}
			var pids = {};
			pids[pid] = 1;
			this.checkHasBand({
				pid : this.pid,
				aid : this.aid,
				paymode : paymode,
				ordertel : mobile,
				mobile : mobile,
				name : name,
				memo : note,
				ordername : name,
				id_card : id_card,
				idCard : id_card,
				sid : sid,
				pids : pids
			})
		},
		//如果购买虚拟卡，订单提交之前需要先请你去这个接口，判断会员是否已经绑定过其他年卡
		checkHasBand : function(opt){
			opt = opt || {};
			var that = this;
			var submitBtn = this.submitBtn;
			var mobile = opt.mobile;
			var name = opt.name;
			var id_card = opt.id_card || "";
			var sid = opt.sid;
			if(this.type=="physics") return this.submit(opt);
			if(!mobile || !name || !sid) throw new Error("缺少mobile或name或sid");
			PFT.Util.Ajax(Api.Url.makeOrder.isNeedToReplace,{
				type : "post",
				params : {
					mobile : mobile,
					name : name,
					id_card : id_card,
					sid : sid
				},
				loading : function(){ submitBtn.addClass("disable")},
				complete : function(){ submitBtn.removeClass("disable")},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						var exist = data.exist;
						var name = data.name;
						var left = data.left;
						if(exist==1){ //已存在
							that.CheckExistDialog.open({
								mobile : mobile,
								idCard : id_card,
								name : name,
								left : left,
								submitData : opt
							});
						}else{
							that.submit(opt);
						}
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		submit : function(opt){
			var submitBtn = this.submitBtn;
			var data = {
				pid : opt.pid,
				aid : opt.aid,
				idCard : opt.idCard,
				paymode : opt.paymode,
				ordertel : opt.ordertel,
				ordername : opt.ordername,
				memo : opt.note,
				pids : opt.pids
			};
			data["begintime"] = Format(new Date,"yyyy-MM-dd");
			data["card_type"] = this.type;
			data["virtual_no"] = this.CardList.getVirtualCards();
			if(opt.update) data["update"] = 1;
			PFT.Util.Ajax(Api.Url.makeOrder.submit,{
				type : "post",
				params : data,
				loading : function(){ submitBtn.addClass("disable")},
				complete : function(){ submitBtn.removeClass("disable")},
				success : function(res){
					res = res || {};
					var status = res.status || "";
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					var ordernum = res.ordernum;
					if(status=="success"){
						if(ordernum){
							window.location.href = "annual_ordersuccess.html?ordernum="+ordernum;
						}else{
							alert("下单成功，但服务端没有返回订单号");
						}
					}else if(status=="fail"){
						alert(msg);
					}
				}
			})
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
				history : ""
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/27 18:55
	 * Description: ""
	 */
	__webpack_require__(8);
	var SDialog = __webpack_require__(10);
	var tpl = __webpack_require__(17);
	var Dialog = function(){
		var that = this;
		this.submitData = {};
		this.SDialog = new SDialog({
			width : 680,
			content : tpl,
			drag : true,
			events : {
				"click #replaceBtn" : function(e){
					that.onReplaceBtnClick(e);
				},
				"click #messageBtn" : function(e){
					that.onMessageBtnClick(e);
				}
			}
		});
	};
	Dialog.prototype = {
		open : function(opt){
			opt = opt || {};
			var mobile = opt.mobile;
			var idCard = opt.idCard;
			var name = opt.name;
			var left = opt.left;
			var result = "";
			if(Object.prototype.toString.call(left)=="[object Array]"){
				result = '<p class="pname">'+name+'</p>';
				for(var i in left){
					var lef = left[i];
					var ltitle = lef.ltitle;
					var title = lef.title;
					var left_num = lef.left;
					result += '<p class="lname">'+ltitle+" "+title+'（'+left_num+'）</p>';
				}
			}else{
				result = name+"（"+left+"）";
			}
			this.submitData = opt.submitData;
			this.SDialog.open({
				onBefore : function(){
					$("#existDialog_mobile").text(mobile);
					$("#existDialog_idCard").text(idCard);
					$("#existDialog_name").html(result);
				}
			});
		},
		close : function(){
			this.SDialog.close();
		},
		on : function(type,handler){
			this.SDialog.on(type,handler);
		},
		//替换并且直接下单
		onReplaceBtnClick : function(e){
			this.SDialog.trigger("replaceAndSubmit",this.submitData,this);
		},
		//取消
		onMessageBtnClick : function(e){
			this.close();
		}
	};
	module.exports = Dialog;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/21 10:04
	 * Description: ""
	 */
	__webpack_require__(11);
	var WinWidthHeight = __webpack_require__(13);
	var Drag = __webpack_require__(14);
	var PubSub = __webpack_require__(15);
	var Extend = __webpack_require__(16);
	var fn = new Function();
	var Defaults = {
		width : "",
		height : "",
		closeBtn : true,
		content : "",
		drag : false,
		speed : 200,
		offsetX : 0,
		offsetY : 0,
		overlay : true,
		headerHeightMin : 46,
		events : {},
		onOpenBefore : fn,
		onOpenAfter : fn,
		onCloseBefore : fn,
		onCloseAfter : fn
	};
	var getUid = (function(){
		var uid = 0;
		return function(){
			return uid++;
		}
	})();
	var Dialog = function(opt){
		var that = this;
		var opt = this.opt = $.extend(Defaults,opt||{});
		this.uid = getUid();
		this.flag = "gSimpleDialog-";
		this.id = this.flag + this.uid + "-";
		var container = this.container = $('<div></div>');
		$("body").append(container);
		container.attr({
			id : this.id + "container"
		}).addClass(this.flag + "container").addClass(this.id+"container");
		if(typeof opt.width=="number") container.width(opt.width);
		if(typeof opt.height=="number") container.height(opt.height);
	
		var header = this.header = $('<div></div>');
		header.attr({id : this.id+"header"})
			  .addClass(this.flag + "header").addClass(this.id+"header")
			  .css({minHeight:opt.headerHeightMin}).appendTo(container);
		if(opt.header){
			var header_tpl = typeof opt.header=="function" ? opt.header() : opt.header;
			header.prepend(header_tpl);
		}
		var content = this.content = $('<div></div>');
		content.attr({id : this.id + "content"})
			   .addClass(this.flag + "content")
			   .addClass(this.id + "content")
			   .appendTo(container)
		       .html(typeof opt.content=="function" ? opt.content() : opt.content);
		var closeBtn = this.closeBtn = $('<div>×</div>');
		closeBtn.attr({id : this.id+"closeBtn"})
			.addClass(this.flag + "closeBtn")
			.addClass(this.id + "closeBtn")
			.appendTo(container);
		var hh = header.height();
		closeBtn.css({width:hh+6,height:hh,lineHeight:hh-4+"px"});
		if(!opt.closeBtn) closeBtn.addClass("hidden");
		closeBtn.on("click",function(){
			that.close();
		})
		this.init(opt);
	};
	Dialog.prototype = Extend({
		init : function(opt){
			var that = this;
			var events = this.events = opt.events;
			var container = this.container;
			for(var i in events){
				//"click .parent .children" => "click:.parent .children"
				var _key = i.replace(/(\w*)\s(.*)/,function(str,p1,p2){
					return p1+":"+p2;
				}).split(":");
				(function(_key){
					var eventType = _key[0];
					var selector = _key[1];
					var handler = events[i];
					container.on(eventType,selector,function(e){
						if(typeof handler=="function"){
							handler(e);
						}else if(typeof handler=="string"){
							that.prototype[handler](e);
						}
					})
				})(_key);
			}
			setTimeout(function(){
				if(opt.drag){
					Drag({
						trigger : that.header[0],
						target : that.container[0]
					})
				}
			},10)
			this.position();
		},
		position : function(){
			var container = this.container;
			var height = container.height();
			var width = container.width();
			var WinWH = WinWidthHeight();
			var offsetX = this.opt.offsetX;
			container.css({
				left : (WinWH.width-width)/2 + offsetX,
				top : -height + 10
			}).hide();
		},
		getMask : function(){
			var mask = $("#"+this.flag+"mask");
			if(mask.length) return mask;
			mask = $('<div></div>');
			mask.attr({
				id : this.flag + "mask",
				class : this.flag + "mask"
			}).appendTo($("body"));
			return mask;
		},
		open : function(opt){
			opt = opt || {};
			var that = this;
			var overlay = typeof opt.overlay=="undefined" ? this.opt.overlay : !!opt.overlay;
			var speed = opt.speed || this.opt.speed;
			var offsetY = opt.offsetY || this.opt.offsetY;
			var onBefore = opt.onBefore || this.opt.onOpenBefore;
			var onAfter = opt.onAfter || this.opt.onOpenAfter;
			var winH = WinWidthHeight().height;
			var containerH = this.container.height();
			this.position();
			this.container.show().css({zIndex:9999});
			onBefore();
			this.container.animate({
				top : (winH-containerH)/2 + offsetY
			},speed,function(){
				onAfter();
			})
			if(overlay) this.getMask().fadeIn(function(){
				that.getMask().css("zIndex",9998);
			});
		},
		close : function(opt){
			opt = opt || {};
			var container = this.container;
			var speed = opt.speed || this.opt.speed;
			var onBefore = opt.onBefore || this.opt.onCloseBefore;
			var onAfter = opt.onAfter || this.opt.onCloseAfter;
			var containerH = container.height();
			onBefore();
			container.animate({
				top : -(containerH+10)
			},speed,function(){
				onAfter();
				container.hide().css({zIndex:-1});
			})
			var mask = $("#"+this.flag+"mask");
			mask.fadeOut(function(){
				mask.css("zIndex",0)
			});
		}
	},PubSub);
	module.exports = Dialog;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/25 18:20
	 * Description: ""
	 */
	module.exports = function(){
		var result = {
			width : 0,
			height : 0
		};
		if(window.innerWidth){
			result.width = window.innerWidth;
			result.height = window.innerHeight;
		}else if(document.documentElement && document.documentElement.clientWidth){
			result.width = document.documentElement.clientWidth;
			result.height = document.documentElement.clientHeight;
		}else{
			result.width = document.body.clientWidth;
			result.height = document.body.clientHeight;
		}
		return result;
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/22 19:07
	 * Description: ""
	 */
	var win = window;
	var	doc = win.document,
		docElem = doc.documentElement;
	var	body = doc.body,
		isIE = !-[1,],	// 判断IE6/7/8 不能判断IE9
		isIE6 = isIE && /msie 6/.test( navigator.userAgent.toLowerCase() ), // 判断IE6
		uuid = 1,
		expando = 'cache' + ( +new Date() + "" ).slice( -8 ),  // 生成随机数
		cacheData = {
			/**
			 *	1 : {
		 *		eclick : [ handler1, handler2, handler3 ];
		 *		clickHandler : function(){ //... };
		 *	}
			 */
		};
	var capitalize = function( str ){
		var firstStr = str.charAt(0);
		return firstStr.toUpperCase() + str.replace( firstStr, '' );
	};
	/**
	 * 获取滚动条的位置
	 * @param { String } 'top' & 'left'
	 * @return { Number }
	 */
	var getScroll = function( type ){
		var upType = capitalize( type );
		return document.documentElement['scroll' + upType] || body['scroll' + upType];
	};
	/**
	 * 获取元素在页面中的位置
	 * @param { Object } DOM元素
	 * @param { String } 'top' & 'left'
	 * @return { Number }
	 */
	var getOffset = function( elem, type ){
		var upType = capitalize( type ),
			client  = docElem['client' + upType]  || body['client' + upType]  || 0,
			scroll  = getScroll( type ),
			box = elem.getBoundingClientRect();
	
		return Math.round( box[type] ) + scroll - client;
	};
	
	var Drag = function(opt){
		opt = opt || {};
		var target = opt.trigger;
		var moveElem = opt.target;
		target.style.cursor = "move";
		// 清除文本选择
		var	clearSelect = 'getSelection' in win ? function(){
				win.getSelection().removeAllRanges();
			} : function(){
				try{
					doc.selection.empty();
				}
				catch( e ){};
			},
	
			self = this,
			event = Drag.event,
			isDown = false,
			newElem = isIE ? target : doc,
			//fixed = moveElem.style.position === 'fixed',
			fixed = true,
			_fixed = true;
	
		// mousedown
		var down = function( e ){
			isDown = true;
			var scrollTop = getScroll( 'top' ),
				scrollLeft = getScroll( 'left' ),
				edgeLeft = fixed ? 0 : scrollLeft,
				edgeTop = fixed ? 0 : scrollTop;
	
			Drag.data( 'dragData', {
				x : e.clientX - getOffset( moveElem, 'left' ) + ( fixed ? scrollLeft : 0 ),
				y : e.clientY - getOffset( moveElem, 'top' ) + ( fixed ? scrollTop : 0 ),
				// 设置上下左右4个临界点的位置
				// 固定定位的临界点 = 当前屏的宽、高(下、右要减去元素本身的宽度或高度)
				// 绝对定位的临界点 = 当前屏的宽、高 + 滚动条卷起部分(下、右要减去元素本身的宽度或高度)
				el : edgeLeft,	// 左临界点
				et : edgeTop,  // 上临界点
				er : edgeLeft + docElem.clientWidth - moveElem.offsetWidth,  // 右临界点
				eb : edgeTop + docElem.clientHeight - moveElem.offsetHeight  // 下临界点
			});
	
			if( isIE ){
				// IE6如果是模拟fixed在mousedown的时候先删除模拟，节省性能
				if( isIE6 && _fixed ){
					moveElem.style.removeExpression( 'top' );
				}
				target.setCapture();
			}
	
			event.bind( newElem, 'mousemove', move );
			event.bind( newElem, 'mouseup', up );
	
			if( isIE ){
				event.bind( target, 'losecapture', up );
			}
	
			e.stopPropagation();
			e.preventDefault();
	
		};
	
		event.bind( target, 'mousedown', down );
	
		// mousemove
		var move = function( e ){
			if( !isDown ) return;
			clearSelect();
			var dragData = Drag.data( 'dragData' ),
				left = e.clientX - dragData.x,
				top = e.clientY - dragData.y,
				et = dragData.et,
				er = dragData.er,
				eb = dragData.eb,
				el = dragData.el,
				style = moveElem.style;
	
			// 设置上下左右的临界点以防止元素溢出当前屏
			style.marginLeft = style.marginTop = '0px';
			style.left = ( left <= el ? el : (left >= er ? er : left) ) + 'px';
			style.top = ( top <= et ? et : (top >= eb ? eb : top) ) + 'px';
			e.stopPropagation();
		};
	
		// mouseup
		var up = function( e ){
			isDown = false;
			if( isIE ){
				event.unbind( target, 'losecapture', up );
			}
			event.unbind( newElem, 'mousemove', move );
			event.unbind( newElem, 'mouseup', up );
			if( isIE ){
				target.releaseCapture();
				// IE6如果是模拟fixed在mouseup的时候要重新设置模拟
				if( isIE6 && _fixed ){
					var top = parseInt( moveElem.style.top ) - self.getScroll( 'top' );
					moveElem.style.setExpression('top',"fuckIE6=document.documentElement.scrollTop+" + top + '+"px"');
				}
			}
			e.stopPropagation();
		};
	};
	/**
	 * 设置并返回缓存的数据 关于缓存系统详见：http://stylechen.com/cachedata.html
	 * @param { String / Object } 任意字符串或DOM元素
	 * @param { String } 缓存属性名
	 * @param { Anything } 缓存属性值
	 * @return { Object }
	 */
	Drag.data = function( elem, val, data ){
		if( typeof elem === 'string' ){
			if( val !== undefined ){
				cacheData[elem] = val;
			}
			return cacheData[elem];
		}
		else if( typeof elem === 'object' ){
			// 如果是window、document将不添加自定义属性
			// window的索引是0 document索引为1
			var index = elem === win ? 0 :
					elem.nodeType === 9 ? 1 :
						elem[expando] ? elem[expando] :
							(elem[expando] = ++uuid),
	
				thisCache = cacheData[index] ? cacheData[index] : ( cacheData[index] = {} );
	
			if( data !== undefined ){
				// 将数据存入缓存中
				thisCache[val] = data;
			}
			// 返回DOM元素存储的数据
			return thisCache[val];
		}
	};
	/**
	 * 删除缓存
	 * @param { String / Object } 任意字符串或DOM元素
	 * @param { String } 要删除的缓存属性名
	 */
	Drag.removeData = function( elem, val ){
		if( typeof elem === 'string' ){
			delete cacheData[elem];
		}
		else if( typeof elem === 'object' ){
			var index = elem === win ? 0 :
				elem.nodeType === 9 ? 1 :
					elem[expando];
	
			if( index === undefined ) return;
			// 检测对象是否为空
			var isEmptyObject = function( obj ) {
					var name;
					for ( name in obj ) {
						return false;
					}
					return true;
				},
			// 删除DOM元素所有的缓存数据
				delteProp = function(){
					delete cacheData[index];
					if( index <= 1 ) return;
					try{
						// IE8及标准浏览器可以直接使用delete来删除属性
						delete elem[expando];
					}
					catch ( e ) {
						// IE6/IE7使用removeAttribute方法来删除属性(document会报错)
						elem.removeAttribute( expando );
					}
				};
	
			if( val ){
				// 只删除指定的数据
				delete cacheData[index][val];
				if( isEmptyObject( cacheData[index] ) ){
					delteProp();
				}
			}
			else{
				delteProp();
			}
		}
	};
	// 事件处理系统
	Drag.event = {
	
		bind : function( elem, type, handler ){
			var events = Drag.data( elem, 'e' + type ) || Drag.data( elem, 'e' + type, [] );
			// 将事件函数添加到缓存中
			events.push( handler );
			// 同一事件类型只注册一次事件，防止重复注册
			if( events.length === 1 ){
				var eventHandler = this.eventHandler( elem );
				Drag.data( elem, type + 'Handler', eventHandler );
				if( elem.addEventListener ){
					elem.addEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.attachEvent( 'on' + type, eventHandler );
				}
			}
		},
	
		unbind : function( elem, type, handler ){
			var events = Drag.data( elem, 'e' + type );
			if( !events ) return;
	
			// 如果没有传入要删除的事件处理函数则删除该事件类型的缓存
			if( !handler ){
				events = undefined;
			}
			// 如果有具体的事件处理函数则只删除一个
			else{
				for( var i = events.length - 1, fn = events[i]; i >= 0; i-- ){
					if( fn === handler ){
						events.splice( i, 1 );
					}
				}
			}
			// 删除事件和缓存
			if( !events || !events.length ){
				var eventHandler = Drag.data( elem, type + 'Handler' );
				if( elem.addEventListener ){
					elem.removeEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.detachEvent( 'on' + type, eventHandler );
				}
				Drag.removeData( elem, type + 'Handler' );
				Drag.removeData( elem, 'e' + type );
			}
		},
	
		// 依次执行事件绑定的函数
		eventHandler : function( elem ){
			return function( event ){
				event = Drag.event.fixEvent( event || win.event );
				var type = event.type,
					events = Drag.data( elem, 'e' + type );
	
				for( var i = 0, handler; handler = events[i++]; ){
					if( handler.call(elem, event) === false ){
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		},
	
		// 修复IE浏览器支持常见的标准事件的API
		fixEvent : function( e ){
			// 支持DOM 2级标准事件的浏览器无需做修复
			if ( e.target ) return e;
			var event = {}, name;
			event.target = e.srcElement || document;
			event.preventDefault = function(){
				e.returnValue = false;
			};
			event.stopPropagation = function(){
				e.cancelBubble = true;
			};
			// IE6/7/8在原生的window.event中直接写入自定义属性
			// 会导致内存泄漏，所以采用复制的方式
			for( name in e ){
				event[name] = e[name];
			}
			return event;
		}
	};
	
	module.exports = Drag;

/***/ },
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
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div class=\"memberBox\" id=\"memberBox\">\r\n    <p class=\"memP\">会员已存在！是否替换原有卡和套餐？</p>\r\n    <table class=\"memTable border\">\r\n        <thead>\r\n        <tr class=\"font-gray\">\r\n            <th>手机号</th>\r\n            <th>身份证</th>\r\n            <th>卡套餐（已用特权数）</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr>\r\n            <td><div style=\"padding-right:10px\" id=\"existDialog_mobile\"></div></td>\r\n            <td><div style=\"padding-right:10px\" id=\"existDialog_idCard\"></div></td>\r\n            <td><div id=\"existDialog_name\"></div></td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    <div class=\"btnBox\">\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-blue\" id=\"replaceBtn\">替换并提交订单</a>\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-border\" id=\"messageBtn\">取消</a>\r\n    </div>\r\n</div>";

/***/ },
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
/* 34 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 35 */,
/* 36 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 11:04
	 * Description: ""
	 */
	var UserInfoView = Backbone.View.extend({
		el : $("#userInfoContainer"),
		events : {
			"focus .validateInp" : "onTextInpFocus",
			"blur .validateInp" : "onTextInpBlur"
		},
		initialize : function(){
			this.nameInp = $("#userinfo_nameInp");
			this.mobileInp = $("#userinfo_mobileInp");
			this.idCardInp = $("#userinfo_idCardInp");
			this.noteInp = $("#userinfo_noteInp");
			this.nameError = this.nameInp.parent().find(".tip");
			this.mobileError = this.mobileInp.parent().find(".tip");
			this.idCardError = this.idCardInp.parent().find(".tip");
		},
		onTextInpFocus : function(e){
			var tarInp = $(e.currentTarget);
			var tip = tarInp.parent().find(".tip");
			tip.removeClass("error").text(tarInp.attr("id")=="userinfo_idCardInp" ? "" : "必填项");
		},
		onTextInpBlur : function(e){
			var tarInp = $(e.currentTarget);
			var name = tarInp.attr("name");
			var val = $.trim(tarInp.val());
			var error = "";
			if(name=="name"){
				if(this.validateName(val)) this.nameError.addClass("error");
			}else if(name=="mobile"){
				error = this.validateMobile(val);
				if(error) this.mobileError.addClass("error").text(error);
			}else if(name=="id_card"){
				error = this.validateIDCard(val);
				if(error) this.idCardError.addClass("error").text(error);
			}
		},
		validateName : function(name){
			if(name=="") return "请填写购买人姓名";
		},
		validateMobile : function(mobile){
			if(mobile==""){
				return "必填项";
			}else if(!PFT.Util.Validate.typePhone(mobile)){
				return "请输入正确格式手机号";
			}
		},
		validateIDCard : function(idCard){
			var idCardInp = this.idCardInp;
			var isRequire = idCardInp.attr("data-needid");
			if(isRequire==1){ //要求必填
				if(!idCard){
					return "请输入身份证号";
				}else if(!PFT.Util.Validate.idcard(idCard)){
					return "请输入正确身份证号";
				}
			}else{ //不要求必填，可选项，但如果填写了，格式要求正确
				if(idCard && !PFT.Util.Validate.idcard(idCard)) return "请输入正确身份证号";
			}
		},
		getUserInfo : function(){
			var name = $.trim(this.nameInp.val());
			var mobile = $.trim(this.mobileInp.val());
			var id_card = $.trim(this.idCardInp.val());
			var notes = this.noteInp.val();
			this.nameInp.blur();
			this.mobileInp.blur();
			this.idCardInp.blur();
			return{
				name : this.validateName(name) ? "error" : name,
				mobile : this.validateMobile(mobile) ? "error" : mobile,
				id_card : this.validateIDCard(id_card) ? "error" : id_card,
				note : notes
			}
		}
	});
	module.exports = UserInfoView;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 15:17
	 * Description: ""
	 */
	var Api = __webpack_require__(5);
	var Loading_Pc = __webpack_require__(38);
	var List = Backbone.View.extend({
		el : $("#cardMsgListUl"),
		loading_str : Loading_Pc("请稍后",{tag:"li",height:100}),
		initialize : function(){
			var urlParam = PFT.Util.UrlParse();
			var pid = this.pid = urlParam["pid"];
			var physics = this.physics = urlParam["physics"];
			if(!pid) return alert("缺少pid");
			this.getList(pid,physics);
			this.$el.html(this.loading_str);
		},
		cacheData : [],
		getList : function(pid,physics){
			var that = this;
			physics = physics || "";
			PFT.Util.Ajax(Api.Url.makeOrder.getCardsForOrder,{
				params : {
					pid : pid,
					physics : physics
				},
				loading : function(){ that.renderList("loading")},
				complete : function(){ that.renderList("complete")},
				success : function(res){
					res = res || {};
					if(res.code==200){
						that.cacheData = res.data;
						var d = res.data[0] || {};
						that.sid = d["sid"] || "";
						that.renderList(res.data);
					}else{
						that._getCardsForOrder_ErrorText = res.msg || "获取卡列表信息出错";
						that.renderList(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		renderList : function(data){
			var html = "";
			if(data=="loading"){
				html = this.loading_str;
			}else if(data=="complete"){
				html = "";
			}else if(Object.prototype.toString.call(data)=="[object Array]"){
				for(var i in data){
					var d = data[i];
					var virtual_no = d["virtual_no"];
					var sid = d["sid"];
					var physics_no = d["physics_no"];
					var card_no = d["card_no"] || "无";
					html += '<li data-sid="'+sid+'" data-virtual="'+virtual_no+'" data-card="'+card_no+'" data-physics="'+physics_no+'" class="border cardItem"><p>虚拟卡号：'+virtual_no+'</p><p>实体卡号：'+card_no+'</p><p>物理ID：'+physics_no+'</p></li>';
				}
				if(!html) html += '<li class="status empty" style="height:100px; line-height:100px; text-align:center">无查卡信息</li>';
			}else{
				html = '<li class="status fail" style="height:100px; line-height:100px; text-align:center">'+data+'</li>';
			}
			this.$el.html(html);
		},
		getSid : function(){
			return this.sid;
		},
		getVirtualCards : function(){
			var data = this.cacheData;
			var result = [];
			for(var i in data){
				var d = data[i];
				var virtual_no = d["virtual_no"];
				result.push(virtual_no);
			}
			return result.join(",");
		},
		getCardsForOrder_ErrorText : function(){
			return this._getCardsForOrder_ErrorText;
		}
	});
	module.exports = List;

/***/ },
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 16:27
	 * Description: ""
	 */
	var Api = __webpack_require__(5);
	var Loading_Pc = __webpack_require__(38);
	var tpl = __webpack_require__(40);
	var OrderIno = Backbone.View.extend({
		initialize : function(){
			this.listUl = $("#orderInfoList");
			this.urlParams = PFT.Util.UrlParse();
			this.pid = this.urlParams["pid"];
			this.aid = this.urlParams["aid"];
			this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
			this.type = this.physics ? "physics" : "virtual";
			if(!this.pid || !this.aid || !this.type) return false;
			this.getInfo(this.pid,this.aid,this.type);
		},
		template : _.template(tpl),
		getInfo : function(pid,aid,type){
			var that = this;
			var listUl = this.listUl;
			PFT.Util.Ajax(Api.Url.makeOrder.getOrderInfo,{
				params : {
					pid : pid,
					aid : aid,
					type : type
				},
				loading : function(){
					listUl.html(that.renderInfo("loading"));
				},
				complete : function(){
					listUl.html("");
				},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					var product = data.product;
					if(res.code==200){
	
						var needID = data.need_ID;
						var idCardInp = $("#userinfo_idCardInp");
						var tip = idCardInp.siblings(".tip");
						idCardInp.attr("data-needid",needID);
						if(needID==1){ //限制身份证必填
							tip.text("必填项");
						}
	
						$("#ltitle_text").text(product.ltitle+"-"+product.title);
						var pay = data.pay;
						if(pay.is_self==1){//自供应
							$("#payLine_no").show().find("input[type=checkbox]").prop("checked","checked");
							$("#payLine_credit").remove();
							$("#payLine_remain").remove();
							$("#payLine_online").remove();
						}
						$("#creditNum").text(pay.credit);
						$("#remainNum").text(pay.remain);
						$("#totalMoney").text(product.price);
						var supplier = data.supplier;
						var supplier_name = supplier.name; //供应商生名
						var supplier_link = supplier.linkman; //联系人
						var intro = supplier.intro; //产品介
						$("#supplierName").text(supplier_name);
						$("#contactsName").html(supplier_link);
						$("#introduceBoxCon").html(intro || "暂无产品介绍");
						listUl.html(that.renderInfo(data));
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		renderInfo : function(data){
			var html = "";
			if(data=="loading"){
				html = Loading_Pc("请稍后...",{
					tag : "tr",
					colspan : 6,
					height : 100
				});
			}else{
				html = this.template({data:data});
			}
			return html;
		}
	});
	module.exports = OrderIno;

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = "<tr>\r\n    <td>\r\n        <p><%=data.product.title%></p>\r\n        <% if(data.privileges.length){ %>\r\n            <p>包含：</p>\r\n            <%_.each(data.privileges,function(item,index){%>\r\n                <%\r\n                    var use_limit = item.use_limit;\r\n                    var limit_str = \"\";\r\n                    if(use_limit==\"-1\"){\r\n                        limit_str = \"不限使用次数\";\r\n                    }else{\r\n                        limit_str = \"限制使用：\";\r\n                        use_limit = use_limit.split(\",\");\r\n                        var daily = use_limit[0];\r\n                        var month = use_limit[1];\r\n                        var total = use_limit[2];\r\n                        if(daily!=\"-1\") limit_str += daily + \"次/日 \";\r\n                        if(month!=\"-1\") limit_str += month + \"次/月 \";\r\n                        if(total!=\"-1\") limit_str += \" 共\"+total+\"次\";\r\n                    }\r\n                %>\r\n                <p class=\"privItem\" data-tid=\"<%=item.tid%>\" data-pid=\"<%=item.pid%>\">\r\n                    <span class=\"title\">\r\n                        <span class=\"ltitle\"><%=item.ltitle%></span>\r\n                        -\r\n                        <span class=\"ttitle\"><%=item.title%></span>\r\n                    </span>\r\n                    <span class=\"limit\"><%=limit_str%></span>\r\n                </p>\r\n            <% }) %>\r\n        <% } %>\r\n    </td>\r\n    <td><%=data.product.storage==\"-1\" ? \"-\" : data.product.storage%></td>\r\n    <td><i class=\"yen\">&yen;</i><em class=\"price\"><%=data.product.price%></em></td>\r\n    <td>不可退</td>\r\n    <td>1</td>\r\n    <td class=\"font-red\"><i class=\"yen\">&yen;</i><em class=\"total_price\"><%=data.product.price%></em></td>\r\n</tr>";

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map