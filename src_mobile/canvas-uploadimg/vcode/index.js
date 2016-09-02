/**
 * Author: huangzhiyang
 * Date: 2016/8/26 11:58
 * Description: ""
 */
require("./index.scss");
function VCode(){
	this.vcodeContainer = $("#vcodeConainer");
	this.init();
}
VCode.prototype = PFT.Util.Mixin({
	state : "",
	init : function(){
		var that = this;
		var el = document.getElementById("vcodeConainer");
		Transform(el);
		var initScale = 0.5;
		var gesture = new AlloyFinger(el,{
			multipointStart: function () {
				//一个手指以上触摸屏幕触发
			},
			multipointEnd: function () {
				//当手指离开，屏幕只剩一个手指或零个手指触发
			},
			rotate: function (evt) {
				//if(that.state=="moveing"){
				//	el.rotateZ += evt.angle;
				//}
			},
			pinchStart: function () {
				if(that.state=="moveing"){
					initScale = el.scaleX;
				}
			},
			pinch: function (evt) {
				if(that.state=="moveing"){
					el.scaleX = el.scaleY = initScale * evt.scale;
				}
			},
			pressMove: function (evt) {
				if(that.state=="moveing"){
					el.translateX += evt.deltaX;
					el.translateY += evt.deltaY;
				}
			},
			tap: function (evt) {
				//console.log(el.scaleX + "_" + el.scaleY + "_" + el.rotateZ + "_" + el.translateX + "_" + el.translateY);
				//console.log("tap");
			},
			doubleTap: function (evt) {
				//console.log("doubleTap");
			},
			longTap: function (evt) {
				//console.log("longTap");
			}
			//,swipe: function (evt) {
			//	//console.log("swipe" + evt.direction);
			//}

		});


	},
	getImage : function(){
		var image = document.getElementById("vcodeConainer").querySelector("img");
		return{
			image : image,
			src : image.src,
			width : image.width,
			height : image.height
		};
	},
	getPosition : function(){
		return this.vcodeContainer.offset();
	},
	setState : function(state){
		this.state = state;
		if(state=="moveing"){
			this.vcodeContainer.addClass("moveing");
		}else{
			this.vcodeContainer.removeClass("moveing");
			this.vcodeContainer[0].style = "";
		}
	}
},PFT.Util.PubSub);

module.exports = VCode;