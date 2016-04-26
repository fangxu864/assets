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
/******/ 	__webpack_require__.p = "http://static.12301.local/assets/build/local";
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
	__webpack_require__(11);
	var Placeholder = __webpack_require__(13);
	var SlideManager = __webpack_require__(14);
	var VRegister = __webpack_require__(15);
	var VInfo = __webpack_require__(42);
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
			var callback = arguments[1];
			if(typeof callback=="function") callback();
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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-20.
	 */
	var Ajax = __webpack_require__(9);
	var fn = new Function;
	var ERROR = "请求出错，请稍后重试";
	//验证码操作相关
	module.exports = {
		api : "route/?c=Member_Register",
		//获取验证码
		get : function(mobile,opt){
			if(!mobile) return false;
			var opt = opt || {};
			var url = opt.url;
			var api = url ? url : this.api;
			var success = opt.success || fn;
			var fail = opt.fail;
			Ajax(api,{
				params : {
					a : "sendVcode",
					mobile : mobile
				},
				loading : opt.loading,
				complete : opt.complete,
				success : function(res){
					var res = res || {};
					var code = res.code;
					var msg = res.msg || "请求出错，请稍后重试";
					if(code==200){
						success(res);
					}else{
						res["msg"] = res.msg || msg;
						fail ? fail(res) : alert(ERROR);
					}
				},
				timeout : opt.timeout,
				serverError : opt.serverError
			})
		},
		//校验验证码
		check : function(vcode,opt){
			if(!vcode) return false;
			var opt = opt || {};
			var url = opt.url;
			var api = url ? url : this.api;
			var success = opt.success || fn;
			var fail = opt.fail;
			Ajax(api,{
				params : {
					a : "verifyVcode",
					vcode : vcode
				},
				loading : opt.loading,
				complete : opt.complete,
				success : function(res){
					var res = res || {};
					var code = res.code;
					var msg = res.msg || "请求出错，请稍后重试";
					if(code==200){
						success(res);
					}else{
						res["msg"] = res.msg || msg;
						fail ? fail(res) : alert(ERROR);
					}
				},
				timeout : opt.timeout,
				serverError : opt.serverError
			})
		}
	}

