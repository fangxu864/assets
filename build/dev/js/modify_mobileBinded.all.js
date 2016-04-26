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
/******/ 	__webpack_require__.p = "http://static.12301dev.com/assets/build";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************************************************************!*\
  !*** ./src/register/modify_mobileBinded/modify_mobileBinded.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-18.
	 */
	var Dialog = __webpack_require__(/*! COMMON/modules/easydialog */ 1);
	var tpl = __webpack_require__(/*! ../view/modify_mobileBinded.html */ 7);
	var VCode = __webpack_require__(/*! COMMON/js/util.vcode.js */ 8);
	var Validate = __webpack_require__(/*! COMMON/js/util.validate.js */ 10);
	var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
	var Main = {
		init : function(){
			this.old_mobile = "18305917899";
			this.modifyMobileTrigger = $("#modifyBtn");
			this.bindEvents();
		},
		bindEvents : function(){
			var that = this;
			this.modifyMobileTrigger.on("click",function(e){
				Dialog.open({
					container : {
						header : '修改绑定手机号',
						content : tpl
					},
					offsetY : -160,
					overlay : false,
					events : {
						"focus #modifyDialogBox .textInp" : function(e){
							var tarInp = $(e.currentTarget);
							that.onTextInpFocus(tarInp);
						},
						"click #modifyDialogBox .submitBtn" : function(e){
							that.onSubmitBtnClick(e);
						},
						"click #modifyDialogBox .getVCodeBtn" : function(e){
							that.onGetVCodeBtnClick($(e.target));
						}
					}
				},function(){
					$("#mobileInp_old").val(that.old_mobile);
				})
			})
		},
		getOldMobile : function(){
			return this.old_mobile;
		},
		getNewMobile : function(){
			return $.trim($("#mobileInp_new").val());
		},
		getOldVCode : function(){
			return $.trim($("#vcodeInpOld").val());
		},
		getNewVCode : function(){
			return $.trim($("#vcodeInpNew").val());
		},
		validate_vcode : function(vcode){
			var error = "";
			if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
			return error;
		},
		validate_mobile : function(mobile){
			var error = "";
			if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
			return error;
		},
		onGetVCodeBtnClick : function(tarBtn){
			if(tarBtn.hasClass("disable")) return false;
			var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
			var validate = this.validate_mobile();
			if(validate) return alert(validate);
			VCode.get(mobile,{
				loading : function(){},
				complate : function(){},
				success : function(res){
	
				}
			})
		},
		onTextInpFocus : function(tarInp){
			tarInp.parents(".rt").removeClass("error");
		},
		onSubmitBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
			var vcode = tarBtn.hasClass("old") ? this.getOldVCode() : this.getNewVCode();
			if(tarBtn.hasClass("old")){
				this.checkVCode(vcode,tarBtn,function(vcode){
					var slideContainer = $("#slideContainer");
					slideContainer.animate({left:-slideContainer.children().first().width()},200)
				})
			}else if(tarBtn.hasClass("new")){
				var validate_mobile = this.validate_mobile(mobile);
				var validate_vcode = this.validate_vcode(vcode);
				if(validate_mobile) return alert(validate_mobile);
				if(validate_vcode) return alert(validate_vcode);
	
			}
		},
		checkVCode : function(vcode,tarBtn,callback){
			return callback(vcode);
			var validate = this.validate_vcode(vcode);
			if(validate) return alert(validate);
			VCode.check(vcode,{
				loading : function(){
					tarBtn.addClass("disable");
				},
				complete : function(){
					tarBtn.removeClass("disable");
				},
				success : function(res){
					var res = res || {};
					var code = res.code;
					if(code==200){
						callback && callback(vcode);
					}else{
						alert(res.msg || AJAX_ERROR_TEXT);
					}
				}
			})
		}
	}
	
	$(function(){
		Main.init();
	})

/***/ },
/* 1 */
/*!********************************************!*\
  !*** ./common/modules/easydialog/index.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-18.
	 */
	module.exports = __webpack_require__(/*! ./easydialog.js */ 2);

/***/ },
/* 2 */
/*!*************************************************!*\
  !*** ./common/modules/easydialog/easydialog.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	/** 
	 * easyDialog v2.2
	 * Url : http://stylechen.com/easydialog-v2.0.html
	 * Author : chenmnkken@gmail.com
	 * Date : 2012-04-22
	 */
	__webpack_require__(/*! ./easydialog.css */ 3);
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
/*!**************************************************!*\
  !*** ./common/modules/easydialog/easydialog.css ***!
  \**************************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/*!****************************************************!*\
  !*** ./src/register/view/modify_mobileBinded.html ***!
  \****************************************************/
