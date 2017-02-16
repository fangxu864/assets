/**
 * Author: huangzhiyang
 * Date: 2016/12/22 15:24
 * Description: ""
 */
module.exports = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt || {});
	var cxt = opt.cxt || null;
	var debug = opt.debug;
	var url = "/call/jh_mem.php?action=chkAndGet2";
	var params = opt.params || {};
	var mobile = params.mobile;
	if(!mobile) throw new Error("缺少mobile参数");
	if(debug){
		opt.loading.call(cxt);
		setTimeout(function(){
			opt.complete.call(cxt);
			opt.success.call(cxt,{
				code : 100,
				data : {
					dtype : 2
				}
			});
		},1000)
	}else{
		PFT.Util.Ajax(url,{
			type : "post",
			params : {
				mobile : mobile
			},
			loading : function(){
				opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete.call(cxt);
			},
			success : function(res){
				//code: 100存在   101不存在   102散客   103此帐号已被禁用或删除
				opt.success.call(cxt,res);
			}
		})
	}


}