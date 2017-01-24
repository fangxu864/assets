/**
 * Author: huangzhiyang
 * Date: 2016/9/14 10:43
 * Description: ""
 */
var __Controll = PFT.Config.Api.get("Order_OrderQuery");
var __list_api = __Controll("third_order");
var __action_api = __Controll("force_chk");
var Status = require("./status");
var fn = new Function;
var Api = {
	fetchList : function(params,opt,cxt){

		cxt = cxt || this;

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
					page : params.currentPage,
					totalPage : 10
				});
			},600);


			return false;

		}


		PFT.Util.Ajax(__list_api,{
			type : "post",
			params : params,
			loading : function(){
				opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete.call(cxt);
			},
			success : function(res){
				res = res || {};
				if(res.code==200){
					var count = res.data.count*1 || 0;
					res.data["page"] = params.currentPage;
					res.data["totalPage"] = Math.ceil(count/params.pageSize);
					var type = res.data.type;
					var ifAdmin = res.data.ifAdmin;
					var list = res.data.data;
					var len = list.length;
					var ticketName = res.data.ticketName;
					if(list && len){
						for(var i=0; i<len; i++){
							var bcode = list[i]["bCode"];
							list[i]["ticketName"] = ticketName[bcode];
							if(list[i]["handleStatus"]==0){
								list[i]["handleStatus"] = list[i]["oStatus"];
							}
							list[i]["handleStatus_ext"] = Status[list[i]["handleStatus"]] || {};
							list[i]["ifAdmin"] = ifAdmin;
							list[i]["type"] = type;  //判断是否是分销商，true显示分销商列，false，不显示
						}
						opt.success.call(cxt,res.data);
					}else{
						opt.empty.call(cxt,res.data);
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},

	/**
	 * 强制退票、强制核销接口
	 * @param params
	 * @param opt
	 */
	doAction : function(params,opt,cxt){
		cxt = cxt = this;
		params = params || {};
		opt = opt || {};
		PFT.Util.Ajax(__action_api,{
			type : "post",
			params : params,
			loading : function(){
				opt.loading && opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete && opt.complete.call(cxt);
			},
			success : function(res){
				res = res || {};
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(res.code==200){
					opt.success && opt.success.call(cxt,res.data);
				}else{
					alert(msg);
				}
			}
		})


	}

};

module.exports = Api;