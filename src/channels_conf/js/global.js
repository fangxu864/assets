/**
 * Created by Administrator on 2015/2/6.
 */
var PFT_GLOBAL = {
	EMPTY_FN : new Function()
};
/**
 * 通用配置
 * @type {{}}
 */
PFT_GLOBAL.CONFIG = {
	AJAX_TIMEOUT : 10 * 1000,
	DEFAULT_IMG : "http://www.12301.cc/images/defaultThum.jpg",
	LOADING_IMG : "http://www.12301.cc/images/icons/gloading.gif"
};
/**
 * 通用工具函数
 */
PFT_GLOBAL.U = (function(){
	//判断文本框输入数值是否为正整数(0非正非负)
	var isPositiveNum = function(count){
		count = String(count);
		var type="^[0-9]*[1-9][0-9]*$";
		var re = new RegExp(type);
		if(count.match(re) == null){
			return false;
		}
		return true;
	};
	var istiveNum = function(count){
		count = String(count); 
		var type="^[0-9][0-9]*$";
		var re = new RegExp(type);
		if(count.match(re) == null){
			return false;
		}
		return true;
	};
	var pa = function(){
		var paa = false
		$(".pri_input").each(function(){
			var pa = $(this).attr("pa");
			if(pa=="0"){
				paa =paa;
				//console.log("ddd"+pa)
			}else{
				paa = true;

			}
			return paa;
		})
		
	};
	var isNum = function(count){
		//count = String(count); 
		var type="^[0-9.][0-9.]*$";
		var re = new RegExp(type);
		if(count.match(re) == null){
			return false;
		}
		return true;
	};
	var isDnum = function(count){
		var type="^[0-9]+([.][0-9]{1}){0,1}$";   //只允许输入一位小数
		var re = new RegExp(type);
		if(count.match(re) == null){
			return false;
		}
		return true;
	};
	var Delay = (function(){

		function Delay(){
			this.timer = null;
			return this;
		}
		Delay.prototype = {
			set : function(callback,time){
				if(typeof time !== "number") time = 1 * 1000;
				this.clear();
				this.timer = setTimeout(function(){
					callback();
				},time)
			},
			clear : function(){
				clearTimeout(this.timer);
				this.timer = null;
			}
		}
		return Delay;

	})();
	var json = {
		stringify : function(obj){
			//如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
			if(window.JSON) return JSON.stringify(obj);
			var t = typeof (obj);
			if (t != "object" || obj === null) {
				if (t == "string") obj = '"' + obj + '"';
				return String(obj);
			} else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				var self = arguments.callee;
				for (n in obj) {
					v = obj[n];
					t = typeof(v);
					if (obj.hasOwnProperty(n)) {
						if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
							v = self(v);
						json.push((arr ? "" : '"' + n + '":') + String(v));
					}
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		},
		parse : function(jsonString) {
			if (window.JSON) return window.JSON.parse(jsonString);
			return $.parseJSON(jsonString);
		}
	};
	/**
	 * 封装alert
	 * @string type
	 * @string content
	 * @number duration
	 * @function callback
	 * @returns {boolean}
	 * @constructor
	 */
	function Alert(type,content,duration,callback){
		var type  = type || "success";
		var duration = duration || 1 * 1000;
		if(!content) return false;
		var wrap = $("#gTopAlertContainer");
		if(!wrap.length){
			wrap = $('<div id="gTopAlertContainer"></div>');
			var styleTxt = '#gTopAlertContainer{ position:fixed; z-index:1000; left:50%; top:-35px; height:35px; padding:0 30px; line-height:35px; font-size:14px; color:#fff; text-align:center; background:#fff;-webkit-box-shadow:1px 1px 2px rgba(0,0,0,.3);box-shadow:1px 1px 2px rgba(0,0,0,.3);}#gTopAlertContainer p{ width:180px;}#gTopAlertContainer.success{ background:#3eba40}#gTopAlertContainer.fail{ background:#df262a}#gTopAlertContainer.error{ background:#df262a}'
			var style = $('<style type="text/css">'+styleTxt+'</style>');
			$("body").append(wrap);
			$("body").append(style);
		}
		wrap.removeClass("success").removeClass("error").removeClass("fail");
		wrap.addClass(type);
		wrap.html(content);
		setTimeout(function(){
			wrap = $("#gTopAlertContainer");
			var width = wrap.outerWidth(true);
			var height = wrap.outerHeight(true);
			wrap.css({"marginLeft":-width/2,"top":-height-2});
			wrap.animate({top:0},"normal",function(){
				var Delay = new PFT_GLOBAL.U.Delay();
				Delay.set(function(){
					wrap.animate({top:-height-2},"normal",function(){
						callback && callback();
					})
				},duration)
			})
		},0)
	}

	/**
	 * 弹出层
	 */
	var Dialog = (function(){
		var defaults = {
			maskId : "",
			containerId : "",
			closeBtnId : "",
			maskBg : "#000",
			maskOpacity : 0.6
		};
		function Dialog(config){
			this.config = $.extend({},defaults,config || {});
			this.maskId = config.maskId;
			this.containerId = config.containerId;
			this.closeBtnId = config.closeBtnId;
			if(!this.maskId || !this.containerId) console && console.log("缺省maskId或containerId");
			this.maskId = this.maskId.indexOf("#")==0 ? this.maskId : "#"+this.maskId;
			this.containerId = this.containerId.indexOf("#")==0 ? this.containerId : "#"+this.containerId;
			if(this.closeBtnId) this.closeBtnId = this.closeBtnId.indexOf("#")==0 ? this.closeBtnId : "#"+this.closeBtnId;
			this.maskBg = config.maskBg;
			this.maskOpacity = config.maskOpacity;
			this.mask = $(this.maskId);
			this.closeBtn = $(this.closeBtnId);
			this.container = $(this.containerId);
			this.containerH = 0;
			this.clickCallbacks = [];
			this.init();
			return this;
		}
		Dialog.prototype = {
			init : function(){
				var that = this;
				var callbacks = this.clickCallbacks;
				var w = this.container.width();
				var h = this.containerH = this.container.height();
				var sw = $(window).width();
				this.container.css({
					left : (sw-w)/2,
					top : -h
				}).hide();
				this.container.on("click",function(e){
					var target = $(e.target);
					if(target.hasClass("closeBtn")) that.close();
					for(var i in callbacks){
						typeof callbacks[i] == "function" && callbacks[i](e);
					}
					return false;
				})
			},
			open : function(beforeOpen,afterOpen){
				beforeOpen = beforeOpen || function(){};
				afterOpen = afterOpen || function(){};
				var mask = this.mask;
				var container = this.container;
				var maskBg = this.maskBg;
				var maskOpacity = this.maskOpacity;
				var containerH = this.containerH;
				//var screenHeight = $(window).height();
				var screenHeight = window.innerHeight;
				var offset = (screenHeight-containerH)/2;
				beforeOpen();
				mask.css({backgroundColor:maskBg,opacity:maskOpacity}).fadeIn(function(){
					container.show().animate({top:offset},300,function(){
						afterOpen();
					})
				});
				return this;
			},
			close : function(beforeClose,afterClose){
				beforeClose = beforeClose || function(){};
				afterClose = afterClose || function(){};
				var mask = this.mask;
				var container = this.container;
				var containerH = this.containerH;
				beforeClose();
				container.animate({top:-containerH-10},400,function(){
					container.hide();
					afterClose();
				})
				mask.fadeOut();
				return this;
			},
			on : function(type,callback){
				type=="click" && this.clickCallbacks.push(callback);
				return this;
			}
		}
		return Dialog;

	})();

	var Class = (function(){
		var Class = function(){};
		var _mix = function(r,p){
			for(var i in p){
				if(p.hasOwnProperty(i)) r[i] = p[i];
			}
		};
		var _extend = function(){
			this.initProperty = true;
			var prototype = new this();
			this.initProperty = false;
			var items = [].slice.call(arguments);
			var item;
			while(item=items.shift()){
				_mix(prototype,item.prototype || item);
			}
			function SubClass(){
				if(!SubClass.initProperty && this.initialize){
					this.initialize.apply(this,arguments);
				}
			}
			SubClass.prototype = prototype;
			SubClass.prototype.constructor = SubClass;
			SubClass.extend = _extend;
			return SubClass;
		};

		Class.extend = _extend;
		return Class;

	})();

	//观察者
	var Obser = (function(){
		var _indexOf = function(array,item){
			if (array === null) return -1;
			var i = 0, length = array.length;
			for (; i < length; i++) if (array[i] === item) return i;
			return -1;
		};
		var Obser = {
			__getEvent : function(){
				return this.__types;
			},
			on : function(type,listener){
				this.__listeners = this.__listeners || {};
				this.__listeners[type] = this.__listeners[type] || [];
				if((_indexOf(this.__listeners,type)===-1) && (typeof listener==="function")){
					this.__listeners[type].push(listener);
				}
				return this;
			},
			fire : function(type){
				if(!this.__listeners || !this.__listeners[type]) return false;
				var listeners = this.__listeners[type];
				var args = Array.prototype.slice.call(arguments,1);
				this.__types = this.__types || [];
				if((_indexOf(this.__types,type)===-1)) this.__types.push(type);
				for(var i= 0,len=listeners.length; i<len; i++){
					listeners[i].apply(this,args);
				}
				return this;
			},
			off : function(type,listener){
				if(!type && !listener) this.__listeners={};
				if(type && !listener) delete this.__listeners[type];
				this.__types = this.__types || [];
				var tindex = _indexOf(this.__types,type);
				if(tindex>-1) this.__types.splice(tindex,1);
				if(type && listener){
					var listeners = this.__listeners[type];
					var index = _indexOf(listeners,listener);
					(index>-1) && listeners.splice(index,1);
				}
				return this;
			}
		};
		return Obser;
	})();

	//所有组件的基类
	var Base = Class.extend(Obser);

	//富组件基类
	var RichBase = Base.extend({
		EVENTS : {
			//"click" : {
			//	".item a" : function(that,e){
			//		that.onClick(e);
			//	}
			//}
		},
		template : "",
		//此方法不可覆盖
		initialize : function(config){
			var that = this;
			config = config || {};
			this._config = config;
			var container = this.container = config.container || $("body");
			var events = this.EVENTS || {};
			var event,eventType,fn,selector,elem;
			for(eventType in events){
				event = events[eventType];
				for(selector in event){
					(function(selector,event){
						container.on(eventType,selector,function(e){
							fn = event[selector];
							fn.call(null,that,e);
						})
					})(selector,event);
				}
			}
			this.init(this._config);
		},
		parseTemplate:function(str,data){
			/**
			 * http://ejohn.org/blog/javascript-micro-templating/
			 * https://github.com/jashkenas/underscore/blob/0.1.0/underscore.js#L399
			 */
			var fn = new Function('obj',
				'var p=[],print=function(){p.push.apply(p,arguments);};' +
				'with(obj){p.push(\'' + str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") +
				"');}return p.join('');")
			return data ? fn(data) : fn
		},
		get : function(key){
			return this._config[key];
		},
		set : function(key,val){
			this._config[key] = val;
		},
		//专门提供给子类覆盖 用于子类初始化
		init : function(config){}
	})

	//图片加载器
	var ImgLoador = Base.extend({
		initialize : function(opt){
			this.__opt = opt || {};
			var src = this.src = this.__opt.src;
			if(Object.prototype.toString.call(src)!=="[object Array]"){
				this.src = [src];
			}
			return this;
		},
		_load : function(index,src){
			var that = this;
			var img = new Image();
			this.fire("loading",img,src,index);
			img.src = src;
			if(img.complete) this.fire("loaded",img,src,index);
			img.onload = function(){
				that.fire("loaded",img,src,index);
			};
			img.onerror = function(){
				that.fire("error",img,src,index);
			};
			return this;
		},
		load : function(){
			var that = this;
			var srcs = this.src;
			if(!srcs) return false;
			for(var i=0,len=srcs.length; i<len; i++){
				that._load(i,srcs[i]);
			}
			return this;
		}
	});



	return{
		Base : Base,
		RichBase : RichBase,
		Alert : Alert,
		Delay : Delay,
		Dialog : Dialog,
		isPositiveNum : isPositiveNum,
		istiveNum : istiveNum,
		isNum : isNum,
		isDnum : isDnum,
		JSON : json,
		pa : pa,
		ImgLoador : ImgLoador
	}

})();
/**
 * 底层业务逻辑
 */
PFT_GLOBAL.G = (function(){

	/**
	 * 底层ajax请求器
	 * @param config
	 * @param callback
	 * @returns {boolean}
	 * @constructor
	 */
	function Ajax(config,callback){
		var ajax = null;
		var fn = PFT_GLOBAL.EMPTY_FN;
		config = config || {};
		var url = config.url;
		if(!url){
			console && console.log("involed url");
			return false;
		}
        var async = config.async || true;
		var type = config.type || "GET";
		var dataType = config.dataType || "json";
		var data = config.data || {};
		var ttimeout = config.ttimeout || PFT_GLOBAL.CONFIG.AJAX_TIMEOUT;
		var loading = config.loading || fn;
		var removeLoading = config.removeLoading || fn;
		var timeout = config.timeout || fn;
		var serverError = config.serverError || fn;
		var callback = typeof callback == "function" ? callback : fn;
		ajax = $.ajax({
            async: async,
			url : url,
			type : type,
			dataType : dataType,
			timeout : ttimeout,
			data : data,
			beforeSend : function(){ loading()},
			success : function(res){
				removeLoading();
				callback(res);
			},
			error : function(xhr,txt){
				removeLoading();
				if(txt == "timeout"){
					timeout();
				}else{
					serverError();
				}
			}
		})
		return ajax;
	}


	return{
		Ajax : Ajax
	}

})();

(function(){

	var Class = (function(){
		var Class = function(){};
		var _mix = function(r,p){
			for(var i in p){
				if(p.hasOwnProperty(i)) r[i] = p[i];
			}
		};
		var _extend = function(){
			this.initProperty = true;
			var prototype = new this();
			this.initProperty = false;
			var items = [].slice.call(arguments);
			var item;
			while(item=items.shift()){
				_mix(prototype,item.prototype || item);
			}
			function SubClass(){
				if(!SubClass.initProperty && this.initialize){
					this.initialize.apply(this,arguments);
				}
			}
			SubClass.prototype = prototype;
			SubClass.prototype.constructor = SubClass;
			SubClass.extend = _extend;
			return SubClass;
		};

		Class.extend = _extend;
		return Class;

	})();
	//观察者
	var Obser = (function(){
		var _indexOf = function(array,item){
			if (array === null) return -1;
			var i = 0, length = array.length;
			for (; i < length; i++) if (array[i] === item) return i;
			return -1;
		};
		var Obser = {
			on : function(type,listener){
				this.__listeners = this.__listeners || {};
				this.__listeners[type] = this.__listeners[type] || [];
				if((_indexOf(this.__listeners,type)===-1) && (typeof listener==="function")){
					this.__listeners[type].push(listener);
				}
				return this;
			},
			fire : function(type){
				if(!this.__listeners || !this.__listeners[type]) return false;
				var listeners = this.__listeners[type];
				var args = Array.prototype.slice.call(arguments,1);
				this.__types = this.__types || [];
				if((_indexOf(this.__types,type)===-1)) this.__types.push(type);
				for(var i= 0,len=listeners.length; i<len; i++){
					listeners[i].apply(this,args);
				}
				return this;
			},
			off : function(type,listener){
				if(!type && !listener) this.__listeners={};
				if(type && !listener) delete this.__listeners[type];
				this.__types = this.__types || [];
				var tindex = _indexOf(this.__types,type);
				if(tindex>-1) this.__types.splice(tindex,1);
				if(type && listener){
					var listeners = this.__listeners[type];
					var index = _indexOf(listeners,listener);
					(index>-1) && listeners.splice(index,1);
				}
				return this;
			}
		};
		return Obser;
	})();
	//组件基类
	var BaseClass = Class.extend(Obser,{
		template : "",
		//此方法不可覆盖
		initialize : function(config){
			var that = this;
			config = config || {};
			this._config = config;
			this.init(this._config);
		},
		parseTemplate:function(str,data){
			/**
			 * http://ejohn.org/blog/javascript-micro-templating/
			 * https://github.com/jashkenas/underscore/blob/0.1.0/underscore.js#L399
			 */
			var fn = new Function('obj',
				'var p=[],print=function(){p.push.apply(p,arguments);};' +
				'with(obj){p.push(\'' + str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") +
				"');}return p.join('');")
			return data ? fn(data) : fn
		},
		get : function(key){
			return this._config[key];
		},
		set : function(key,val){
			this._config[key] = val;
		},
		//专门提供给子类覆盖 用于子类初始化
		init : function(config){}
	})

	if(!window.BaseClass) window.BaseClass = BaseClass;
	

})();