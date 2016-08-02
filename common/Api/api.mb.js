/**
 * Author: huangzhiyang
 * Date: 2016/8/2 16:25
 * Description: ""
 */
var Api_Mb = {
	//微商城，城市选择， 获取城市列表
	fetchCityFromProduct : function(){
		return "/wx/api/v0.0.3/order.php";
	}
};
module.exports = function(Api){
	for(var i in Api_Mb) Api[i] = Api_Mb[i];
	return Api;
}