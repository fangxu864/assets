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
	 * Created by Administrator on 16-4-12.
	 */
	__webpack_require__(8);
	var Placeholder = __webpack_require__(10);
	var SlideManager = __webpack_require__(11);
	var VRegister = __webpack_require__(12);
	var VInfo = __webpack_require__(15);
	var Router = Backbone.Router.extend({
		routes : {
			"" : "main",
			"step/:id" : "step"
		},
		initialize : function(){
			var that = this;
			this.slideManager = new SlideManager();
			this.VRegister = new VRegister({router:this});
			this.VInfo = new VInfo({router:this});
			this.slideManager.on("slide.before",function(id){
	
			})
			this.slideManager.on("slide.after",function(id){
	
			})
			Placeholder.init();
		},
		main : function(){
			this.slideManager.slide(1);
		},
		step : function(id){
			this.slideManager.slide(id);
		}
	});
	var router = new Router;
	Backbone.history.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-18.
	 */
	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** 
	 * easyDialog v2.2
	 * Url : http://stylechen.com/easydialog-v2.0.html
	 * Author : chenmnkken@gmail.com
	 * Date : 2012-04-22
	 */
	__webpack_require__(3);
	(function( win, undefined ){
	
	var	doc = win.document,
		docElem = doc.documentElement;
	
	var easyDialog = function(){
	
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
	
	var	Dialog = function(){};
	
	Dialog.prototype = {
		// 参数设置
		getOptions : function( arg ){
			var i,
				options = {},
				// 默认参数
				defaults = {
					container:   null,			// string / object   弹处层内容的id或内容模板
					overlay:     true,			// boolean  		 是否添加遮罩层
					drag:	     true,			// boolean  		 是否绑定拖拽事件
					fixed: 	     true,			// boolean  		 是否静止定位
					follow:      null,			// string / object   是否跟随自定义元素来定位
					followX:     0,				// number   		 相对于自定义元素的X坐标的偏移
					followY:     0,				// number  		     相对于自定义元素的Y坐标的偏移
					autoClose:   0,				// number            自动关闭弹出层的时间
					offsetX :    0,
					offsetY :    0,
					lock:        false,			// boolean           是否允许ESC键来关闭弹出层
					events :     null,
					callback:    null			// function          关闭弹出层后执行的回调函数
					/** 
					 *  container为object时的参数格式
					 *	container : {
					 *		header : '弹出层标题',
					 *		content : '弹出层内容',
					 *		yesFn : function(){},	    // 确定按钮的回调函数
					 *		noFn : function(){} / true,	// 取消按钮的回调函数
					 *		yesText : '确定',		    // 确定按钮的文本，默认为‘确定’
					 *		noText : '取消' 		    // 取消按钮的文本，默认为‘取消’		
					 *	}		
					 */
				};
			
			for( i in defaults ){
				options[i] = arg[i] !== undefined ? arg[i] : defaults[i];
			}
			Dialog.data( 'options', options );
			return options;
		},
			
		// 防止IE6模拟fixed时出现抖动
		setBodyBg : function(){
			if( body.currentStyle.backgroundAttachment !== 'fixed' ){
				body.style.backgroundImage = 'url(about:blank)';
				body.style.backgroundAttachment = 'fixed';
			}
		},
		
		// 防止IE6的select穿透
		appendIframe : function(elem){
			elem.innerHTML = '<iframe style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;border:0 none;filter:alpha(opacity=0)"></iframe>';
		},
		
		/**
		 * 设置元素跟随定位
		 * @param { Object } 跟随的DOM元素
		 * @param { String / Object } 被跟随的DOM元素
		 * @param { Number } 相对于被跟随元素的X轴的偏移
		 * @param { Number } 相对于被跟随元素的Y轴的偏移
		 */
		setFollow : function( elem, follow, x, y ){
			follow = typeof follow === 'string' ? doc.getElementById( follow ) : follow;
			var style = elem.style;
			style.position = 'absolute';			
			style.left = Dialog.getOffset( follow, 'left') + x + 'px';
			style.top = Dialog.getOffset( follow, 'top' ) + y + 'px';
		},
		
		/**
		 * 设置元素固定(fixed) / 绝对(absolute)定位
		 * @param { Object } DOM元素
		 * @param { Boolean } true : fixed, fasle : absolute
		 */
		setPosition : function( elem, fixed ){
			var style = elem.style;
			style.position = isIE6 ? 'absolute' : fixed ? 'fixed' : 'absolute';
			if( fixed ){
				if( isIE6 ){
					style.setExpression( 'top','fuckIE6=document.documentElement.scrollTop+document.documentElement.clientHeight/2+"px"' );
				}
				else{
					style.top = '50%';
				}
				style.left = '50%';
			}
			else{
				if( isIE6 ){
					style.removeExpression( 'top' );
				}
				style.top = docElem.clientHeight/2 + Dialog.getScroll( 'top' ) + 'px';
				style.left = docElem.clientWidth/2 + Dialog.getScroll( 'left' ) + 'px';
			}
		},
		
		/**
		 * 创建遮罩层
		 * @return { Object } 遮罩层 
		 */
		createOverlay : function(){
			var overlay = doc.createElement('div'),
				style = overlay.style;
				
			style.cssText = 'margin:0;padding:0;border:none;width:100%;height:100%;background:#333;opacity:0.6;filter:alpha(opacity=60);z-index:9999;position:fixed;top:0;left:0;';
			
			// IE6模拟fixed
			if(isIE6){
				body.style.height = '100%';
				style.position = 'absolute';
				style.setExpression('top','fuckIE6=document.documentElement.scrollTop+"px"');
			}
			
			overlay.id = 'overlay';
			return overlay;
		},
		
		/**
		 * 创建弹出层
		 * @return { Object } 弹出层 
		 */
		createDialogBox : function(){
			var dialogBox = doc.createElement('div');		
			dialogBox.style.cssText = 'margin:0;padding:0;border:none;z-index:10000;';
			dialogBox.id = 'easyDialogBox';		
			return dialogBox;
		},
	
		/**
		 * 创建默认的弹出层内容模板
		 * @param { Object } 模板参数
		 * @return { Object } 弹出层内容模板
		 */
		createDialogWrap : function( tmpl ){
			// 弹出层标题
			var header = tmpl.header ? 
				'<h4 class="easyDialog_title" id="easyDialogTitle"><a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="closeBtn">&times;</a>' + tmpl.header + '</h4>' :
				'',
				// 确定按钮
				yesBtn = typeof tmpl.yesFn === 'function' ? 
					'<button class="btn_highlight" id="easyDialogYesBtn">' + ( typeof tmpl.yesText === 'string' ? tmpl.yesText : '确定' ) + '</button>' :
					'',
				// 取消按钮	
				noBtn = typeof tmpl.noFn === 'function' || tmpl.noFn === true ? 
					'<button class="btn_normal" id="easyDialogNoBtn">' + ( typeof tmpl.noText === 'string' ? tmpl.noText : '取消' ) + '</button>' :
					'',			
				// footer
				footer = yesBtn === '' && noBtn === '' ? '' :
					'<div class="easyDialog_footer">' + noBtn + yesBtn + '</div>',
				
				dialogTmpl = [
				'<div class="easyDialog_content">',
					header,
					'<div class="easyDialog_text">' + tmpl.content + '</div>',
					footer,
				'</div>'
				].join(''),
	
				dialogWrap = doc.getElementById( 'easyDialogWrapper' ),
				rScript = /<[\/]*script[\s\S]*?>/ig;
				
			if( !dialogWrap ){
				dialogWrap = doc.createElement( 'div' );
				dialogWrap.id = 'easyDialogWrapper';
				dialogWrap.className = 'easyDialog_wrapper';
			}
			dialogWrap.innerHTML = dialogTmpl.replace( rScript, '' );		
			return dialogWrap;
		}		
	};
		
	/**
	 * 设置并返回缓存的数据 关于缓存系统详见：http://stylechen.com/cachedata.html
	 * @param { String / Object } 任意字符串或DOM元素
	 * @param { String } 缓存属性名
	 * @param { Anything } 缓存属性值
	 * @return { Object } 
	 */
	Dialog.data = function( elem, val, data ){
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
	Dialog.removeData = function( elem, val ){
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
	Dialog.event = {
		
		bind : function( elem, type, handler ){
			var events = Dialog.data( elem, 'e' + type ) || Dialog.data( elem, 'e' + type, [] );
			// 将事件函数添加到缓存中
			events.push( handler );
			// 同一事件类型只注册一次事件，防止重复注册
			if( events.length === 1 ){
				var eventHandler = this.eventHandler( elem );
				Dialog.data( elem, type + 'Handler', eventHandler );
				if( elem.addEventListener ){
					elem.addEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.attachEvent( 'on' + type, eventHandler );
				}
			}
		},
			
		unbind : function( elem, type, handler ){
			var events = Dialog.data( elem, 'e' + type );
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
				var eventHandler = Dialog.data( elem, type + 'Handler' );			
				if( elem.addEventListener ){
					elem.removeEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.detachEvent( 'on' + type, eventHandler );
				}		
				Dialog.removeData( elem, type + 'Handler' );
				Dialog.removeData( elem, 'e' + type );
			}
		},
			
		// 依次执行事件绑定的函数
		eventHandler : function( elem ){
			return function( event ){
				event = Dialog.event.fixEvent( event || win.event );
				var type = event.type,
					events = Dialog.data( elem, 'e' + type );
					
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
	
	/**
	 * 首字母大写转换
	 * @param { String } 要转换的字符串
	 * @return { String } 转换后的字符串 top => Top
	 */
	Dialog.capitalize = function( str ){
		var firstStr = str.charAt(0);
		return firstStr.toUpperCase() + str.replace( firstStr, '' );
	};
	
	/**
	 * 获取滚动条的位置
	 * @param { String } 'top' & 'left'
	 * @return { Number } 
	 */	
	Dialog.getScroll = function( type ){
		var upType = this.capitalize( type );		
		return docElem['scroll' + upType] || body['scroll' + upType];	
	};
	
	/**
	 * 获取元素在页面中的位置
	 * @param { Object } DOM元素
	 * @param { String } 'top' & 'left'
	 * @return { Number } 
	 */		
	Dialog.getOffset = function( elem, type ){
		var upType = this.capitalize( type ),
			client  = docElem['client' + upType]  || body['client' + upType]  || 0,
			scroll  = this.getScroll( type ),
			box = elem.getBoundingClientRect();
			
		return Math.round( box[type] ) + scroll - client;
	};
	
	/**
	 * 拖拽效果
	 * @param { Object } 触发拖拽的DOM元素
	 * @param { Object } 要进行拖拽的DOM元素
	 */
	Dialog.drag = function( target, moveElem ){
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
			event = self.event,
			isDown = false,
			newElem = isIE ? target : doc,
			fixed = moveElem.style.position === 'fixed',
			_fixed = Dialog.data( 'options' ).fixed;
		
		// mousedown
		var down = function( e ){
			isDown = true;
			var scrollTop = self.getScroll( 'top' ),
				scrollLeft = self.getScroll( 'left' ),
				edgeLeft = fixed ? 0 : scrollLeft,
				edgeTop = fixed ? 0 : scrollTop;
			
			Dialog.data( 'dragData', {
				x : e.clientX - self.getOffset( moveElem, 'left' ) + ( fixed ? scrollLeft : 0 ),	
				y : e.clientY - self.getOffset( moveElem, 'top' ) + ( fixed ? scrollTop : 0 ),			
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
			var dragData = Dialog.data( 'dragData' ),
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
				event.unbind( target, 'losecapture', arguments.callee );
			}
			event.unbind( newElem, 'mousemove', move );
			event.unbind( newElem, 'mouseup', arguments.callee );		
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
	
	var	timer,	// 定时器
		// ESC键关闭弹出层
		escClose = function( e ){
			if( e.keyCode === 27 ){
				extend.close();
			}
		},	
		// 清除定时器
		clearTimer = function(){
			if( timer ){
				clearTimeout( timer );
				timer = undefined;
			}
		};
		
	var extend = {
		open : function(){
			var $ = new Dialog(),
				options = $.getOptions( arguments[0] || {} ),	// 获取参数
				event = Dialog.event,
				docWidth = docElem.clientWidth,
				docHeight = docElem.clientHeight,
				self = this,
				overlay,
				dialogBox,
				dialogWrap,
				boxChild;
	
			clearTimer();
			
			// ------------------------------------------------------
			// ---------------------插入遮罩层-----------------------
			// ------------------------------------------------------
			
			// 如果页面中已经缓存遮罩层，直接显示
			if( options.overlay ){
				overlay = doc.getElementById( 'overlay' );			
				if( !overlay ){
					overlay = $.createOverlay();
					body.appendChild( overlay );
					if( isIE6 ){
						$.appendIframe( overlay );
					}
				}
				overlay.style.display = 'block';
			}
			
			if(isIE6){
				$.setBodyBg();
			}
			
			// ------------------------------------------------------
			// ---------------------插入弹出层-----------------------
			// ------------------------------------------------------
			
			// 如果页面中已经缓存弹出层，直接显示
			dialogBox = doc.getElementById( 'easyDialogBox' );
			if( !dialogBox ){
				dialogBox = $.createDialogBox();
				body.appendChild( dialogBox );
			}
			
			if( options.follow ){
				var follow = function(){
					$.setFollow( dialogBox, options.follow, options.followX, options.followY );
				};
				
				follow();
				event.bind( win, 'resize', follow );
				Dialog.data( 'follow', follow );
				if( overlay ){
					overlay.style.display = 'none';
				}
				options.fixed = false;
			}
			else{
				$.setPosition( dialogBox, options.fixed );
			}
			dialogBox.style.display = 'block';
					
			// ------------------------------------------------------
			// -------------------插入弹出层内容---------------------
			// ------------------------------------------------------
			
			// 判断弹出层内容是否已经缓存过
			dialogWrap = typeof options.container === 'string' ? 
				doc.getElementById( options.container ) : 
				$.createDialogWrap( options.container );
			
			boxChild = dialogBox.getElementsByTagName('*')[0];
			
			if( !boxChild ){
				dialogBox.appendChild( dialogWrap );
			}
			else if( boxChild && dialogWrap !== boxChild ){
				boxChild.style.display = 'none';
				body.appendChild( boxChild );
				dialogBox.appendChild( dialogWrap );
			}
			
			dialogWrap.style.display = 'block';
			
			var eWidth = dialogWrap.offsetWidth,
				eHeight = dialogWrap.offsetHeight,
				widthOverflow = eWidth > docWidth,
				heigthOverflow = eHeight > docHeight;
				
			// 强制去掉自定义弹出层内容的margin	
			dialogWrap.style.marginTop = dialogWrap.style.marginRight = dialogWrap.style.marginBottom = dialogWrap.style.marginLeft = '0px';	
			
			// 居中定位
			if( !options.follow ){
				var offsetX = options.offsetX;
				var offsetY = options.offsetY;
				dialogBox.style.marginLeft = '-' + (widthOverflow ? (docWidth/2-offsetX) : (eWidth/2-offsetX)) + 'px';
				dialogBox.style.marginTop = '-' + (heigthOverflow ? (docHeight/2-offsetY) : (eHeight/2-offsetY)) + 'px';
			}
			else{
				dialogBox.style.marginLeft = dialogBox.style.marginTop = '0px';
			}
					
			// 防止select穿透固定宽度和高度
			if( isIE6 && !options.overlay ){
				dialogBox.style.width = eWidth + 'px';
				dialogBox.style.height = eHeight + 'px';
			}
			
			// ------------------------------------------------------
			// --------------------绑定相关事件----------------------
			// ------------------------------------------------------
			var closeBtn = doc.getElementById( 'closeBtn' ),
				dialogTitle = doc.getElementById( 'easyDialogTitle' ),
				dialogYesBtn = doc.getElementById('easyDialogYesBtn'),
				dialogNoBtn = doc.getElementById('easyDialogNoBtn');		
	
			// 绑定确定按钮的回调函数
			if( dialogYesBtn ){
				event.bind( dialogYesBtn, 'click', function( event ){
					if( options.container.yesFn.call(self, event) !== false ){
						self.close();
					}
				});
			}
			
			// 绑定取消按钮的回调函数
			if( dialogNoBtn ){
				var noCallback = function( event ){
					if( options.container.noFn === true || options.container.noFn.call(self, event) !== false ){
						self.close();
					}
				};
				event.bind( dialogNoBtn, 'click', noCallback );
				// 如果取消按钮有回调函数 关闭按钮也绑定同样的回调函数
				if( closeBtn ){
					event.bind( closeBtn, 'click', noCallback );
				}
			}			
			// 关闭按钮绑定事件	
			else if( closeBtn ){
				event.bind( closeBtn, 'click', self.close );
			}
			
			// ESC键关闭弹出层
			if( !options.lock ){
				event.bind( doc, 'keyup', escClose );
			}
			// 自动关闭弹出层
			if( options.autoClose && typeof options.autoClose === 'number' ){
				timer = setTimeout( self.close, options.autoClose );
			}		
			// 绑定拖拽(如果弹出层内容的宽度或高度溢出将不绑定拖拽)
			if( options.drag && dialogTitle && !widthOverflow && !heigthOverflow ){
				dialogTitle.style.cursor = 'move';
				Dialog.drag( dialogTitle, dialogBox );
			}
			
			// 确保弹出层绝对定位时放大缩小窗口也可以垂直居中显示
			
			if( !options.follow && !options.fixed ){
				var resize = function(){
					$.setPosition( dialogBox, false );
				};
				// 如果弹出层内容的宽度或高度溢出将不绑定resize事件
				if( !widthOverflow && !heigthOverflow ){
					event.bind( win, 'resize', resize );
				}
				Dialog.data( 'resize', resize );
			}
			var events = options.events;
			// 缓存相关元素以便关闭弹出层的时候进行操作
			Dialog.data( 'dialogElements', {
				overlay : overlay,
				dialogBox : dialogBox,
				closeBtn : closeBtn,
				dialogTitle : dialogTitle,
				dialogYesBtn : dialogYesBtn,
				dialogNoBtn : dialogNoBtn,
				events : events
			});
			if(!events) return false;
			var $dialogBox = win.jQuery(dialogBox);
			for(var event in events){
				var ename = event.split(" ")[0];
				var selector = event.substring(event.indexOf(" "));
				var handler = events[event];
				$dialogBox.on(ename,selector,handler);
			}
			Dialog.data("$dialogBox", $dialogBox );
		},
		
		close : function(){
			var options = Dialog.data( 'options' ),
				elements = Dialog.data( 'dialogElements' ),
				event = Dialog.event;
			clearTimer();
			//	隐藏遮罩层
			if( options.overlay && elements.overlay ){
				elements.overlay.style.display = 'none';
			}
			// 隐藏弹出层
			elements.dialogBox.style.display = 'none';
			// IE6清除CSS表达式
			if( isIE6 ){
				elements.dialogBox.style.removeExpression( 'top' );
			}
			
			// ------------------------------------------------------
			// --------------------删除相关事件----------------------
			// ------------------------------------------------------
			if( elements.closeBtn ){
				event.unbind( elements.closeBtn, 'click' );
			}
	
			if( elements.dialogTitle ){
				event.unbind( elements.dialogTitle, 'mousedown' );
			}
			
			if( elements.dialogYesBtn ){
				event.unbind( elements.dialogYesBtn, 'click' );
			}
			
			if( elements.dialogNoBtn ){
				event.unbind( elements.dialogNoBtn, 'click' );
			}
			
			if( !options.follow && !options.fixed ){
				event.unbind( win, 'resize', Dialog.data('resize') );
				Dialog.removeData( 'resize' );
			}
			
			if( options.follow ){
				event.unbind( win, 'resize', Dialog.data('follow') );
				Dialog.removeData( 'follow' );
			}
			
			if( !options.lock ){
				event.unbind( doc, 'keyup', escClose );
			}
			// 执行callback
			if(typeof options.callback === 'function'){
				options.callback.call( extend );
			}
			if(cacheData["$dialogBox"]){
				Dialog.data("$dialogBox").off();
			}
			// 清除缓存
			Dialog.removeData( 'options' );
			Dialog.removeData( 'dialogElements' );
	
		}
	};
	
	return extend;
	
	};
	
	// ------------------------------------------------------
	// ---------------------DOM加载模块----------------------
	// ------------------------------------------------------
	var loaded = function(){
			win.easyDialog = easyDialog();
		},
		
		doScrollCheck = function(){
			if ( doc.body ) return;
	
			try {
				docElem.doScroll("left");
			} catch(e) {
				setTimeout( doScrollCheck, 1 );
				return;
			}
			loaded();
		};
	
	(function(){
		if( doc.body ){
			loaded();
		}
		else{
			if( doc.addEventListener ){
				doc.addEventListener( 'DOMContentLoaded', function(){
					doc.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
					loaded();
				}, false );
				win.addEventListener( 'load', loaded, false );
			}
			else if( doc.attachEvent ){
				doc.attachEvent( 'onreadystatechange', function(){
					if( doc.readyState === 'complete' ){
						doc.detachEvent( 'onreadystatechange', arguments.callee );
						loaded();
					}
				});
				win.attachEvent( 'onload', loaded );			
				var toplevel = false;
				try {
					toplevel = win.frameElement == null;
				} catch(e) {}
	
				if ( docElem.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		}
	})();
	
	})( window, undefined );
	module.exports = easyDialog;
	
	// 2012-04-12 修复跟随定位缩放浏览器时无法继续跟随的BUG
	// 2012-04-22 修复弹出层内容的尺寸大于浏览器当前屏尺寸的BUG

/***/ },
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-14.
	 */
	module.exports = {
		init : function(){
			if("placeholder" in document.createElement("input")) return false;
			$("input").each(function(){
				var tarInp = $(this);
				var placeholder = tarInp.prop("placeholder");
				var val = $.trim(tarInp.val());
				if(placeholder && !val) tarInp.val(placeholder);
			})
			$(document).on("focus","input",function(e){
				var tarInp = $(e.currentTarget);
				var val = $.trim(tarInp.val());
				var placeholder = tarInp.prop("placeholder");
				if(placeholder && val==placeholder) tarInp.val("");
			}).on("blur","input",function(e){
				var tarInp = $(e.currentTarget);
				var val = $.trim(tarInp.val());
				var placeholder = tarInp.prop("placeholder");
				if(placeholder && !val) tarInp.val(placeholder);
			})
		}
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-12.
	 */
	var SlideManager = Backbone.View.extend({
		el : $("#slideContainer"),
		initialize : function(){
			this.stepWidth = this.$el.children().first().width();
		},
		slide : function(id){
			var that = this;
			var dir = -1;
			this.$el.children(".step_"+id).addClass("active").siblings().removeClass("active");
			var id = id-1;
			this.trigger("slide.before",id);
			this.$el.animate({left:dir*id*this.stepWidth},200,function(){
				that.trigger("slide.after",id+1);
			});
		}
	});
	module.exports = SlideManager;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	var Ajax = __webpack_require__(13);
	var Validate = __webpack_require__(14);
	var Dialog = __webpack_require__(1);
	var VRegister = Backbone.View.extend({
		api : {
			getVCode : "call/jh_mem.php",
			register : "call/jh_mem.php"
		},
		el : $("#regForm"),
		RESEND_VCODE_TIME : 60,
		timer : null,
		events : {
			"click #tiaokuanCheckbox" : "onTiaoKuanCheckBoxClick",
			"click #getValidCodeBtn" : "onGetValidCodeBtnClick",
			"click #regSubmitBtn" : "onRegSubmitBtnClick",
			"mousedown #showPwdBtn" : "onShowPwdBtnMousedown",
			"mouseup #showPwdBtn" : "onShowPwdBtnMouseup",
			"blur .textInp" : "onTextInpBlur",
			"blur #pwdInp" : "onPwdInpBlur",
			"input #pwdInp" : "onPwdInpChange",
			"focus .textInp" : "onTextInpFocus"
		},
		initialize : function(opt){
			this.router = opt.router;
			this.registerBtn = $("#regSubmitBtn");
			this.mobileInp = $("#mobileInp");
			this.pwdInp = $("#pwdInp");
			this.pwdInpParent = this.pwdInp.parents(".rt");
			this.pwdInpErrorTip = this.pwdInpParent.find(".error");
			this.pwdLevelBar = this.pwdInpParent.find(".levelBar");
			this.getVCodeBtn = $("#getValidCodeBtn");
			this.regForm = $("#regForm");
	
			//当注册时，使用已使用过的手机号时
			this.on("reg.mobild.exist",function(){
				Dialog.open({
					container : {
						header : '注册失败',
						content : [
							'<div style="width:300px;" class="dialogCon" style="margin-left:20px">',
							'<div class="line" style="margin-bottom:10px;">您的手机已被关联到已有的平台帐号</div>',
							'<div class="line" style="margin-bottom:5px;"><a class="dbtn login" style="margin-right:10px" href="dlogin_n.html">点击登录</a>使用此手机号登录</div>',
							'<div class="line" style="margin-bottom:5px;"><a class="dbtn reReg reRegBtn" style="margin-right:10px" href="javascript:void(0)">返回注册</a>更换其它手机号码</div>',
							'</div>'
						].join("")
					},
					offsetY : -100,
					events : {
						"click .reRegBtn" : function(e){
							Dialog.close();
						}
					}
				});
			})
			//成功获取验证码后
			this.on("get.vcode.success",function(res){
				var that = this;
				var getBtn = this.getVCodeBtn;
				var last_time = this.RESEND_VCODE_TIME;
				PFT.Help.AlertTo("success",'<p style="width:400px">验证码已发送到手机'+this.mobileInp.val()+'上，'+last_time+'秒后可重新获取</p>',2000);
				clearInterval(this.timer);
				getBtn.text(last_time+"秒后重新获取")
				this.timer = setInterval(function(){
					if(last_time==0){
						getBtn.removeClass("disable").text("获取验证码");
						return clearInterval(that.timer);
					}
					last_time--;
					getBtn.addClass("disable");
					getBtn.text(last_time+"秒后重新获取")
				},1000)
			})
		},
		//验证密码(合法性及安全度)
		//6-20数字、字母和常用符号两种以上组合
		validatePwd : function(pwd){
			var pwdParent = this.pwdInpParent;
			var pwdError = this.pwdInpErrorTip;
			var pwdLevelBar = this.pwdLevelBar;
			var onError = function(error){
				var error = error || "错误";
				pwdParent.addClass("error");
				pwdError.text(error);
				pwdLevelBar.removeClass("weak").removeClass("normal").removeClass("strong");
			};
			var onOk = function(level){
				pwdParent.removeClass("error");
				pwdLevelBar.removeClass("weak").removeClass("normal").removeClass("strong").addClass(level);
			};
			if(!pwd) return onError("*必填");
			var result = Validate.validatePwd(pwd);
			if(result.error) return onError(result.error);
			onOk(result.level);
		},
		onPwdInpBlur : function(e){
			var val = $(e.currentTarget).val();
			this.validatePwd(val);
		},
		onPwdInpChange : function(e){
			this.onPwdInpBlur(e);
		},
		onTextInpBlur : function(e){
			var tarInp = $(e.currentTarget);
			this.validateInput(tarInp);
		},
		onTextInpFocus : function(e){
			var tarInp = $(e.currentTarget);
			var parent = tarInp.parents(".rt");
			parent.removeClass("ok").removeClass("error");
		},
		onGetValidCodeBtnClick : function(e){
			var that = this;
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var mobile = $.trim(this.mobileInp.val());
			if(!mobile) return alert("请先填写手机号");
			if(!this.mobileInp.parents(".rt").hasClass("ok")) return alert("请填写正确格式手机号");
			Ajax(that.api.getVCode,{
				type : "post",
				dataType : "json",
				params : {
					action : "SendVcode",
					stype : "register",
					mobile : mobile,
					emial : false
				},
				loading : function(){ tarBtn.addClass("disable").text("正在获取...")},
				complete : function(){ tarBtn.removeClass("disable").text("获取验证码")},
				success : function(res){
					var res = res || {};
					var status = res.status;
					var msg = res.msg || "请求出错，请稍后重试";
					if(status=="success"){
						that.trigger("get.vcode.success",res);
					}else{
						alert(msg);
					}
				}
			})
		},
		onShowPwdBtnMousedown : function(e){
			this.pwdInp.prop("type","text");
		},
		onShowPwdBtnMouseup : function(e){
			this.pwdInp.prop("type","password");
		},
		//点击注册提交按钮
		onRegSubmitBtnClick : function(e){
			return this.router.navigate("step/2",{trigger:true});
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var can_submit = true;
			$("input[data-validate]").each(function(){
				var tarInp = $(this);
				tarInp.trigger("blur");
				if(tarInp.parents(".rt").hasClass("error")){
					can_submit = false;
					return false;
				}
			})
			if(!can_submit) return false;
			this.submit_register();
		},
		//提交注册
		submit_register : function(){
			var params = this.regForm.serialize();
			Ajax(this.api.register,{
				type : "post",
				dataType : "json",
				params : params,
				loading : function(){},
				complete : function(){},
				success : function(res){}
			})
		},
		validateInput : function(tarInp){
			var rules = tarInp.data("validate");
			var val = $.trim(tarInp.val());
			var result = true;
			if(!rules) return false;
			rules = rules.split(" ");
			for(var i in rules){
				var rule = rules[i];
				if(Validate[rule]){
					result = Validate[rule](val);
					if(!result) break;
				}
			}
			if(result){
				if(tarInp.attr("id")=="validCodeInp" && val.length!=6){
					return tarInp.parents(".rt").removeClass("ok").addClass("error");
				}
				tarInp.parents(".rt").removeClass("error").addClass("ok");
			}else{
				tarInp.parents(".rt").removeClass("ok").addClass("error");
			}
		},
		//是否同意条款
		onTiaoKuanCheckBoxClick : function(e){
			var checkbox = $(e.currentTarget);
			if(!!checkbox.prop("checked")){
				this.registerBtn.removeClass("disable");
			}else{
				this.registerBtn.addClass("disable");
			}
		}
	});
	module.exports = VRegister;

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	module.exports = function(url,opt){
		if(!url) return alert("ajax请求缺少url");
		var fn = new Function;
		var opt = opt || {};
		var params = opt.params || {};
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var timeout = opt.timeout || function(){ alert("请求超时，请稍后重试")};
		var serverError = opt.serverError || function(xhr,txt){
			var txt = txt || "请求出错，请稍后重试";
			if(txt=="parsererror") txt = "请求出错，请稍后重试";
			alert(txt);
		};
		var type = opt.type || "get";
		var dataType = opt.dataType || "json";
		var ttimeout = opt.ttimeout || 120 * 1000;
		$.ajax({
			url : url,
			type : type,
			dataType : dataType,
			data : params,
			timeout :ttimeout,
			beforeSend : function(){
				loading();
			},
			success : function(res){
				complete(res);
				success(res);
			},
			error : function(xhr,txt){
				complete(xhr,txt);
				if(txt == "timeout"){
					timeout(xhr,txt);
				}else{
					serverError(xhr,txt);
				}
			}
		})
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	var Validate = {
		//非空
		noBlank: function( value ){
			return !!value;
		},
		//最小
		min: function( value, rule ){
			return value.length >= rule;
		},
		//最大
		max: function( value, rule ){
			return value.length <= rule;
		},
		//验证常用英文符号，常用于密码验证
		typeChar : function(val){
			//常用英文符号
			var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
			return sChar.test(val);
		},
		typeCN : function(str){
			var result = true;
			var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
			for(var i= 0,len=str.length; i<len; i++){
				if(!reg.test(str)){
					result = false;
					break;
				}
			}
			return result;
		},
		//中文、英文
		typeZE: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
		},
		//英文、数字
		typeEN: function( value ){
			return /^[0-9|a-z|A-Z]+$/.test( value );
		},
		//只能大写英文字母
		typeE : function(value){
			return /^[A-Z]+$/g.test(value);
		},
		//只能小写英文字母
		typee : function(value){
			return /^[a-z]+$/g.test(value);
		},
		//只能大小写英文字母
		typeEe : function(value){
			return /^[a-zA-Z]+$/g.test(value);
		},
		//数字
		typeNum: function( value ){
			return !isNaN( value );
		},
		//电话
		typePhone: function( value ){
			var reg = /^1[0-9]{10}$/;
			return reg.test( value );
		},
		//email
		typeEmail: function( value ){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
		},
		//身份证号合法性验证
		//支持15位和18位身份证号
		//支持地址编码、出生日期、校验位验证
		idcard : function(code){
			var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
			var tip = "";
			var pass= true;
	
			if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
				tip = "身份证号格式错误";
				pass = false;
			}else if(!city[code.substr(0,2)]){
				tip = "地址编码错误";
				pass = false;
			}else{
				//18位身份证需要验证最后一位校验位
				if(code.length == 18){
					code = code.split('');
					//∑(ai×Wi)(mod 11)
					//加权因子
					var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
					//校验位
					var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
					var sum = 0;
					var ai = 0;
					var wi = 0;
					for (var i = 0; i < 17; i++)
					{
						ai = code[i];
						wi = factor[i];
						sum += ai * wi;
					}
					var last = parity[sum % 11];
					if(parity[sum % 11] != code[17]){
						tip = "校验位错误";
						pass =false;
					}
				}
			}
			return pass;
		},
		//验证密码(合法性及安全度)
		//6-20数字、字母和常用符号两种以上组合
		validatePwd : function(pwd){
			var len = pwd.length;
			//常用英文符号
			var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
			if(!pwd) return {error:"缺少pwd",level:""};
			if(len<6 || len>20) return {error:"位数须在6-20间",level:""};
			//判断密码可用性
			//不能全为数字  不能全为字母   不能全为符号
			//须是数字、字母、符号  三项中任意两项或三项组合
			var check = function(pwd){
				var error = "";
				var len = pwd.length;
				if(/\s/g.test(pwd)) return error = "不能包含空格";
				if(Validate.typeNum(pwd)) return error = "不能是纯数字";
				if(Validate.typeEe(pwd)) return error = "不能是纯字母";
				var num_leter_result = [];
				for(var i=0; i<len; i++){
					var s = pwd[i];
					if(Validate.typeNum(s) || Validate.typeEe(s)){
						num_leter_result.push(s);
					}
				}
				if(num_leter_result.length==0) error = "必须包含数字或字母";
				return error;
			};
			//判断密码强弱程度
			//弱密码：6位数字字母(大小写均可)组合。
			//中密码: 7位数及以上 数字字母（小写）组合
			//强密码：7位数及以上 数字字母并且存在大写字母或符号
			var getCheckLevel = function(pwd){
				var len = pwd.length;
				if(len==6) return "weak";
				var hasUpcaseLetterOrChar = (function(){
					var res = false;
					for(var i=0; i<len; i++){
						var s = pwd[i];
						if(Validate.typeE(s) || sChar.test(s)){
							res = true;
							break;
						}
					}
					return res;
				})();
				//只要包含有大写字母或常用符号的7位及以上密码
				if(hasUpcaseLetterOrChar) return "strong";
				return "normal";
			};
			var check_able = check(pwd);
			if(check_able){
				return{error:check_able,level:""};
			}else{
				var level = getCheckLevel(pwd);
				return{error:"",level:level};
			}
		}
	};
	module.exports = Validate;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-15.
	 */
	var CitySelect = __webpack_require__(16);
	var VInfo = Backbone.View.extend({
		el : $("#infoForm"),
		events : {
			"click #jumpFromInfoBtn" : "onJumpFromInfoBtnClick",
			"click #infoSubmitBtn" : "onInfoSubmitBtnClick"
		},
		initialize : function(opt){
			this.router = opt.router;
			this.citySelect = new CitySelect({
				provId : "#provSelect",
				cityId : "#citySelect"
			});
		},
		onJumpFromInfoBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			var account = tarBtn.data("account");
			this.router.navigate("step/3",{trigger:true});
		},
		onInfoSubmitBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var params = this.$el.serialize();
			console.log(params);
		}
	});
	module.exports = VInfo;

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-15.
	 */
	var fn = new Function();
	var Data = {"citylist":[{"p":"北京","c":[{"n":"东城区"},{"n":"西城区"},{"n":"崇文区"},{"n":"宣武区"},{"n":"朝阳区"},{"n":"丰台区"},{"n":"石景山区"},{"n":"海淀区"},{"n":"门头沟区"},{"n":"房山区"},{"n":"通州区"},{"n":"顺义区"},{"n":"昌平区"},{"n":"大兴区"},{"n":"平谷区"},{"n":"怀柔区"},{"n":"密云县"},{"n":"延庆县"}]},{"p":"天津","c":[{"n":"和平区"},{"n":"河东区"},{"n":"河西区"},{"n":"南开区"},{"n":"河北区"},{"n":"红挢区"},{"n":"滨海新区"},{"n":"东丽区"},{"n":"西青区"},{"n":"津南区"},{"n":"北辰区"},{"n":"宁河区"},{"n":"武清区"},{"n":"静海县"},{"n":"宝坻区"},{"n":"蓟县"}]},{"p":"河北","c":[{"n":"石家庄","a":[{"s":"长安区"},{"s":"桥东区"},{"s":"桥西区"},{"s":"新华区"},{"s":"井陉矿区"},{"s":"裕华区"},{"s":"井陉县"},{"s":"正定县"},{"s":"栾城县"},{"s":"行唐县"},{"s":"灵寿县"},{"s":"高邑县"},{"s":"深泽县"},{"s":"赞皇县"},{"s":"无极县"},{"s":"平山县"},{"s":"元氏县"},{"s":"赵县"},{"s":"辛集市"},{"s":"藁城市"},{"s":"晋州市"},{"s":"新乐市"},{"s":"鹿泉市"}]},{"n":"唐山","a":[{"s":"路南区"},{"s":"路北区"},{"s":"古冶区"},{"s":"开平区"},{"s":"丰南区"},{"s":"丰润区"},{"s":"滦县"},{"s":"滦南县"},{"s":"乐亭县"},{"s":"迁西县"},{"s":"玉田县"},{"s":"唐海县"},{"s":"遵化市"},{"s":"迁安市"}]},{"n":"秦皇岛","a":[{"s":"海港区"},{"s":"山海关区"},{"s":"北戴河区"},{"s":"青龙满族自治县"},{"s":"昌黎县"},{"s":"抚宁县"},{"s":"卢龙县"}]},{"n":"邯郸","a":[{"s":"邯山区"},{"s":"丛台区"},{"s":"复兴区"},{"s":"峰峰矿区"},{"s":"邯郸县"},{"s":"临漳县"},{"s":"成安县"},{"s":"大名县"},{"s":"涉县"},{"s":"磁县"},{"s":"肥乡县"},{"s":"永年县"},{"s":"邱县"},{"s":"鸡泽县"},{"s":"广平县"},{"s":"馆陶县"},{"s":"魏县"},{"s":"曲周县"},{"s":"武安市"}]},{"n":"邢台","a":[{"s":"桥东区"},{"s":"桥西区"},{"s":"邢台县"},{"s":"临城县"},{"s":"内丘县"},{"s":"柏乡县"},{"s":"隆尧县"},{"s":"任县"},{"s":"南和县"},{"s":"宁晋县"},{"s":"巨鹿县"},{"s":"新河县"},{"s":"广宗县"},{"s":"平乡县"},{"s":"威县"},{"s":"清河县"},{"s":"临西县"},{"s":"南宫市"},{"s":"沙河市"}]},{"n":"保定","a":[{"s":"新市区"},{"s":"北市区"},{"s":"南市区"},{"s":"满城县"},{"s":"清苑县"},{"s":"涞水县"},{"s":"阜平县"},{"s":"徐水县"},{"s":"定兴县"},{"s":"唐县"},{"s":"高阳县"},{"s":"容城县"},{"s":"涞源县"},{"s":"望都县"},{"s":"安新县"},{"s":"易县"},{"s":"曲阳县"},{"s":"蠡县"},{"s":"顺平县"},{"s":"博野县"},{"s":"雄县"},{"s":"涿州市"},{"s":"定州市"},{"s":"安国市"},{"s":"高碑店市"}]},{"n":"张家口","a":[{"s":"桥东区"},{"s":"桥西区"},{"s":"宣化区"},{"s":"下花园区"},{"s":"宣化县"},{"s":"张北县"},{"s":"康保县"},{"s":"沽源县"},{"s":"尚义县"},{"s":"蔚县"},{"s":"阳原县"},{"s":"怀安县"},{"s":"万全县"},{"s":"怀来县"},{"s":"涿鹿县"},{"s":"赤城县"},{"s":"崇礼县"}]},{"n":"承德","a":[{"s":"双桥区"},{"s":"双滦区"},{"s":"鹰手营子矿区"},{"s":"承德县"},{"s":"兴隆县"},{"s":"平泉县"},{"s":"滦平县"},{"s":"隆化县"},{"s":"丰宁满族自治县"},{"s":"宽城满族自治县"},{"s":"围场满族蒙古族自治县"}]},{"n":"沧州","a":[{"s":"新华区"},{"s":"运河区"},{"s":"沧县"},{"s":"青县"},{"s":"东光县"},{"s":"海兴县"},{"s":"盐山县"},{"s":"肃宁县"},{"s":"南皮县"},{"s":"吴桥县"},{"s":"献县"},{"s":"孟村回族自治县"},{"s":"泊头市"},{"s":"任丘市"},{"s":"黄骅市"},{"s":"河间市"}]},{"n":"廊坊","a":[{"s":"安次区"},{"s":"广阳区"},{"s":"固安县"},{"s":"永清县"},{"s":"香河县"},{"s":"大城县"},{"s":"文安县"},{"s":"大厂回族自治县"},{"s":"霸州市"},{"s":"三河市"}]},{"n":"衡水","a":[{"s":"桃城区"},{"s":"枣强县"},{"s":"武邑县"},{"s":"武强县"},{"s":"饶阳县"},{"s":"安平县"},{"s":"故城县"},{"s":"景县"},{"s":"阜城县"},{"s":"冀州市"},{"s":"深州市"}]}]},{"p":"山西","c":[{"n":"太原","a":[{"s":"小店区"},{"s":"迎泽区"},{"s":"杏花岭区"},{"s":"尖草坪区"},{"s":"万柏林区"},{"s":"晋源区"},{"s":"清徐县"},{"s":"阳曲县"},{"s":"娄烦县"},{"s":"古交市"}]},{"n":"大同","a":[{"s":"城区"},{"s":"矿区"},{"s":"南郊区"},{"s":"新荣区"},{"s":"阳高县"},{"s":"天镇县"},{"s":"广灵县"},{"s":"灵丘县"},{"s":"浑源县"},{"s":"左云县"},{"s":"大同县"}]},{"n":"阳泉","a":[{"s":"城区"},{"s":"矿区"},{"s":"郊区"},{"s":"平定县"},{"s":"盂县"}]},{"n":"长治","a":[{"s":"城区"},{"s":"郊区"},{"s":"长治县"},{"s":"襄垣县"},{"s":"屯留县"},{"s":"平顺县"},{"s":"黎城县"},{"s":"壶关县"},{"s":"长子县"},{"s":"武乡县"},{"s":"沁县"},{"s":"沁源县"},{"s":"潞城市"}]},{"n":"晋城","a":[{"s":"城区"},{"s":"沁水县"},{"s":"阳城县"},{"s":"陵川县"},{"s":"泽州县"},{"s":"高平市"}]},{"n":"朔州","a":[{"s":"朔城区"},{"s":"平鲁区"},{"s":"山阴县"},{"s":"应县"},{"s":"右玉县"},{"s":"怀仁县"}]},{"n":"晋中","a":[{"s":"榆次区"},{"s":"榆社县"},{"s":"左权县"},{"s":"和顺县"},{"s":"昔阳县"},{"s":"寿阳县"},{"s":"太谷县"},{"s":"祁县"},{"s":"平遥县"},{"s":"灵石县"},{"s":"介休市"}]},{"n":"运城","a":[{"s":"盐湖区"},{"s":"临猗县"},{"s":"万荣县"},{"s":"闻喜县"},{"s":"稷山县"},{"s":"新绛县"},{"s":"绛县"},{"s":"垣曲县"},{"s":"夏县"},{"s":"平陆县"},{"s":"芮城县"},{"s":"永济市"},{"s":"河津市"}]},{"n":"忻州","a":[{"s":"忻府区"},{"s":"定襄县"},{"s":"五台县"},{"s":"代县"},{"s":"繁峙县"},{"s":"宁武县"},{"s":"静乐县"},{"s":"神池县"},{"s":"五寨县"},{"s":"岢岚县"},{"s":"河曲县"},{"s":"保德县"},{"s":"偏关县"},{"s":"原平市"}]},{"n":"临汾","a":[{"s":"尧都区"},{"s":"曲沃县"},{"s":"翼城县"},{"s":"襄汾县"},{"s":"洪洞县"},{"s":"古县"},{"s":"安泽县"},{"s":"浮山县"},{"s":"吉县"},{"s":"乡宁县"},{"s":"大宁县"},{"s":"隰县"},{"s":"永和县"},{"s":"蒲县"},{"s":"汾西县"},{"s":"侯马市"},{"s":"霍州市"}]},{"n":"吕梁","a":[{"s":"离石区"},{"s":"文水县"},{"s":"交城县"},{"s":"兴县"},{"s":"临县"},{"s":"柳林县"},{"s":"石楼县"},{"s":"岚县"},{"s":"方山县"},{"s":"中阳县"},{"s":"交口县"},{"s":"孝义市"},{"s":"汾阳市"}]}]},{"p":"内蒙古","c":[{"n":"呼和浩特","a":[{"s":"新城区"},{"s":"回民区"},{"s":"玉泉区"},{"s":"玉泉区"},{"s":"赛罕区"},{"s":"土默特左旗"},{"s":"托克托县"},{"s":"和林格尔县"},{"s":"清水河县"},{"s":"武川县"}]},{"n":"包头","a":[{"s":"东河区"},{"s":"昆都仑区"},{"s":"青山区"},{"s":"石拐区"},{"s":"白云矿区"},{"s":"九原区"},{"s":"土默特右旗"},{"s":"固阳县"},{"s":"达尔罕茂明安联合旗"}]},{"n":"乌海","a":[{"s":"海勃湾区"},{"s":"海南区"},{"s":"乌达区"}]},{"n":"赤峰","a":[{"s":"红山区"},{"s":"元宝山区"},{"s":"松山区"},{"s":"阿鲁科尔沁旗"},{"s":"巴林左旗"},{"s":"巴林右旗"},{"s":"林西县"},{"s":"克什克腾旗"},{"s":"翁牛特旗"},{"s":"喀喇沁旗"},{"s":"宁城县"},{"s":"敖汉旗"}]},{"n":"通辽","a":[{"s":"科尔沁区"},{"s":"科尔沁左翼中旗"},{"s":"科尔沁左翼后旗"},{"s":"开鲁县"},{"s":"库伦旗"},{"s":"奈曼旗"},{"s":"扎鲁特旗"},{"s":"霍林郭勒市"}]},{"n":"鄂尔多斯","a":[{"s":"东胜区"},{"s":"达拉特旗"},{"s":"准格尔旗"},{"s":"鄂托克前旗"},{"s":"鄂托克旗"},{"s":"杭锦旗"},{"s":"乌审旗"},{"s":"伊金霍洛旗"}]},{"n":"呼伦贝尔","a":[{"s":"海拉尔区"},{"s":"阿荣旗"},{"s":"莫力达瓦达斡尔族自治旗"},{"s":"鄂伦春自治旗"},{"s":"鄂温克族自治旗"},{"s":"陈巴尔虎旗"},{"s":"新巴尔虎左旗"},{"s":"新巴尔虎右旗"},{"s":"满洲里市"},{"s":"牙克石市"},{"s":"扎兰屯市"},{"s":"额尔古纳市"},{"s":"根河市"}]},{"n":"巴彦淖尔","a":[{"s":"临河区"},{"s":"五原县"},{"s":"磴口县"},{"s":"乌拉特前旗"},{"s":"乌拉特中旗"},{"s":"乌拉特后旗"},{"s":"杭锦后旗"}]},{"n":"乌兰察布","a":[{"s":"集宁区"},{"s":"卓资县"},{"s":"化德县"},{"s":"商都县"},{"s":"兴和县"},{"s":"凉城县"},{"s":"察哈尔右翼前旗"},{"s":"察哈尔右翼中旗"},{"s":"察哈尔右翼后旗"},{"s":"四子王旗"},{"s":"丰镇市"}]},{"n":"兴安","a":[{"s":"乌兰浩特市"},{"s":"阿尔山市"},{"s":"科尔沁右翼前旗"},{"s":"科尔沁右翼中旗"},{"s":"扎赉特旗"},{"s":"突泉县"}]},{"n":"锡林郭勒","a":[{"s":"二连浩特市"},{"s":"锡林浩特市"},{"s":"阿巴嘎旗"},{"s":"苏尼特左旗"},{"s":"苏尼特右旗"},{"s":"东乌珠穆沁旗"},{"s":"西乌珠穆沁旗"},{"s":"太仆寺旗"},{"s":"镶黄旗"},{"s":"正镶白旗"},{"s":"正蓝旗"},{"s":"多伦县"}]},{"n":"阿拉善","a":[{"s":"阿拉善左旗"},{"s":"阿拉善右旗"},{"s":"额济纳旗"}]}]},{"p":"辽宁","c":[{"n":"沈阳","a":[{"s":"和平区"},{"s":"沈河区"},{"s":"大东区"},{"s":"皇姑区"},{"s":"铁西区"},{"s":"苏家屯区"},{"s":"东陵区"},{"s":"新城子区"},{"s":"于洪区"},{"s":"辽中县"},{"s":"康平县"},{"s":"法库县"},{"s":"新民市"}]},{"n":"大连","a":[{"s":"中山区"},{"s":"西岗区"},{"s":"沙河口区"},{"s":"甘井子区"},{"s":"旅顺口区"},{"s":"金州区"},{"s":"长海县"},{"s":"瓦房店市"},{"s":"普兰店市"},{"s":"庄河市"}]},{"n":"鞍山","a":[{"s":"铁东区"},{"s":"铁西区"},{"s":"立山区"},{"s":"千山区"},{"s":"台安县"},{"s":"210323"},{"s":"海城市"}]},{"n":"抚顺","a":[{"s":"新抚区"},{"s":"东洲区"},{"s":"望花区"},{"s":"顺城区"},{"s":"抚顺县"},{"s":"新宾满族自治县"},{"s":"清原满族自治县"}]},{"n":"本溪","a":[{"s":"平山区"},{"s":"溪湖区"},{"s":"明山区"},{"s":"南芬区"},{"s":"本溪满族自治县"},{"s":"桓仁满族自治县"}]},{"n":"丹东","a":[{"s":"元宝区"},{"s":"振兴区"},{"s":"振安区"},{"s":"宽甸满族自治县"},{"s":"东港市"},{"s":"凤城市"}]},{"n":"锦州","a":[{"s":"古塔区"},{"s":"凌河区"},{"s":"太和区"},{"s":"黑山县"},{"s":"义县"},{"s":"凌海市"},{"s":"北镇市"}]},{"n":"营口","a":[{"s":"站前区"},{"s":"西市区"},{"s":"鲅鱼圈区"},{"s":"老边区"},{"s":"盖州市"},{"s":"大石桥市"}]},{"n":"阜新","a":[{"s":"海州区"},{"s":"新邱区"},{"s":"太平区"},{"s":"清河门区"},{"s":"细河区"},{"s":"阜新蒙古族自治县"},{"s":"彰武县"}]},{"n":"辽阳","a":[{"s":"白塔区"},{"s":"文圣区"},{"s":"宏伟区"},{"s":"弓长岭区"},{"s":"太子河区"},{"s":"辽阳县"},{"s":"灯塔市"}]},{"n":"盘锦","a":[{"s":"双台子区"},{"s":"兴隆台区"},{"s":"大洼县"},{"s":"盘山县"}]},{"n":"铁岭","a":[{"s":"银州区"},{"s":"清河区"},{"s":"铁岭县"},{"s":"西丰县"},{"s":"昌图县"},{"s":"调兵山市"},{"s":"开原市"}]},{"n":"朝阳","a":[{"s":"双塔区"},{"s":"龙城区"},{"s":"朝阳县"},{"s":"建平县"},{"s":"喀喇沁左翼蒙古族自治县"},{"s":"北票市"},{"s":"凌源市"}]},{"n":"葫芦岛","a":[{"s":"连山区"},{"s":"龙港区"},{"s":"南票区"},{"s":"绥中县"},{"s":"建昌县"},{"s":"兴城市"}]}]},{"p":"吉林","c":[{"n":"长春","a":[{"s":"南关区"},{"s":"宽城区"},{"s":"朝阳区"},{"s":"二道区"},{"s":"绿园区"},{"s":"双阳区"},{"s":"农安县"},{"s":"九台市"},{"s":"榆树市"},{"s":"德惠市"}]},{"n":"吉林","a":[{"s":"昌邑区"},{"s":"龙潭区"},{"s":"船营区"},{"s":"丰满区"},{"s":"永吉县"},{"s":"蛟河市"},{"s":"桦甸市"},{"s":"舒兰市"},{"s":"磐石市"}]},{"n":"四平","a":[{"s":"铁西区"},{"s":"铁东区"},{"s":"梨树县"},{"s":"伊通满族自治县"},{"s":"公主岭市"},{"s":"双辽市"}]},{"n":"辽源","a":[{"s":"龙山区"},{"s":"西安区"},{"s":"东丰县"},{"s":"东辽县"}]},{"n":"通化","a":[{"s":"东昌区"},{"s":"二道江区"},{"s":"通化县"},{"s":"辉南县"},{"s":"柳河县"},{"s":"梅河口市"},{"s":"集安市"}]},{"n":"白山","a":[{"s":"八道江区"},{"s":"江源区"},{"s":"抚松县"},{"s":"靖宇县"},{"s":"长白朝鲜族自治县"},{"s":"临江市"}]},{"n":"松原","a":[{"s":"宁江区"},{"s":"前郭尔罗斯蒙古族自治县"},{"s":"长岭县"},{"s":"乾安县"},{"s":"扶余县"}]},{"n":"白城","a":[{"s":"洮北区"},{"s":"镇赉县"},{"s":"通榆县"},{"s":"洮南市"},{"s":"大安市"}]},{"n":"延边","a":[{"s":"延吉市"},{"s":"图们市"},{"s":"敦化市"},{"s":"珲春市"},{"s":"龙井市"},{"s":"和龙市"},{"s":"汪清县"},{"s":"安图县"}]}]},{"p":"黑龙江","c":[{"n":"哈尔滨","a":[{"s":"道里区"},{"s":"南岗区"},{"s":"道外区"},{"s":"平房区"},{"s":"松北区"},{"s":"香坊区"},{"s":"呼兰区"},{"s":"阿城区"},{"s":"依兰县"},{"s":"方正县"},{"s":"宾县"},{"s":"巴彦县"},{"s":"木兰县"},{"s":"通河县"},{"s":"延寿县"},{"s":"双城市"},{"s":"尚志市"},{"s":"五常市"}]},{"n":"齐齐哈尔","a":[{"s":"龙沙区"},{"s":"建华区"},{"s":"铁锋区"},{"s":"昂昂溪区"},{"s":"富拉尔基区"},{"s":"碾子山区"},{"s":"梅里斯达斡尔族区"},{"s":"龙江县"},{"s":"依安县"},{"s":"泰来县"},{"s":"甘南县"},{"s":"富裕县"},{"s":"克山县"},{"s":"克东县"},{"s":"拜泉县"},{"s":"讷河市"}]},{"n":"鸡西","a":[{"s":"鸡冠区"},{"s":"恒山区"},{"s":"滴道区"},{"s":"梨树区"},{"s":"城子河区"},{"s":"麻山区"},{"s":"鸡东县"},{"s":"虎林市"},{"s":"密山市"}]},{"n":"鹤岗","a":[{"s":"向阳区"},{"s":"工农区"},{"s":"南山区"},{"s":"兴安区"},{"s":"东山区"},{"s":"兴山区"},{"s":"萝北县"},{"s":"绥滨县"}]},{"n":"双鸭山","a":[{"s":"尖山区"},{"s":"岭东区"},{"s":"四方台区"},{"s":"宝山区"},{"s":"集贤县"},{"s":"友谊县"},{"s":"宝清县"},{"s":"饶河县"}]},{"n":"大庆","a":[{"s":"萨尔图区"},{"s":"龙凤区"},{"s":"让胡路区"},{"s":"红岗区"},{"s":"大同区"},{"s":"肇州县"},{"s":"肇源县"},{"s":"林甸县"},{"s":"杜尔伯特蒙古族自治县"}]},{"n":"伊春","a":[{"s":"伊春区"},{"s":"南岔区"},{"s":"友好区"},{"s":"西林区"},{"s":"翠峦区"},{"s":"新青区"},{"s":"美溪区"},{"s":"金山屯区"},{"s":"五营区"},{"s":"乌马河区"},{"s":"汤旺河区"},{"s":"带岭区"},{"s":"乌伊岭区"},{"s":"红星区"},{"s":"上甘岭区"},{"s":"嘉荫县"},{"s":"铁力市"}]},{"n":"佳木斯","a":[{"s":"向阳区"},{"s":"前进区"},{"s":"东风区"},{"s":"郊区"},{"s":"桦南县"},{"s":"桦川县"},{"s":"汤原县"},{"s":"抚远县"},{"s":"同江市"},{"s":"富锦市"}]},{"n":"七台河","a":[{"s":"新兴区"},{"s":"桃山区"},{"s":"茄子河区"},{"s":"勃利县"}]},{"n":"牡丹江","a":[{"s":"东安区"},{"s":"阳明区"},{"s":"爱民区"},{"s":"西安区"},{"s":"东宁县"},{"s":"林口县"},{"s":"绥芬河市"},{"s":"海林市"},{"s":"宁安市"},{"s":"穆棱市"}]},{"n":"黑河","a":[{"s":"爱辉区"},{"s":"嫩江县"},{"s":"逊克县"},{"s":"孙吴县"},{"s":"北安市"},{"s":"五大连池市"}]},{"n":"绥化","a":[{"s":"北林区"},{"s":"望奎县"},{"s":"兰西县"},{"s":"青冈县"},{"s":"庆安县"},{"s":"明水县"},{"s":"绥棱县"},{"s":"安达市"},{"s":"肇东市"},{"s":"海伦市"}]},{"n":"大兴安岭","a":[{"s":"加格达奇区"},{"s":"松岭区"},{"s":"新林区"},{"s":"呼中区"},{"s":"呼玛县"},{"s":"塔河县"},{"s":"漠河县"}]}]},{"p":"上海","c":[{"n":"黄浦区"},{"n":"卢湾区"},{"n":"徐汇区"},{"n":"长宁区"},{"n":"静安区"},{"n":"普陀区"},{"n":"闸北区"},{"n":"虹口区"},{"n":"杨浦区"},{"n":"闵行区"},{"n":"宝山区"},{"n":"嘉定区"},{"n":"浦东新区"},{"n":"金山区"},{"n":"松江区"},{"n":"奉贤区"},{"n":"青浦区"},{"n":"崇明县"}]},{"p":"江苏","c":[{"n":"南京","a":[{"s":"玄武区"},{"s":"白下区"},{"s":"秦淮区"},{"s":"建邺区"},{"s":"鼓楼区"},{"s":"下关区"},{"s":"浦口区"},{"s":"栖霞区"},{"s":"雨花台区"},{"s":"江宁区"},{"s":"六合区"},{"s":"溧水县"},{"s":"高淳县"}]},{"n":"无锡","a":[{"s":"崇安区"},{"s":"南长区"},{"s":"北塘区"},{"s":"锡山区"},{"s":"惠山区"},{"s":"滨湖区"},{"s":"江阴市"},{"s":"宜兴市"}]},{"n":"徐州","a":[{"s":"鼓楼区"},{"s":"云龙区"},{"s":"九里区"},{"s":"贾汪区"},{"s":"泉山区"},{"s":"丰县"},{"s":"沛县"},{"s":"铜山县"},{"s":"睢宁县"},{"s":"新沂市"},{"s":"邳州市"}]},{"n":"常州","a":[{"s":"天宁区"},{"s":"钟楼区"},{"s":"戚墅堰区"},{"s":"新北区"},{"s":"武进区"},{"s":"溧阳市"},{"s":"金坛市"}]},{"n":"苏州","a":[{"s":"沧浪区"},{"s":"平江区"},{"s":"金阊区"},{"s":"虎丘区"},{"s":"吴中区"},{"s":"相城区"},{"s":"常熟市"},{"s":"张家港市"},{"s":"昆山市"},{"s":"吴江市"},{"s":"太仓市"}]},{"n":"南通","a":[{"s":"崇川区"},{"s":"港闸区"},{"s":"海安县"},{"s":"如东县"},{"s":"启东市"},{"s":"如皋市"},{"s":"通州市"},{"s":"海门市"}]},{"n":"连云港","a":[{"s":"连云区"},{"s":"新浦区"},{"s":"海州区"},{"s":"赣榆县"},{"s":"东海县"},{"s":"灌云县"},{"s":"灌南县"}]},{"n":"淮安","a":[{"s":"清河区"},{"s":"楚州区"},{"s":"淮阴区"},{"s":"清浦区"},{"s":"涟水县"},{"s":"洪泽县"},{"s":"盱眙县"},{"s":"金湖县"}]},{"n":"盐城","a":[{"s":"亭湖区"},{"s":"盐都区"},{"s":"响水县"},{"s":"滨海县"},{"s":"阜宁县"},{"s":"射阳县"},{"s":"建湖县"},{"s":"东台市"},{"s":"大丰市"}]},{"n":"扬州","a":[{"s":"广陵区"},{"s":"邗江区"},{"s":"维扬区"},{"s":"宝应县"},{"s":"仪征市"},{"s":"高邮市"},{"s":"江都市"}]},{"n":"镇江","a":[{"s":"京口区"},{"s":"润州区"},{"s":"丹徒区"},{"s":"丹阳市"},{"s":"扬中市"},{"s":"句容市"}]},{"n":"泰州","a":[{"s":"海陵区"},{"s":"高港区"},{"s":"兴化市"},{"s":"靖江市"},{"s":"泰兴市"},{"s":"姜堰市"}]},{"n":"宿迁","a":[{"s":"宿城区"},{"s":"宿豫区"},{"s":"沭阳县"},{"s":"泗阳县"},{"s":"泗洪县"}]}]},{"p":"浙江","c":[{"n":"杭州","a":[{"s":"上城区"},{"s":"下城区"},{"s":"江干区"},{"s":"拱墅区"},{"s":"西湖区"},{"s":"滨江区"},{"s":"萧山区"},{"s":"余杭区"},{"s":"桐庐县"},{"s":"淳安县"},{"s":"建德市"},{"s":"富阳市"},{"s":"临安市"}]},{"n":"宁波","a":[{"s":"海曙区"},{"s":"江东区"},{"s":"江北区"},{"s":"北仑区"},{"s":"镇海区"},{"s":"鄞州区"},{"s":"象山县"},{"s":"宁海县"},{"s":"余姚市"},{"s":"慈溪市"},{"s":"奉化市"}]},{"n":"温州","a":[{"s":"鹿城区"},{"s":"龙湾区"},{"s":"瓯海区"},{"s":"洞头县"},{"s":"永嘉县"},{"s":"平阳县"},{"s":"苍南县"},{"s":"文成县"},{"s":"泰顺县"},{"s":"瑞安市"},{"s":"乐清市"}]},{"n":"嘉兴","a":[{"s":"南湖区"},{"s":"秀洲区"},{"s":"嘉善县"},{"s":"海盐县"},{"s":"海宁市"},{"s":"平湖市"},{"s":"桐乡市"}]},{"n":"湖州","a":[{"s":"吴兴区"},{"s":"南浔区"},{"s":"德清县"},{"s":"长兴县"},{"s":"安吉县"}]},{"n":"绍兴","a":[{"s":"越城区"},{"s":"绍兴县"},{"s":"新昌县"},{"s":"诸暨市"},{"s":"上虞市"},{"s":"嵊州市"}]},{"n":"金华","a":[{"s":"婺城区"},{"s":"金东区"},{"s":"武义县"},{"s":"浦江县"},{"s":"磐安县"},{"s":"兰溪市"},{"s":"义乌市"},{"s":"东阳市"},{"s":"永康市"}]},{"n":"衢州","a":[{"s":"柯城区"},{"s":"衢江区"},{"s":"常山县"},{"s":"开化县"},{"s":"龙游县"},{"s":"江山市"}]},{"n":"舟山","a":[{"s":"定海区"},{"s":"普陀区"},{"s":"岱山县"},{"s":"嵊泗县"}]},{"n":"台州","a":[{"s":"椒江区"},{"s":"黄岩区"},{"s":"路桥区"},{"s":"玉环县"},{"s":"三门县"},{"s":"天台县"},{"s":"仙居县"},{"s":"温岭市"},{"s":"临海市"}]},{"n":"丽水","a":[{"s":"莲都区"},{"s":"青田县"},{"s":"缙云县"},{"s":"遂昌县"},{"s":"松阳县"},{"s":"云和县"},{"s":"庆元县"},{"s":"景宁畲族自治县"},{"s":"龙泉市"}]}]},{"p":"安徽","c":[{"n":"合肥","a":[{"s":"瑶海区"},{"s":"庐阳区"},{"s":"蜀山区"},{"s":"包河区"},{"s":"长丰县"},{"s":"肥东县"},{"s":"肥西县"}]},{"n":"芜湖","a":[{"s":"镜湖区"},{"s":"弋江区"},{"s":"鸠江区"},{"s":"三山区"},{"s":"芜湖县"},{"s":"繁昌县"},{"s":"南陵县"}]},{"n":"蚌埠","a":[{"s":"龙子湖区"},{"s":"蚌山区"},{"s":"禹会区"},{"s":"淮上区"},{"s":"怀远县"},{"s":"五河县"},{"s":"固镇县"}]},{"n":"淮南","a":[{"s":"大通区"},{"s":"田家庵区"},{"s":"谢家集区"},{"s":"八公山区"},{"s":"潘集区"},{"s":"凤台县"}]},{"n":"马鞍山","a":[{"s":"金家庄区"},{"s":"花山区"},{"s":"雨山区"},{"s":"当涂县"}]},{"n":"淮北","a":[{"s":"杜集区"},{"s":"相山区"},{"s":"烈山区"},{"s":"濉溪县"}]},{"n":"铜陵","a":[{"s":"铜官山区"},{"s":"狮子山区"},{"s":"郊区"},{"s":"铜陵县"}]},{"n":"安庆","a":[{"s":"迎江区"},{"s":"大观区"},{"s":"宜秀区"},{"s":"怀宁县"},{"s":"枞阳县"},{"s":"潜山县"},{"s":"太湖县"},{"s":"宿松县"},{"s":"望江县"},{"s":"岳西县"},{"s":"桐城市"}]},{"n":"黄山","a":[{"s":"屯溪区"},{"s":"黄山区"},{"s":"徽州区"},{"s":"歙县"},{"s":"休宁县"},{"s":"黟县"},{"s":"祁门县"}]},{"n":"滁州","a":[{"s":"琅琊区"},{"s":"南谯区"},{"s":"来安县"},{"s":"全椒县"},{"s":"定远县"},{"s":"凤阳县"},{"s":"天长市"},{"s":"明光市"}]},{"n":"阜阳","a":[{"s":"颍州区"},{"s":"颍东区"},{"s":"颍泉区"},{"s":"临泉县"},{"s":"太和县"},{"s":"阜南县"},{"s":"颍上县"},{"s":"界首市"}]},{"n":"宿州","a":[{"s":"埇桥区"},{"s":"砀山县"},{"s":"萧县"},{"s":"灵璧县"},{"s":"泗县"}]},{"n":"巢湖","a":[{"s":"居巢区"},{"s":"庐江县"},{"s":"无为县"},{"s":"含山县"},{"s":"和县"}]},{"n":"六安","a":[{"s":"金安区"},{"s":"裕安区"},{"s":"寿县"},{"s":"霍邱县"},{"s":"舒城县"},{"s":"金寨县"},{"s":"霍山县"}]},{"n":"亳州","a":[{"s":"谯城区"},{"s":"涡阳县"},{"s":"蒙城县"},{"s":"利辛县"}]},{"n":"池州","a":[{"s":"贵池区"},{"s":"东至县"},{"s":"石台县"},{"s":"青阳县"}]},{"n":"宣城","a":[{"s":"宣州区"},{"s":"郎溪县"},{"s":"广德县"},{"s":"泾县"},{"s":"绩溪县"},{"s":"旌德县"},{"s":"宁国市"}]}]},{"p":"福建","c":[{"n":"福州","a":[{"s":"鼓楼区"},{"s":"台江区"},{"s":"仓山区"},{"s":"马尾区"},{"s":"晋安区"},{"s":"闽侯县"},{"s":"连江县"},{"s":"罗源县"},{"s":"闽清县"},{"s":"永泰县"},{"s":"平潭县"},{"s":"福清市"},{"s":"长乐市"}]},{"n":"厦门","a":[{"s":"思明区"},{"s":"海沧区"},{"s":"湖里区"},{"s":"集美区"},{"s":"同安区"},{"s":"翔安区"}]},{"n":"莆田","a":[{"s":"城厢区"},{"s":"涵江区"},{"s":"荔城区"},{"s":"秀屿区"},{"s":"仙游县"}]},{"n":"三明","a":[{"s":"梅列区"},{"s":"三元区"},{"s":"明溪县"},{"s":"清流县"},{"s":"宁化县"},{"s":"大田县"},{"s":"尤溪县"},{"s":"沙县"},{"s":"将乐县"},{"s":"泰宁县"},{"s":"建宁县"},{"s":"永安市"}]},{"n":"泉州","a":[{"s":"鲤城区"},{"s":"丰泽区"},{"s":"洛江区"},{"s":"泉港区"},{"s":"惠安县"},{"s":"安溪县"},{"s":"永春县"},{"s":"德化县"},{"s":"金门县"},{"s":"石狮市"},{"s":"晋江市"},{"s":"南安市"}]},{"n":"漳州","a":[{"s":"芗城区"},{"s":"龙文区"},{"s":"云霄县"},{"s":"漳浦县"},{"s":"诏安县"},{"s":"长泰县"},{"s":"东山县"},{"s":"南靖县"},{"s":"平和县"},{"s":"华安县"},{"s":"龙海市"}]},{"n":"南平","a":[{"s":"延平区"},{"s":"顺昌县"},{"s":"浦城县"},{"s":"光泽县"},{"s":"松溪县"},{"s":"政和县"},{"s":"邵武市"},{"s":"武夷山市"},{"s":"建瓯市"},{"s":"建阳市"}]},{"n":"龙岩","a":[{"s":"新罗区"},{"s":"长汀县"},{"s":"永定县"},{"s":"上杭县"},{"s":"武平县"},{"s":"连城县"},{"s":"漳平市"}]},{"n":"宁德","a":[{"s":"蕉城区"},{"s":"霞浦县"},{"s":"古田县"},{"s":"屏南县"},{"s":"寿宁县"},{"s":"周宁县"},{"s":"柘荣县"},{"s":"福安市"},{"s":"福鼎市"}]}]},{"p":"江西","c":[{"n":"南昌","a":[{"s":"东湖区"},{"s":"西湖区"},{"s":"青云谱区"},{"s":"湾里区"},{"s":"青山湖区"},{"s":"南昌县"},{"s":"新建县"},{"s":"安义县"},{"s":"进贤县"}]},{"n":"景德镇","a":[{"s":"昌江区"},{"s":"珠山区"},{"s":"浮梁县"},{"s":"乐平市"}]},{"n":"萍乡","a":[{"s":"安源区"},{"s":"湘东区"},{"s":"莲花县"},{"s":"上栗县"},{"s":"芦溪县"}]},{"n":"九江","a":[{"s":"庐山区"},{"s":"浔阳区"},{"s":"九江县"},{"s":"武宁县"},{"s":"修水县"},{"s":"永修县"},{"s":"德安县"},{"s":"星子县"},{"s":"都昌县"},{"s":"湖口县"},{"s":"彭泽县"},{"s":"瑞昌市"}]},{"n":"新余","a":[{"s":"渝水区"},{"s":"分宜县"}]},{"n":"鹰潭","a":[{"s":"月湖区"},{"s":"余江县"},{"s":"贵溪市"}]},{"n":"赣州","a":[{"s":"章贡区"},{"s":"赣县"},{"s":"信丰县"},{"s":"大余县"},{"s":"上犹县"},{"s":"崇义县"},{"s":"安远县"},{"s":"龙南县"},{"s":"定南县"},{"s":"全南县"},{"s":"宁都县"},{"s":"于都县"},{"s":"兴国县"},{"s":"会昌县"},{"s":"寻乌县"},{"s":"石城县"},{"s":"瑞金市"},{"s":"南康市"}]},{"n":"吉安","a":[{"s":"吉州区"},{"s":"青原区"},{"s":"吉安县"},{"s":"吉水县"},{"s":"峡江县"},{"s":"新干县"},{"s":"永丰县"},{"s":"泰和县"},{"s":"遂川县"},{"s":"万安县"},{"s":"安福县"},{"s":"永新县"},{"s":"井冈山市"}]},{"n":"宜春","a":[{"s":"袁州区"},{"s":"奉新县"},{"s":"万载县"},{"s":"上高县"},{"s":"宜丰县"},{"s":"靖安县"},{"s":"铜鼓县"},{"s":"丰城市"},{"s":"樟树市"},{"s":"高安市"}]},{"n":"抚州","a":[{"s":"临川区"},{"s":"南城县"},{"s":"黎川县"},{"s":"南丰县"},{"s":"崇仁县"},{"s":"乐安县"},{"s":"宜黄县"},{"s":"金溪县"},{"s":"资溪县"},{"s":"东乡县"},{"s":"广昌县"}]},{"n":"上饶","a":[{"s":"信州区"},{"s":"上饶县"},{"s":"广丰县"},{"s":"玉山县"},{"s":"铅山县"},{"s":"横峰县"},{"s":"弋阳县"},{"s":"余干县"},{"s":"鄱阳县"},{"s":"万年县"},{"s":"婺源县"},{"s":"德兴市"}]}]},{"p":"山东","c":[{"n":"济南","a":[{"s":"历下区"},{"s":"市中区"},{"s":"槐荫区"},{"s":"天桥区"},{"s":"历城区"},{"s":"长清区"},{"s":"平阴县"},{"s":"济阳县"},{"s":"商河县"},{"s":"章丘市"}]},{"n":"青岛","a":[{"s":"市南区"},{"s":"市北区"},{"s":"四方区"},{"s":"黄岛区"},{"s":"崂山区"},{"s":"李沧区"},{"s":"城阳区"},{"s":"胶州市"},{"s":"即墨市"},{"s":"平度市"},{"s":"胶南市"},{"s":"莱西市"}]},{"n":"淄博","a":[{"s":"淄川区"},{"s":"张店区"},{"s":"博山区"},{"s":"临淄区"},{"s":"周村区"},{"s":"桓台县"},{"s":"高青县"},{"s":"沂源县"}]},{"n":"枣庄","a":[{"s":"市中区"},{"s":"薛城区"},{"s":"峄城区"},{"s":"台儿庄区"},{"s":"山亭区"},{"s":"滕州市"}]},{"n":"东营","a":[{"s":"东营区"},{"s":"河口区"},{"s":"垦利县"},{"s":"利津县"},{"s":"广饶县"}]},{"n":"烟台","a":[{"s":"芝罘区"},{"s":"福山区"},{"s":"牟平区"},{"s":"莱山区"},{"s":"长岛县"},{"s":"龙口市"},{"s":"莱阳市"},{"s":"莱州市"},{"s":"蓬莱市"},{"s":"招远市"},{"s":"栖霞市"},{"s":"海阳市"}]},{"n":"潍坊","a":[{"s":"潍城区"},{"s":"寒亭区"},{"s":"坊子区"},{"s":"奎文区"},{"s":"临朐县"},{"s":"昌乐县"},{"s":"青州市"},{"s":"诸城市"},{"s":"寿光市"},{"s":"安丘市"},{"s":"高密市"},{"s":"昌邑市"}]},{"n":"济宁","a":[{"s":"市中区"},{"s":"任城区"},{"s":"微山县"},{"s":"鱼台县"},{"s":"金乡县"},{"s":"嘉祥县"},{"s":"汶上县"},{"s":"泗水县"},{"s":"梁山县"},{"s":"曲阜市"},{"s":"兖州市"},{"s":"邹城市"}]},{"n":"泰安","a":[{"s":"泰山区"},{"s":"岱岳区"},{"s":"宁阳县"},{"s":"东平县"},{"s":"新泰市"},{"s":"肥城市"}]},{"n":"威海","a":[{"s":"环翠区"},{"s":"文登市"},{"s":"荣成市"},{"s":"乳山市"}]},{"n":"日照","a":[{"s":"东港区"},{"s":"岚山区"},{"s":"五莲县"},{"s":"莒县"}]},{"n":"莱芜","a":[{"s":"莱城区"},{"s":"钢城区"}]},{"n":"临沂","a":[{"s":"兰山区"},{"s":"罗庄区"},{"s":"河东区"},{"s":"沂南县"},{"s":"郯城县"},{"s":"沂水县"},{"s":"苍山县"},{"s":"费县"},{"s":"平邑县"},{"s":"莒南县"},{"s":"蒙阴县"},{"s":"临沭县"}]},{"n":"德州","a":[{"s":"德城区"},{"s":"陵县"},{"s":"宁津县"},{"s":"庆云县"},{"s":"临邑县"},{"s":"齐河县"},{"s":"平原县"},{"s":"夏津县"},{"s":"武城县"},{"s":"乐陵市"},{"s":"禹城市"}]},{"n":"聊城","a":[{"s":"东昌府区"},{"s":"阳谷县"},{"s":"莘县"},{"s":"茌平县"},{"s":"东阿县"},{"s":"冠县"},{"s":"高唐县"},{"s":"临清市"}]},{"n":"滨州","a":[{"s":"滨城区"},{"s":"惠民县"},{"s":"阳信县"},{"s":"无棣县"},{"s":"沾化县"},{"s":"博兴县"},{"s":"邹平县"}]},{"n":"菏泽","a":[{"s":"牡丹区"},{"s":"曹县"},{"s":"单县"},{"s":"成武县"},{"s":"巨野县"},{"s":"郓城县"},{"s":"鄄城县"},{"s":"定陶县"},{"s":"东明县"}]}]},{"p":"河南","c":[{"n":"郑州","a":[{"s":"中原区"},{"s":"二七区"},{"s":"管城回族区"},{"s":"金水区"},{"s":"上街区"},{"s":"惠济区"},{"s":"中牟县"},{"s":"巩义市"},{"s":"荥阳市"},{"s":"新密市"},{"s":"新郑市"},{"s":"登封市"}]},{"n":"开封","a":[{"s":"龙亭区"},{"s":"顺河回族区"},{"s":"鼓楼区"},{"s":"禹王台区"},{"s":"金明区"},{"s":"杞县"},{"s":"通许县"},{"s":"尉氏县"},{"s":"开封县"},{"s":"兰考县"}]},{"n":"洛阳","a":[{"s":"老城区"},{"s":"西工区"},{"s":"廛河回族区"},{"s":"涧西区"},{"s":"吉利区"},{"s":"洛龙区"},{"s":"孟津县"},{"s":"新安县"},{"s":"栾川县"},{"s":"嵩县"},{"s":"汝阳县"},{"s":"宜阳县"},{"s":"洛宁县"},{"s":"伊川县"},{"s":"偃师市"}]},{"n":"平顶山","a":[{"s":"新华区"},{"s":"卫东区"},{"s":"石龙区"},{"s":"湛河区"},{"s":"宝丰县"},{"s":"叶县"},{"s":"鲁山县"},{"s":"郏县"},{"s":"舞钢市"},{"s":"汝州市"}]},{"n":"安阳","a":[{"s":"文峰区"},{"s":"北关区"},{"s":"殷都区"},{"s":"龙安区"},{"s":"安阳县"},{"s":"汤阴县"},{"s":"滑县"},{"s":"内黄县"},{"s":"林州市"}]},{"n":"鹤壁","a":[{"s":"鹤山区"},{"s":"山城区"},{"s":"淇滨区"},{"s":"浚县"},{"s":"淇县"}]},{"n":"新乡","a":[{"s":"红旗区"},{"s":"卫滨区"},{"s":"凤泉区"},{"s":"牧野区"},{"s":"新乡县"},{"s":"获嘉县"},{"s":"原阳县"},{"s":"延津县"},{"s":"封丘县"},{"s":"长垣县"},{"s":"卫辉市"},{"s":"辉县市"}]},{"n":"焦作","a":[{"s":"解放区"},{"s":"中站区"},{"s":"马村区"},{"s":"山阳区"},{"s":"修武县"},{"s":"博爱县"},{"s":"武陟县"},{"s":"温县"},{"s":"沁阳市"},{"s":"孟州市"}]},{"n":"濮阳","a":[{"s":"华龙区"},{"s":"清丰县"},{"s":"南乐县"},{"s":"范县"},{"s":"台前县"},{"s":"濮阳县"}]},{"n":"许昌","a":[{"s":"魏都区"},{"s":"许昌县"},{"s":"鄢陵县"},{"s":"襄城县"},{"s":"禹州市"},{"s":"长葛市"}]},{"n":"漯河","a":[{"s":"源汇区"},{"s":"郾城区"},{"s":"召陵区"},{"s":"舞阳县"},{"s":"临颍县"}]},{"n":"三门峡","a":[{"s":"湖滨区"},{"s":"渑池县"},{"s":"陕县"},{"s":"卢氏县"},{"s":"义马市"},{"s":"灵宝市"}]},{"n":"南阳","a":[{"s":"宛城区"},{"s":"卧龙区"},{"s":"南召县"},{"s":"方城县"},{"s":"西峡县"},{"s":"镇平县"},{"s":"内乡县"},{"s":"淅川县"},{"s":"社旗县"},{"s":"唐河县"},{"s":"新野县"},{"s":"桐柏县"},{"s":"邓州市"}]},{"n":"商丘","a":[{"s":"梁园区"},{"s":"睢阳区"},{"s":"民权县"},{"s":"睢县"},{"s":"宁陵县"},{"s":"柘城县"},{"s":"虞城县"},{"s":"夏邑县"},{"s":"永城市"}]},{"n":"信阳","a":[{"s":"浉河区"},{"s":"平桥区"},{"s":"罗山县"},{"s":"光山县"},{"s":"新县"},{"s":"商城县"},{"s":"固始县"},{"s":"潢川县"},{"s":"淮滨县"},{"s":"息县"}]},{"n":"周口","a":[{"s":"川汇区"},{"s":"扶沟县"},{"s":"西华县"},{"s":"商水县"},{"s":"沈丘县"},{"s":"郸城县"},{"s":"淮阳县"},{"s":"太康县"},{"s":"鹿邑县"},{"s":"项城市"}]},{"n":"驻马店","a":[{"s":"驿城区"},{"s":"西平县"},{"s":"上蔡县"},{"s":"平舆县"},{"s":"正阳县"},{"s":"确山县"},{"s":"泌阳县"},{"s":"汝南县"},{"s":"遂平县"},{"s":"新蔡县"}]},{"n":"济源","a":[{"s":"济源"}]}]},{"p":"湖北","c":[{"n":"武汉","a":[{"s":"江岸区"},{"s":"江汉区"},{"s":"硚口区"},{"s":"汉阳区"},{"s":"武昌区"},{"s":"青山区"},{"s":"洪山区"},{"s":"东西湖区"},{"s":"汉南区"},{"s":"蔡甸区"},{"s":"江夏区"},{"s":"黄陂区"},{"s":"新洲区"}]},{"n":"黄石","a":[{"s":"黄石港区"},{"s":"西塞山区"},{"s":"下陆区"},{"s":"铁山区"},{"s":"阳新县"},{"s":"大冶市"}]},{"n":"十堰","a":[{"s":"茅箭区"},{"s":"张湾区"},{"s":"郧县"},{"s":"郧西县"},{"s":"竹山县"},{"s":"竹溪县"},{"s":"房县"},{"s":"丹江口市"}]},{"n":"宜昌","a":[{"s":"西陵区"},{"s":"伍家岗区"},{"s":"点军区"},{"s":"猇亭区"},{"s":"夷陵区"},{"s":"远安县"},{"s":"兴山县"},{"s":"秭归县"},{"s":"长阳土家族自治县"},{"s":"五峰土家族自治县"},{"s":"宜都市"},{"s":"当阳市"},{"s":"枝江市"}]},{"n":"襄樊","a":[{"s":"襄城区"},{"s":"樊城区"},{"s":"襄阳区"},{"s":"南漳县"},{"s":"谷城县"},{"s":"保康县"},{"s":"老河口市"},{"s":"枣阳市"},{"s":"宜城市"}]},{"n":"鄂州","a":[{"s":"梁子湖区"},{"s":"华容区"},{"s":"鄂城区"}]},{"n":"荆门","a":[{"s":"东宝区"},{"s":"掇刀区"},{"s":"京山县"},{"s":"沙洋县"},{"s":"钟祥市"}]},{"n":"孝感","a":[{"s":"孝南区"},{"s":"孝昌县"},{"s":"大悟县"},{"s":"云梦县"},{"s":"应城市"},{"s":"安陆市"},{"s":"汉川市"}]},{"n":"荆州","a":[{"s":"沙市区"},{"s":"荆州区"},{"s":"公安县"},{"s":"监利县"},{"s":"江陵县"},{"s":"石首市"},{"s":"洪湖市"},{"s":"松滋市"}]},{"n":"黄冈","a":[{"s":"黄州区"},{"s":"团风县"},{"s":"红安县"},{"s":"罗田县"},{"s":"英山县"},{"s":"浠水县"},{"s":"蕲春县"},{"s":"黄梅县"},{"s":"麻城市"},{"s":"武穴市"}]},{"n":"咸宁","a":[{"s":"咸安区"},{"s":"嘉鱼县"},{"s":"通城县"},{"s":"崇阳县"},{"s":"通山县"},{"s":"赤壁市"}]},{"n":"随州","a":[{"s":"曾都区"},{"s":"随县"},{"s":"广水市"}]},{"n":"恩施","a":[{"s":"恩施市"},{"s":"利川市"},{"s":"建始县"},{"s":"巴东县"},{"s":"宣恩县"},{"s":"咸丰县"},{"s":"来凤县"},{"s":"鹤峰县"}]},{"n":"仙桃","a":[{"s":"仙桃"}]},{"n":"潜江","a":[{"s":"潜江"}]},{"n":"天门","a":[{"s":"天门"}]},{"n":"神农架","a":[{"s":"神农架"}]}]},{"p":"湖南","c":[{"n":"长沙","a":[{"s":"芙蓉区"},{"s":"天心区"},{"s":"岳麓区"},{"s":"开福区"},{"s":"雨花区"},{"s":"长沙县"},{"s":"望城县"},{"s":"宁乡县"},{"s":"浏阳市"}]},{"n":"株洲","a":[{"s":"荷塘区"},{"s":"芦淞区"},{"s":"石峰区"},{"s":"天元区"},{"s":"株洲县"},{"s":"攸县"},{"s":"茶陵县"},{"s":"炎陵县"},{"s":"醴陵市"}]},{"n":"湘潭","a":[{"s":"雨湖区"},{"s":"岳塘区"},{"s":"湘潭县"},{"s":"湘乡市"},{"s":"韶山市"}]},{"n":"衡阳","a":[{"s":"珠晖区"},{"s":"雁峰区"},{"s":"石鼓区"},{"s":"蒸湘区"},{"s":"南岳区"},{"s":"衡阳县"},{"s":"衡南县"},{"s":"衡山县"},{"s":"衡东县"},{"s":"祁东县"},{"s":"耒阳市"},{"s":"常宁市"}]},{"n":"邵阳","a":[{"s":"双清区"},{"s":"大祥区"},{"s":"北塔区"},{"s":"邵东县"},{"s":"新邵县"},{"s":"邵阳县"},{"s":"隆回县"},{"s":"洞口县"},{"s":"绥宁县"},{"s":"新宁县"},{"s":"城步苗族自治县"},{"s":"武冈市"}]},{"n":"岳阳","a":[{"s":"岳阳楼区"},{"s":"云溪区"},{"s":"君山区"},{"s":"岳阳县"},{"s":"华容县"},{"s":"湘阴县"},{"s":"平江县"},{"s":"汨罗市"},{"s":"临湘市"}]},{"n":"常德","a":[{"s":"武陵区"},{"s":"鼎城区"},{"s":"安乡县"},{"s":"汉寿县"},{"s":"澧县"},{"s":"临澧县"},{"s":"桃源县"},{"s":"石门县"},{"s":"津市市"}]},{"n":"张家界","a":[{"s":"永定区"},{"s":"武陵源区"},{"s":"慈利县"},{"s":"桑植县"}]},{"n":"益阳","a":[{"s":"资阳区"},{"s":"赫山区"},{"s":"南县"},{"s":"桃江县"},{"s":"安化县"},{"s":"沅江市"}]},{"n":"郴州","a":[{"s":"北湖区"},{"s":"苏仙区"},{"s":"桂阳县"},{"s":"宜章县"},{"s":"永兴县"},{"s":"嘉禾县"},{"s":"临武县"},{"s":"汝城县"},{"s":"桂东县"},{"s":"安仁县"},{"s":"资兴市"}]},{"n":"永州","a":[{"s":"零陵区"},{"s":"冷水滩区"},{"s":"祁阳县"},{"s":"东安县"},{"s":"双牌县"},{"s":"道县"},{"s":"江永县"},{"s":"宁远县"},{"s":"蓝山县"},{"s":"新田县"},{"s":"江华瑶族自治县"}]},{"n":"怀化","a":[{"s":"鹤城区"},{"s":"中方县"},{"s":"沅陵县"},{"s":"辰溪县"},{"s":"溆浦县"},{"s":"会同县"},{"s":"麻阳苗族自治县"},{"s":"新晃侗族自治县"},{"s":"芷江侗族自治县"},{"s":"靖州苗族侗族自治县"},{"s":"通道侗族自治县"},{"s":"洪江市"}]},{"n":"娄底","a":[{"s":"娄星区"},{"s":"双峰县"},{"s":"新化县"},{"s":"冷水江市"},{"s":"涟源市"}]},{"n":"湘西","a":[{"s":"吉首市"},{"s":"泸溪县"},{"s":"凤凰县"},{"s":"花垣县"},{"s":"保靖县"},{"s":"古丈县"},{"s":"永顺县"},{"s":"龙山县"}]}]},{"p":"广东","c":[{"n":"广州","a":[{"s":"荔湾区"},{"s":"越秀区"},{"s":"海珠区"},{"s":"天河区"},{"s":"白云区"},{"s":"黄埔区"},{"s":"番禺区"},{"s":"花都区"},{"s":"南沙区"},{"s":"萝岗区"},{"s":"增城市"},{"s":"从化市"}]},{"n":"韶关","a":[{"s":"武江区"},{"s":"浈江区"},{"s":"曲江区"},{"s":"始兴县"},{"s":"仁化县"},{"s":"翁源县"},{"s":"乳源瑶族自治县"},{"s":"新丰县"},{"s":"乐昌市"},{"s":"南雄市"}]},{"n":"深圳","a":[{"s":"罗湖区"},{"s":"福田区"},{"s":"南山区"},{"s":"宝安区"},{"s":"龙岗区"},{"s":"盐田区"}]},{"n":"珠海","a":[{"s":"香洲区"},{"s":"斗门区"},{"s":"金湾区"}]},{"n":"汕头","a":[{"s":"龙湖区"},{"s":"金平区"},{"s":"濠江区"},{"s":"潮阳区"},{"s":"潮南区"},{"s":"澄海区"},{"s":"南澳县"}]},{"n":"佛山","a":[{"s":"禅城区"},{"s":"南海区"},{"s":"顺德区"},{"s":"三水区"},{"s":"高明区"}]},{"n":"江门","a":[{"s":"蓬江区"},{"s":"江海区"},{"s":"新会区"},{"s":"台山市"},{"s":"开平市"},{"s":"鹤山市"},{"s":"恩平市"}]},{"n":"湛江","a":[{"s":"赤坎区"},{"s":"霞山区"},{"s":"坡头区"},{"s":"麻章区"},{"s":"遂溪县"},{"s":"徐闻县"},{"s":"廉江市"},{"s":"雷州市"},{"s":"吴川市"}]},{"n":"茂名","a":[{"s":"茂南区"},{"s":"茂港区"},{"s":"电白县"},{"s":"高州市"},{"s":"化州市"},{"s":"信宜市"}]},{"n":"肇庆","a":[{"s":"端州区"},{"s":"鼎湖区"},{"s":"广宁县"},{"s":"怀集县"},{"s":"封开县"},{"s":"德庆县"},{"s":"高要市"},{"s":"四会市"}]},{"n":"惠州","a":[{"s":"惠城区"},{"s":"惠阳区"},{"s":"博罗县"},{"s":"惠东县"},{"s":"龙门县"}]},{"n":"梅州","a":[{"s":"梅江区"},{"s":"梅县"},{"s":"大埔县"},{"s":"丰顺县"},{"s":"五华县"},{"s":"平远县"},{"s":"蕉岭县"},{"s":"兴宁市"}]},{"n":"汕尾","a":[{"s":"城区"},{"s":"海丰县"},{"s":"陆河县"},{"s":"陆丰市"}]},{"n":"河源","a":[{"s":"源城区"},{"s":"紫金县"},{"s":"龙川县"},{"s":"连平县"},{"s":"和平县"},{"s":"东源县"}]},{"n":"阳江","a":[{"s":"江城区"},{"s":"阳西县"},{"s":"阳东县"},{"s":"阳春市"}]},{"n":"清远","a":[{"s":"清城区"},{"s":"佛冈县"},{"s":"阳山县"},{"s":"连山壮族瑶族自治县"},{"s":"连南瑶族自治县"},{"s":"清新县"},{"s":"英德市"},{"s":"连州市"}]},{"n":"东莞","a":[{"s":"东莞市"}]},{"n":"中山","a":[{"s":"中山市"}]},{"n":"潮州","a":[{"s":"湘桥区"},{"s":"潮安县"},{"s":"饶平县"}]},{"n":"揭阳","a":[{"s":"榕城区"},{"s":"揭东县"},{"s":"揭西县"},{"s":"惠来县"},{"s":"普宁市"}]},{"n":"云浮","a":[{"s":"云城区"},{"s":"新兴县"},{"s":"郁南县"},{"s":"云安县"},{"s":"罗定市"}]}]},{"p":"广西","c":[{"n":"南宁","a":[{"s":"兴宁区"},{"s":"青秀区"},{"s":"江南区"},{"s":"西乡塘区"},{"s":"良庆区"},{"s":"邕宁区"},{"s":"武鸣县"},{"s":"隆安县"},{"s":"马山县"},{"s":"上林县"},{"s":"宾阳县"},{"s":"横县"}]},{"n":"柳州","a":[{"s":"城中区"},{"s":"鱼峰区"},{"s":"柳南区"},{"s":"柳北区"},{"s":"柳江县"},{"s":"柳城县"},{"s":"鹿寨县"},{"s":"融安县"},{"s":"融水苗族自治县"},{"s":"三江侗族自治县"}]},{"n":"桂林","a":[{"s":"秀峰区"},{"s":"叠彩区"},{"s":"象山区"},{"s":"七星区"},{"s":"雁山区"},{"s":"阳朔县"},{"s":"临桂县"},{"s":"灵川县"},{"s":"全州县"},{"s":"兴安县"},{"s":"永福县"},{"s":"灌阳县"},{"s":"龙胜各族自治县"},{"s":"资源县"},{"s":"平乐县"},{"s":"荔蒲县"},{"s":"恭城瑶族自治县"}]},{"n":"梧州","a":[{"s":"万秀区"},{"s":"蝶山区"},{"s":"长洲区"},{"s":"苍梧县"},{"s":"藤县"},{"s":"蒙山县"},{"s":"岑溪市"}]},{"n":"北海","a":[{"s":"海城区"},{"s":"银海区"},{"s":"铁山港区"},{"s":"合浦县"}]},{"n":"防城港","a":[{"s":"港口区"},{"s":"防城区"},{"s":"上思县"},{"s":"东兴市"}]},{"n":"钦州","a":[{"s":"钦南区"},{"s":"钦北区"},{"s":"灵山县"},{"s":"浦北县"}]},{"n":"贵港","a":[{"s":"港北区"},{"s":"港南区"},{"s":"覃塘区"},{"s":"平南县"},{"s":"桂平市"}]},{"n":"玉林","a":[{"s":"玉州区"},{"s":"容县"},{"s":"陆川县"},{"s":"博白县"},{"s":"兴业县"},{"s":"北流市"}]},{"n":"百色","a":[{"s":"右江区"},{"s":"田阳县"},{"s":"田东县"},{"s":"平果县"},{"s":"德保县"},{"s":"靖西县"},{"s":"那坡县"},{"s":"凌云县"},{"s":"乐业县"},{"s":"田林县"},{"s":"西林县"},{"s":"隆林各族自治县"}]},{"n":"贺州","a":[{"s":"八步区"},{"s":"昭平县"},{"s":"钟山县"},{"s":"富川瑶族自治县"}]},{"n":"河池","a":[{"s":"金城江区"},{"s":"南丹县"},{"s":"天峨县"},{"s":"凤山县"},{"s":"东兰县"},{"s":"罗城仫佬族自治县"},{"s":"环江毛南族自治县"},{"s":"巴马瑶族自治县"},{"s":"都安瑶族自治县"},{"s":"大化瑶族自治县"},{"s":"宜州市"}]},{"n":"来宾","a":[{"s":"兴宾区"},{"s":"忻城县"},{"s":"象州县"},{"s":"武宣县"},{"s":"金秀瑶族自治县"},{"s":"合山市"}]},{"n":"崇左","a":[{"s":"江洲区"},{"s":"扶绥县"},{"s":"宁明县"},{"s":"龙州县"},{"s":"大新县"},{"s":"天等县"},{"s":"凭祥市"}]}]},{"p":"海南","c":[{"n":"海口","a":[{"s":"秀英区"},{"s":"龙华区"},{"s":"琼山区"},{"s":"美兰区"}]},{"n":"三亚","a":[{"s":"三亚市"}]},{"n":"五指山","a":[{"s":"五指山"}]},{"n":"琼海","a":[{"s":"琼海"}]},{"n":"儋州","a":[{"s":"儋州"}]},{"n":"文昌","a":[{"s":"文昌"}]},{"n":"万宁","a":[{"s":"万宁"}]},{"n":"东方","a":[{"s":"东方"}]}]},{"p":"重庆","c":[{"n":"万州区"},{"n":"涪陵区"},{"n":"渝中区"},{"n":"大渡口区"},{"n":"江北区"},{"n":"沙坪坝区"},{"n":"九龙坡区"},{"n":"南岸区"},{"n":"北碚区"},{"n":"万盛区"},{"n":"双挢区"},{"n":"渝北区"},{"n":"巴南区"},{"n":"长寿区"},{"n":"綦江县"},{"n":"潼南县"},{"n":"铜梁县"},{"n":"大足县"},{"n":"荣昌县"},{"n":"壁山县"},{"n":"梁平县"},{"n":"城口县"},{"n":"丰都县"},{"n":"垫江县"},{"n":"武隆县"},{"n":"忠县"},{"n":"开县"},{"n":"云阳县"},{"n":"奉节县"},{"n":"巫山县"},{"n":"巫溪县"},{"n":"黔江区"},{"n":"石柱土家族自治县"},{"n":"秀山土家族苗族自治县"},{"n":"酉阳土家族苗族自治县"},{"n":"彭水苗族土家族自治县"},{"n":"江津区"},{"n":"合川区"},{"n":"永川区"},{"n":"南川区"}]},{"p":"四川","c":[{"n":"成都","a":[{"s":"锦江区"},{"s":"青羊区"},{"s":"金牛区"},{"s":"武侯区"},{"s":"成华区"},{"s":"龙泉驿区"},{"s":"青白江区"},{"s":"新都区"},{"s":"温江区"},{"s":"金堂县"},{"s":"双流县"},{"s":"郫县"},{"s":"大邑县"},{"s":"蒲江县"},{"s":"新津县"},{"s":"都江堰市"},{"s":"彭州市"},{"s":"邛崃市"},{"s":"崇州市"}]},{"n":"自贡","a":[{"s":"自流井区"},{"s":"贡井区"},{"s":"大安区"},{"s":"沿滩区"},{"s":"荣县"},{"s":"富顺县"}]},{"n":"攀枝花","a":[{"s":"东区"},{"s":"西区"},{"s":"仁和区"},{"s":"米易县"},{"s":"盐边县"}]},{"n":"泸州","a":[{"s":"江阳区"},{"s":"纳溪区"},{"s":"龙马潭区"},{"s":"泸县"},{"s":"合江县"},{"s":"叙永县"},{"s":"古蔺县"}]},{"n":"德阳","a":[{"s":"旌阳区"},{"s":"中江县"},{"s":"罗江县"},{"s":"广汉市"},{"s":"什邡市"},{"s":"绵竹市"}]},{"n":"绵阳","a":[{"s":"涪城区"},{"s":"游仙区"},{"s":"三台县"},{"s":"盐亭县"},{"s":"安县"},{"s":"梓潼县"},{"s":"北川羌族自治县"},{"s":"平武县"},{"s":"江油市"}]},{"n":"广元","a":[{"s":"利州区"},{"s":"元坝区"},{"s":"朝天区"},{"s":"旺苍县"},{"s":"青川县"},{"s":"剑阁县"},{"s":"苍溪县"}]},{"n":"遂宁","a":[{"s":"船山区"},{"s":">安居区"},{"s":">蓬溪县"},{"s":">射洪县"},{"s":">大英县"}]},{"n":"内江","a":[{"s":"市中区"},{"s":"东兴区"},{"s":"威远县"},{"s":"资中县"},{"s":"隆昌县"}]},{"n":"乐山","a":[{"s":"市中区"},{"s":"沙湾区"},{"s":"五通桥区"},{"s":"金口河区"},{"s":"犍为县"},{"s":"井研县"},{"s":"夹江县"},{"s":"沐川县"},{"s":"峨边彝族自治县"},{"s":"马边彝族自治县"},{"s":"峨眉山市"}]},{"n":"南充","a":[{"s":"顺庆区"},{"s":"高坪区"},{"s":"嘉陵区"},{"s":"南部县"},{"s":"营山县"},{"s":"蓬安县"},{"s":"仪陇县"},{"s":"西充县"},{"s":"阆中市"}]},{"n":"眉山","a":[{"s":"东坡区"},{"s":"仁寿县"},{"s":"彭山县"},{"s":"洪雅县"},{"s":"丹棱县"},{"s":"青神县"}]},{"n":"宜宾","a":[{"s":"翠屏区"},{"s":"宜宾县"},{"s":"南溪县"},{"s":"江安县"},{"s":"长宁县"},{"s":"高县"},{"s":"珙县"},{"s":"筠连县"},{"s":"兴文县"},{"s":"屏山县"}]},{"n":"广安","a":[{"s":"广安区"},{"s":"岳池县"},{"s":"武胜县"},{"s":"邻水县"},{"s":"华蓥市"}]},{"n":"达川","a":[{"s":"通川区"},{"s":"达县"},{"s":"宣汉县"},{"s":"开江县"},{"s":"大竹县"},{"s":"渠县"},{"s":"万源市"}]},{"n":"雅安","a":[{"s":"雨城区"},{"s":"名山县"},{"s":"荥经县"},{"s":"汉源县"},{"s":"石棉县"},{"s":"天全县"},{"s":"芦山县"},{"s":"宝兴县"}]},{"n":"巴中","a":[{"s":"巴州区"},{"s":"通江县"},{"s":"南江县"},{"s":"平昌县"}]},{"n":"资阳","a":[{"s":"雁江区"},{"s":"安岳县"},{"s":"乐至县"},{"s":"简阳市"}]},{"n":"阿坝","a":[{"s":"汶川县"},{"s":"理县"},{"s":"茂县"},{"s":"松潘县"},{"s":"九寨沟县"},{"s":"金川县"},{"s":"小金县"},{"s":"黑水县"},{"s":"马尔康县"},{"s":"壤塘县"},{"s":"阿坝县"},{"s":"若尔盖县"},{"s":"红原县"}]},{"n":"甘孜","a":[{"s":"康定县"},{"s":"泸定县"},{"s":"丹巴县"},{"s":"九龙县"},{"s":"雅江县"},{"s":"道孚县"},{"s":"炉霍县"},{"s":"甘孜县"},{"s":"新龙县"},{"s":"德格县"},{"s":"白玉县"},{"s":"石渠县"},{"s":"色达县"},{"s":"理塘县"},{"s":"巴塘县"},{"s":"乡城县"},{"s":"稻城县"},{"s":"得荣县"}]},{"n":"凉山","a":[{"s":"西昌市"},{"s":"木里藏族自治县"},{"s":"盐源县"},{"s":"德昌县"},{"s":"会理县"},{"s":"会东县"},{"s":"宁南县"},{"s":"普格县"},{"s":"布拖县"},{"s":"金阳县"},{"s":"昭觉县"},{"s":"喜德县"},{"s":"冕宁县"},{"s":"越西县"},{"s":"甘洛县"},{"s":"美姑县"},{"s":"雷波县"}]}]},{"p":"贵州","c":[{"n":"贵阳","a":[{"s":"南明区"},{"s":"云岩区"},{"s":"花溪区"},{"s":"乌当区"},{"s":"白云区"},{"s":"小河区"},{"s":"开阳县"},{"s":"息烽县"},{"s":"修文县"},{"s":"清镇市"}]},{"n":"六盘水","a":[{"s":"钟山区"},{"s":"六枝特区"},{"s":"水城县"},{"s":"盘县"}]},{"n":"遵义","a":[{"s":"红花岗区"},{"s":"汇川区"},{"s":"遵义县"},{"s":"桐梓县"},{"s":"绥阳县"},{"s":"正安县"},{"s":"道真仡佬族苗族自治县"},{"s":"务川仡佬族苗族自治县"},{"s":"凤冈县"},{"s":"湄潭县"},{"s":"余庆县"},{"s":"习水县"},{"s":"赤水市"},{"s":"仁怀市"}]},{"n":"安顺","a":[{"s":"西秀区"},{"s":"平坝县"},{"s":"普定县"},{"s":"镇宁布依族苗族自治县"},{"s":"关岭布依族苗族自治县"},{"s":"紫云苗族布依族自治县"}]},{"n":"铜仁","a":[{"s":"铜仁市"},{"s":"江口县"},{"s":"玉屏侗族自治县"},{"s":"石阡县"},{"s":"思南县"},{"s":"印江土家族苗族自治县"},{"s":"德江县"},{"s":"沿河土家族自治县"},{"s":"松桃苗族自治县"},{"s":"万山特区"}]},{"n":"黔西南","a":[{"s":"兴义市"},{"s":"兴仁县"},{"s":"普安县"},{"s":"晴隆县"},{"s":"贞丰县"},{"s":"望谟县"},{"s":"册亨县"},{"s":"安龙县"}]},{"n":"毕节","a":[{"s":"毕节市"},{"s":"大方县"},{"s":"黔西县"},{"s":"金沙县"},{"s":"织金县"},{"s":"纳雍县"},{"s":"威宁彝族回族苗族自治县"},{"s":"赫章县"}]},{"n":"黔东南","a":[{"s":"凯里市"},{"s":"黄平县"},{"s":"施秉县"},{"s":"三穗县"},{"s":"镇远县"},{"s":"岑巩县"},{"s":"天柱县"},{"s":"锦屏县"},{"s":"剑河县"},{"s":"台江县"},{"s":"黎平县"},{"s":"榕江县"},{"s":"从江县"},{"s":"雷山县"},{"s":"麻江县"},{"s":"丹寨县"}]},{"n":"黔南","a":[{"s":"都匀市"},{"s":"福泉市"},{"s":"荔波县"},{"s":"贵定县"},{"s":"瓮安县"},{"s":"独山县"},{"s":"平塘县"},{"s":"罗甸县"},{"s":"长顺县"},{"s":"龙里县"},{"s":"惠水县"},{"s":"三都水族自治县"}]}]},{"p":"云南","c":[{"n":"昆明","a":[{"s":"五华区"},{"s":"盘龙区"},{"s":"官渡区"},{"s":"西山区"},{"s":"东川区"},{"s":"呈贡县"},{"s":"晋宁县"},{"s":"富民县"},{"s":"宜良县"},{"s":"石林彝族自治县"},{"s":"嵩明县"},{"s":"禄劝彝族苗族自治县"},{"s":"寻甸回族彝族自治县"},{"s":"安宁市"}]},{"n":"曲靖","a":[{"s":"麒麟区"},{"s":"马龙县"},{"s":"陆良县"},{"s":"师宗县"},{"s":"罗平县"},{"s":"富源县"},{"s":"会泽县"},{"s":"沾益县"},{"s":"宣威市"}]},{"n":"玉溪","a":[{"s":"红塔区"},{"s":"江川县"},{"s":"澄江县"},{"s":"通海县"},{"s":"华宁县"},{"s":"易门县"},{"s":"峨山彝族自治县"},{"s":"新平彝族傣族自治县"},{"s":"元江哈尼族彝族傣族自治县"}]},{"n":"保山","a":[{"s":"隆阳区"},{"s":"施甸县"},{"s":"腾冲县"},{"s":"龙陵县"},{"s":"昌宁县"}]},{"n":"昭通","a":[{"s":"昭阳区"},{"s":"鲁甸县"},{"s":"巧家县"},{"s":"盐津县"},{"s":"大关县"},{"s":"永善县"},{"s":"绥江县"},{"s":"镇雄县"},{"s":"彝良县"},{"s":"威信县"},{"s":"水富县"}]},{"n":"丽江","a":[{"s":"古城区"},{"s":"玉龙纳西族自治县"},{"s":"永胜县"},{"s":"华坪县"},{"s":"宁蒗彝族自治县"}]},{"n":"普洱","a":[{"s":"思茅区"},{"s":"宁洱镇"},{"s":"墨江哈尼族自治县"},{"s":"景东彝族自治县"},{"s":"景谷傣族彝族自治县"},{"s":"镇沅彝族哈尼族拉祜族自治县"},{"s":"江城哈尼族彝族自治县"},{"s":"孟连傣族拉祜族佤族自治县"},{"s":"澜沧拉祜族自治县"},{"s":"西盟佤族自治县"}]},{"n":"临沧","a":[{"s":"临翔区"},{"s":"凤庆县"},{"s":"云县"},{"s":"永德县"},{"s":"镇康县"},{"s":"双江拉祜族佤族布朗族傣族自治县"},{"s":"耿马傣族佤族自治县"},{"s":"沧源佤族自治县"}]},{"n":"楚雄","a":[{"s":"楚雄市"},{"s":"双柏县"},{"s":"牟定县"},{"s":"南华县"},{"s":"姚安县"},{"s":"大姚县"},{"s":"永仁县"},{"s":"元谋县"},{"s":"武定县"},{"s":"禄丰县"}]},{"n":"红河","a":[{"s":"个旧市"},{"s":"开远市"},{"s":"蒙自县"},{"s":"屏边苗族自治县"},{"s":"建水县"},{"s":"石屏县"},{"s":"弥勒县"},{"s":"泸西县"},{"s":"元阳县"},{"s":"红河县"},{"s":"金平苗族瑶族傣族自治县"},{"s":"绿春县"},{"s":"河口瑶族自治县"}]},{"n":"文山","a":[{"s":"文山县"},{"s":"砚山县"},{"s":"西畴县"},{"s":"麻栗坡县"},{"s":"马关县"},{"s":"丘北县"},{"s":"广南县"},{"s":"富宁县"}]},{"n":"西双版纳","a":[{"s":"景洪市"},{"s":"勐海县"},{"s":"勐腊县"}]},{"n":"大理","a":[{"s":"大理市"},{"s":"漾濞彝族自治县"},{"s":"祥云县"},{"s":"宾川县"},{"s":"弥渡县"},{"s":"南涧彝族自治县"},{"s":"巍山彝族回族自治县"},{"s":"永平县"},{"s":"云龙县"},{"s":"洱源县"},{"s":"剑川县"},{"s":"鹤庆县"}]},{"n":"德宏","a":[{"s":"瑞丽市"},{"s":"潞西市"},{"s":"梁河县"},{"s":"盈江县"},{"s":"陇川县"}]},{"n":"怒江傈","a":[{"s":"泸水县"},{"s":"福贡县"},{"s":"贡山独龙族怒族自治县"},{"s":"兰坪白族普米族自治县"}]},{"n":"迪庆","a":[{"s":"香格里拉县"},{"s":"德钦县"},{"s":"维西傈僳族自治县"}]}]},{"p":"西藏","c":[{"n":"拉萨","a":[{"s":"城关区"},{"s":"林周县"},{"s":"当雄县"},{"s":"尼木县"},{"s":"曲水县"},{"s":"堆龙德庆县"},{"s":"达孜县"},{"s":"墨竹工卡县"}]},{"n":"昌都","a":[{"s":"昌都县"},{"s":"江达县"},{"s":"贡觉县"},{"s":"类乌齐县"},{"s":"丁青县"},{"s":"察雅县"},{"s":"八宿县"},{"s":"左贡县"},{"s":"芒康县"},{"s":"洛隆县"},{"s":"边坝县"}]},{"n":"山南","a":[{"s":"乃东县"},{"s":"扎囊县"},{"s":"贡嘎县"},{"s":"桑日县"},{"s":"琼结县"},{"s":"曲松县"},{"s":"措美县"},{"s":"洛扎县"},{"s":"加查县"},{"s":"隆子县"},{"s":"错那县"},{"s":"浪卡子县"}]},{"n":"日喀则","a":[{"s":"日喀则市"},{"s":"南木林县"},{"s":"江孜县"},{"s":"定日县"},{"s":"萨迦县"},{"s":"拉孜县"},{"s":"昂仁县"},{"s":"谢通门县"},{"s":"白朗县"},{"s":"仁布县"},{"s":"康马县"},{"s":"定结县"},{"s":"仲巴县"},{"s":"亚东县"},{"s":"吉隆县"},{"s":"聂拉木县"},{"s":"萨嘎县"},{"s":"岗巴县"}]},{"n":"那曲","a":[{"s":"那曲县"},{"s":"嘉黎县"},{"s":"比如县"},{"s":"聂荣县"},{"s":"安多县"},{"s":"申扎县"},{"s":"索县"},{"s":"班戈县"},{"s":"巴青县"},{"s":"尼玛县"}]},{"n":"阿里","a":[{"s":"普兰县"},{"s":"札达县"},{"s":"噶尔县"},{"s":"日土县"},{"s":"革吉县"},{"s":"改则县"},{"s":"措勤县"}]},{"n":"林芝","a":[{"s":"林芝县"},{"s":"工布江达县"},{"s":"米林县"},{"s":"墨脱县"},{"s":"波密县"},{"s":"察隅县"},{"s":"朗县"}]}]},{"p":"陕西","c":[{"n":"西安","a":[{"s":"新城区"},{"s":"碑林区"},{"s":"莲湖区"},{"s":"灞桥区"},{"s":"未央区"},{"s":"雁塔区"},{"s":"阎良区"},{"s":"临潼区"},{"s":"长安区"},{"s":"蓝田县"},{"s":"周至县"},{"s":"户县"},{"s":"高陵县"}]},{"n":"铜川","a":[{"s":"王益区"},{"s":"印台区"},{"s":"耀州区"},{"s":"宜君县"}]},{"n":"宝鸡","a":[{"s":"渭滨区"},{"s":"金台区"},{"s":"陈仓区"},{"s":"凤翔县"},{"s":"岐山县"},{"s":"扶风县"},{"s":"眉县"},{"s":"陇县"},{"s":"千阳县"},{"s":"麟游县"},{"s":"凤县"},{"s":"太白县"}]},{"n":"咸阳","a":[{"s":"秦都区"},{"s":"杨凌区"},{"s":"渭城区"},{"s":"三原县"},{"s":"泾阳县"},{"s":"乾县"},{"s":"礼泉县"},{"s":"永寿县"},{"s":"彬县"},{"s":"长武县"},{"s":"旬邑县"},{"s":"淳化县"},{"s":"武功县"},{"s":"兴平市"}]},{"n":"渭南","a":[{"s":"临渭区"},{"s":"华县"},{"s":"潼关县"},{"s":"大荔县"},{"s":"合阳县"},{"s":"澄城县"},{"s":"蒲城县"},{"s":"白水县"},{"s":"富平县"},{"s":"韩城市"},{"s":"华阴市"}]},{"n":"延安","a":[{"s":"宝塔区"},{"s":"延长县"},{"s":"延川县"},{"s":"子长县"},{"s":"安塞县"},{"s":"志丹县"},{"s":"吴起县"},{"s":"甘泉县"},{"s":"富县"},{"s":"洛川县"},{"s":"宜川县"},{"s":"黄龙县"},{"s":"黄陵县"}]},{"n":"汉中","a":[{"s":"汉台区"},{"s":"南郑县"},{"s":"城固县"},{"s":"洋县"},{"s":"西乡县"},{"s":"勉县"},{"s":"宁强县"},{"s":"略阳县"},{"s":"镇巴县"},{"s":"留坝县"},{"s":"佛坪县"}]},{"n":"榆林","a":[{"s":"榆阳区"},{"s":"神木县"},{"s":"府谷县"},{"s":"横山县"},{"s":"靖边县"},{"s":"定边县"},{"s":"绥德县"},{"s":"米脂县"},{"s":"佳县"},{"s":"吴堡县"},{"s":"清涧县"},{"s":"子洲县"}]},{"n":"安康","a":[{"s":"汉滨区"},{"s":"汉阴县"},{"s":"石泉县"},{"s":"宁陕县"},{"s":"紫阳县"},{"s":"岚皋县"},{"s":"平利县"},{"s":"镇坪县"},{"s":"旬阳县"},{"s":"白河县"}]},{"n":"商洛","a":[{"s":"商州区"},{"s":"洛南县"},{"s":"丹凤县"},{"s":"商南县"},{"s":"山阳县"},{"s":"镇安县"},{"s":"柞水县"}]}]},{"p":"甘肃","c":[{"n":"兰州","a":[{"s":"区(县)"},{"s":"城关区"},{"s":"七里河区"},{"s":"西固区"},{"s":"安宁区"},{"s":"红古区"},{"s":"永登县"},{"s":"皋兰县"},{"s":"榆中县"}]},{"n":"嘉峪关","a":[{"s":"嘉峪关市"}]},{"n":"金昌","a":[{"s":"金川区"},{"s":"永昌县"}]},{"n":"白银","a":[{"s":"白银区"},{"s":"平川区"},{"s":"靖远县"},{"s":"会宁县"},{"s":"景泰县"}]},{"n":"天水","a":[{"s":"秦城区"},{"s":"麦积区"},{"s":"清水县"},{"s":"秦安县"},{"s":"甘谷县"},{"s":"武山县"},{"s":"张家川回族自治县"}]},{"n":"武威","a":[{"s":"凉州区"},{"s":"民勤县"},{"s":"古浪县"},{"s":"天祝藏族自治县"}]},{"n":"张掖","a":[{"s":"甘州区"},{"s":"肃南裕固族自治县"},{"s":"民乐县"},{"s":"临泽县"},{"s":"高台县"},{"s":"山丹县"}]},{"n":"平凉","a":[{"s":"崆峒区"},{"s":"泾川县"},{"s":"灵台县"},{"s":"崇信县"},{"s":"华亭县"},{"s":"庄浪县"},{"s":"静宁县"}]},{"n":"酒泉","a":[{"s":"肃州区"},{"s":"金塔县"},{"s":"瓜州县"},{"s":"肃北蒙古族自治县"},{"s":"阿克塞哈萨克族自治县"},{"s":"玉门市"},{"s":"敦煌市"}]},{"n":"庆阳","a":[{"s":"西峰区"},{"s":"庆城县"},{"s":"环县"},{"s":"华池县"},{"s":"合水县"},{"s":"正宁县"},{"s":"宁县"},{"s":"镇原县"}]},{"n":"定西","a":[{"s":"安定区"},{"s":"通渭县"},{"s":"陇西县"},{"s":"渭源县"},{"s":"临洮县"},{"s":"漳县"},{"s":"岷县"}]},{"n":"陇南","a":[{"s":"武都区"},{"s":"成县"},{"s":"文县"},{"s":"宕昌县"},{"s":"康县"},{"s":"西和县"},{"s":"礼县"},{"s":"徽县"},{"s":"两当县"}]},{"n":"临夏","a":[{"s":"临夏市"},{"s":"临夏县"},{"s":"康乐县"},{"s":"永靖县"},{"s":"广河县"},{"s":"和政县"},{"s":"东乡族自治县"},{"s":"积石山保安族东乡族撒拉族自治县"}]},{"n":"甘南","a":[{"s":"合作市"},{"s":"临潭县"},{"s":"卓尼县"},{"s":"舟曲县"},{"s":"迭部县"},{"s":"玛曲县"},{"s":"碌曲县"},{"s":"夏河县"}]}]},{"p":"青海","c":[{"n":"西宁","a":[{"s":"城东区"},{"s":"城中区"},{"s":"城西区"},{"s":"城北区"},{"s":"大通回族土族自治县"},{"s":"湟中县"},{"s":"湟源县"}]},{"n":"海东","a":[{"s":"平安县"},{"s":"民和回族土族自治县"},{"s":"乐都县"},{"s":"互助土族自治县"},{"s":"化隆回族自治县"},{"s":"循化撒拉族自治县"}]},{"n":"海北","a":[{"s":"门源回族自治县"},{"s":"祁连县"},{"s":"海晏县"},{"s":"刚察县"}]},{"n":"黄南","a":[{"s":"同仁县"},{"s":"尖扎县"},{"s":"泽库县"},{"s":"河南蒙古族自治县"}]},{"n":"海南","a":[{"s":"共和县"},{"s":"同德县"},{"s":"贵德县"},{"s":"兴海县"},{"s":"贵南县"}]},{"n":"果洛","a":[{"s":"玛沁县"},{"s":"班玛县"},{"s":"甘德县"},{"s":"达日县"},{"s":"久治县"},{"s":"玛多县"}]},{"n":"玉树","a":[{"s":"玉树县"},{"s":"杂多县"},{"s":"称多县"},{"s":"治多县"},{"s":"囊谦县"},{"s":"曲麻莱县"}]},{"n":"梅西","a":[{"s":"格尔木市"},{"s":"德令哈市"},{"s":"乌兰县"},{"s":"都兰县"},{"s":"天峻县"}]}]},{"p":"宁夏","c":[{"n":"银川","a":[{"s":"兴庆区"},{"s":"西夏区"},{"s":"金凤区"},{"s":"永宁县"},{"s":"贺兰县"},{"s":"灵武市"}]},{"n":"石嘴山","a":[{"s":"大武口区"},{"s":"惠农区"},{"s":"平罗县"}]},{"n":"吴忠","a":[{"s":"利通区"},{"s":"红寺堡区"},{"s":"盐池县"},{"s":"同心县"},{"s":"青铜峡市"}]},{"n":"固原","a":[{"s":"原州区"},{"s":"西吉县"},{"s":"隆德县"},{"s":"泾源县"},{"s":"彭阳县"}]},{"n":"中卫","a":[{"s":"沙坡头区"},{"s":"中宁县"},{"s":"海原县"}]}]},{"p":"新疆","c":[{"n":"乌鲁木齐","a":[{"s":"天山区"},{"s":"沙依巴克区"},{"s":"新市区"},{"s":"水磨沟区"},{"s":"头屯河区"},{"s":"达坂城区"},{"s":"米东区"},{"s":"乌鲁木齐县"}]},{"n":"克拉玛依","a":[{"s":"独山子区"},{"s":"克拉玛依区"},{"s":"白碱滩区"},{"s":"乌尔禾区"}]},{"n":"吐鲁番","a":[{"s":"吐鲁番市"},{"s":"鄯善县"},{"s":"托克逊县"}]},{"n":"哈密","a":[{"s":"哈密市"},{"s":"巴里坤哈萨克自治县"},{"s":"伊吾县"}]},{"n":"昌吉","a":[{"s":"昌吉市"},{"s":"阜康市"},{"s":"呼图壁县"},{"s":"玛纳斯县"},{"s":"奇台县"},{"s":"吉木萨尔县"},{"s":"木垒哈萨克自治县"}]},{"n":"博尔塔拉","a":[{"s":"博乐市"},{"s":"精河县"},{"s":"温泉县"}]},{"n":"巴音郭楞","a":[{"s":"库尔勒市"},{"s":"轮台县"},{"s":"尉犁县"},{"s":"若羌县"},{"s":"且末县"},{"s":"焉耆回族自治县"},{"s":"和静县"},{"s":"和硕县"},{"s":"博湖县"}]},{"n":"阿克苏","a":[{"s":"阿克苏市"},{"s":"温宿县"},{"s":"库车县"},{"s":"沙雅县"},{"s":"新和县"},{"s":"拜城县"},{"s":"乌什县"},{"s":"阿瓦提县"},{"s":"柯坪县"}]},{"n":"克孜勒苏","a":[{"s":"阿图什市"},{"s":"阿克陶县"},{"s":"阿合奇县"},{"s":"乌恰县"}]},{"n":"喀什","a":[{"s":"喀什市"},{"s":"疏附县"},{"s":"疏勒县"},{"s":"英吉沙县"},{"s":"泽普县"},{"s":"莎车县"},{"s":"叶城县"},{"s":"麦盖提县"},{"s":"岳普湖县"},{"s":"伽师县"},{"s":"巴楚县"},{"s":"塔什库尔干县塔吉克自治"}]},{"n":"和田","a":[{"s":"和田市"},{"s":"和田县"},{"s":"墨玉县"},{"s":"皮山县"},{"s":"洛浦县"},{"s":"策勒县"},{"s":"于田县"},{"s":"民丰县"}]},{"n":"伊犁","a":[{"s":"伊宁市"},{"s":"奎屯市"},{"s":"伊宁县"},{"s":"察布查尔锡伯自治县"},{"s":"霍城县"},{"s":"巩留县"},{"s":"新源县"},{"s":"昭苏县"},{"s":"特克斯县"},{"s":"尼勒克县"}]},{"n":"塔城","a":[{"s":"塔城市"},{"s":"乌苏市"},{"s":"额敏县"},{"s":"沙湾县"},{"s":"托里县"},{"s":"裕民县"},{"s":"和布克赛尔蒙古自治县"}]},{"n":"阿勒泰","a":[{"s":"阿勒泰市"},{"s":"布尔津县"},{"s":"富蕴县"},{"s":"福海县"},{"s":"哈巴河县"},{"s":"青河县"},{"s":"吉木乃县"}]},{"n":"石河子","a":[{"s":"石河子"}]},{"n":"阿拉尔","a":[{"s":"阿拉尔"}]},{"n":"图木舒克","a":[{"s":"图木舒克"}]},{"n":"五家渠","a":[{"s":"五家渠"}]}]},{"p":"香港","c":[{"n":"中西区"},{"n":"东区"},{"n":"九龙城区"},{"n":"观塘区"},{"n":"南区"},{"n":"深水区"},{"n":"湾仔区"},{"n":"黄大仙区"},{"n":"油尖旺区"},{"n":"离岛区"},{"n":"葵青区"},{"n":"北区"},{"n":"西贡区"},{"n":"沙田区"},{"n":"屯门区"},{"n":"大埔区"},{"n":"荃湾区"},{"n":"元朗区"}]},{"p":"澳门","c":[{"n":"花地玛堂区"},{"n":"圣安多尼堂区"},{"n":"大堂区"},{"n":"望德堂区"},{"n":"风顺堂区"},{"n":"嘉模堂区"},{"n":"圣方济各堂区"}]},{"p":"台湾","c":[{"n":"台北市"},{"n":"高雄市"},{"n":"基隆市"},{"n":"台中市"},{"n":"台南市"},{"n":"新竹市"},{"n":"嘉义市"},{"n":"台北县"},{"n":"宜兰县"},{"n":"新竹县"},{"n":"桃园县"},{"n":"苗栗县"},{"n":"台中县"},{"n":"彰化县"},{"n":"南投县"},{"n":"嘉义县"},{"n":"云林县"},{"n":"台南县"},{"n":"高雄县"},{"n":"屏东县"},{"n":"台东县"},{"n":"花莲县"},{"n":"澎湖县"}]},{"p":"国外"}]};
	Data = Data.citylist;
	var Select = function(opt){
		var opt = opt || {};
		this.provId = opt.provId;
		this.cityId = opt.cityId;
		if(!this.provId || !this.cityId) return false;
		this.provSelect = null;
		this.citySelect = null;
		this.onProvChange = opt.onProvChange || fn;
		this.onCityChange = opt.onCityChange || fn;
		this.defaults = opt.defaults || Data[0]["p"];
		this.init();
	};
	Select.prototype = {
		init : function(){
			var that = this;
			this.provSelect = $(this.provId);
			this.citySelect = $(this.cityId);
			this.provSelect.on("change",function(e){
				var prov = $(this).val();
				var citys = that.getCitysByProv(prov);
				if(citys) that.buildCitys(citys);
				that.onProvChange(prov);
			})
			this.citySelect.on("change",function(e){
				var city = $(this).val();
				that.onCityChange(city);
			})
			this.buildProvs(this.defaults);
		},
		getCitysByProv : function(prov){
			if(!prov) return false;
			var result = null;
			for(var i in Data){
				var d = Data[i];
				var p = d["p"];
				if(p==prov){
					result = d["c"];
					break;
				}
			}
			return result;
		},
		buildCitys : function(citys){
			if(Object.prototype.toString.call(citys)!=="[object Array]") return false;
			var html = "";
			for(var i in citys){
				var city = citys[i]["n"];
				html += '<option value="'+city+'">'+city+'</option>';
			}
			this.citySelect.html(html);
		},
		buildProvs : function(defaultProv){
			var that = this;
			var html = "";
			for(var i in Data){
				var d = Data[i];
				var p = d["p"];
				var selected = p==defaultProv ? "selected" : "";
				html += '<option value="'+p+'" '+selected+'>'+p+'</option>';
			}
			this.provSelect.html(html);
			setTimeout(function(){
				that.provSelect.trigger("change");
			},10)
		},
	
	};
	module.exports = Select;

/***/ }
/******/ ]);
//# sourceMappingURL=register.all.js.map