/**
 * Author: huangzhiyang
 * Date: 2016/6/3 16:56
 * Description: ""
 */
require("./style.scss");
var indexTpl = require("./index.html");
var itemTpl = require("./item.html");
var Header = Backbone.View.extend({
	el : $("#headContainer"),
	template : _.template(itemTpl),
	events : {
		"click .pckTitListUlItem" : "onItemClick",
		"click #addPckBtn" : "addItem"
	},
	initialize : function(){
		var that = this;
		this.$el.html(indexTpl);
		this.$addBtn = $("#addPckBtn");
		//从服务器取回套餐信息后
		this.model.on("ready",function(res){

		})
	},
	onItemClick : function(e){
		var tarItem = $(e.currentTarget);
		if(!tarItem.hasClass("pckTitListUlItem")) return false;
		var id = tarItem.attr("data-id");
		var name = tarItem.find(".name").text();
		tarItem.addClass("edit").siblings().removeClass("edit");
		this.trigger("item.switch",{
			id : id,
			name : name
		})
	},
	/**
	 * 添加一个套餐
	 */
	addItem : function(){
		var html = this.renderItem("","");
		this.$addBtn.parent().before(html);
	},
	renderItem : function(id,name){
		return this.template({id:id,name:name});
	}
});
module.exports = Header;