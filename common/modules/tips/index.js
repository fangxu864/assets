
require("./index.scss");

function Tips(){

}

Tips.prototype={
	/**
	 * tips的显示方法
	 *@params    object
	 * opt.direction                               // tip的位置，可接受  top  right  left  bottom  。默认 right
	 * opt.hostObj,               *必须            //依托的对象，或this。
	 * opt.lifetime,                               //显示时长，若值为 -1 则一直显示。默认4s
	 * opt.content,               *必须            //显示的内容。
	 * opt.bgcolor,                                //背景颜色。默认 "#FF5722" 橘黄色
	 * opt.color;                                  //字体颜色。默认 "white" 白色
	 */
	show:function (opt) {
		var direction=opt.direction || "right",   //箭头的方向  top  right  left  bottom
			hostObj=opt.hostObj,                   //依托的对象，或this
			lifetime=opt.lifetime || 4000,         //显示时长，若值为 -1 则一直显示
			content=opt.content,                   //显示的内容
			bgcolor=opt.bgcolor || "#FF5722",     //背景颜色
		    color=opt.color || "white";           //字体颜色
		var tip=this.create();
		tip.html(content+"<i class='arrow'></i>");
		$("body").append(tip);
		//智能转换方向
		direction = this.configDirection(tip , hostObj , direction);
		//添加动画类名
		tip.addClass('pft-tips-'+direction);
		//根据方向确定tip的位置
		var directionLeft,directionTop;
		var arrow = tip.find("i.arrow");
		switch (direction){
			case "right":
				directionLeft = hostObj.offset().left + hostObj.outerWidth() + 10;
				directionTop = hostObj.offset().top;
				arrow.css("border-"+direction+"-color",bgcolor);
				break;
			case "left":
				directionLeft = hostObj.offset().left - tip.outerWidth() - 10;
				directionTop = hostObj.offset().top;
				arrow.css("border-"+direction+"-color",bgcolor);
				break;
			case "top":
				directionLeft = hostObj.offset().left;
				directionTop = hostObj.offset().top - tip.outerHeight() - 10;
				arrow.css("border-"+direction+"-color",bgcolor);
				break;
			case "bottom":
				directionLeft = hostObj.offset().left;
				directionTop = hostObj.offset().top + hostObj.outerHeight() + 10;
				arrow.css("border-"+direction+"-color",bgcolor);
				break;
		}
		tip.css({
			"background-color" : bgcolor,
			"color" : color,
			"left" : directionLeft,
			"top" : directionTop
		});
		if(lifetime == -1) return false;
		setTimeout(function () {
			tip.addClass("fadeOut");
			setTimeout(function () {
				tip.remove()
			},210)
		},lifetime)
	},
	/**
	 * tips的生成方法
	 */
	create:function () {
		return $("<div class='pft-tips'></div>");
	},
	/**
	 * 确定Tip的显示方位
	 * @hostObj    依托的JQ对象
	 * @tip         tip JQ对象
	 */
	configDirection:function (tip , hostObj ,direction) {
		var direct=direction
		//判断方向
		//找出可用方向数组
		var host_H = hostObj.offset().top - $(window).scrollTop(); //依托对象相对窗口的Top值
		var host_W = hostObj.offset().left - $(window).scrollLeft(); //依托对象相对窗口的left值

		var validArr=[];
		//检测top
		if ( tip.outerHeight() + 10 < host_H && host_W > -10){
			validArr.push("top")
		}
		//检测bottom
		if ( tip.outerHeight() + 10 < $(window).outerHeight() - host_H - hostObj.outerHeight()  && host_W > -10 ){
			validArr.push("bottom")
		}
		//检测left
		if ( tip.outerWidth() + 10 < host_W && $(window).outerHeight() - host_H > tip.outerHeight() ){
			validArr.push("left")
		}
		//检测right
		if ( tip.outerWidth() + 10 < $(window).outerWidth() - host_W - hostObj.outerWidth() ){
			validArr.push("right")
		}
		//判断是是否为空数组
		if(validArr.length !== 0){
			//数组中是否存在direction
			if(validArr.join(",").indexOf(direct) === -1){
				direct = validArr[0];
			}
		}
		return direct;
	},
	/**
	 * 关闭所有tips
	 */
	closeAllTips : function(){
		$(".pft-tips").remove()
	}
};


module.exports=Tips;