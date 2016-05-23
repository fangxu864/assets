/**
 * Created by huangzhi on 2015/5/18.
 */

;(function(){


//所有类的基类
var Class = function () { };

//基类增加一个extend方法
Class.extend = function (prop) {
	var _super = this.prototype;
	//父类的实例赋给变量prototype
	var prototype = new this();
	//把要扩展的属性复制到prototype变量上
	for (var name in prop) {
		//下面代码是让ctor里可以直接访问使用this._super访问父类构造函数，除了ctor的其他方法，this._super都是访问父类的实例
		prototype[name] = name == "ctor" && typeof prop[name] == "function" &&
		typeof _super[name] == "function" ?
			(function (name, fn) {
				return function () {
					//备份一下this._super
					var tmp = this._super;
					//替换成父类的同名ctor方法
					this._super = _super[name];
					//执行，此时fn中的this里面的this._super已经换成了_super[name],即父类的同名方法
					var ret = fn.apply(this, arguments);
					//把备份的还原回去
					this._super = tmp;
					return ret;
				};
			})(name, prop[name]) :
			prop[name];
	}

	//假的构造函数
	function Class() {
		//执行真正的ctor构造函数
		this.ctor.apply(this, arguments);
	}

	//继承父类的静态属性
	for (var key in this) {
		if (this.hasOwnProperty(key) && key != "extend")
			Class[key] = this[key];
	}

	// 子类的原型指向父类的实例
	Class.prototype = prototype;

	//这里一定要用new this
	//不能Class.prototype._super = prototype;（这里明显错误，prototype这时已经被copy进去了新的属性）
	//或者Class.prototype._super = _super;（这里会导致_super instanceof 不准确 ）
	Class.prototype._super = new this();

	//覆盖父类的静态属性
	if (prop.statics) {
		for (var name in prop.statics) {
			if (prop.statics.hasOwnProperty(name)) {
				Class[name] = prop.statics[name];
				if (name == "ctor") {
					Class[name]();
				}
			}
		}
	}

	Class.prototype.constructor = Class;

	//原型可扩展
	Class.extendPrototype = function (prop) {
		for (var name in prop) {
			prototype[name] = prop[name];
		}
	};

	//任何Class.extend的返回对象都将具备extend方法
	Class.extend = arguments.callee;

	return Class;
};
var Obser = (function(){
	var _indexOf = function(array,item){
		if (array === null) return -1;
		var i = 0, length = array.length;
		for (; i < length; i++) if (array[i] === item) return i;
		return -1;
	};
	var Obser = {
		ctor : function(){},
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


var Base = Class.extend(Obser);


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
	ctor : function(config){
		var that = this;
		//this._super(config);
		config = config || {};
		this._config = config;
		this.init(this._config);
		this.container = this.container || (config.container || $("body"));
		var container = this.container;
		var events = this.EVENTS || {};
		var event,eventType,fn,selector,elem;
		for(eventType in events){
			event = events[eventType];
			for(selector in event){
				(function(selector,event){
					container.on(eventType,selector,function(e){
						fn = that[event[selector]];
						(typeof fn=="function") && fn.call(null,that,e);
					})
				})(selector,event);
			}
		}

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
});

window["RichBase"] = RichBase;

})();