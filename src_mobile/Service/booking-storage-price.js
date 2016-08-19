/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 获取价格及库存 (预定页面)
 * p_type	string	产品类型
 * params	object	ajax请求附带的参数
 * opt	    object	callback fn
 */
module.exports = function(p_type,params,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(!p_type) return console.warn("service booking-storage-price params:p_type is required");

	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				14624 : {
					price : 200,
					store : 10
				},
				14625 : {
					price : 100,
					store : 0
				},
				14626 : {
					price : 230,
					store : -1
				}
			})
		},1000)

		return false;
	}



	PFT.Util.Ajax(PFT.Api.C.getTicketListBook(),{
		params : params,
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var list = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				success(list);
			}else{
				opt.fail(msg);
			}
		}
	})
}