/**
 * Author: huangzhiyang
 * Date: 2016/8/10 18:52
 * Description: 获取产品详情
 */
module.exports = function(lid,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(PFT.Util.UrlParse().debug==""){
		opt.loading();
		setTimeout(function(){
			opt.success({
				"id": "3026",
				"title": "[福建 · 厦门]  思明区轮渡码头",
				"area": "12|382|0",
				"address": "[福建 · 厦门]  思明区轮渡码头",
				"jtzn": "【公共交通】\r\n27路公交；快速公交brT1路；快速公交brT联络线。\r\n\r\n【自驾线路】\r\n厦门到码头：从厦禾路出发，行驶到湖滨东路,进入湖滨东路。沿湖滨东路走0.7公里并左转到湖滨南路；沿湖滨南路走3.5公里并向西直行到鹭江道，沿鹭江道走1.5公里并右转，走10米并向西南直行到轮渡。",
				"jqts": "【开放时间】第一航班时间：19：30——21：10  第二航班时间：20：00——21：40<br />\r\n<br />\r\n【取票地点】厦门轮渡<br />\r\n<br />\r\n【入园凭证】根据短信取票<br />\r\n<br />\r\n【优惠政策】A：1.1m以下免费，1.1-1.4m半价，1.4m以上全价；B：其他人员一律无优惠<br />\r\n<br />\r\n【发票说明】无<br />\r\n<br />\r\n【退改说明】当天下午18:00前告知改期或者取消。<br />\r\n<br />\r\n【温馨提示】<br />\r\n<br />\r\n【联系电话】18950032307",
				"imgpath": "prodimgs/123622/20140910/14103290099136_thumb.jpg",
				"apply_did": "3378"
			})
		},1000)


		return;
	}


	PFT.Util.Ajax(PFT.Api.C.getLandInfo(),{
		type : "post",
		params : {
			lid : lid,
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				success(data);
			}else{
				opt.fail(msg);
			}
		}
	})
}