/**
 * Author: huangzhiyang
 * Date: 2016/8/12 14:31
 * Description: 获取日历价格
 */
module.exports = function(pid,yearmonth,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading()
		setTimeout(function(){
			opt.success({
				"2016-08-12": "200",
				"2016-08-13": "200",
				"2016-08-14": "200",
				"2016-08-15": "200",
				"2016-08-16": "200",
				"2016-08-17": "200",
				"2016-08-18": "5",
				"2016-08-19": "200",
				"2016-08-20": "200",
				"2016-08-21": "200",
				"2016-08-22": "200",
				"2016-08-23": "200",
				"2016-08-24": "200",
				"2016-08-25": "200",
				"2016-08-26": "200",
				"2016-08-27": "200",
				"2016-08-28": "200",
				"2016-08-29": "200",
				"2016-08-30": "200",
				"2016-08-31": "200"
			})
		},1000)

		return false;
	}

	PFT.Util.Ajax(PFT.Api.C.getTicketList(),{
		type : "post",
		params : {
			pid : pid,
			date : yearmonth
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var list = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				if(!PFT.Util.isEmptyObj(list)){
					success(list);
				}else{
					empty(list);
				}
			}else{
				opt.fail(msg);
			}
		}
	})
}