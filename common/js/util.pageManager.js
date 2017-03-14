/**
 * 
 * 页面容器管理类
 * 
 * @author: huangzhiyang
 * 
 * @email: 348845730@qq.com
 * 
 * @date: 2017/01/23
 * 
 */
function Page(opt){
	if(!(this instanceof Page)) return new Page(opt);
	var fn = new Function();
	this.opt = opt = PFT.Util.Mixin(opt,{
		name : "",
		onLoad : fn,
		onDestroy : fn
	},false);

	this.init();

}

Page.__currentPage = [];

Page.prototype = {
	init : function(){
		var __currentPage = Page.__currentPage;
		var curpage = __currentPage.shift();
		if(curpage){
			curpage.onDestroy && curpage.onDestroy.call(curpage);
		}
		__currentPage.push(this.opt);
		this.opt.onLoad.call(this.opt);
	}
}

module.exports = Page;