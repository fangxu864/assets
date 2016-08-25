/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 短信登陆接口 绑定手机号  http://123624.12301.local/r/Mall_Member/smsLogin/
 * params : {
 * 		mobile	int	手机号
 *	    code	string	短信验证码
 * }
 */
module.exports = function(params,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading();


		return false;
	}

	params = params || {};
	params["token"] = PFT.Util.getToken();

	PFT.Util.Ajax(PFT.Api.C.smsLogin(),{
		type : "post",
		params : params,
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				opt.success(data);
			}else{
				opt.fail(msg);
			}
		}
	})
}