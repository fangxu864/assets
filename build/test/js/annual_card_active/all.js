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
	__webpack_require__(1);
	var Api = __webpack_require__(5);
	var ReadPhysicsCard = __webpack_require__(6);
	var CheckExistDialog = __webpack_require__(7);
	var MainView = Backbone.View.extend({
		time : 60,  //获取验证码的间隔时间 60s
		timer : null,
		cardHasReaded : {},
		el : $("#cardContainer"),
		events : {
			"click #readCardBtn" : "onReadCardBtnClick",
			"click #getVCodeBtn" : "onGetVCodeBtnClick",
			"click #activateBtn" : "onActiveBtnClick",
			"blur .textInp" : "onTextInpBlur",
			"focus .textInp" : "onTextInpFocus"
		},
		initialize : function(){
			var that = this;
			this.cardInp = $("#cardInp");
			this.readCardBtn = $("#readCardBtn");
			this.getVCodeBtn = $("#getVCodeBtn");
			this.idCardInp = $("#idCardInp");
			this.cardInfoBar = $("#cardInfoBar").hide();
			this.mobileInp = $("#mobileInp");
			this.vcodeInp = $("#vcodeInp");
			this.memnameInp = $("#memnameInp");
			this.submitBtn = $("#activateBtn");
			this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
			this.CheckExistDialog = new CheckExistDialog();
			this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
				that.submit("replace");
				this.close();
			})
		},
		//点击读卡
		onReadCardBtnClick : function(e){
			if($(e.currentTarget).hasClass("disable")) return false;
			var cardval = this.ReadPhysicsCard.read();
			this.cardInp.val(cardval);
			if(!cardval) return alert("读卡失败");
			this.cardHasReaded[cardval] = 1;
			this.getCardInfo(cardval,"physics")
		},
		//点击获取验证码
		onGetVCodeBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("unable")) return false;
			var mobile = $.trim(this.mobileInp.val());
			if(!PFT.Util.Validate.typePhone(mobile)) return alert("请填写正确格式手机号");
			this.getVCode(mobile);
		},
		//点击提交激活
		onActiveBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			if(this.cardInfoBar.hasClass("error")) return false;
			if(!this.cardInp.val()){
				this.cardInp.blur();
				return false;
			}
			this.mobileInp.blur();
			if(this.mobileInp.siblings(".tip").hasClass("error")) return false;
			this.vcodeInp.blur();
			if(this.vcodeInp.siblings(".tip").hasClass("error")) return false;
			this.idCardInp.blur();
			if(this.idCardInp.siblings(".tip").hasClass("error")) return false;
			this.submit();
		},
		onTextInpBlur : function(e){
			var that = this;
			var tarInp = $(e.currentTarget);
			var validate = tarInp.attr("validator");
			if(!validate) return false;
			validate = validate.split("|");
			for(var i in validate){
				var valid = validate[i].split(":");
				var rule = valid[0];
				var args = valid[1] ? valid[1].split(",") : [];
				var handler = that.validator[rule];
				if(handler) handler.apply(that,args);
			}
		},
		onTextInpFocus : function(e){
			var that = this;
			var tarInp = $(e.currentTarget);
			var validate = tarInp.attr("validator");
			if(!validate) return false;
			if(tarInp.attr("id")=="cardInp"){
				$("#cardInfoBar").removeClass("error").hide();
			}else{
				tarInp.siblings(".tip").removeClass("error").hide();
			}
		},
		validator : {
			card : function(){
				var tarInp = this.cardInp;
				var val = $.trim(tarInp.val());
				var cardInfoBar = this.cardInfoBar;
				if(!val){
					cardInfoBar.show().addClass("error").html("请输入卡号或直接用读卡器读取卡号");
				}else{
					cardInfoBar.hide().removeClass("error");
					this.getCardInfo(val,"other");
				}
			},
			mobile : function(){
				var mobileInp = this.mobileInp;
				var mobile = $.trim(mobileInp.val());
				var tip = mobileInp.siblings(".tip");
				if(!PFT.Util.Validate.typePhone(mobile)){
					tip.show().addClass("error").text("请填写正确格式手机号");
					return false;
				}else{
					tip.hide().removeClass("error");
					return true;
				}
			},
			vcode : function(){
				var vcodeInp = this.vcodeInp;
				var vcode = $.trim(vcodeInp.val());
				var tip = vcodeInp.siblings(".tip");
				if(!vcode){
					tip.show().addClass("error").text("请填写验证码");
					return false;
				}else{
					tip.hide().removeClass("error");
					return true;
				}
			},
			idCard : function(need){
				var idCardInp = this.idCardInp;
				var idCard = $.trim(idCardInp.val());
				var tip = idCardInp.siblings(".tip");
				if((idCard && !PFT.Util.Validate.idCard(idCard)) || ((need==1) && !idCard)){
					tip.show().addClass("error").text("请填写正确格式身份证");
					return false;
				}else{
					tip.removeClass("error").hide();
					return true;
				}
			}
		},
		getCardInfo : function(card_no,type){
			var that = this;
			var tarBtn = this.readCardBtn;
			if(!card_no || !type) return false;
			PFT.Util.Ajax(Api.Url.active.checkCard,{
				params : {
					identify : card_no,
					type : type
				},
				loading : function(){
					tarBtn.addClass("disable");
					$("#loadingIcon").show();
				},
				complete : function(){
					tarBtn.removeClass("disable");
					$("#loadingIcon").hide();
				},
				success : function(res){
					res = res || {};
					var data= res.data;
					if(res.code==200){
						var idCardInp = that.idCardInp;
						var needID = data.need_ID || "";
						var virtual_no = data.virtual_no;
						var physics_no = data.physics_no;
						idCardInp.attr("validate","idCard:"+needID);
						if(needID==1){
							$("#idCard-fontRed").show();
						}else{
							$("#idCard-fontRed").hide();
						}
						that.cardInfoBar.show().removeClass("error").html("虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
					}else{
						that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
					}
				}
			})
		},
		getVCode : function(mobile){
			var that = this;
			var getVCodeBtn = this.getVCodeBtn;
			PFT.Util.Ajax(Api.Url.active.getVCode,{
				params : {
					mobile : mobile
				},
				loading : function(){
					getVCodeBtn.addClass("unable").text("请稍后..");
				},
				success : function(res){
					res = res || {};
					if(res.code==200){
						var last = that.time-1;
						that.timer = setInterval(function(){
							last = last-1;
							if(last<=0){
								getVCodeBtn.text("获取验证码").removeClass("unable");
								clearInterval(that.timer);
							}else{
								getVCodeBtn.text(last+"秒后可重新获取");
							}
						},1000)
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		submit : function(replace){
			var that = this;
			var submitBtn = this.submitBtn;
			var cardVal = this.cardInp.val();
			var type = this.cardHasReaded[cardVal] ? "physics" : "other";
			var mobile = this.mobileInp.val();
			var name = this.memnameInp.val();
			var id_card = this.idCardInp.val();
			var vcode = this.vcodeInp.val();
			var data = {
				identify : cardVal,
				type : type,
				mobile : mobile,
				name : name,
				id_card : id_card,
				vcode : vcode
			};
			if(replace=="replace") data["replace"] = 1;
			PFT.Util.Ajax(Api.Url.active.activateForPc,{
				type : "post",
				params : data,
				loading : function(){
					submitBtn.addClass("disable");
				},
				complete : function(){
					submitBtn.removeClass("disable");
				},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						if(data.exist==1){
							that.CheckExistDialog.open(data);
						}else{
							PFT.Util.STip("success",'<div style="width:200px">激活成功</div>')
						}
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT)
					}
				}
			})
		}
	});
	
	$(function(){
		new MainView();
	})


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
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
/* 6 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/24 17:28
	 * Description: ""
	 */
	function readPhysicsCard(opt){
		opt = opt || {};
		this.id = opt.id;
		if(!this.id) throw Error("缺少id");
		this.readObj = document.getElementById(this.id);
		//<object classid="clsid:b1ee5c7f-5cd3-4cb8-b390-f9355defe39a" width="0" height="0" id="readCardObj"></object>
	}
	readPhysicsCard.prototype = {
		read : function(){
			var readCardObj = this.readObj;
			if(!readCardObj){
				alert("请使用IE浏览器读物理卡号");
				return "";
			}
			if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
				alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
				return "";
			}
			readCardObj.open();
			var val = readCardObj.ICReaderRequest();
			return val || "";
		}
	};
	module.exports = readPhysicsCard;

/***/ },
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
			width : 520,
			height : 280,
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
			this.submitData = opt.submitData;
			this.SDialog.open({
				onBefore : function(){
					$("#existDialog_mobile").text(mobile);
					$("#existDialog_idCard").text(idCard);
					$("#existDialog_name").text(name+"（"+left+"）");
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

	module.exports = "<div class=\"memberBox\" id=\"memberBox\">\r\n    <p class=\"memP\">会员已存在！是否替换原有卡和套餐？</p>\r\n    <table class=\"memTable border\">\r\n        <thead>\r\n        <tr class=\"font-gray\">\r\n            <th>手机号</th>\r\n            <th>身份证</th>\r\n            <th>卡套餐（已用特权数）</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr>\r\n            <td id=\"existDialog_mobile\"></td>\r\n            <td id=\"existDialog_idCard\"></td>\r\n            <td id=\"existDialog_name\"></td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    <div class=\"btnBox\">\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-blue\" id=\"replaceBtn\">替换并提交订单</a>\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-border\" id=\"messageBtn\">更换信息</a>\r\n    </div>\r\n</div>";

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map