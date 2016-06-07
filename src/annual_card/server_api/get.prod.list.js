/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:10
 * Description: ""
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	setTimeout(function(){
		res.end(createResponse(200,{
			"23423" : "测试获取产品列表接口",
			"345345" : "返回data为key value形式",
			"3455" : "key为产品id，value为产品名称"
		}))
	},1000)
}