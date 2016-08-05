/**
 * Author: huangzhiyang
 * Date: 2016/8/4 14:22
 * Description: 加载图片方法
 */
module.exports = function(src,opt){

	if(typeof src!=="string") return false;

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	var img = new Image();

	opt.loading();

	img.src = src;

	if(img.complete) return opt.success(src,img);

	img.onload = function(){
		opt.complete(src,img);
		opt.success(src,img);
	};
	img.onerror = function(){
		opt.complete(src,img);
		opt.error(src,img);
	};

}