/***/ },
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */,
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	var Ajax = __webpack_require__(9);
	var VCode = __webpack_require__(8);
	var URLParseQuery = __webpack_require__(16);
	var Validate = __webpack_require__(10);
	var Dialog = __webpack_require__(1);
	var md5 = __webpack_require__(17); //md5.hex(pwd)   in node_modules/
	var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
	var VRegister = Backbone.View.extend({
		api : "route/index.php?c=Member_Register",
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
			this.vcodeInp = $("#validCodeInp");
			this.regForm = $("#regForm");
			this.regSubmitBtn = $("#regSubmitBtn");
			this.regSubmitBtn_text = this.regSubmitBtn.text();
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
			VCode.get(mobile,{
				loading : function(){ tarBtn.addClass("disable").text("正在获取...")},
				complete : function(){ tarBtn.removeClass("disable").text("获取验证码")},
				success : function(res){
					that.trigger("get.vcode.success",res);
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
			//return this.router.navigate("/step/2",{trigger:true});
			var that = this;
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
			this.check_mobile_exist(function(mobile){
				//如果手机号未被注册过
				that.check_vcode_enable(function(vcode){
					//如果此验证码可用
					that.submit_register();
				})
			})
		},
		//提交注册前-校验该帐号名是否被注册过
		check_mobile_exist : function(callback){
			var that = this;
			var submitBtn = this.regSubmitBtn;
			var mobile = that.mobileInp.val();
			Ajax(this.api,{
				params : {
					a : "chkMobile",
					mobile : mobile
				},
				loading : function(){ submitBtn.text("正在注册...").addClass("disable")},
				complete : function(){ submitBtn.text(that.regSubmitBtn_text).removeClass("disable")},
				success : function(res){
					var res = res || {};
					var code = res.code;
					if(code==200){ //手机号未被注册过
						callback && callback(mobile)
					}else{ //当注册时，使用已使用过的手机号时
						var msg = res.msg || '您的手机已被关联到已有的平台帐号';
						Dialog.open({
							container : {
								header : '注册失败',
								content : [
									'<div style="width:300px;" class="dialogCon" style="margin-left:20px">',
									'<div class="line" style="margin-bottom:10px;">'+msg+'</div>',
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
					}
				}
			})
		},
		//提交注册前-校验验证码是否可用
		check_vcode_enable : function(callback){
			var that = this;
			var submitBtn = this.regSubmitBtn;
			var vcode = that.vcodeInp.val();
			Ajax(this.api,{
				params : {
					a : "verifyVcode",
					vcode : vcode
				},
				loading : function(){ submitBtn.text("正在注册...").addClass("disable")},
				complete : function(){ submitBtn.text(that.regSubmitBtn_text).removeClass("disable")},
				success : function(res){
					var res = res || {};
					var code = res.code;
					if(code==200){
						callback && callback(vcode)
					}else{
						alert(res.msg || AJAX_ERROR_TEXT);
					}
				}
			})
		},
		//提交注册
		submit_register : function(){
			var urlQuery = URLParseQuery();
			var dtype = urlQuery.dtype;
			if(!dtype) return alert("缺省dtype");
			var mobile = this.mobileInp.val();
			var vcode = this.vcodeInp.val();
			var password = md5.hex(this.pwdInp.val());
			Ajax(this.api,{
				type : "post",
				params : {
					a : "memberRegister",
					dtype : dtype,
					mobile : mobile,
					password : password,
					vcode : vcode
				},
				loading : function(){},
				complete : function(){},
				success : function(res){
					var res = res || {};
					var code = res.code;
					if(code==200){
	
					}else{
						alert(res.msg || AJAX_ERROR_TEXT);
					}
				}
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
/* 16 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-20.
	 */
	module.exports = function(url){
		if(!url) url = window.location.search.substr(1);
		var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
		var result = {};
		url.replace(reg,function(){
			var key = arguments[2];
			var val = arguments[3];
			result[key] = val;
		})
		return result;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global) {/**
	 * [js-md5]{@link https://github.com/emn178/js-md5}
	 *
	 * @namespace md5
	 * @version 0.4.0
	 * @author Chen, Yi-Cyuan [emn178@gmail.com]
	 * @copyright Chen, Yi-Cyuan 2014-2016
	 * @license MIT
	 */
	(function (root) {
	  'use strict';
	
	  var NODE_JS = typeof process == 'object' && process.versions && process.versions.node;
	  if (NODE_JS) {
	    root = global;
	  }
	  var COMMON_JS = !root.JS_MD5_TEST && typeof module == 'object' && module.exports;
	  var AMD = "function" == 'function' && __webpack_require__(19);
	  var ARRAY_BUFFER = !root.JS_MD5_TEST && typeof ArrayBuffer != 'undefined';
	  var HEX_CHARS = '0123456789abcdef'.split('');
	  var EXTRA = [128, 32768, 8388608, -2147483648];
	  var SHIFT = [0, 8, 16, 24];
	  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer'];
	
	  var blocks = [], buffer8;
	  if (ARRAY_BUFFER) {
	    var buffer = new ArrayBuffer(68);
	    buffer8 = new Uint8Array(buffer);
	    blocks = new Uint32Array(buffer);
	  }
	
	  /**
	   * @method hex
	   * @memberof md5
	   * @description Output hash as hex string
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {String} Hex string
	   * @example
	   * md5.hex('The quick brown fox jumps over the lazy dog');
	   * // equal to
	   * md5('The quick brown fox jumps over the lazy dog');
	   */
	  /**
	   * @method digest
	   * @memberof md5
	   * @description Output hash as bytes array
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {Array} Bytes array
	   * @example
	   * md5.digest('The quick brown fox jumps over the lazy dog');
	   */
	  /**
	   * @method array
	   * @memberof md5
	   * @description Output hash as bytes array
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {Array} Bytes array
	   * @example
	   * md5.array('The quick brown fox jumps over the lazy dog');
	   */
	  /**
	   * @method arrayBuffer
	   * @memberof md5
	   * @description Output hash as ArrayBuffer
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {ArrayBuffer} ArrayBuffer
	   * @example
	   * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
	   */
	  /**
	   * @method buffer
	   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
	   * @memberof md5
	   * @description Output hash as ArrayBuffer
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {ArrayBuffer} ArrayBuffer
	   * @example
	   * md5.buffer('The quick brown fox jumps over the lazy dog');
	   */
	  var createOutputMethod = function (outputType) {
	    return function (message) {
	      return new Md5(true).update(message)[outputType]();
	    };
	  };
	
	  /**
	   * @method create
	   * @memberof md5
	   * @description Create Md5 object
	   * @returns {Md5} Md5 object.
	   * @example
	   * var hash = md5.create();
	   */
	  /**
	   * @method update
	   * @memberof md5
	   * @description Create and update Md5 object
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {Md5} Md5 object.
	   * @example
	   * var hash = md5.update('The quick brown fox jumps over the lazy dog');
	   * // equal to
	   * var hash = md5.create();
	   * hash.update('The quick brown fox jumps over the lazy dog');
	   */
	  var createMethod = function () {
	    var method = createOutputMethod('hex');
	    if (NODE_JS) {
	      method = nodeWrap(method);
	    }
	    method.create = function () {
	      return new Md5();
	    };
	    method.update = function (message) {
	      return method.create().update(message);
	    };
	    for (var i = 0;i < OUTPUT_TYPES.length;++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createOutputMethod(type);
	    }
	    return method;
	  };
	
	  var nodeWrap = function (method) {
	    var crypto, Buffer;
	    try {
	      if (root.JS_MD5_TEST) {
	        throw 'JS_MD5_TEST';
	      }
	      crypto = __webpack_require__(20);
	      Buffer = __webpack_require__(21).Buffer;
	    } catch (e) {
	      console.log(e);
	      return method;
	    }
	    var nodeMethod = function (message) {
	      if (typeof message == 'string') {
	        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
	      } else if (message.constructor == ArrayBuffer) {
	        message = new Uint8Array(message);
	      } else if (message.length === undefined) {
	        return method(message);
	      }
	      return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
	    };
	    return nodeMethod;
	  };
	
	  /**
	   * Md5 class
	   * @class Md5
	   * @description This is internal class.
	   * @see {@link md5.create}
	   */
	  function Md5(sharedMemory) {
	    if (sharedMemory) {
	      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	      this.blocks = blocks;
	      this.buffer8 = buffer8;
	    } else {
	      if (ARRAY_BUFFER) {
	        var buffer = new ArrayBuffer(68);
	        this.buffer8 = new Uint8Array(buffer);
	        this.blocks = new Uint32Array(buffer);
	      } else {
	        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	      }
	    }
	    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = 0;
	    this.finalized = this.hashed = false;
	    this.first = true;
	  }
	
	  /**
	   * @method update
	   * @memberof Md5
	   * @instance
	   * @description Update hash
	   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	   * @returns {Md5} Md5 object.
	   * @see {@link md5.update}
	   */
	  Md5.prototype.update = function (message) {
	    if (this.finalized) {
	      return;
	    }
	    var notString = typeof(message) != 'string';
	    if (notString && message.constructor == root.ArrayBuffer) {
	      message = new Uint8Array(message);
	    }
	    var code, index = 0, i, length = message.length || 0, blocks = this.blocks;
	    var buffer8 = this.buffer8;
	
	    while (index < length) {
	      if (this.hashed) {
	        this.hashed = false;
	        blocks[0] = blocks[16];
	        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	      }
	
	      if (notString) {
	        if (ARRAY_BUFFER) {
	          for (i = this.start;index < length && i < 64; ++index) {
	            buffer8[i++] = message[index];
	          }
	        } else {
	          for (i = this.start;index < length && i < 64; ++index) {
	            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
	          }
	        }
	      } else {
	        if (ARRAY_BUFFER) {
	          for (i = this.start;index < length && i < 64; ++index) {
	            code = message.charCodeAt(index);
	            if (code < 0x80) {
	              buffer8[i++] = code;
	            } else if (code < 0x800) {
	              buffer8[i++] = 0xc0 | (code >> 6);
	              buffer8[i++] = 0x80 | (code & 0x3f);
	            } else if (code < 0xd800 || code >= 0xe000) {
	              buffer8[i++] = 0xe0 | (code >> 12);
	              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
	              buffer8[i++] = 0x80 | (code & 0x3f);
	            } else {
	              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
	              buffer8[i++] = 0xf0 | (code >> 18);
	              buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
	              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
	              buffer8[i++] = 0x80 | (code & 0x3f);
	            }
	          }
	        } else {
	          for (i = this.start;index < length && i < 64; ++index) {
	            code = message.charCodeAt(index);
	            if (code < 0x80) {
	              blocks[i >> 2] |= code << SHIFT[i++ & 3];
	            } else if (code < 0x800) {
	              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	            } else if (code < 0xd800 || code >= 0xe000) {
	              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	            } else {
	              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
	              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	            }
	          }
	        }
	      }
	      this.lastByteIndex = i;
	      this.bytes += i - this.start;
	      if (i >= 64) {
	        this.start = i - 64;
	        this.hash();
	        this.hashed = true;
	      } else {
	        this.start = i;
	      }
	    }
	    return this;
	  };
	
	  Md5.prototype.finalize = function () {
	    if (this.finalized) {
	      return;
	    }
	    this.finalized = true;
	    var blocks = this.blocks, i = this.lastByteIndex;
	    blocks[i >> 2] |= EXTRA[i & 3];
	    if (i >= 56) {
	      if (!this.hashed) {
	        this.hash();
	      }
	      blocks[0] = blocks[16];
	      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	    }
	    blocks[14] = this.bytes << 3;
	    this.hash();
	  };
	
	  Md5.prototype.hash = function () {
	    var a, b, c, d, bc, da, blocks = this.blocks;
	
	    if (this.first) {
	      a = blocks[0] - 680876937;
	      a = (a << 7 | a >>> 25) - 271733879 << 0;
	      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
	      d = (d << 12 | d >>> 20) + a << 0;
	      c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
	      c = (c << 17 | c >>> 15) + d << 0;
	      b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
	      b = (b << 22 | b >>> 10) + c << 0;
	    } else {
	      a = this.h0;
	      b = this.h1;
	      c = this.h2;
	      d = this.h3;
	      a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
	      a = (a << 7 | a >>> 25) + b << 0;
	      d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
	      d = (d << 12 | d >>> 20) + a << 0;
	      c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
	      c = (c << 17 | c >>> 15) + d << 0;
	      b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
	      b = (b << 22 | b >>> 10) + c << 0;
	    }
	
	    a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
	    a = (a << 7 | a >>> 25) + b << 0;
	    d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
	    d = (d << 12 | d >>> 20) + a << 0;
	    c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
	    c = (c << 17 | c >>> 15) + d << 0;
	    b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
	    b = (b << 22 | b >>> 10) + c << 0;
	    a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
	    a = (a << 7 | a >>> 25) + b << 0;
	    d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
	    d = (d << 12 | d >>> 20) + a << 0;
	    c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
	    c = (c << 17 | c >>> 15) + d << 0;
	    b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
	    b = (b << 22 | b >>> 10) + c << 0;
	    a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
	    a = (a << 7 | a >>> 25) + b << 0;
	    d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
	    d = (d << 12 | d >>> 20) + a << 0;
	    c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
	    c = (c << 17 | c >>> 15) + d << 0;
	    b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
	    b = (b << 22 | b >>> 10) + c << 0;
	    a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
	    a = (a << 5 | a >>> 27) + b << 0;
	    d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
	    d = (d << 9 | d >>> 23) + a << 0;
	    c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
	    c = (c << 14 | c >>> 18) + d << 0;
	    b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
	    b = (b << 20 | b >>> 12) + c << 0;
	    a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
	    a = (a << 5 | a >>> 27) + b << 0;
	    d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
	    d = (d << 9 | d >>> 23) + a << 0;
	    c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
	    c = (c << 14 | c >>> 18) + d << 0;
	    b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
	    b = (b << 20 | b >>> 12) + c << 0;
	    a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
	    a = (a << 5 | a >>> 27) + b << 0;
	    d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
	    d = (d << 9 | d >>> 23) + a << 0;
	    c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
	    c = (c << 14 | c >>> 18) + d << 0;
	    b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
	    b = (b << 20 | b >>> 12) + c << 0;
	    a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
	    a = (a << 5 | a >>> 27) + b << 0;
	    d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
	    d = (d << 9 | d >>> 23) + a << 0;
	    c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
	    c = (c << 14 | c >>> 18) + d << 0;
	    b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
	    b = (b << 20 | b >>> 12) + c << 0;
	    bc = b ^ c;
	    a += (bc ^ d) + blocks[5] - 378558;
	    a = (a << 4 | a >>> 28) + b << 0;
	    d += (bc ^ a) + blocks[8] - 2022574463;
	    d = (d << 11 | d >>> 21) + a << 0;
	    da = d ^ a;
	    c += (da ^ b) + blocks[11] + 1839030562;
	    c = (c << 16 | c >>> 16) + d << 0;
	    b += (da ^ c) + blocks[14] - 35309556;
	    b = (b << 23 | b >>> 9) + c << 0;
	    bc = b ^ c;
	    a += (bc ^ d) + blocks[1] - 1530992060;
	    a = (a << 4 | a >>> 28) + b << 0;
	    d += (bc ^ a) + blocks[4] + 1272893353;
	    d = (d << 11 | d >>> 21) + a << 0;
	    da = d ^ a;
	    c += (da ^ b) + blocks[7] - 155497632;
	    c = (c << 16 | c >>> 16) + d << 0;
	    b += (da ^ c) + blocks[10] - 1094730640;
	    b = (b << 23 | b >>> 9) + c << 0;
	    bc = b ^ c;
	    a += (bc ^ d) + blocks[13] + 681279174;
	    a = (a << 4 | a >>> 28) + b << 0;
	    d += (bc ^ a) + blocks[0] - 358537222;
	    d = (d << 11 | d >>> 21) + a << 0;
	    da = d ^ a;
	    c += (da ^ b) + blocks[3] - 722521979;
	    c = (c << 16 | c >>> 16) + d << 0;
	    b += (da ^ c) + blocks[6] + 76029189;
	    b = (b << 23 | b >>> 9) + c << 0;
	    bc = b ^ c;
	    a += (bc ^ d) + blocks[9] - 640364487;
	    a = (a << 4 | a >>> 28) + b << 0;
	    d += (bc ^ a) + blocks[12] - 421815835;
	    d = (d << 11 | d >>> 21) + a << 0;
	    da = d ^ a;
	    c += (da ^ b) + blocks[15] + 530742520;
	    c = (c << 16 | c >>> 16) + d << 0;
	    b += (da ^ c) + blocks[2] - 995338651;
	    b = (b << 23 | b >>> 9) + c << 0;
	    a += (c ^ (b | ~d)) + blocks[0] - 198630844;
	    a = (a << 6 | a >>> 26) + b << 0;
	    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
	    d = (d << 10 | d >>> 22) + a << 0;
	    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
	    c = (c << 15 | c >>> 17) + d << 0;
	    b += (d ^ (c | ~a)) + blocks[5] - 57434055;
	    b = (b << 21 | b >>> 11) + c << 0;
	    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
	    a = (a << 6 | a >>> 26) + b << 0;
	    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
	    d = (d << 10 | d >>> 22) + a << 0;
	    c += (a ^ (d | ~b)) + blocks[10] - 1051523;
	    c = (c << 15 | c >>> 17) + d << 0;
	    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
	    b = (b << 21 | b >>> 11) + c << 0;
	    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
	    a = (a << 6 | a >>> 26) + b << 0;
	    d += (b ^ (a | ~c)) + blocks[15] - 30611744;
	    d = (d << 10 | d >>> 22) + a << 0;
	    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
	    c = (c << 15 | c >>> 17) + d << 0;
	    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
	    b = (b << 21 | b >>> 11) + c << 0;
	    a += (c ^ (b | ~d)) + blocks[4] - 145523070;
	    a = (a << 6 | a >>> 26) + b << 0;
	    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
	    d = (d << 10 | d >>> 22) + a << 0;
	    c += (a ^ (d | ~b)) + blocks[2] + 718787259;
	    c = (c << 15 | c >>> 17) + d << 0;
	    b += (d ^ (c | ~a)) + blocks[9] - 343485551;
	    b = (b << 21 | b >>> 11) + c << 0;
	
	    if (this.first) {
	      this.h0 = a + 1732584193 << 0;
	      this.h1 = b - 271733879 << 0;
	      this.h2 = c - 1732584194 << 0;
	      this.h3 = d + 271733878 << 0;
	      this.first = false;
	    } else {
	      this.h0 = this.h0 + a << 0;
	      this.h1 = this.h1 + b << 0;
	      this.h2 = this.h2 + c << 0;
	      this.h3 = this.h3 + d << 0;
	    }
	  };
	
	  /**
	   * @method hex
	   * @memberof Md5
	   * @instance
	   * @description Output hash as hex string
	   * @returns {String} Hex string
	   * @see {@link md5.hex}
	   * @example
	   * hash.hex();
	   */
	  Md5.prototype.hex = function () {
	    this.finalize();
	
	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
	
	    return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
	       HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
	       HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
	       HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
	       HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
	       HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
	       HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
	       HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
	       HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
	       HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
	       HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
	       HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
	       HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
	       HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
	       HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
	       HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
	  };
	
	  /**
	   * @method toString
	   * @memberof Md5
	   * @instance
	   * @description Output hash as hex string
	   * @returns {String} Hex string
	   * @see {@link md5.hex}
	   * @example
	   * hash.toString();
	   */
	  Md5.prototype.toString = Md5.prototype.hex;
	
	  /**
	   * @method digest
	   * @memberof Md5
	   * @instance
	   * @description Output hash as bytes array
	   * @returns {Array} Bytes array
	   * @see {@link md5.digest}
	   * @example
	   * hash.digest();
	   */
	  Md5.prototype.digest = function () {
	    this.finalize();
	
	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
	    return [
	      h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
	      h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
	      h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
	      h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
	    ];
	  };
	
	  /**
	   * @method array
	   * @memberof Md5
	   * @instance
	   * @description Output hash as bytes array
	   * @returns {Array} Bytes array
	   * @see {@link md5.array}
	   * @example
	   * hash.array();
	   */
	  Md5.prototype.array = Md5.prototype.digest;
	
	  /**
	   * @method arrayBuffer
	   * @memberof Md5
	   * @instance
	   * @description Output hash as ArrayBuffer
	   * @returns {ArrayBuffer} ArrayBuffer
	   * @see {@link md5.arrayBuffer}
	   * @example
	   * hash.arrayBuffer();
	   */
	  Md5.prototype.arrayBuffer = function () {
	    this.finalize();
	
	    var buffer = new ArrayBuffer(16);
	    var blocks = new Uint32Array(buffer);
	    blocks[0] = this.h0;
	    blocks[1] = this.h1;
	    blocks[2] = this.h2;
	    blocks[3] = this.h3;
	    return buffer;
	  };
	
	  /**
	   * @method buffer
	   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
	   * @memberof Md5
	   * @instance
	   * @description Output hash as ArrayBuffer
	   * @returns {ArrayBuffer} ArrayBuffer
	   * @see {@link md5.buffer}
	   * @example
	   * hash.buffer();
	   */
	  Md5.prototype.buffer = Md5.prototype.arrayBuffer;
	
	  var exports = createMethod();
	
	  if (COMMON_JS) {
	    module.exports = exports;
	  } else {
	    /**
	     * @method md5
	     * @description Md5 hash function, export to global in browsers.
	     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
	     * @returns {String} md5 hashes
	     * @example
	     * md5(''); // d41d8cd98f00b204e9800998ecf8427e
	     * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
	     * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
	     *
	     * // It also supports UTF-8 encoding
	     * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
	     *
	     * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
	     * md5([]); // d41d8cd98f00b204e9800998ecf8427e
	     * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
	     */
	    root.md5 = exports;
	    if (AMD) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return exports;
	      }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	  }
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18), (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var rng = __webpack_require__(25)
	
	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}
	
	exports.createHash = __webpack_require__(27)
	
	exports.createHmac = __webpack_require__(39)
	
	exports.randomBytes = function(size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)))
	    } catch (err) { callback(err) }
	  } else {
	    return new Buffer(rng(size))
	  }
	}
	
	function each(a, f) {
	  for(var i in a)
	    f(a[i], i)
	}
	
	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160']
	}
	
	var p = __webpack_require__(40)(exports)
	exports.pbkdf2 = p.pbkdf2
	exports.pbkdf2Sync = p.pbkdf2Sync
	
	
	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials'
	, 'createCipher'
	, 'createCipheriv'
	, 'createDecipher'
	, 'createDecipheriv'
	, 'createSign'
	, 'createVerify'
	, 'createDiffieHellman'
	], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet')
	  }
	})
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(22)
	var ieee754 = __webpack_require__(23)
	var isArray = __webpack_require__(24)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer, (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 23 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {(function() {
	  var g = ('undefined' === typeof window ? global : window) || {}
	  _crypto = (
	    g.crypto || g.msCrypto || __webpack_require__(26)
	  )
	  module.exports = function(size) {
	    // Modern Browsers
	    if(_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */
	    
	      _crypto.getRandomValues(bytes);
	      return bytes;
	    }
	    else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size)
	    }
	    else
	      throw new Error(
	        'secure random number generation not supported by this browser\n'+
	        'use chrome, FireFox or Internet Explorer 11'
	      )
	  }
	}())
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(21).Buffer))

