/**
 * Author: huangzhiyang
 * Date: 2016/8/3 15:25
 * Description: 获取热门产品推荐，适用于C端
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	var area = opt.area || "";
	PFT.Util.Ajax(PFT.Api.C.getProductHot(),{
		params : {
			area : area
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			if(res.code==200){
				var list = res.data.list;
				if(list.length){
					opt.success(res);
				}else{
					opt.empty(res);
				}
			}else{
				opt.fail(res);
			}
		}
	})
}