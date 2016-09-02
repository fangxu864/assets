var extend = function(destination,source){
    for(var n in source){
        if(source.hasOwnProperty(n)){
            destination[n]=source[n];
        }
    }
    return destination;
};
var Class = function() {
	var length = arguments.length;
    var option = arguments[length-1];
    var events = option.events || {};
    var container = option.container;
    option.init = option.init || function(){};

	if(length==1){
		var newClass = function() {
            return new newClass.prototype._init(arguments);
        };
        newClass.prototype = option;
        newClass.prototype._init = function(arg){
        	var that = this;
        	if(container){
        		for(var i in events){
        			(function(i){
						var eventType = i.split(" ")[0];
	        			var selector = i.split(" ")[1];
	        			var handler = events[i];
	        			if(typeof handler=="string") handler = that[handler] ? that[handler] : function(){};
	        			if(!handler) return;
	        			handler = handler.bind(that);
	        			if(selector){
	        				container.on(eventType,selector,handler);
	        			}else{
	        				container.on(eventType,handler);
	        			}	
        			})(i)
        		}
        	}
            this.init.apply(this,arg);
        };
        newClass.prototype.constructor = newClass;

        newClass.prototype.on = function(type,handler){
        	if(typeof type!=="string" || typeof handler!=="function") return false;
        	var callbacks = this.__CustomEventCallback__ || (this.__CustomEventCallback__={});
        	var callbackArr = callbacks[type] || (callbacks[type]=[]);
        	callbackArr.push(handler);
        }

        newClass.prototype.trigger = function(type){
        	var that = this;
        	var fns = this.__CustomEventCallback__[type];
        	if(!fns) return false;
        	for(var i in fns){
        		var fn = fns[i];
        		var args = Array.prototype.slice.call(arguments,1);
        		fn.apply(this,args)
        	}
        }
        newClass.prototype._init.prototype = newClass.prototype;

        return newClass;

	}else if(length==2){

		var superClass = arguments[0].extend;
    
        var tempClass = function() {};
        tempClass.prototype = superClass.prototype;

        var subClass = function() {
            return new subClass.prototype._init(arguments);
        }
      
        subClass.superClass = superClass.prototype;
        subClass.callSuper = function(context,func){
            var slice = Array.prototype.slice;
            var a = slice.call(arguments, 2);
            var func = subClass.superClass[func];
       
            if(func){
                func.apply(context, a.concat(slice.call(arguments)));
            }
        };
        subClass.prototype = new tempClass();
        subClass.prototype.constructor = subClass;
        
        extend(subClass.prototype, option);

        subClass.prototype._init = function(args){
            this.init.apply(this, args);
        };
        subClass.prototype._init.prototype = subClass.prototype;

        return subClass;

	}
};

module.exports = Class;