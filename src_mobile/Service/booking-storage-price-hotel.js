/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 获取价格和库存 (预定页面，针对酒店产品)  http://123624.12301.local/r/Mall_Product/getHotelPriceAndStorage/
 * params : {
 * 		pid : "",
 * 		aid : "",
 * 		beginDate : ""
 * 		endDate : ""
 * }
 */
module.exports = function(params,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				"jsprice": 18,
				"store": {
					"2016-08-23": 10,
					"2016-08-24": -1,
					"2016-08-25": -1,
					"2016-08-26": -1,
					"2016-08-27": -1,
					"2016-08-28": -1,
					"2016-08-29": -1,
					"2016-08-30": -1,
					"2016-08-31": -1
				}
			})
		},1000)

		return false;
	}

	PFT.Util.Ajax(PFT.Api.C.getHotelPriceAndStorage(),{
		type : "post",
		params : {
			pid : params.pid,
			aid : params.aid,
			beginDate : params.beginDate,
			endDate : params.endDate,
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
				opt.success(data);
			}else{
				opt.fail(msg);
			}
		}
	})
}