/***/ function(module, exports) {

	module.exports = "<style type=\"text/css\">\r\n    #modifyDialogBox p{ margin:0; padding:0;}\r\n    #modifyDialogBox{ width:450px; overflow:hidden; padding:20px 0 20px 50px;}\r\n    .modifyDialogBoxCon{ width:100%; overflow:hidden; position:relative;}\r\n    #modifyDialogBox .slideCon{ position:relative; width:1350px; overflow:hidden; list-style:none; padding:0; margin:0;}\r\n    #modifyDialogBox .slideCon .slideItem{ width:450px; float:left; padding:0}\r\n    #modifyDialogBox .slideItem .line{ width:100%; overflow:hidden;}\r\n    #modifyDialogBox .line{ margin-bottom:15px;}\r\n    #modifyDialogBox .line .lt{ float:left; width:80px; margin-top:6px;}\r\n    #modifyDialogBox .line .rt{ float:left;}\r\n    #modifyDialogBox .line .textInp{ width:120px; height:22px; line-height:22px; padding:6px; border:1px solid #e5e5e5; background:#fff;\r\n        box-shadow:inset 0 1px 1px rgba(0,0,0,.055);\r\n        -webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.055);\r\n        -moz-box-shadow:inset 0 1px 1px rgba(0,0,0,.055);\r\n        -o-box-shadow:inset 0 1px 1px rgba(0,0,0,.055);\r\n        -ms-box-shadow:inset 0 1px 1px rgba(0,0,0,.055);\r\n    }\r\n    #modifyDialogBox .line .textInp:focus{ outline:none; color:#f37138}\r\n    #modifyDialogBox .line .submitBtn{ display:block; width:80px; height:30px; line-height:30px; margin-top:20px; text-align:center; color:#fff; background:#008fc2; text-decoration:none}\r\n    #modifyDialogBox .line .submitBtn:hover{ background:#0081af; text-decoration:none}\r\n    #modifyDialogBox .line .submitBtn.disable,#modifyDialogBox .line .submitBtn.disable:hover{ background:#818181; cursor:default}\r\n    #modifyDialogBox .getVCodeBtn{ position:relative; top:1px; padding:4px 6px; background:#008fc2; color:#fff; text-decoration:none}\r\n    #modifyDialogBox .getVCodeBtn:hover{ background:#0081af; text-decoration:none}\r\n    #modifyDialogBox .getVCodeBtn.disable,#modifyDialogBox .getVCodeBtn.disable:hover{ background:#0081af; text-decoration:none}\r\n    #modifyDialogBox .line .rt .tip.error{ display:none}\r\n    #modifyDialogBox .line .rt.error .textInp{ border-color:#e12424; color:#e12424}\r\n    #modifyDialogBox .line .rt.error .tip.error{ display:block; color:#e12424}\r\n    #modifyDialogBox .line.mobile_new .rt.error .tip.error{ display:inline-block;}\r\n</style>\r\n<div id=\"modifyDialogBox\" class=\"modifyDialogBox\">\r\n    <div class=\"modifyDialogBoxCon\">\r\n        <ul id=\"slideContainer\" class=\"slideCon\">\r\n            <li class=\"slideItem slideItem_1 item_1\">\r\n                <div class=\"line clearfix mobile_old\">\r\n                    <div class=\"lt\">旧手机号</div>\r\n                    <div class=\"rt\">\r\n                        <input type=\"text\" name=\"\" readonly style=\"width:180px\" class=\"textInp mobileInp_old\" id=\"mobileInp_old\" placeholder=\"手机号\"/>\r\n                        <span class=\"tip error\">*请输入正确格式手机号</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"line clearfix\">\r\n                    <div class=\"lt\">输入验证码</div>\r\n                    <div class=\"rt\">\r\n                        <input type=\"text\" name=\"\" class=\"textInp vcodeInp vcodeInpOld old\" id=\"vcodeInpOld\" placeholder=\"验证码\"/>\r\n                        <a class=\"getVCodeBtn old getVCode_old\" href=\"javascript:void(0)\">获取验证码</a>\r\n                        <p class=\"tip error\">*请填写6位数验证码</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"line clearfix\">\r\n                    <div class=\"lt\"></div>\r\n                    <div class=\"rt\">\r\n                        <a class=\"submitBtn submitBtnOld old\" href=\"javascript:void(0)\">下一步</a>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n            <li class=\"slideItem slideItem_2 item_2\">\r\n                <div class=\"line clearfix mobile_new\">\r\n                    <div class=\"lt\">新手机号</div>\r\n                    <div class=\"rt\">\r\n                        <input type=\"text\" name=\"\" style=\"width:180px\" class=\"textInp mobileInp_new\" id=\"mobileInp_new\" placeholder=\"手机号\"/>\r\n                        <span class=\"tip error\">*请输入正确格式手机号</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"line clearfix\">\r\n                    <div class=\"lt\">输入验证码</div>\r\n                    <div class=\"rt\">\r\n                        <input type=\"text\" style=\"width:100px;\" name=\"\" class=\"textInp vcodeInp vcodeInpNew new\" id=\"vcodeInpNew\" placeholder=\"验证码\"/>\r\n                        <a class=\"getVCodeBtn new getVCode_new\" href=\"javascript:void(0)\">获取验证码</a>\r\n                        <p class=\"tip error\">*请填写6位数验证码</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"line clearfix\">\r\n                    <div class=\"lt\"></div>\r\n                    <div class=\"rt\">\r\n                        <a class=\"submitBtn submitBtnNew new\" href=\"javascript:void(0)\">下一步</a>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n            <li class=\"slideItem slideItem_3 item_3\">\r\n                <p class=\"line\">修改绑定手机成功！</p>\r\n                <p class=\"line\">你绑定的新号码为：<span id=\"mobile_new\">1333333333</span></p>\r\n                <p class=\"line\"><a id=\"successBtn\" class=\"submitBtn\" href=\"javascript:void(0)\">确定</a></p>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>";

/***/ },
/* 8 */
/*!*********************************!*\
  !*** ./common/js/util.vcode.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-20.
	 */
	var Ajax = __webpack_require__(/*! ./util.ajax.js */ 9);
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
/*!********************************!*\
  !*** ./common/js/util.ajax.js ***!
  \********************************/
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
/*!************************************!*\
  !*** ./common/js/util.validate.js ***!
  \************************************/
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


/***/ }
/******/ ]);
//# sourceMappingURL=modify_mobileBinded.all.js.map