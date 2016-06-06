/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Model = require("./model");
var Header = require("./modules/header");
var PckInfoManager = require("./modules/pck-info-manager");
var MainView = Backbone.View.extend({
	el : $("body"),
	events : {
		"click #saveBtn" : "onSubmitBtnClick"
	},
	initialize : function(){
		var that = this;
		this.model = new Model();

		this.infoManager = new PckInfoManager({model:this.model});

		this.header = new Header({model:this.model});

		//点击删除一个套餐
		this.header.on("item.delete",function(data){
			that.infoManager.removeItem(data.id);
		});
		//点击切换套餐
		this.header.on("item.switch",function(data){
			var id = data.id;
			if(id>=0){
				that.infoManager.switchItem(id);
			}else{
				that.infoManager.createItem(id);
				that.infoManager.switchItem(id);
			}
		});

	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		
	}
});

$(function(){
	new MainView();
})