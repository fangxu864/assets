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
	 * Author: huangzhiyang
	 * Date: 2016/7/11 11:01
	 * Description: ""
	 */
	var Dialog = __webpack_require__(1);
	var BankManager = function(){
		this.bankListUl = $("#bankListUl");
		this.addBankBtn = $("#addbk");
		this.Dialog = new Dialog();
		this.bindEvents();
	}
	BankManager.prototype = {
		bindEvents : function(){
			var that = this;
			var Dialog = this.Dialog;
			this.addBankBtn.on("click",function(e){
				Dialog.open();
			})
		}
	};
	
	$(function(){
		new BankManager();
	})

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/7/11 11:48
	 * Description: ""
	 */
	__webpack_require__(12);
	var Dialog = __webpack_require__(2);
	var dialog_content = __webpack_require__(11);
	var Main = function(){
		this.dialog = new Dialog({
			width : 680,
			height : 350,
			content : dialog_content,
			drag : true,
			events : {
				
			}
		})
	};
	Main.prototype = {
		open : function(opt){
			this.dialog.open(opt);
		}
	};
	module.exports = Main;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/21 10:04
	 * Description: ""
	 */
	__webpack_require__(3);
	var WinWidthHeight = __webpack_require__(7);
	var Drag = __webpack_require__(8);
	var PubSub = __webpack_require__(9);
	var Extend = __webpack_require__(10);
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
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div id=\"bankDialogCxtContainer\" class=\"bankDialogCxtContainer\">\n    <form id=\"bankForm\">\n        <div class=\"bankTitle\">添加配置银行卡</div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>银行:</label>\n            </div>\n            <div class=\"lineright\">\n                <select id=\"bankName\" class=\"bankName selectInp\"></select>\n                <span class=\"tip\">请填写开户行</span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>开户支行:</label>\n            </div>\n            <div class=\"lineright\">\n                <select id=\"subBranchName\" class=\"subBranchName selectInp\"></select>\n                <span class=\"tip\">请填写开户支行</span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>选择地区:</label>\n            </div>\n            <div class=\"lineright\">\n                <selcet id=\"selectPro\" class=\"selectPro selectInp\"></selcet>\n                <selcet id=\"selectCity\" class=\"selectCity selectInp\"></selcet>\n                <span class=\"tip\"></span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>现代化支付系统行号:</label>\n            </div>\n            <div class=\"lineright\">\n                <input id=\"subBranchName\" class=\"subBranchName textInp\"/>\n                <span class=\"tip\"><a href=\"\">现代化支付系统行号</a>无法打开请更换浏览器</span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>银行卡/存折号:</label>\n            </div>\n            <div class=\"lineright\">\n                <input id=\"bankCard\" class=\"bankCard textInp\"/>\n                <span class=\"tip\">请准确填写银行卡号</span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>开户姓名:</label>\n            </div>\n            <div class=\"lineright\">\n                <input id=\"bankCard\" class=\"bankCard textInp\"/>\n                <span class=\"tip\">请准确填写开户姓名用以核对</span>\n            </div>\n        </div>\n        <div class=\"line\">\n            <div class=\"lineLeft\">\n                <label for=\"\"><span class=\"warningTip\">*</span>银行卡类别</label>\n            </div>\n            <div class=\"lineright\">\n                <select id=\"bankCard\" class=\"bankCard selectInp\">\n                    <option value=\"\">存折</option>\n                    <option value=\"\">贷记卡(信用卡)</option>\n                    <option value=\"\">公司账号</option>\n                </select>\n                <span class=\"tip\">请准确填写开户姓名用以核对</span>\n            </div>\n        </div>\n    </form>\n</div>";

/***/ },
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=withdraw_bank.all.js.map