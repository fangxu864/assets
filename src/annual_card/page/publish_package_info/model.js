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
		fetch_list : "/r/publish_prod_package/fetch_list",
		fetch_prod_list : "/r/product_annualCard/getLands/",
		fetch_ticket : "/r/product_annualCard/getTickets/"
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
	},
	/**
	 * 获取产品列表
	 */
	fetchProdList : function(){
		var that = this;
		PFT.Util.Ajax(this.api.fetch_prod_list,{
			loading : function(){
				that.trigger("fetchProdList.loading");
			},
			complate : function(){
				that.trigger("fetchProdList.complete");
			},
			success : function(res){
				res = res || {};
				var code = res.code;
				if(code==200){
					that.trigger("fetchProdList.success",res);
				}else{
					that.trigger("fetchProdList.fail",res);
				}
			}
		})
	},
	/**
	 * 获取某个产品下的票类
	 * @param prod_id
	 */
	fetchTicket : function(prod_id,aid){
		if(!prod_id || !aid) return false;
		var that = this;
		PFT.Util.Ajax(this.api.fetch_ticket,{
			type : "get",
			params : {
				lid : prod_id,
				aid : aid
			},
			loading : function(){
				that.trigger("fetchTicket.loading");
			},
			complate : function(){
				that.trigger("fetchTicket.complete");
			},
			success : function(res){
				res = res || {};
				var code = res.code;
				if(code==200){
					that.trigger("fetchTicket.success",{prodId:prod_id,aid:aid,data:res});
				}else{
					that.trigger("fetchTicket.fail",res);
				}
			}
		})
	}
});
module.exports = ManagerStore;