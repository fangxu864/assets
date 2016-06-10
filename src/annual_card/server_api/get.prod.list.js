/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:10
 * Description: ""
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	setTimeout(function(){
		res.end(createResponse(200,[{
			"id" : "123123",
			"name" : "产品名称111"
		},{
			"id" : "123423423",
			"name" : "产品名称222"
		},{
			"id" : "13423",
			"name" : "产品名称333"
		}],"请求成功"))
	},1000)
}