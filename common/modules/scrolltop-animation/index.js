/**
 * Author: huangzhiyang
 * Date: 2016/8/11 16:53
 * Description: from "http://www.cnblogs.com/skyHF/p/4720308.html"
 */
module.exports = function(options){
	var defaults = {
		elem : null,
		top : 0,    //滚动目标位置
		duration : 500,  //过渡动画时间
		delay : 30,     //定时器时间
		callback : null   //回调函数
	};
	var opts = $.extend(defaults,options),
		timer = null,
		_this = opts.elem,
		curTop = _this.scrollTop,//滚动条当前的位置
		subTop = opts.top - curTop,    //滚动条目标位置和当前位置的差值
		index = 0,
		dur = Math.round(opts.duration / opts.delay),
		smoothScroll = function(t){
			index++;
			var per = Math.round(subTop/dur);
			if(index >= dur){
				_this.scrollTop = t;
				window.clearInterval(timer);
				if(opts.callback && typeof opts.callback == 'function') opts.callback();
			}else{
				_this.scrollTop = (curTop + index*per);
			}
		};
	timer = window.setInterval(function(){
		smoothScroll(opts.top);
	}, opts.delay);
};