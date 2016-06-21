/**
 * Author: huangzhiyang
 * Date: 2016/6/3 16:27
 * Description: ""
 */
var fn = new Function();
var Api = require("../../common/api.js");
var ManagerStore = Backbone.Model.extend({
	__Cache : {},
	api : {
		fetch_package_list : Api.Url.PackageInfo.getPackageInfoList,
		fetch_prod_list : Api.Url.PackageInfo.getLands,
		fetch_ticket : Api.Url.PackageInfo.getTickets
	},
	initialize : function(){

	},
	getTid : function(){
		return PFT.Util.UrlParse()["tid"] || "";
	},
	/**
	* 获取指定年卡产品内的套餐信息
	*/
	fetchTicketInfoByTid : function(tid,opt){
		tid = tid || this.getTid();
		if(!tid) return false;
		var opt = opt || {};
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var that = this;
		if(this.__Cache[tid]){
			loading();
			complete();
			success(this.__Cache[tid]);
			return false;
		}
		PFT.Util.Ajax(this.api.fetch_package_list,{
			type : "post",
			params : {
				tid : tid
			},
			loading : function(){
				loading();
				that.trigger("fetchTicketInfo.loading");
			},
			complete : function(){
				complete();
				that.trigger("fetchTicketInfo.complete");
			},
			success : function(res){
				that.__Cache[tid] = res;
				success(res);
				that.trigger("fetchTicketInfo.ready",res);
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