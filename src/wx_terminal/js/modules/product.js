/**
 * Created by Administrator on 15-9-21.
 */
var TerminalCore = require("./terminal.core.js");
var Product = RichBase.extend({
	statics : {
		api : "../m/voucher_check.php",
		timeout : 5 * 60 * 1000,
		reloadProduct : false,
		searchInpChangeTimeout : 100,
		getProductData : function(){
			return this.__Data || (this.__Data==[]);
		},
		setProductData : function(data){
			if(!data || !(data instanceof Array)) return false;
			this.__Data = data;
		},
		showMask : function(){
			$("#gmaskLayer").show().css("z-index",100002);
		},
		hideMask : function(){
			$("#gmaskLayer").hide().css("z-index",-1);
		},
		showLogin : function(){
			$("#loginWrap").show().css("z-index",100001);
		},
		hideLogin : function(){
			$("#loginWrap").hide().css("z-index",-1);
		}
	},
	EVENTS : {
		"input" : {
			".prodSearchInp" : "onSearchInpChange"
		},
		"tap" : {
			".clearBtn" : "onClearBtnTap",
			".listUl .item" : "onItemTap"
		}
	},
	searchInpChangeTimer : null,
	init : function(opt){
		this.container = opt.container;
		this.listUl = this.container.find(".listUl");
		this.clearBtn = $("#searchProdBox").find(".clearBtn");
	},
	bootstrap : function(){
		var that = this;
		login.on("login.success",function(data){
			if(that.statics.reloadProduct){
				that.statics.reloadProduct = false;
				that.loadProduct();
			}
		});
		this.Core = new TerminalCore();
		this.loadProduct();
	},
	onSearchInpChange : function(that,e){
		clearTimeout(that.searchInpChangeTimer);
		that.searchInpChangeTimer = setTimeout(function(){
			var tarInp = $(e.currentTarget);
			var val = tarInp.val();
			var clearBtn = that.clearBtn;
			if(val){
				that.renderHtml(that.filter(val));
				clearBtn.show();
			}else{
				that.renderHtml(that.filter());
				clearBtn.hide();
			}
		},that.statics.searchInpChangeTimeout);
	},
	onClearBtnTap : function(that,e){
		var tarBtn = $(e.currentTarget);
		$("#prodSearchInp").val("").focus();
		tarBtn.hide();
		that.renderHtml(that.filter());
	},
	onItemTap : function(that,e){
		var tarItem = $(e.currentTarget);
		tarItem.addClass("active").siblings().removeClass("active");
		var title = tarItem.find(".t").text();
		var salerid = tarItem.attr("data-id");
		$("#productname").attr("data-salerid",salerid).text(title);
		that.fire("item.tap",tarItem);
		window.history.go(-1);
	},
	filter : function(keyword){
		var oData = this.statics.getProductData();
		var result = [];
		if(!keyword) return oData;
		for(var i in oData){
			var d = oData[i];
			var title = d["title"];
			if(title.indexOf(keyword)>-1){
				result.push(d);
			}
		}
		return result;
	},
	loadProduct : function(){
		var that = this;
		this.Core.loadProduct({
			loading : function(){
				that.statics.showMask();
			},
			removeLoading : function(){
				that.statics.hideMask();
			},
			success : function(res){
				var list = res.list;
				that.renderHtml(list);
				that.statics.setProductData(list);
				setTimeout(function(){
					that.fire("product.load.success",res);
				},10)
			},
			empty : function(res){
				alert("查无景区产品,请重新进入页面");
			},
			unlogin : function(res){
				that.statics.showLogin();
				that.statics.reloadProduct = true;
			},
			error : function(res){	alert("请求出错,请稍后重试")},
			timeout : function(res){ alert("请求超时,请稍后重试")},
			serverError : function(res){ alert("请求出错,请稍后重试")}
		})
	},
	renderHtml : function(data){
		var that = this;
		var tpl  =$("#productItemTpl").html();
		var html = "";
		for(var i in data){
			var d = data[i];
			html += that.parseTemplate(tpl,d);
		}
		if(!html) html = '<li style="height:150px;line-height:150px; text-align:center"><i class="iconfont" style="font-size:18px; margin-right:2px; vertical-align:middle">&#xe669;</i><span class="t" style="font-size:14px; vertical-align:middle">查无产品...</span></li>'
		that.listUl.html(html);
	},
	show : function(){ this.container.show();},
	close : function(){ this.container.hide();}
});
module.exports = Product;
