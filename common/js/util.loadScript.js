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
	var fail = opt.fail || fn;
	//同步加载或异步加载
	var async = typeof opt.async=="boolean" ? opt.async : "true";
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.setAttribute("type","text/javascript");
	script.setAttribute("async", async);
	script.setAttribute("defer", async);
	script.setAttribute("src",src);

	loading();

	if(script.readState){
		script.onreadystatechange = function(){
			if(script.readState=="loaded" || script.readState=="complete"){
				script.onreadystatechange = null;
				complete();
			}
		}
	}else{
		script.onload = script.complete = function(){
			complete();
		}
		script.onerror = function(){
			fail();
		}
	}


	head.appendChild(script);

}
