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
		fixed = moveElem.style.position === 'fixed',
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