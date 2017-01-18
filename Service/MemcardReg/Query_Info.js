/**
 * Author: huangzhiyang
 * Date: 2016/12/22 15:24
 * Description: ""
 */
module.exports = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt || {});
	var cxt = opt.cxt || null;
	var debug = opt.debug;
	var url = PFT.Config.Api.get("product_MemberCardBasic","memberCardInfos");
	var type = opt.type || "post";
	var params = opt.params || {};
	var fid = params.fid;

	if(!fid) throw new Error("缺少fid参数");
	if(debug){
		opt.loading.call(cxt);
		setTimeout(function(){
			opt.complete.call(cxt);
			opt.success.call(cxt,{
				mobile : "18305917866",      //手机号
				id_card_no : "350521198911232563",             //身份证
				dname : "黄小档檑厅",                  //姓名
				province : "12",
				city : "383",
				address : "福建福州鼓楼区",
				headphoto : "https://sf-sponsor.b0.upaiyun.com/0ca544e7b5e6243f546ee3f3c87de114.png",
				car : "1",
				remarks : "备注备注备注备注备注备注备注",
				phy_no : "1111111111",
				card_no : "222222222222",
				notice_type	 : "1",
				sex : "F"
			});
		},1000)
	}else{
		PFT.Util.Ajax(url,{
			type : type,
			params : {
				fid : fid
			},
			loading : function(){
				opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete.call(cxt);
			},
			success : function(res){
				var code = res.code;
				var data = res.data.list;
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