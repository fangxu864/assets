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
				"priv" : [{ //套餐特权 [{},{}]
					product : {
						id : "123123",
						name : "测试产品名称111"
					},
					ticket : {
						id : "1232434",
						name : "成人票",
						aid : "121"
					},
					rule : {

					}
				},{
					product : {
						id : "1231sdfa3",
						name : "测试产品名称222"
					},
					ticket : {
						id : "123243sdf4",
						name : "成人票",
						aid : ""
					},
					rule : {

					}
				}]
			}
		}))
	},1000)
}