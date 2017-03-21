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
			getMemberInfo : "/r/Home_HomeMember/getMemberInfo/",
			setRemainWaring : "/r/Home_HomeMember/setRemainWaring/"
		}
	},
	Ajax : function(url,opt){

		opt = opt || {};

		var type = opt.type || "post";
		opt["type"] = type;

		return PFT.Util.Ajax(url,opt);
	},
	//判断一个元素有没有进入指定容器的可视范围内
	elemViewIn : function(elem,container,offsetTop){
		var containerOffset = container.offset();
		var containerTop = containerOffset.top;
		var containerHeight = container.height();
		var paddingTop = container.css("paddingTop");
		paddingTop = paddingTop.substr(0,paddingTop.length-2) * 1;
		var offset = elem.offset();
		var top = offset.top - containerTop - paddingTop;
		if(top<=containerHeight){
			return true;
		}
		return false;
	}
};