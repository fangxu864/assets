/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Model = require("./model");
var Header = require("./modules/header");
var PckInfoManager = require("./modules/pck-info-manager");
var Loading = require("COMMON/js/util.loading.pc.js");
var MainView = Backbone.View.extend({
	el : $("body"),
	initialize : function(){
		var that = this;
		this.model = new Model();
		this.tid = this.model.getTid();
		this.lid = this.model.getLid();
		this.model.fetchTicketInfo({
			loading : function(){
				var html = Loading("努力加载中，请稍后...",{
					id : "fetchTicketInfoLoading",
					width : 798,
					height : 600,
					css : {
						position : "absolute",
						zIndex : 1000,
						top : "28px",
						left : 0,
						right : 0,
						background : "#fff"
					}
				});
				$("#cardContainer").append(html);
			},
			complete : function(){ $("#fetchTicketInfoLoading").remove();},
			success : function(res){
				that.infoManager = new PckInfoManager({model:that.model});
				that.header = new Header({model:that.model});
				//点击删除一个套餐
				that.header.on("item.delete",function(data){
					that.infoManager.removeItem(data.id);
				});
				//点击切换套餐
				that.header.on("item.switch",function(data){
					var id = data.id;
					if(id>=0){
						that.infoManager.switchItem(id);
					}else{
						that.infoManager.createItem(id);
						that.infoManager.switchItem(id);
					}
				});
				that.header.init({model:that.model,initData:res});
				that.infoManager.init({model:that.model,initData:res});
			}
		});
	}
});

$(function(){
	new MainView();
})