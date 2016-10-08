/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: ""
 */

var __pos = 0;

module.exports = function(params,opt,cxt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	cxt = cxt || this;

	if(__DEBUG__){
		opt.loading()
		setTimeout(function(){
			var list = [];
			if(__pos>=29){
				opt.complete();
				opt.empty({
					list : list,
					lastPos : 0
				})
			}else{
				params["lastPos"] = params["lastPos"] || 10;
				for(var i=__pos; i<(__pos+params.lastPos); i++){
					list.push(i);
				}
				__pos += params.lastPos;
				opt.complete();
				opt.success({
					list : list,
					lastPos : 10
				})
			}
		},1000)

		return false;
	}

	params = params || {};
	params["pageSize"] = params["pageSize"] || 10;
	params["token"] = PFT.Util.getToken();

	PFT.Util.Ajax(PFT.Api.C.productList(),{
		params : params,
		loading : function(){
			opt.loading.call(cxt);
		},
		complete : function(){
			opt.complete.call(cxt);
		},
		success : function(res){
			res = res || {};
			var data = res.data || {};
			var list = data.list;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(res.code==200){
				if(list.length){
					opt.success.call(cxt,data);
				}else{
					opt.empty.call(cxt,data);
				}
			}else{
				opt.fail.call(cxt,msg);
			}
		}
	})
}