/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 提交订单 (预定页面)  http://123624.12301.local/r/Mall_Order/order/
 *   pid	        int	14624,主票pid
	 tnum	        int	2,主票购买张数
	 begintime	    string	2016-08-01,游玩日期
	 endtime	    string	2016-08-02, 结束时间,酒店类型的产品才有
	 contacttel	    int	手机号
	 ordername	    string	联系人
	 sfz	        string	身份证
	 memo	        string	备注
	 aid	        int	3385,上级供应商id
	 idcards	    array	身份证数组,[350181, 350182, ......]
	 tourists	    array	游客姓名数组,[马大爷, 他二舅, .....]
	 link	        object	联票, {"14624" : 2, "14625" : 3}
	 roundid	    int	场馆信息, 演出类才有
	 venusid	    int	场次信息, 演出类才有
	 zoneid	        int	区域信息, 演出类才有
	 parentid	    int	上级用户id, 全民营销
 */
module.exports = function(submitData,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				"validTime": "仅当天有效", //0表示当天有效，20表示20天内有效, 2016-08-01~2016-08-10表示此时间段内有效
				"verifyTime": "周一周五周日可验", // -1表示不限验证时间, [0,1,3,4,5,6]表示周一周二周四周五周六周日可验, 2016-08-01~2016-08-10表示此时间段可验
				"refund_rule": "1",     //2不可退，1游玩日期前可退，0有效期前可退
				"refund_rule_text" : "游玩日期前30分钟内可退",
				"refund_early_time": "60",  //有效期前多少分钟可退
				"reb" : 100 ,        //当不符合阶梯退票的规则，则收取1元固定手续费
				"cancel_cost": [        //阶梯退票手续费
					{
						"c_days": "1563",   //1563分钟之内
						"c_type": "1",      //收取固定金额 or 百分比
						"c_cost": "1200"    //收取12元 （单位：分）
					},
					{
						"c_days": "184",
						"c_type": "1",
						"c_cost": "1400"
					},
					{
						"c_days": "4320",
						"c_type": "0",
						"c_cost": "40"  //收取票价的百分40
					}
				],
				"assStation": [ //仅当线路产品时返回
					"东土大唐到西天取经",
					"农业银行直达建行厕所"
				],
				"needID": "2",  //是否需要填写身份证
				"title": "【测试】联票订单测试",   //景区名称,
				"p_type" : "H", //景区类型
				//门票列表
				tickets : [{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"zone_id" : "602",
					"pid": "1",
					"tid": "1753",
					"buy_low": "4",   //最小购买张数
					"buy_up": "7",
					"sonTickets": [ //套票才有
						{
							"pid": "3563",
							"lid": "3221",
							"title": "【测试】周五测试（勿买勿删）成人票",
							"num": "1",
							"p_type": "A"
						},
						{
							"pid": "3565",
							"lid": "3222",
							"title": "【测试】没那么简单成人测试测试票",
							"num": "2",
							"p_type": "A"
						}
					]
				},{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"pid": "2",
					"tid": "07536",
					"buy_low": "-1",   //最小购买张数
					"buy_up": "-1"
				},{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"pid": "3",
					"tid": "57536",
					"buy_low": "-1",   //最小购买张数
					"buy_up": "-1"
				}]
			})
		},1000)

		return false;
	}

	submitData["token"] = PFT.Util.getToken();

	PFT.Util.Ajax(PFT.Api.C.submitOrder(),{
		type : "post",
		params : submitData,
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
				opt.fail(code,msg);
			}
		}
	})
}