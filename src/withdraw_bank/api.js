/**
 * Author: huangzhiyang
 * Date: 2016/7/11 14:53
 * Description: 文档在：http://git.12301.io/PFT/PFT_Documents/src/master/%E9%93%B6%E8%A1%8C%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3.md
 */
var fn = new Function;
var Defaults = {
	loading : fn,
	complete : fn,
	success : fn,
	empty : fn,
	fail : fn,
	error : fn
};
var Api = {
	url : PFT.Config.Api.get("Finance_Banks")
};
module.exports = Api;