/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:10
 * Description: ""
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	setTimeout(function(){
		res.end(createResponse(200,{
			"1" : {
				"tid" : "1",
				"ttitle" : "测试套餐名111",
				"ltitle" : "年卡产品名称",
				"price_section" : {
					"sdate" : "2016-06-10",
					"edate" : "2016-07-01",
					"js" : "10.01", //供货价
					"ls" : "15.01" //零售价
				},
				"tprice" : "20.01", //门市价
				"notes" : "产品说明产品说明",
				"delaytype" : "2", //使用有效期 0-激活后有效 1-售出后有效 2-固定时段有效
				"delaydays" : "",  //使用有效期，多少天后有效
				"order_start" : "2016-06-10", //使用有效期-开始时间 delaytype=2时
				"order_end" : "2016-06-11",   //使用有效期-结束时间 delaytype=2时
				"auto_active_days" : "0",     //自动激活天数 (<0: 不自动激活; 0:售出即激活; >0:n天后激活)
				"getaddr" : "使用说明使用说明使用说明使用说明使用说明",
				"cert_limit" : "1",           //#身份证激活限制 0-无需填写身份证号 1-需要填写身份证号
				"search_limit" : "2",         //购买搜索限制 0-不限制 1-卡号（实体卡/虚拟卡）  2-身份证号 4-手机号 [多选时用逗豆隔开]
				"fax" : "18405927899",        //供应商手机号
				"nts_sup" : "1",              //年卡激活时是否通知供应商   0 不通知 1 通知
				"nts_tour" : "1",             //年卡激活时是否通知游客   0 不通知 1 通知
				"confirm_wx" : "0",           //会员消费信息通知到微信    0-不通知 1-通知
				"apply_limit" : 1,            //发布/放入仓库 1-发布 2-放入仓库
				"priv" : {
					"1" : {
						tid : "1",
						ttitle : "票名称11",
						lid : "232",
						ltitle : "产品名称1111",
						aid : "2",
						uselimit : "-1,-1,5"
					}
				},

			}
		}))
	},1000)
}