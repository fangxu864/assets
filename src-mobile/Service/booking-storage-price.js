/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 获取价格及库存 (预定页面)
 * params	object	ajax请求附带的参数
 * opt	    object	callback fn
 */
module.exports = function(params,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				1 : {
					price : 200,
					store : 3
				},
				2 : {
					price : 100,
					store : 0
				},
				3 : {
					price : 230,
					store : -1
				}
			})
		},1000)

		return false;
	}

	params = params || {};
	params["token"] = PFT.Util.getToken();

	PFT.Util.Ajax(PFT.Api.C.getPriceAndStorage(),{
		type : "post",
		params : params,
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var list = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				opt.success(list);
			}else{
				opt.fail(msg);
			}
		}
	})
}