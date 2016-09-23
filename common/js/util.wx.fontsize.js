/**
 * Author: huangzhiyang
 * Date: 16-5-16 下午5:04
 * Description: ""
 */
module.exports = function(){
	var _setFontSize = function(){
		document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
	};
	document.addEventListener('DOMContentLoaded', function(e) {
		_setFontSize();
	}, false);
	document.addEventListener("resize",function(e){
		_setFontSize();
	},false)
}