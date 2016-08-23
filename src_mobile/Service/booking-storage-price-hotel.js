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
			opt.success([
				{
					"id": "6243",
					"round_name": "时段2",
					"bt": "12:01",
					"et": "18:00",
					"venus_id": "166",
					"use_date": "2016-08-15",
					"storage": 225,
					"area_storage": {
						"601": 1,
						"602": 60,
						"603": 45,
						"604": 60
					}
				},
				{
					"id": "6244",
					"round_name": "时段3",
					"bt": "18:01",
					"et": "23:59",
					"venus_id": "166",
					"use_date": "2016-08-15",
					"storage": 225,
					"area_storage": {
						"601": 1,
						"602": 25,
						"603": 45,
						"604": 60
					}
				}
			])
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