/**
 * Author: huangzhiyang
 * Date: 2016/8/3 15:25
 * Description: 获取热门产品推荐，适用于C端
 */
module.exports = function(opt,cxt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
	cxt = cxt || this;

	if(__DEBUG__){

		opt.loading();
		setTimeout(function(){
			opt.success([{
				"lid": "2633",
				"title": "接口测试产品（仅供测试）",
				"area": "12|381|0",
				"address": "福州软件园",
				"aid": "113",
				"imgpath": "prodimgs/100019/20140714/14053213389362_thumb.jpg",
				"jsprice": "0.01",
				"tprice": "100.00",
				"pid": "2380"
			},{
				"lid": "2633",
				"title": "接口测试产品（仅供测试）",
				"area": "12|381|0",
				"address": "福州软件园",
				"aid": "113",
				"imgpath": "prodimgs/100019/20140714/14053213389362_thumb.jpg",
				"jsprice": "0.01",
				"tprice": "100.00",
				"pid": "2380"
			},{
				"lid": "2633",
				"title": "接口测试产品（仅供测试）",
				"area": "12|381|0",
				"address": "福州软件园",
				"aid": "113",
				"imgpath": "prodimgs/100019/20140714/14053213389362_thumb.jpg",
				"jsprice": "0.01",
				"tprice": "100.00",
				"pid": "2380"
			},{
				"lid": "2633",
				"title": "接口测试产品（仅供测试）",
				"area": "12|381|0",
				"address": "福州软件园",
				"aid": "113",
				"imgpath": "prodimgs/100019/20140714/14053213389362_thumb.jpg",
				"jsprice": "0.01",
				"tprice": "100.00",
				"pid": "2380"
			},{
				"lid": "2633",
				"title": "接口测试产品（仅供测试）",
				"area": "12|381|0",
				"address": "福州软件园",
				"aid": "113",
				"imgpath": "prodimgs/100019/20140714/14053213389362_thumb.jpg",
				"jsprice": "0.01",
				"tprice": "100.00",
				"pid": "2380"
			}])
		},1000)


		return false;

	}

	var params = {token : PFT.Util.getToken()};
	if(opt.keyword) params["keyword"] = opt.keyword;

	PFT.Util.Ajax(PFT.Api.C.getProductHot(),{
		type : "post",
		params : params,
		loading : function(){ opt.loading.call(cxt)},
		complete : function(){ opt.complete.call(cxt)},
		success : function(res){
			res = res || {};
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(res.code==200){
				var list = res.data.list;
				if(list.length){
					opt.success.call(cxt,list);
				}else{
					opt.empty.call(cxt,list);
				}
			}else{
				opt.fail.call(cxt,msg,res.code);
			}
		}
	})
}