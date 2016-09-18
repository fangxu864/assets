/**
 * Author: huangzhiyang
 * Date: 2016/9/14 10:43
 * Description: ""
 */
var __api = PFT.Config.Api.get("Order_OrderQuery","third_order");
var fn = new Function;
var Api = {
	fetchList : function(params,opt,cxt){

		cxt = cxt || this;

		params = params || {};
		opt = opt || {};
		if(!params.pageSize) params["pageSize"] = 15;
		if(!params.currentPage) params["currentPage"] = 1;

		if(opt.debug){
			opt.complete();
			var list = [];
			for(var i=0; i<10; i++){
				list.push({
					pftOrder : "6668165",
					bCode : "测试接口超时(001测试票)",
					name : "驴妈妈",
					cTime : "2016-09-13 14:45:59",
					oStnum : "1",
					handleStatus : 1
				})
			}
			opt.success.call(cxt,{
				data : list,
				page : 1,
				totalPage : 10
			})


			return false;

		}






		PFT.Util.Ajax(__api,{
			type : "post",
			params : params,
			loading : opt.loading.call(cxt) || fn,
			complete : opt.complete.call(cxt) || fn,
			success : function(res){
				res = res || {};
				if(res.code==200){
					var count = res.data.count || 0;
					res.data["page"] = params.currentPage;
					res.data["totalPage"] = Math.ceil(count/params.pageSize);
					var list = res.data.data;
					if(list && list.length){
						opt.success.call(cxt,res.data);
					}else{
						opt.empty.call(cxt,res.data);
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	}
};

module.exports = Api;