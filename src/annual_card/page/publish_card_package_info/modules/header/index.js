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
		"click #addPckBtn" : "addItem",
		"click .removeBtn" : "onRemoveBtnClick"
	},
	_uid : 0,
	initialize : function(){
		var that = this;
		this.$el.html(indexTpl);
		this.$addBtn = $("#addPckBtn");
		this.listUl = $("#pckTitListUl");
		//从服务器取回套餐信息后
		this.model.on("ready",function(res){
			var html = "";
			res = res || "";
			var code = res.code;
			var data = res.data;
			var msg = res.msg;
			if(code==200){
				for(var i in data){
					var item = data[i];
					html += that.renderItem(item.id,item.name);
				}
				that.$addBtn.before(html);
				that.listUl.children().first().trigger("click");
			}else{
				alert(msg);
			}
		})
	},
	//点击切换
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
	onRemoveBtnClick : function(e){
		e.stopPropagation();
		if(!confirm("删除该卡种，关联的会员特权也一并删除，是否确定删除？")) return false;
		var tarBtn = $(e.currentTarget);
		var parent = tarBtn.parents(".pckTitListUlItem");
		var id = parent.attr("data-id");
		parent.remove();
		this.trigger("item.delete",{id:id});
		this.listUl.children(".pckTitListUlItem").first().trigger("click");
	},
	switchItem : function(id){
		if(!id) return false;
		this.listUl.find(".pckTitListUlItem[data-id="+id+"]").addClass("edit").siblings().removeClass("edit");
	},
	getUID : function(){
		this._uid++;
		return -1 * this._uid;
	},
	/**
	 * 添加一个套餐
	 */
	addItem : function(){
		var id = this.getUID();
		var html = this.renderItem(id,"");
		this.listUl.children().removeClass("edit");
		this.$addBtn.before(html);
		this.listUl.children(".pckTitListUlItem").last().trigger("click");
	},
	renderItem : function(id,name){
		return this.template({id:id,name:name});
	}
});
module.exports = Header;