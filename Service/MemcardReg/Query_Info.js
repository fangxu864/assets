/**
 * Author: huangzhiyang
 * Date: 2016/12/22 15:24
 * Description: ""
 */
module.exports = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt || {});
	var cxt = opt.cxt || null;
	var debug = opt.debug;
	var url = PFT.Config.Api.get("memcard","edit");
	var type = opt.type || "post";
	var params = opt.params || {};
	var did = params.did;

	if(!did) throw new Error("缺少did参数");
	if(debug){
		opt.loading.call(cxt);
		setTimeout(function(){
			opt.complete.call(cxt);
			opt.success.call(cxt,{
				mobile : "18305917866",
				idCard : "",
				cname : "",
				sex : "M",
				qq : "",
				province : "",
				city : "",
				detail_address : "",
				photo_img_add : "",
				car_info : "",
				remark : "",
				password : "",
				confirmPwd : ""
			});
		},1000)
	}else{
		PFT.Util.Ajax(url,{
			type : type,
			params : {
				did : did
			},
			loading : function(){
				opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete.call(cxt);
			},
			success : function(res){
				var code = res.code;
				var data = res.data;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					opt.success.call(cxt,data);
				}else{
					opt.error.call(cxt,msg,code);
				}
			}
		})
	}


}