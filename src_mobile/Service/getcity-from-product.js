/**
 * Author: huangzhiyang
 * Date: 2016/8/2 14:59
 * Description: ""
 */
var _isEmpty = function(obj){
	var _isEmpty = true;
	for(var i in obj){
		_isEmpty = false;
		break;
	}
	return _isEmpty;
};
module.exports = function(opt){
	opt = opt || {};
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
			if(code==200){
				if(!_isEmpty(areas)){
					opt.success && opt.success(areas);
				}else{
					opt.empty && opt.empty(areas);
				}
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

