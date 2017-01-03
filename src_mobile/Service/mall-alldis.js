/**
 * Author: huangzhiyang
 * Description: 新版微商城全民分销相关接口
 */

var api = PFT.Config.Api.get("Mall_AllDis");

//获取开店状态  是否可以开店
exports.getStatus = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){

	}

	PFT.Util.Ajax(api("getAllDisStatus"),{
		type : "post",
		params : {
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				success();
			}else{
				fail(msg,code)
			}
		},
		serverError : function(){
			alert(PFT.AJAX_ERROR_TEXT);
		}
	})
}