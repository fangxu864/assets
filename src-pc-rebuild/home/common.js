/**
 * Author: huangzhiyang
 * Date: 2017/1/13 14:03
 * Description: ""
 */
module.exports = {
	api : {
		Home_HomeNotice : {
			priceChange : "/r/Home_HomeNotice/priceChange/",
			productChange : "/r/Home_HomeNotice/productChange/",
			partnerChange : "/r/Home_HomeNotice/partnerChange/",
			systemNotice : "/r/Home_HomeNotice/getSysNotice/"
		},
		Home_HomeMember : {
			getMemberInfo : "/r/Home_HomeMember/getMemberInfo/"
		}
	},
	Ajax : function(url,opt){

		opt = opt || {};

		var type = opt.type || "post";
		opt["type"] = type;

		return PFT.Util.Ajax(url,opt);
	}
};