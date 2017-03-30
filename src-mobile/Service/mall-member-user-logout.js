/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 个人中心退出登录   http://123624.12301.local/r/Mall_Member/logout/
 *
 *
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({

			})
		},1000)

		return false;
	}

	var redirect = opt.redirect || "";
	var params = {
		token : PFT.Util.getToken()
	};

	if(redirect && typeof redirect==="string") params["redirect"] = redirect;

	PFT.Util.Ajax(PFT.Api.C.logout(),{
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
				opt.fail(msg,code);
			}
		}
	})
}