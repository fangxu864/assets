/**
 * Author: huangzhiyang
 * Date: 2016/8/3 17:07
 * Description: 微商城获取产品类型
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	PFT.Util.Ajax(PFT.Api.getptype(),{
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			if(res.code==200){
				if(res.data.length){
					opt.success(res);
				}else{
					opt.empty(res);
				}
			}else{
				opt.fail(res.msg || PFT.AJAX_ERROR_TEXT);
			}
		}
	})

}