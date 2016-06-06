/**
 * Author: huangzhiyang
 * Date: 2016/6/6 11:30
 * Description: ""
 */
var infoItem_tpl = require("./info.item.html");
var InfoManager = Backbone.View.extend({
	el : $("#slideUl"),
	template : _.template(infoItem_tpl),
	initialize : function(){
		var that = this;
		this.itemWidth = $("#infoManagerContainer").width();
		this.model.on("ready",this.initList,this);
	},
	//获取套餐列表，初始化slide item
	initList : function(res){
		var template = this.template;
		var html = "";
		res = res || {};
		var code = res.code;
		var data = res.data;
		var msg = res.msg;
		if(code!=200) return false;
		var itemCount = 0;
		for(var i in data){
			itemCount++;
			html += template(data[i]);
		}
		this.$el.html(html).css({position:"relative"});
		this.refreshSlide()
	},
	//新增一个套餐详情
	createItem : function(id){
		var html = this.template({id:id});
		this.$el.append(html);
		this.refreshSlide();
	},
	//删除一个套餐详情
	removeItem : function(id){
		$("#slideItem_"+id).remove();
		this.refreshSlide();
	},
	//切换到指定某个套餐
	switchItem : function(id,callback){
		var tarItem = $("#slideItem_"+id);
		var width = this.itemWidth;
		this.$el.animate({left : -1 * tarItem.index() * width},300,function(){
			callback && callback();
		})
	},
	renderInfoItem : function(data){

	},
	//获取某个套餐的详细字段信息
	getInfoParams : function(pckId){

	},
	refreshSlide : function(callback){
		var items = this.$el.children();
		var width = this.itemWidth;
		var count = items.length;
		this.$el.width(width*count);
		callback && callback(items,width,count);
	}
});
module.exports = InfoManager;