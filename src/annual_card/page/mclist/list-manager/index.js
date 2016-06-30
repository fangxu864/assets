/**
 * Author: huangzhiyang
 * Date: 2016/6/29 16:29
 * Description: ""
 */
var itemContainerTpl = require("./item-container-tpl.xtpl");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var Api = require("../../../common/api.js");
var Manager = Backbone.View.extend({
	el : $("#listSlideContainer"),
	tableTh : {
		//激活状态
		1 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"],
		//未激活状态
		0 : ["售出时间","虚拟卡号/实体卡号 ","发卡商户","激活情况"],
		//禁用状态
		2 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"],
		//挂失状态
		4 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"]
	},
	initialize : function(opt){
		opt = opt || {};
		this.state = opt.state;
		this.itemWidth = this.$el.width();
		this.statusArr = opt.statusArr;
		this.slideUl = this.$el.find(".slideUl");
		this.slideUl.width(this.itemWidth*this.statusArr.length);
		this.buildSlideItem(this.statusArr);
	},
	buildSlideItem : function(status){
		var that = this;
		var template = _.template(itemContainerTpl);
		var tableTh = this.tableTh;
		var html = "";
		for(var i=0; i<status.length; i++){
			var _stus = status[i];
			var ths = tableTh[_stus];
			html += template({data:{
				width : that.itemWidth,
				status : _stus,
				ths : ths,
				loading : ""
			}});
		}
		this.slideUl.html(html);
	},
	getSupplySelectVal : function(){
		return $("#supplySelect").val();
	},
	//要切换(激活哪个slide item)
	active : function(status){
		var tarItem = $("#listItemLi_"+status);
		var index = tarItem.index();
		var state = this.state[status] || (this.state[status]={});
		var supply = this.getSupplySelectVal();
		var keyword = $("#searchInp").val();
		var listData = state.listData;
		//切换之前，先把当前pannel里的状态保存到state里
		state["supply"] = supply;
		state["keyword"] = keyword;
		$("#searchInp").val("");
		if(!listData) this.getList(status);
		this.slideUl.animate({left:-1*this.itemWidth*index},400);
	},
	getList : function(status,page,keyword){
		var that = this;
		var container = $("#listItemLi_"+status).find(".tbody");
		PFT.Util.Ajax(Api.Url.storage.getList,{
			params : {
				status : status,
				page : page,
				page_size : 20,
				identify : keyword
			},
			loading : function(){
				var loading = LoadingPc("努力加载中，请稍后..",{
					tag : "tr",
					height : 300,
					colspan : that.tableTh[status].length,
					css : {
						"text-align" : "center"
					}
				});
				container.html(loading);
			},
			complete : function(){

			},
			success : function(res){

			}
		})
	}
});
module .exports = Manager;