/**
 * Author: huangzhiyang
 * Date: 2016/8/4 16:05
 *
 * 获取店铺配置，这个服务比较特别，一般的服务只是export一个方法，这个服务需要export一个对象
 * 为微商城各个页面都需要基于fetch方法的返回结果，去启动微信自定义分享  这里mixin了Pubsub对象
 *
 * 	var shopConfig = new CustomShopConfig();
 * 	shopConfig.on("loading",function(){})
 * 	shopConfig.on("complete",function(){})
 * 	shopConfig.on("success",function(res){})
 * 	shopConfig.on("fail",function(msg){})
 * 	shopConfig.fetch({
 * 		loading : function(){},
 * 		complete : function(){},
 * 		success : function(res){},
 * 		fail : function(msg){}
 * 	})
 *
 */
var CustomShopConfig = function(opt){

	this.__shopname__ = "";

	this.__banner__ = [];

};

CustomShopConfig.prototype = PFT.Util.Mixin({

	fetch : function(opt){

		var that = this;
		opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt||{});

		PFT.Util.Ajax(PFT.Api.custom_shop_config(),{
			loading : function(){
				opt.loading();
				that.fire("loading");
			},
			complete : function(){
				opt.complete();
				that.fire("complete");
			},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					that.__shopname__ = data.name;
					//后端返回的banner格式很别扭，这边自己手动转一下
					//[{http://images.12301.cc/123624/14514654753878.jpg:"http://123624.12301.cc/wx/mall/pdetail.html?lid=3843"}] =>
					//[{src:"http://images.12301.cc/123624/14514654753878.jpg",link:"http://123624.12301.cc/wx/mall/pdetail.html?lid=3843"}]
					var _banner = data.banner;
					for(var i in _banner){
						var b = _banner[i];
						var bjson = {};
						for(var s in b){
							bjson["src"] = s;
							bjson["link"] = b[s];
						}
						that.__banner__.push(bjson);
					}
					res.data.banner = that.__banner__;
					opt.success(res);
					that.fire("success",res);
				}else{
					opt.fail(res.msg || PFT.AJAX_ERROR_TEXT);
					that.fire("fail",msg)
				}
			}
		})
	},
	getShopname : function(){
		return this.__shopname__;
	},
	getBanner : function(){
		return this.__banner__;
	}

},PFT.Util.PubSub);

module.exports = CustomShopConfig;