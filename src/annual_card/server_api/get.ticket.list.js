/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:10
 * Description: 根据给定的产品id，请求该产品下的票类列表
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	setTimeout(function(){
		res.end(createResponse(200,[{
			"id" : "123123",     //票id
			"name" : "票名称111", //票名称
			"aid" : [{           //该票的供应商列表
				id : "2342", //供应商id
				name : "供应商名称"
			},{
				id : "234342", //供应商id
				name : "供应商名称121"
			},{
				id : "23412", //供应商id
				name : "供应商名称123"
			}]
		},{
			"id" : "123423423",
			"name" : "票名称222"
		},{
			"id" : "13423",
			"name" : "票名称333"
		}],"请求成功"))
	},1000)
}