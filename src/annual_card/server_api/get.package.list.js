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
				"id" : "1",
				"name" : "测试套餐名111",
				"privilege" : [{ //套餐特权 [{},{}]
					product : {
						id : "123123",
						name : "测试产品名称111"
					},
					ticket : {
						id : "1232434",
						name : "成人票"
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
						name : "成人票"
					},
					rule : {

					}
				}]
			},
			"2" : {
				"id" : "2",
				"name" : "测试套餐名222"
			},
			"3" : {
				"id" : "3",
				"name" : "测试套餐名333"
			}
		}))
	},1000)
}