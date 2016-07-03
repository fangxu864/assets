/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:02
 * Description: ""
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	var result_success = {
		src : "https://sfault-image.b0.upaiyun.com/847/123/847123006-573551703f418_articlex"
	};
	var result_error = {
		src : "",
		error : "这里显示错误信息"
	};
	var result = createResponse(200,result_success);
	setTimeout(function(){
		res.end('<script type="text/javascript">var FileuploadCallbacks=window.parent.FileuploadCallbacks[1];for(var i in FileuploadCallbacks) FileuploadCallbacks[i]('+result+');</script>')
	},1000)
};