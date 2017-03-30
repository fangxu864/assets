/**
 * Author: huangzhiyang
 * Date: 2016/8/3 17:07
 * Description: 微商城获取产品类型
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(__DEBUG__){

		opt.loading();

		opt.success([
			{
				"name": "景区",
				"identify": "A"
			},
			{
				"name": "酒店",
				"identify": "C"
			},
			{
				"name": "周边游",
				"identify": "B"
			},
			{
				"name": "套票",
				"identify": "F"
			},
			{
				"name": "演出",
				"identify": "H"
			}
		]);

		return false;

	}



	PFT.Util.Ajax(PFT.Api.getptype(),{
		type : "post",
		params : {
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			if(res.code==200){
				var data = res.data;
				if(data.length){
					opt.success(data);
				}else{
					opt.empty(data);
				}
			}else{
				opt.fail(res.msg || PFT.AJAX_ERROR_TEXT);
			}
		}
	})

}