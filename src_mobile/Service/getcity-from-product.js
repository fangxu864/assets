/**
 * Author: huangzhiyang
 * Date: 2016/8/2 14:59
 * Description: 获取这个帐号所有有产品的城市列表
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	PFT.Util.Ajax(PFT.Api.fetchCityFromProduct(),{
		params : {
			action : "area_list"
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var areas = res.areas;
			//areas = {
			//	f : [{
			//		a: "h", id: 1100, hanzi: "和平区", pinyin: "hepingqu", shouzimu: "hpq"
			//	}]
			//};
			if(code==200){
				if(!PFT.Util.isEmptyObject(areas)){
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

