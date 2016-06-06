/**
 * Author: huangzhiyang
 * Date: 2016/6/3 16:27
 * Description: ""
 */
var ManagerStore = Backbone.Model.extend({
	defaults : {
		data : {}
	},
	api : {
		fetch_list : "/r/publish_prod_package/fetch_list"
	},
	initialize : function(){
		this.fetchPackageList(this.getCardID());
	},
	getCardID : function(){
		return "234234";
	},
	/**
	* 获取指定年卡产品内的套餐信息
	*/
	fetchPackageList : function(cardID){
		var that = this;
		PFT.Util.Ajax(this.api.fetch_list,{
			loading : function(){},
			complate : function(){},
			success : function(res){
				that.trigger("ready",res);
			}
		})
	}
});
module.exports = ManagerStore;