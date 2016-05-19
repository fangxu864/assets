/**
 * Author: huangzhiyang
 * Date: 16-5-17 上午11:58
 * Description: ""
 */
var Ajax = require("./util.ajax.js");
var api = "http://www.12301.cc/module/wechat/wx_shop_config.php?action=get_config";
/**
 * 获取店铺名称接口
 * @param opt
 *  opt={
 *  	account :  帐号  必填
 *      loading :  回调
 *      complete : 回调
 *      timeout :  回调
 *      serverError : 回调
 *      fail        : 回调
 *      success :  成功回调
 *  }
 * @returns {*}
 */
module.exports = function(opt){
	var account = opt.account;
	if(typeof account!=="string") return alert("获取店铺名称接口，account不能为空");
	Ajax(api,{
		loading : opt.loading,
		complete : opt.complete,
		timeout : opt.timeout,
		serverError : opt.serverError,
		success : function(res){
			var res = res || {};
			var code = res.code;
			var msg = res.msg || "请求出错，请稍后重试";
			if(code==200){
				opt.success(res);
			}else{
				opt.fail(msg);
			}
		}
	})
}