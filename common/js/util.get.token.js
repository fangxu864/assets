/**
 * Author: huangzhiyang
 * Date: 2016/5/24 18:32
 * Description: ""
 */
module.exports = function(){
	return $("#csrf_token").val() || "";
}