/**
 * Author: huangzhiyang
 * Date: 2016/8/2 14:59
 * Description: ""
 */
module.exports = function(opt){
	opt = opt || {};
	PFT.Util.Ajax(PFT.Api.fetchCityFromProduct(),{
		params : {

		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var area = res.area;
			if(code==200){
				success(area);
			}else{
				if(opt.fail){
					opt.fail(res);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		}
	})
}

