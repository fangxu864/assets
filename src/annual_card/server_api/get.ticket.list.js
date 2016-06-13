/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:10
 * Description: 根据给定的产品id，请求该产品下的票类列表
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	setTimeout(function(){
		var data = '{"code":200,"data":[{"id":"17536","title":"成人票and可乐赠饮","pid":"14624","apply_did":"3385"},{"id":"17537","title":"老人票","pid":"14625","apply_did":"3385"},{"id":"21335","title":"教师票","pid":"18423","apply_did":"3385"},{"id":"22906","title":"测试新票2","pid":"19994","apply_did":"3385"},{"id":"22907","title":"测试新票1","pid":"19995","apply_did":"3385"},{"id":"24568","title":"优惠票","pid":"21656","apply_did":"3385"}],"msg":""}';
		res.end(data)
	},1000)
}