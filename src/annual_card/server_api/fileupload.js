/**
 * Author: huangzhiyang
 * Date: 2016/6/7 12:02
 * Description: ""
 */
var createResponse = require("./__createResponse");
module.exports = function(req,res){
	var result = createResponse(200,{
		src : "https://sfault-image.b0.upaiyun.com/847/123/847123006-573551703f418_articlex"
	});
	setTimeout(function(){
		res.end('<script>var FileuploadCallbacks=window.parent.FileuploadCallbacks[1];for(var i in FileuploadCallbacks) FileuploadCallbacks[i]('+result+');</script>')
	},1000)
};