/**
 * Author: huangzhiyang
 * Date: 2016/6/17 15:17
 * Description: ""
 */
var Api = require("../../../common/api.js");
var Loading_Pc = require("COMMON/js/util.loading.pc.js");
var List = Backbone.View.extend({
	el : $("#cardMsgListUl"),
	loading_str : Loading_Pc("请稍后",{tag:"li",height:100}),
	initialize : function(){
		var urlParam = PFT.Util.UrlParse();
		var pid = this.pid = urlParam["pid"];
		var physics = this.physics = urlParam["physics"];
		this.error = "";
		if(!pid) return alert("缺少pid");
		this.getList(pid,physics);
		this.$el.html(this.loading_str);
	},
	cacheData : [],
	getList : function(pid,physics){
		var that = this;
		physics = physics || "";
		PFT.Util.Ajax(Api.Url.makeOrder.getCardsForOrder,{
			params : {
				pid : pid,
				physics : physics
			},
			loading : function(){ that.renderList("loading")},
			complete : function(){ that.renderList("complete")},
			success : function(res){
				res = res || {};
				if(res.code==200){
					that.cacheData = res.data;
					var d = res.data[0] || {};
					that.sid = d["sid"] || "";
					that.renderList(res.data);
				}else{
					that._getCardsForOrder_ErrorText = res.msg || "获取卡列表信息出错";
					that.renderList(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	renderList : function(data){
		var html = "";
		if(data=="loading"){
			html = this.loading_str;
		}else if(data=="complete"){
			html = "";
		}else if(Object.prototype.toString.call(data)=="[object Array]"){
			for(var i in data){
				var d = data[i];
				var virtual_no = d["virtual_no"];
				var sid = d["sid"];
				var physics_no = d["physics_no"];
				var card_no = d["card_no"] || "无";
				html += '<li data-sid="'+sid+'" data-virtual="'+virtual_no+'" data-card="'+card_no+'" data-physics="'+physics_no+'" class="border cardItem"><p>虚拟卡号：'+virtual_no+'</p><p>实体卡号：'+card_no+'</p><p>物理ID：'+physics_no+'</p></li>';
			}
			if(!html){
				html += '<li class="status empty" style="height:100px; line-height:100px; text-align:center">无查卡信息</li>';
				this.error = "无查卡信息";
				$("#submitBtn").addClass("disable");
			}
		}else{
			html = '<li class="status fail" style="height:100px; line-height:100px; text-align:center">'+data+'</li>';
			this.error = data;
			$("#submitBtn").addClass("disable");
		}
		this.$el.html(html);
	},
	getSid : function(){
		return this.sid;
	},
	getVirtualCards : function(){
		var data = this.cacheData;
		var result = [];
		for(var i in data){
			var d = data[i];
			var virtual_no = d["virtual_no"];
			result.push(virtual_no);
		}
		return result.join(",");
	},
	getCardsForOrder_ErrorText : function(){
		return this._getCardsForOrder_ErrorText;
	}
});
module.exports = List;