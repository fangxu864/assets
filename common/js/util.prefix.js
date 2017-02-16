/**
 * Author: huangzhiyang
 * Date: 2016/7/27 17:13
 * Description: ""
 */
var styles, pre, dom;
var prefix;
if(window.getComputedStyle){
	styles = window.getComputedStyle(document.documentElement, '');
	pre = (Array.prototype.slice
			.call(styles)
			.join('')
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
	)[1];
	dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

	prefix = {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre
	};
}
// IE8- don't support `getComputedStyle`, so there is no prefix
else{
	prefix = {
		dom: '',
		lowercase: '',
		css: '',
		js: ''
	}
}

module.exports = prefix;