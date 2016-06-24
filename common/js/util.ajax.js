/**
 * Created by Administrator on 16-4-13.
 */
module.exports = function(url,opt){
	if(!url) return alert("ajax请求缺少url");
	var fn = new Function;
	var opt = opt || {};
	var params = opt.params || {};
	var loading = opt.loading || fn;
	var complete = opt.complete || fn;
	var success = opt.success || fn;
	var timeout = opt.timeout || function(){ alert("请求超时，请稍后重试")};
	var serverError = opt.serverError || function(xhr,txt){
		var txt = txt || "请求出错，请稍后重试";
		if(txt=="parsererror") txt = "请求出错，请稍后重试";
		alert(txt);
	};
	var type = opt.type || "get";
	var dataType = opt.dataType || "json";
	var ttimeout = opt.ttimeout || 120 * 1000;
	var xhr = $.ajax({
		url : url,
		type : type,
		dataType : dataType,
		data : params,
		timeout :ttimeout,
		beforeSend : function(){
			loading();
		},
		success : function(res){
			complete(res);
			success(res);
		},
		error : function(xhr,txt){
			complete(xhr,txt);
			if(txt == "timeout"){
				timeout(xhr,txt);
			}else{
				serverError(xhr,txt);
			}
		}
	})
	return xhr;
}