/**
 * Author: huangzhiyang
 * Date: 2016/6/7 15:40
 * Description: ""
 */
require("./style.scss");
var index_tpl = require("./index.html");
var ticket_item_tpl = require("./ticket.item.tpl");
var prod_item_tpl = require("./product.item.tpl");
var ProdSelect = Backbone.View.extend({
	events : {
		"click .btn-group .pop-btn" : "onBtnClick",
		"click .clearSearchBtn" : "onClearBtnClick",
		"keyup .prodSelectSearchInp" : "onSearchInpChange",
		"focus .prodSelectSearchInp" : "onSearchInpFocus",
		"blur .prodSelectSearchInp" : "onSearchInpBlur",
		"click #prodListUl li" : "onProdItemClick"
	},
	el : $("#prodSelectPopContainer"),
	prodCache : null,
	ticketCache : {},
	ticketTemplate : _.template(ticket_item_tpl),
	prodTemplate : _.template(prod_item_tpl),
	pckId : "",
	prodId : "",
	ticId : "",
	aid : "",
	initialize : function(){
		var that = this;
		this.mask = $("#prodSelectMask");
		this.$el.html(index_tpl);
		this.searchInp = $("#prodSelectSearchInp");
		this.prodListUl = $("#prodListUl");
		this.ticketListUl = $("#ticketListUl");
		this.clearBtn = this.$el.find(".clearSearchBtn");

		//请求产品列表
		this.model.on("fetchProdList.loading",function(){
			that.renderProductList("loading");
		});
		this.model.on("fetchProdList.success",function(res){
			var prodList = res.data;
			that.prodCache = prodList;
			that.renderProductList("success",prodList);
		});
		this.model.on("fetchProdList.fail",function(res){
			that.renderProductList("fail");
		});

		//请求某一产品下的票类列表
		this.model.on("fetchTicket.loading",function(){
			that.renderTicketList("loading");
		});
		this.model.on("fetchTicket.success",function(data){
			var prodId = data.prodId;
			var res = data.data;
			var ticketData = res.data;
			if(prodId && ticketData){
				that.ticketCache[prodId] = ticketData;
				that.renderTicketList("success",ticketData);
			}else{
				that.renderTicketList("fail");
			}
		});
		this.model.on("fetchTicket.fail",function(res){
			that.renderTicketList("fail");
		});

	},
	onBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("yes")){
			var prod = this.prodListUl.children(".active");
			var ticRadio = this.ticketListUl.find("input[type=radio][name=prodSelect_ticketRadio]:checked");
			var prodId = prod.attr("data-prodid");
			var prodName = prod.find(".t").text();
			var ticId = ticRadio.attr("data-ticid");
			var ticName = ticRadio.parent().find(".t").text();
			var aid = ticRadio.parent().find(".aidSelect").val();
			if(this.prodId && this.ticId){ //切换特权商品
				if(this.prodId==prodId && this.ticId==ticId) return false;
				this.trigger("switch.prod",{
					pckId : this.pckId,
					before : {
						prodId : this.prodId,
						ticId : this.ticId,
						aid : this.aid
					},
					after : {
						prodId : prodId,
						prodName : prodName,
						ticId : ticId,
						ticName : ticName,
						aid : aid
					}
				},this)
			}else{ //新增一个特权商品
				this.trigger("add.prod",{
					pckId : this.pckId,
					prodId : prodId,
					prodName : prodName,
					ticId : ticId,
					ticName : ticName,
					aid : aid
				},this)
			}
		}
		this.close();
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
		this.renderProductList("success",this.filter(val));
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
		this.renderProductList("success",this.prodCache);
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
	//点击产品item，请求该产品对应的票类 (引入缓存)
	onProdItemClick : function(e){
		var tarItem = $(e.currentTarget);
		var prod_id = tarItem.attr("data-prodid");
		if(prod_id){
			var cache = this.ticketCache[prod_id];
			if(cache){ //如果已经请求过并缓存起来了
				this.renderTicketList("success",cache);
			}else{
				this.model.fetchTicket(prod_id);
			}
			tarItem.addClass("active").siblings().removeClass("active");
		}else{
			this.renderTicketList("success",[])
		}
	},
	filter : function(keyword){
		keyword = $.trim(keyword);
		var prodCache = this.prodCache;
		if(!prodCache) return {};
		if(!keyword) return prodCache;
		var result = [];
		for(var i in prodCache){
			var prod = prodCache[i];
			var name = prod["name"];
			if(name.indexOf(keyword)>-1){
				result.push(prod);
			}
		}
		return result;
	},
	//渲染产品列表
	renderProductList : function(type,products){
		var html = "";
		if(type=="success"){
			html = this.prodTemplate({products:products});
			if(!html){ //如果为空
				html = '<li class="status empty">查无匹配产品...</li>';
			}
		}else if(type=="loading"){
			html = '<li class="status loading">努力加载中...</li>';
		}else if(type=="fail" || type=="serverError"){
			html = '<li class="status error">'+PFT.AJAX_ERROR_TEXT+'</li>';
		}else if(type=="timeout"){
			html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
		}
		this.prodListUl.html(html);
		this.prodListUl.children().first().trigger("click");
	},
	//渲染票类列表
	renderTicketList : function(type,tickets){
		var html = "";
		if(type=="success"){
			html = this.ticketTemplate({tickets:tickets});
			if(!$.trim(html)){ //如果为空
				html = '<li class="status empty">查无匹配票类...</li>';
			}
		}else if(type=="loading"){
			html = '<li class="status loading">努力加载中...</li>';
		}else if(type=="fail" || type=="serverError"){
			html = '<li class="status error">'+PFT.AJAX_ERROR_TEXT+'</li>';
		}else if(type=="timeout"){
			html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
		}
		this.ticketListUl.html(html);
	},
	open : function(data){
		this.pckId = data.pckId;
		this.prodId = data.prodId;
		this.ticId = data.ticId;
		this.aid = data.aid;
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