/***/ },
/* 26 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(28)
	
	var md5 = toConstructor(__webpack_require__(36))
	var rmd160 = toConstructor(__webpack_require__(38))
	
	function toConstructor (fn) {
	  return function () {
	    var buffers = []
	    var m= {
	      update: function (data, enc) {
	        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
	        buffers.push(data)
	        return this
	      },
	      digest: function (enc) {
	        var buf = Buffer.concat(buffers)
	        var r = fn(buf)
	        buffers = null
	        return enc ? r.toString(enc) : r
	      }
	    }
	    return m
	  }
	}
	
	module.exports = function (alg) {
	  if('md5' === alg) return new md5()
	  if('rmd160' === alg) return new rmd160()
	  return createHash(alg)
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var exports = module.exports = function (alg) {
	  var Alg = exports[alg]
	  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
	  return new Alg()
	}
	
	var Buffer = __webpack_require__(21).Buffer
	var Hash   = __webpack_require__(29)(Buffer)
	
	exports.sha1 = __webpack_require__(30)(Buffer, Hash)
	exports.sha256 = __webpack_require__(34)(Buffer, Hash)
	exports.sha512 = __webpack_require__(35)(Buffer, Hash)


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function (Buffer) {
	
	  //prototype class for hash functions
	  function Hash (blockSize, finalSize) {
	    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize
	    this._blockSize = blockSize
	    this._len = 0
	    this._s = 0
	  }
	
	  Hash.prototype.init = function () {
	    this._s = 0
	    this._len = 0
	  }
	
	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8"
	      data = new Buffer(data, enc)
	    }
	
	    var l = this._len += data.length
	    var s = this._s = (this._s || 0)
	    var f = 0
	    var buffer = this._block
	
	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
	      var ch = (t - f)
	
	      for (var i = 0; i < ch; i++) {
	        buffer[(s % this._blockSize) + i] = data[i + f]
	      }
	
	      s += ch
	      f += ch
	
	      if ((s % this._blockSize) === 0) {
	        this._update(buffer)
	      }
	    }
	    this._s = s
	
	    return this
	  }
	
	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8
	
	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80
	
	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1)
	
	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block)
	      this._block.fill(0)
	    }
	
	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4)
	
	    var hash = this._update(this._block) || this._hash()
	
	    return enc ? hash.toString(enc) : hash
	  }
	
	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass')
	  }
	
	  return Hash
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */
	
	var inherits = __webpack_require__(31).inherits
	
	module.exports = function (Buffer, Hash) {
	
	  var A = 0|0
	  var B = 4|0
	  var C = 8|0
	  var D = 12|0
	  var E = 16|0
	
	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80)
	
	  var POOL = []
	
	  function Sha1 () {
	    if(POOL.length)
	      return POOL.pop().init()
	
	    if(!(this instanceof Sha1)) return new Sha1()
	    this._w = W
	    Hash.call(this, 16*4, 14*4)
	
	    this._h = null
	    this.init()
	  }
	
	  inherits(Sha1, Hash)
	
	  Sha1.prototype.init = function () {
	    this._a = 0x67452301
	    this._b = 0xefcdab89
	    this._c = 0x98badcfe
	    this._d = 0x10325476
	    this._e = 0xc3d2e1f0
	
	    Hash.prototype.init.call(this)
	    return this
	  }
	
	  Sha1.prototype._POOL = POOL
	  Sha1.prototype._update = function (X) {
	
	    var a, b, c, d, e, _a, _b, _c, _d, _e
	
	    a = _a = this._a
	    b = _b = this._b
	    c = _c = this._c
	    d = _d = this._d
	    e = _e = this._e
	
	    var w = this._w
	
	    for(var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j*4)
	        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)
	
	      var t = add(
	        add(rol(a, 5), sha1_ft(j, b, c, d)),
	        add(add(e, W), sha1_kt(j))
	      )
	
	      e = d
	      d = c
	      c = rol(b, 30)
	      b = a
	      a = t
	    }
	
	    this._a = add(a, _a)
	    this._b = add(b, _b)
	    this._c = add(c, _c)
	    this._d = add(d, _d)
	    this._e = add(e, _e)
	  }
	
	  Sha1.prototype._hash = function () {
	    if(POOL.length < 100) POOL.push(this)
	    var H = new Buffer(20)
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a|0, A)
	    H.writeInt32BE(this._b|0, B)
	    H.writeInt32BE(this._c|0, C)
	    H.writeInt32BE(this._d|0, D)
	    H.writeInt32BE(this._e|0, E)
	    return H
	  }
	
	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if(t < 20) return (b & c) | ((~b) & d);
	    if(t < 40) return b ^ c ^ d;
	    if(t < 60) return (b & c) | (b & d) | (c & d);
	    return b ^ c ^ d;
	  }
	
	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	           (t < 60) ? -1894007588 : -899497514;
	  }
	
	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return (x + y ) | 0
	  //lets see how this goes on testling.
	  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  //  return (msw << 16) | (lsw & 0xFFFF);
	  }
	
	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt));
	  }
	
	  return Sha1
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(32);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(33);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(18)))

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 33 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */
	
	var inherits = __webpack_require__(31).inherits
	
	module.exports = function (Buffer, Hash) {
	
	  var K = [
	      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	    ]
	
	  var W = new Array(64)
	
	  function Sha256() {
	    this.init()
	
	    this._w = W //new Array(64)
	
	    Hash.call(this, 16*4, 14*4)
	  }
	
	  inherits(Sha256, Hash)
	
	  Sha256.prototype.init = function () {
	
	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0
	
	    this._len = this._s = 0
	
	    return this
	  }
	
	  function S (X, n) {
	    return (X >>> n) | (X << (32 - n));
	  }
	
	  function R (X, n) {
	    return (X >>> n);
	  }
	
	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }
	
	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }
	
	  function Sigma0256 (x) {
	    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	  }
	
	  function Sigma1256 (x) {
	    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	  }
	
	  function Gamma0256 (x) {
	    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	  }
	
	  function Gamma1256 (x) {
	    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	  }
	
	  Sha256.prototype._update = function(M) {
	
	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var T1, T2
	
	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0
	
	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16
	        ? M.readInt32BE(j * 4)
	        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]
	
	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w
	
	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
	    }
	
	    this._a = (a + this._a) | 0
	    this._b = (b + this._b) | 0
	    this._c = (c + this._c) | 0
	    this._d = (d + this._d) | 0
	    this._e = (e + this._e) | 0
	    this._f = (f + this._f) | 0
	    this._g = (g + this._g) | 0
	    this._h = (h + this._h) | 0
	
	  };
	
	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32)
	
	    H.writeInt32BE(this._a,  0)
	    H.writeInt32BE(this._b,  4)
	    H.writeInt32BE(this._c,  8)
	    H.writeInt32BE(this._d, 12)
	    H.writeInt32BE(this._e, 16)
	    H.writeInt32BE(this._f, 20)
	    H.writeInt32BE(this._g, 24)
	    H.writeInt32BE(this._h, 28)
	
	    return H
	  }
	
	  return Sha256
	
	}


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(31).inherits
	
	module.exports = function (Buffer, Hash) {
	  var K = [
	    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	  ]
	
	  var W = new Array(160)
	
	  function Sha512() {
	    this.init()
	    this._w = W
	
	    Hash.call(this, 128, 112)
	  }
	
	  inherits(Sha512, Hash)
	
	  Sha512.prototype.init = function () {
	
	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0
	
	    this._al = 0xf3bcc908|0
	    this._bl = 0x84caa73b|0
	    this._cl = 0xfe94f82b|0
	    this._dl = 0x5f1d36f1|0
	    this._el = 0xade682d1|0
	    this._fl = 0x2b3e6c1f|0
	    this._gl = 0xfb41bd6b|0
	    this._hl = 0x137e2179|0
	
	    this._len = this._s = 0
	
	    return this
	  }
	
	  function S (X, Xl, n) {
	    return (X >>> n) | (Xl << (32 - n))
	  }
	
	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }
	
	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }
	
	  Sha512.prototype._update = function(M) {
	
	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var al, bl, cl, dl, el, fl, gl, hl
	
	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0
	
	    al = this._al | 0
	    bl = this._bl | 0
	    cl = this._cl | 0
	    dl = this._dl | 0
	    el = this._el | 0
	    fl = this._fl | 0
	    gl = this._gl | 0
	    hl = this._hl | 0
	
	    for (var i = 0; i < 80; i++) {
	      var j = i * 2
	
	      var Wi, Wil
	
	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4)
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4)
	
	      } else {
	        var x  = W[j - 15*2]
	        var xl = W[j - 15*2 + 1]
	        var gamma0  = S(x, xl, 1) ^ S(x, xl, 8) ^ (x >>> 7)
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7)
	
	        x  = W[j - 2*2]
	        xl = W[j - 2*2 + 1]
	        var gamma1  = S(x, xl, 19) ^ S(xl, x, 29) ^ (x >>> 6)
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6)
	
	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7  = W[j - 7*2]
	        var Wi7l = W[j - 7*2 + 1]
	
	        var Wi16  = W[j - 16*2]
	        var Wi16l = W[j - 16*2 + 1]
	
	        Wil = gamma0l + Wi7l
	        Wi  = gamma0  + Wi7 + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0)
	        Wil = Wil + gamma1l
	        Wi  = Wi  + gamma1  + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0)
	        Wil = Wil + Wi16l
	        Wi  = Wi  + Wi16 + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0)
	
	        W[j] = Wi
	        W[j + 1] = Wil
	      }
	
	      var maj = Maj(a, b, c)
	      var majl = Maj(al, bl, cl)
	
	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7)
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7)
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9)
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9)
	
	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j]
	      var Kil = K[j + 1]
	
	      var ch = Ch(e, f, g)
	      var chl = Ch(el, fl, gl)
	
	      var t1l = hl + sigma1l
	      var t1 = h + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0)
	      t1l = t1l + chl
	      t1 = t1 + ch + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0)
	      t1l = t1l + Kil
	      t1 = t1 + Ki + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0)
	      t1l = t1l + Wil
	      t1 = t1 + Wi + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0)
	
	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl
	      var t2 = sigma0h + maj + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0)
	
	      h  = g
	      hl = gl
	      g  = f
	      gl = fl
	      f  = e
	      fl = el
	      el = (dl + t1l) | 0
	      e  = (d + t1 + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	      d  = c
	      dl = cl
	      c  = b
	      cl = bl
	      b  = a
	      bl = al
	      al = (t1l + t2l) | 0
	      a  = (t1 + t2 + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0
	    }
	
	    this._al = (this._al + al) | 0
	    this._bl = (this._bl + bl) | 0
	    this._cl = (this._cl + cl) | 0
	    this._dl = (this._dl + dl) | 0
	    this._el = (this._el + el) | 0
	    this._fl = (this._fl + fl) | 0
	    this._gl = (this._gl + gl) | 0
	    this._hl = (this._hl + hl) | 0
	
	    this._a = (this._a + a + ((this._al >>> 0) < (al >>> 0) ? 1 : 0)) | 0
	    this._b = (this._b + b + ((this._bl >>> 0) < (bl >>> 0) ? 1 : 0)) | 0
	    this._c = (this._c + c + ((this._cl >>> 0) < (cl >>> 0) ? 1 : 0)) | 0
	    this._d = (this._d + d + ((this._dl >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	    this._e = (this._e + e + ((this._el >>> 0) < (el >>> 0) ? 1 : 0)) | 0
	    this._f = (this._f + f + ((this._fl >>> 0) < (fl >>> 0) ? 1 : 0)) | 0
	    this._g = (this._g + g + ((this._gl >>> 0) < (gl >>> 0) ? 1 : 0)) | 0
	    this._h = (this._h + h + ((this._hl >>> 0) < (hl >>> 0) ? 1 : 0)) | 0
	  }
	
	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64)
	
	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset)
	      H.writeInt32BE(l, offset + 4)
	    }
	
	    writeInt64BE(this._a, this._al, 0)
	    writeInt64BE(this._b, this._bl, 8)
	    writeInt64BE(this._c, this._cl, 16)
	    writeInt64BE(this._d, this._dl, 24)
	    writeInt64BE(this._e, this._el, 32)
	    writeInt64BE(this._f, this._fl, 40)
	    writeInt64BE(this._g, this._gl, 48)
	    writeInt64BE(this._h, this._hl, 56)
	
	    return H
	  }
	
	  return Sha512
	
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	
	var helpers = __webpack_require__(37);
	
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << ((len) % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;
	
	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;
	
	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	
	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
	
	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
	
	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
	
	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
	
	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);
	
	}
	
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}
	
	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var intSize = 4;
	var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
	var chrsz = 8;
	
	function toArray(buf, bigEndian) {
	  if ((buf.length % intSize) !== 0) {
	    var len = buf.length + (intSize - (buf.length % intSize));
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }
	
	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}
	
	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}
	
	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}
	
	module.exports = { hash: hash };
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	module.exports = ripemd160
	
	
	
	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	
	// Constants table
	var zl = [
	    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
	var zr = [
	    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
	var sl = [
	     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
	var sr = [
	    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];
	
	var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];
	
	var bytesToWords = function (bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << (24 - b % 32);
	  }
	  return words;
	};
	
	var wordsToBytes = function (words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	  }
	  return bytes;
	};
	
	var processBlock = function (H, M, offset) {
	
	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];
	
	    // Swap
	    M[offset_i] = (
	        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	    );
	  }
	
	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;
	
	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = (al +  M[offset+zl[i]])|0;
	    if (i<16){
	        t +=  f1(bl,cl,dl) + hl[0];
	    } else if (i<32) {
	        t +=  f2(bl,cl,dl) + hl[1];
	    } else if (i<48) {
	        t +=  f3(bl,cl,dl) + hl[2];
	    } else if (i<64) {
	        t +=  f4(bl,cl,dl) + hl[3];
	    } else {// if (i<80) {
	        t +=  f5(bl,cl,dl) + hl[4];
	    }
	    t = t|0;
	    t =  rotl(t,sl[i]);
	    t = (t+el)|0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;
	
	    t = (ar + M[offset+zr[i]])|0;
	    if (i<16){
	        t +=  f5(br,cr,dr) + hr[0];
	    } else if (i<32) {
	        t +=  f4(br,cr,dr) + hr[1];
	    } else if (i<48) {
	        t +=  f3(br,cr,dr) + hr[2];
	    } else if (i<64) {
	        t +=  f2(br,cr,dr) + hr[3];
	    } else {// if (i<80) {
	        t +=  f1(br,cr,dr) + hr[4];
	    }
	    t = t|0;
	    t =  rotl(t,sr[i]) ;
	    t = (t+er)|0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t    = (H[1] + cl + dr)|0;
	  H[1] = (H[2] + dl + er)|0;
	  H[2] = (H[3] + el + ar)|0;
	  H[3] = (H[4] + al + br)|0;
	  H[4] = (H[0] + bl + cr)|0;
	  H[0] =  t;
	};
	
	function f1(x, y, z) {
	  return ((x) ^ (y) ^ (z));
	}
	
	function f2(x, y, z) {
	  return (((x)&(y)) | ((~x)&(z)));
	}
	
	function f3(x, y, z) {
	  return (((x) | (~(y))) ^ (z));
	}
	
	function f4(x, y, z) {
	  return (((x) & (z)) | ((y)&(~(z))));
	}
	
	function f5(x, y, z) {
	  return ((x) ^ ((y) |(~(z))));
	}
	
	function rotl(x,n) {
	  return (x<<n) | (x>>>(32-n));
	}
	
	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
	
	  if (typeof message == 'string')
	    message = new Buffer(message, 'utf8');
	
	  var m = bytesToWords(message);
	
	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;
	
	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	  );
	
	  for (var i=0 ; i<m.length; i += 16) {
	    processBlock(H, m, i);
	  }
	
	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	      // Shortcut
	    var H_i = H[i];
	
	    // Swap
	    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	  }
	
	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(27)
	
	var zeroBuffer = new Buffer(128)
	zeroBuffer.fill(0)
	
	module.exports = Hmac
	
	function Hmac (alg, key) {
	  if(!(this instanceof Hmac)) return new Hmac(alg, key)
	  this._opad = opad
	  this._alg = alg
	
	  var blocksize = (alg === 'sha512') ? 128 : 64
	
	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key
	
	  if(key.length > blocksize) {
	    key = createHash(alg).update(key).digest()
	  } else if(key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize)
	  }
	
	  var ipad = this._ipad = new Buffer(blocksize)
	  var opad = this._opad = new Buffer(blocksize)
	
	  for(var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36
	    opad[i] = key[i] ^ 0x5C
	  }
	
	  this._hash = createHash(alg).update(ipad)
	}
	
	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc)
	  return this
	}
	
	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest()
	  return createHash(this._alg).update(this._opad).update(h).digest(enc)
	}
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var pbkdf2Export = __webpack_require__(41)
	
	module.exports = function (crypto, exports) {
	  exports = exports || {}
	
	  var exported = pbkdf2Export(crypto)
	
	  exports.pbkdf2 = exported.pbkdf2
	  exports.pbkdf2Sync = exported.pbkdf2Sync
	
	  return exports
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function(crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest
	      digest = undefined
	    }
	
	    if ('function' !== typeof callback)
	      throw new Error('No callback provided to pbkdf2')
	
	    setTimeout(function() {
	      var result
	
	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest)
	      } catch (e) {
	        return callback(e)
	      }
	
	      callback(undefined, result)
	    })
	  }
	
	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations)
	      throw new TypeError('Iterations not a number')
	
	    if (iterations < 0)
	      throw new TypeError('Bad iterations')
	
	    if ('number' !== typeof keylen)
	      throw new TypeError('Key length not a number')
	
	    if (keylen < 0)
	      throw new TypeError('Bad key length')
	
	    digest = digest || 'sha1'
	
	    if (!Buffer.isBuffer(password)) password = new Buffer(password)
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)
	
	    var hLen, l = 1, r, T
	    var DK = new Buffer(keylen)
	    var block1 = new Buffer(salt.length + 4)
	    salt.copy(block1, 0, 0, salt.length)
	
	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length)
	
	      var U = crypto.createHmac(digest, password).update(block1).digest()
	
	      if (!hLen) {
	        hLen = U.length
	        T = new Buffer(hLen)
	        l = Math.ceil(keylen / hLen)
	        r = keylen - (l - 1) * hLen
	
	        if (keylen > (Math.pow(2, 32) - 1) * hLen)
	          throw new TypeError('keylen exceeds maximum length')
	      }
	
	      U.copy(T, 0, 0, hLen)
	
	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest()
	
	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k]
	        }
	      }
	
	      var destPos = (i - 1) * hLen
	      var len = (i == l ? r : hLen)
	      T.copy(DK, destPos, 0, len)
	    }
	
	    return DK
	  }
	
	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-15.
	 */
	var CitySelect = __webpack_require__(43);
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
/* 43 */
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