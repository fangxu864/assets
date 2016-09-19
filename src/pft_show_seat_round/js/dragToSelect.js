/**
 * Created by Administrator on 15-8-21.
 */
var DragToSelect = RichBase.extend({
	isDrag : false,
	init : function(opt){
		this.container = opt.container;
		this.rectBox = $("#dragRectBox");
		var offset = this.container.offset();
		this.offsetX = offset.left;
		this.offsetY = offset.top;
	},
	onMouseDown : function(data){
		this.isDrag = true;
		if(data.isDrag) return false;
		var offsetX = this.offsetX;
		var offsetY = this.offsetY;
		this.rectBox.show().css({
			left : data.x-offsetX,
			top : data.y-offsetY,
			width : 0,
			height : 0
		});
	},
	onMouseMove : function(data){
		if(data.isDrag || !this.isDrag) return false;
		this.rectBox.css({
			width : Math.abs(data.disX),
			height : Math.abs(data.disY)
		});
	},
	onMouseUp : function(data){
		this.isDrag = false;
	},
	dragToSelect : function(opt){
		var sIndex_x = opt.sIndex_x;
		var sIndex_y = opt.sIndex_y;
		var eIndex_x = opt.eIndex_x;
		var eIndex_y = opt.eIndex_y;

	}
});
module.exports = DragToSelect;