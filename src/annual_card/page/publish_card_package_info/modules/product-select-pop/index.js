/**
 * Author: huangzhiyang
 * Date: 2016/6/7 15:40
 * Description: ""
 */
require("./style.scss");
var index_tpl = require("./index.html");
var ProdSelect = Backbone.View.extend({
	events : {
		"click .btn-group .pop-btn" : "onBtnClick",
		"click .clearSearchBtn" : "onClearBtnClick",
		"keyup .prodSelectSearchInp" : "onSearchInpChange",
		"focus .prodSelectSearchInp" : "onSearchInpFocus",
		"blur .prodSelectSearchInp" : "onSearchInpBlur"
	},
	el : $("#prodSelectPopContainer"),
	prodCache : null,
	ticketCache : {},
	initialize : function(){
		var that = this;
		this.mask = $("#prodSelectMask");
		this.$el.html(index_tpl);
		this.searchInp = $("#prodSelectSearchInp");
		this.prodListUl = $("#prodListUl");
		this.clearBtn = this.$el.find(".clearSearchBtn");
		this.model.on("fetchProdList.loading",function(){});
		this.model.on("fetchProdList.complete",function(){});
		this.model.on("fetchProdList.success",function(res){
			var data = res.data;
			that.prodCache = data;
			that.prodListUl.html(that.render(data));
		});
		this.model.on("fetchProdList.fail",function(res){});
	},
	onBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("yes")){
			this.trigger("")
		}else{
			this.close();
		}
	},
	onSearchInpChange : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		if(val){
			this.clearBtn.show();
		}else{
			this.clearBtn.hide();
		}
		//filter
		this.prodListUl.html(this.render(this.filter(val)));
	},
	onSearchInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		if(val){
			this.clearBtn.show();
		}else{
			this.clearBtn.hide();
		}
	},
	onClearBtnClick : function(e){
		this.searchInp.val("").focus();
		$(e.currentTarget).hide();
		this.prodListUl.html(this.render(this.prodCache));
	},
	onSearchInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		if(val){
			this.clearBtn.show();
		}else{
			this.clearBtn.hide();
		}
	},
	filter : function(keyword){
		keyword = $.trim(keyword);
		var prodCache = this.prodCache;
		if(!prodCache) return {};
		if(!keyword) return prodCache;
		var result = {};
		for(var i in prodCache){
			var name = prodCache[i];
			if(name.indexOf(keyword)>-1){
				result[i] = name;
			}
		}
		return result;
	},
	render : function(data){
		data = data || {};
		var html = "";
		for(var i in data){
			html += '<li class="prodItem" data-id="'+i+'">'+data[i]+'</li>';
		}
		if(!html) html = '<li class="status empty">查无产品...</li>';
		return html;
	},
	open : function(prodId,ticketId){
		this.mask.show();
		this.$el.show();
		if(this.prodCache) return false;
		this.model.fetchProdList();
	},
	close : function(){
		this.mask.hide();
		this.$el.hide();
	}
});
module.exports = ProdSelect;