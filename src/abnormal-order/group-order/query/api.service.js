/**
 * Author: huangzhiyang
 * Date: 2016/9/14 10:43
 * Description: ""
 */
var __Controll = PFT.Config.Api.get("Order_OrderQuery");
var __list_api = __Controll("group_order");
var Status = require("./status");
var fn = new Function;
//查询订单模块
exports.Query = {
	query : function(params,opt,cxt){


		cxt = cxt || this;

		var _params = params||{};

		for(var i in params){
			if(i=="beginTime"){
				_params["btime"] = params["beginTime"];
			}
			if(i=="endTime"){
				_params["etime"] = params["endTime"];
			}
		}
		params = params || {};
		opt = opt || {};
		if(!params.pageSize) params["pageSize"] = 15;
		if(!params.currentPage) params["currentPage"] = 1;

		if(opt.debug){
			opt.loading.call(cxt);
			setTimeout(function(){
				opt.complete.call(cxt);
				var list = [];
				for(var i=0; i<10; i++){
					list.push({
						ordernum : "6668165",
						prodMsg : "测试接口超时(001测试票)测试接口超时(001测试票)测试接口超时(001测试票)测试接口超时(001测试票)",
						buss : "驴妈妈",
						time : "2016-09-13 14:45:59",
						tnum : "1",
						status : 1,
						status_text : "下单失败",
						errormsg : "失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因"
					})
				}
				opt.success.call(cxt,{
					data : list,
					page : params.currentPage,
					totalPage : 10
				});
			},600);

			return false;

		}


		PFT.Util.Ajax(__list_api,{
			type : "post",
			params : _params,
			loading : function(){
				opt.loading && opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete && opt.complete.call(cxt);
			},
			success : function(res){
				res = res || {};
				if(res.code==200){
					var count = res.data.count*1 || 0;
					res.data["page"] = params.currentPage;
					res.data["totalPage"] = Math.ceil(count/params.pageSize);
					var list = res.data.data;
					var len = list?list.length:0;
					var ticketName = res.data.ticketName;
					var shopType = res.data.shopType;
					if(list && len){
						for(var i=0; i<len; i++){
							var bcode = list[i]["bCode"];
							var coopB = list[i]["coopB"];
							var _shopType = shopType[coopB] || "--";
							list[i]["ticketName"] = ticketName[bcode];
							if(list[i]["handleStatus"]==0){
								list[i]["handleStatus"] = list[i]["oStatus"];
							}
							list[i]["shopType"] = _shopType;
							list[i]["handleStatus_ext"] = Status[list[i]["handleStatus"]] || {};
						}
						opt.success && opt.success.call(cxt,res.data);
					}else{
						opt.empty && opt.empty.call(cxt,res.data);
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})




	}



};


