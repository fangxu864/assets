/**
 * Created by Administrator on 15-8-20.
 */
var Drag = RichBase.extend({
	sx : 0,
	sy : 0,
	left : 0,
	top : 0,
	isDrag : false,
	lock_x : false,
	lock_y : false,
	init : function(opt){
		var that = this;
		var container = this.container = opt.container;
		var listUl = container.children();
		var pWidth = container.width();
		var pHeight = container.height();
		var cWidth = listUl.width();
		var cHeight = listUl.height();
		this.initDefaultOpt();
		if(cWidth<=pWidth && cHeight<=pHeight) return false;
		if(cWidth<=pWidth) this.lock_x = true;
		if(cHeight<=pHeight) this.lock_y = true;
		container.on("mousedown",function(e){
			that.onMouseDown(that,e);
		})
		container.on("mousemove",function(e){
			that.onMouseMove(that,e);
		})
		container.on("mouseup",function(e){
			that.onMouseUp(that,e);
		})
	},
	initDefaultOpt : function(){
		this.sx = 0;
		this.sy = 0;
		this.top = 0;
		this.left = 0;
		this.isDrag = false;
		this.lock_x = false;
		this.lock_y = false;
	},
	onMouseDown : function(that,e){
		var ctrlKey = e.ctrlKey;
		var container = that.container;
		if(ctrlKey){
			that.isDrag = true;
			container.css("cursor","move");
		}
		that.sx = e.clientX;
		that.sy = e.clientY;
		that.fire("mousedown",{x:that.sx,y:that.sy,isDrag:that.isDrag});
	},
	onMouseMove : function(that,e){
		var ctrlKey = e.ctrlKey;
		var container = that.container;
		var listUl = container.children(".stageUl");
		var ab_w = Math.abs(listUl.width()-container.width());
		var ab_h = Math.abs(listUl.height()-container.height());
		var sx = that.sx;
		var sy = that.sy;
		var clientX = e.clientX;
		var clientY = e.clientY;
		var disX = clientX-sx;
		var disY = clientY-sy;
		var x = that.left + disX;
		var y = that.top + disY;
		if(x>0){
			x = 0;
		}else if(Math.abs(x)>ab_w){
			x = -ab_w;
		}
		if(y>0){
			y = 0;
		}else if(Math.abs(y)>ab_h){
			y = -ab_h;
		}
		if(ctrlKey && that.isDrag){
			if(that.lock_x){
				listUl.css({top:y});
			}else if(that.lock_y){
				listUl.css({left:x});
			}else{
				listUl.css({left:x, top:y});
			}
			container.css("cursor","move");
		}
		that.fire("mousemove",{
			isDrag:that.isDrag,
			x:x,
			y:y,
			lockX : that.lock_x,
			lockY : that.lock_y,
			disX : disX,
			disY : disY
		});
	},
	onMouseUp : function(that,e){
		var ctrlKey = e.ctrlKey;
		var container = that.container;
		var listUl = container.children(".stageUl");
		var left = listUl.css("left");
		var top = listUl.css("top");
		if(left=="auto" || left=="0") left="0px";
		if(top=="auto" || top=="0") top="0px";
		left = (left.substring(0,left.length-2))*1;
		top = (top.substring(0,top.length-2))*1;
		if(ctrlKey){
			that.isDrag = false;
			container.css("cursor","default");
		}
		that.left = left;
		that.top = top;
		that.fire("mouseup",{x:that.left,y:that.top,isDrag:that.isDrag});
	},
	refresh : function(opt){
		this.container.off("mousedown");
		this.container.off("mousemove");
		this.container.off("mouseup");
		this.init(opt);
	}
});

module.exports = Drag;

