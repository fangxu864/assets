/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 */

var UserOrder = {
	/**
	 * Description: 个人中心  我的订单 列表  http://123624.12301.local/r/Mall_Member/getOrderList/
	 * page	  int	第几页
	 * pageSize  int	每页几条
	 * type	  string	unuse or history
	*/
	list : function(params,opt,cxt){

		opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
		cxt = cxt || this;

		if(__DEBUG__){
			opt.loading();
			setTimeout(function(){
				opt.complete();
				opt.success({
					"total": 26,
					"total_page" : 2,
					"list": [
						{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327471",
							"code": "461387",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						},{
							"ltitle": "【测试】每周五测试套票",
							"ttitle": "普通票",
							"ordernum": "3327470",
							"code": "073481",
							"begintime": "2016-08-23",
							"endtime": "2016-09-22",
							"tnum": "1",
							"paystatus": "1"
						}
					],
					"page": 1
				});
			},1000)

			return false;
		}

		params = params || {};
		params["token"] = PFT.Util.getToken();
		PFT.Util.Ajax(PFT.Api.C.userCenterOrderList(),{
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
				var code = res.code;
				var data = res.data || {};
				var list = data.list;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200 && list){
					if(list.length){
						for(var i=0; i<list.length; i++){
							list[i]["status_config"] = PFT.Config.orderStatus;
						}
						opt.success.call(cxt,data);
					}else{
						opt.empty.call(cxt,data);
					}
				}else{
					opt.fail.call(cxt,msg,code);
				}
			}
		})
	},

	/**
	 * 我的订单 _详情 http://123624.12301.local/r/Mall_Member/orderDetail/
	 * @param ordernumstring	订单号
	 */
	detail : function(ordernum,opt,cxt){
		opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
		cxt = cxt || this;
		PFT.Util.Ajax(PFT.Api.C.userCenterOrderDetail(),{
			type : "post",
			params : {
				ordernum : ordernum,
				token : PFT.Util.getToken()
			},
			loading : function(){ opt.loading.call(cxt)},
			complete : function(){ opt.complete.call(cxt)},
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					data["ptype"] = data.ptype || "A";
					data["imgpath"] = data.imgpath || "";
					opt.success.call(cxt,data);
				}else{
					opt.fail.call(cxt,msg);
				}
			}
		})
	},
	/**
	 * 取消订单  http://123624.12301.local/r/Mall_Member/cancelOrder/
	 * @param ordernum 订单号
	 * @param opt
	 */
	cancel : function(ordernum,opt,cxt){
		opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
		cxt = cxt || this;
		PFT.Util.Ajax(PFT.Api.C.userCenterOrderCanel(),{
			type : "post",
			params : {
				ordernum : ordernum,
				token : PFT.Util.getToken()
			},
			loading : function(){ opt.loading.call(cxt)},
			complete : function(){ opt.complete.call(cxt)},
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200 || code==201){
					opt.success.call(cxt,res,code);
				}else{
					opt.fail.call(cxt,msg,code);
				}
			}
		})
	}
};

module.exports = UserOrder;