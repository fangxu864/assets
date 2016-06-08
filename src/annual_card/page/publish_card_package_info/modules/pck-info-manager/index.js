/**
 * Author: huangzhiyang
 * Date: 2016/6/6 11:30
 * Description: ""
 */
var infoItem_tpl = require("./info.item.html");
var Calendar = require("COMMON/modules/calendar");
var ProdSelectPop = require("../product-select-pop");
var InfoManager = Backbone.View.extend({
	el : $("#slideUl"),
	events : {
		"focus .datePickerInp" : "onDatePickerInpFocus",
		"click .selectProd_picker" : "onSelectProdBtnClick",
		"click .deleteProdBtn" : "onDelectProdBtnClick",
		"click .addPckRightBtn" : "onAddPckRightBtnClick"
	},
	template : _.template(infoItem_tpl),
	initialize : function(){
		var that = this;
		this.itemWidth = $("#infoManagerContainer").width();
		this.model.on("ready",this.initList,this);

		this.Calendar = new Calendar();

		this.ProdSelectPop = new ProdSelectPop({model:this.model});

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
			html += template({data:data[i]});
		}
		this.$el.html(html).css({position:"relative"});
		this.refreshSlide()
	},
	onDatePickerInpFocus : function(e){
		var calendar = this.Calendar;
		var tarInp = $(e.currentTarget);
		var date = tarInp.val() || "2016-06-03";
		calendar.show(date,{
			picker : tarInp,
			top : 1
		})
	},
	//套餐特权-点击选择产品
	onSelectProdBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		this.ProdSelectPop.open();
	},
	//套餐特权-点击删除产品
	onDelectProdBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		console.log(tarBtn);
	},
	//套餐特权-点击新增一个产品
	onAddPckRightBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		console.log(tarBtn);
	},
	//新增一个套餐详情
	createItem : function(id){
		var html = this.template({data:{id:id}});
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
	refreshSlide : function(callback){
		var items = this.$el.children();
		var width = this.itemWidth;
		var count = items.length;
		this.$el.width(width*count);
		callback && callback(items,width,count);
	}
});
module.exports = InfoManager;
