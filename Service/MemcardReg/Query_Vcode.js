/**
 * Author: huangzhiyang
 * Date: 2016/12/22 15:24
 * Description: ""
 */
module.exports = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt || {});
	var cxt = opt.cxt || null;
	var debug = opt.debug;
	var url = "/call/jh_card.php?action=code";
	var params = opt.params || {};
	var mobile = params.mobile;
	if(!mobile) throw new Error("缺少mobile参数");
	if(debug){
		opt.loading.call(cxt);
		setTimeout(function(){
			opt.complete.call(cxt);
			opt.success.call(cxt,{

			});
		},1000)
	}else{
		PFT.Util.Ajax(url,{
			type : "get",
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
				if(res.status=="success"){
					opt.success.call(cxt,res.status,res.msg);
				}else{
					opt.error.call(cxt,res.msg,res.status);
				}
			}
		})
	}


}