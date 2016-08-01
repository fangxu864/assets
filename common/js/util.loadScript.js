/**
 * Author: huangzhiyang
 * Date: 2016/8/1 9:40
 * Description: 载入script
 */


module.exports = function(src,opt){
	if(typeof src!=="string") return false;
	opt = opt || {};
	var fn = function(){};
	var loading = opt.loading || fn;
	var complete = opt.complete || fn;
	//同步加载或异步加载
	var async = typeof opt.async=="boolean" ? opt.async : "true";
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.setAttribute("type","text/script");
	script.setAttribute("async", async);
	script.setAttribute("defer", async);

	loading();

	if(script.readState){
		script.onreadystatechange = function(){
			if(script.readState=="loaded" || script.readState=="complete"){
				script.onreadystatechange = null;
				complete();
			}
		}
	}else{
		script.onload = function(){
			complete();
		}
	}

	script.setAttribute("src",src);
	head.appendChild(script);

}
