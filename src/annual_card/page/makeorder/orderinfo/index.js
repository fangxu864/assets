/**
 * Author: huangzhiyang
 * Date: 2016/6/17 16:27
 * Description: ""
 */
var Api = require("../../../common/api.js");
var OrderIno = Backbone.View.extend({
	initialize : function(){
		this.urlParams = PFT.Util.UrlParse();
		this.pid = this.urlParams["pid"];
		this.aid = this.urlParams["aid"];
		this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
		this.type = this.physics ? "physics" : "virtual";
		if(!this.pid || !this.aid || !this.type) return false;
		this.getInfo(this.pid,this.aid,this.type);
	},
	getInfo : function(pid,aid,type){
		PFT.Util.Ajax(Api.Url.makeOrder.getOrderInfo,{
			loading : function(){},
			complete : function(){},
			success : function(res){

			}
		})
	}
});
module.exports = OrderIno;