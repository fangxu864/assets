/**
 * Author: huangzhiyang
 * Date: 2016/6/6 11:30
 * Description: ""
 */
var infoItem_tpl = require("./info.item.html");
var rightsItem_tpl = require("./pck.right.item.tpl");
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
	rightsTemplate : _.template(rightsItem_tpl),
	initialize : function(){
		var that = this;
		this.itemWidth = $("#infoManagerContainer").width();
		this.model.on("ready",this.initList,this);

		this.Calendar = new Calendar();

		this.ProdSelectPop = new ProdSelectPop({model:this.model});
		//切换特权产品
		this.ProdSelectPop.on("switch.prod",function(data){
			var before = data.before;
			var after = data.after;
			var pckId = data.pckId;
			var item = $("#privItem_"+pckId+"_"+before.prodId+"_"+before.ticId);
			if(item.length==0) return false;
			item.attr("data-prodId",after.prodId).attr("data-ticId",after.ticId).attr("data-aid",after.aid)
				.attr("id","privItem_"+pckId+"_"+after.prodId+"_"+after.ticId)
				.find(".name").text(after.prodName+" - "+after.ticName);
		});
		//新增一个特权产品
		this.ProdSelectPop.on("add.prod",function(data){
			var pckId = data.pckId;
			var index = that.getPckRightListIndexMax(pckId)+1;
			var prodId = data.prodId;
			var ticId = data.ticId;
			if($("#privItem_"+pckId+"_"+prodId+"_"+ticId).length) return alert("该产品已存在，请勿重得添加");
			var html = that.renderPckRightList(pckId,[{
				index : index,
				product : {
					id : data.prodId,
					name : data.prodName
				},
				ticket : {
					id : data.ticId,
					name : data.ticName,
					aid : data.aid
				},
				rule : {}
			}]);
			$("#pckRightListUl_"+pckId).append(html);
		})

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
			var d = data[i];
			var priv = d.priv;
			d["priv"] = this.renderPckRightList(i,priv);
			html += template({data:d});
		}
		this.$el.html(html).css({position:"relative"});
		this.refreshSlide();
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
		var pckId = tarBtn.attr("data-pckid");
		var parent = tarBtn.parents(".pckRightItem");
		var prodId = parent.attr("data-prodid");
		var ticId = parent.attr("data-ticid");
		this.ProdSelectPop.open({
			pckId : pckId,
			prodId : prodId,
			ticId : ticId
		});
	},
	//套餐特权-点击删除产品
	onDelectProdBtnClick : function(e){
		if(!confirm("确定删除此特权产品吗？")) return false;
		var tarBtn = $(e.currentTarget);
		tarBtn.parents(".pckRightItem").remove();
	},
	//套餐特权-点击新增一个产品-打开产品选择弹窗
	onAddPckRightBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var pckId = tarBtn.attr("data-pckid");
		this.ProdSelectPop.open({
			pckId : pckId
		});
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
	},
	/**
	 * 渲染某个套餐的特权模块
	 * @param rights []
	 */
	renderPckRightList : function(pckId,rights){
		return this.rightsTemplate({pckId:pckId,privilege:rights});
	},
	//获取套权商品列表里最大的index值
	getPckRightListIndexMax : function(pckId){
		var max = 0;
		$("#pckRightListUl_"+pckId).children().each(function(){
			var index = $(this).attr("data-index") * 1;
			if(index>max) max=index;
		})
		return max;
	}
});
module.exports = InfoManager;
