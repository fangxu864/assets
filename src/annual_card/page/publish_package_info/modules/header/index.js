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
	initialize : function(opt){},
	init : function(opt){
		var that = this;
		this.$el.html(indexTpl);
		this.$addBtn = $("#addPckBtn");
		this.listUl = $("#pckTitListUl");
		this.tid = this.model.getTid(); //票id
		this.lid = this.model.getLid(); //景区id
		var initData = opt.initData;
		var html = "";
		if(this.tid){ //址地栏传入tid进来
			var data = initData.data.otherTicket || [];
			for(var i in data){
				var item = data[i];
				var tid = item.tid;
				var ttitle = item.title;
				html += that.renderItem(tid,ttitle);
			}
			that.$addBtn.before(html);
			that.listUl.children(".pckTitListUlItem").filter("[data-id="+this.tid+"]").trigger("click");
		}else{//地址栏没传入tid 说明是新建一个景区
			html += that.renderItem(that.getUID(),"");
			that.$addBtn.before(html);
			that.listUl.children(".pckTitListUlItem").first().trigger("click");
		}
		$("#packageName").text(initData.data.attribute.ltitle);
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
	renderItem : function(tid,ttitle){
		return this.template({tid:tid,ttitle:ttitle});
	}
});
module.exports = Header;