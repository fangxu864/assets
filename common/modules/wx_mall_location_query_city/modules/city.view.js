/**
 * Author: huangzhiyang
 * Date: 2016/5/23 16:02
 * Description: ""
 */
var CityView = Backbone.View.extend({
	initialize : function(opt){
		this.location = opt.location;
		this.model.on("change",function(model){
			
		})
	},
	getCityData : function(){
		var that = this;
		var listUl = this.listUl;
		var all_citys = this.statics.getStorage();
		if(all_citys){
			this.render(all_citys);
			this.fire("ready");
		}else{
			PFT.Ajax({
				url : PFT.Url.order_v3,
				type : "get",
				dataType : "json",
				data : {
					action : "area_list"
				},
				loading : function(){
					listUl.html('<li class="sta state loading"><i class="iconfont loading">&#xe644;</i><span class="t">加载城市...</span></li>');
					that.fire("fetch.citys.loading");
				},
				removeLoading : function(res){
					listUl.html("");
					that.fire("fetch.citys.complete");
					that.fire("ready");
				},
				timeout : function(res){
					listUl.html('<li class="sta state timeout"><i class="iconfont">&#xe669;</i><span class="t">请求超时,请稍后重试...</span></li>');
					that.fire("fetch.citys.timeout");
				},
				serverError : function(res){
					listUl.html('<li class="sta state serverError"><i class="iconfont">&#xe669;</i><span class="t">请求出错,请稍后重试...</span></li>');
					that.fire("fetch.citys.serverError");
				}
			},function(res){
				var code = res.code;
				var areas = res.areas;
				if(code==200){
					that.statics.setStorage(areas);
					that.render(res.areas);
				}else{
					listUl.html('<li class="sta state fail"><i class="iconfont">&#xe669;</i><span class="t">请求失败,请稍后重试...</span></li>');
					that.fire("fetch.citys.fail");
				}
			})
		}
	}
});
module.exports = CityView;