/**
 * Author: huangzhiyang
 * Date: 2016/6/29 16:29
 * Description: ""
 */
var itemContainerTpl = require("./item-container-tpl.xtpl");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
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
		var loading = LoadingPc("努力加载中，请稍后..",{
			tag : "span",
			height : 400
		});
		var html = "";
		for(var i=0; i<status.length; i++){
			var _stus = status[i];
			var ths = tableTh[_stus];
			html += template({data:{
				width : that.itemWidth,
				status : _stus,
				ths : ths,
				loading : loading
			}});
		}
		this.slideUl.html(html);
	},
	//要切换(激活哪个slide item)
	active : function(status){
		var tarItem = $("#listItemLi_"+status);
		var index = tarItem.index();
		this.slideUl.animate({left:-1*this.itemWidth*index},400);
	}
});
module .exports = Manager;