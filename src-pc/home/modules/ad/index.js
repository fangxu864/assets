

require("./index.scss");
module.exports = function(parent){
	//七牛上的图片请求有问题
	var src = "http://images.pft12301.cc/new_first_page/ad_01.png";
	src = "//static.12301.cc/assets/build/images/new_home_ad_01.png";
	var container = $('<div id="AD_RigBox" class="AD_RigBox"><img src="'+src+'"/></div>').appendTo(parent);
	// var img = $("<img/>");
	// img.attr("src","http://images.pft12301.cc/new_first_page/ad_01.png");
	// container.append(img);
	// container.append($('<img src="http://images.pft12301.cc/new_first_page/ad_01.png"/>'));

	
}

