/**
 * Created by Administrator on 15-10-20.
 */
var Api = require("./api.js");
var Product = RichBase.extend({
	statics : {
		SEARCH_FLAG : true,
		cacheData : null
	},
	EVENTS : {
		"click" : {
			"" : "onContainerClick",
			".productListBox" : "onProductListBoxClick",
			".listUl .pItem" : "onItemClick"
		},
		"keyup" : {
			".searchInp" : "onSearchInpKeyup"
		}
	},
	//当产品数大于50个时，开启搜索功能(admin默认开启搜索)
	PRODUCT_COUNT_TRIGGER_SEARCH : 50,
	cacheData : null,
	init : function(opt){
		var that = this;
		this.container = opt.container;
		this.selectBox = this.container.children();
		this.searchBox = this.container.find(".searchBox");
		this.listUl = this.container.find(".listUl");
		this.searchInp = this.container.find(".searchInp");
		this.triggerInp = $("#prodSearchInp");
		var sid = Api.getSid();
		this.triggerInp.on("click",function(){
			if(sid) return false;
			that.showSelect();
		})
		Api.fetchProduct({sid:sid},{
			loading : function(){
				that.showProdStatus();
				$("#prodBoxStatus").html('<img class="loading" src="'+Api.LOADING_IMG+'"/><span class="t">正在加载产品...</span>');
			},
			removeLoading : function(){ that.hideProdStatus()},
			success : function(res){
				var list = res.list;
				that.statics.cacheData = list;
				that.render(list);
				//当产品数大于50个时，开启搜索功能(admin默认开启搜索)
				if(sid || (!Api.checkIsAdmin() && list.length<50)){
					that.searchBox.hide();
				}else{
					that.searchBox.show();
				}
				setTimeout(function(){
					that.listUl.children().first().trigger("click");
				},10)
			},
			empty : function(res){
				that.showProdStatus();
				$("#prodBoxStatus").show().html('<span class="t">没有产品...</span>');
			},
			fail : function(res){
				alert(res.msg || Api.AJAX_ERROR_TEXT);
			}
		})
	},
	onContainerClick : function(that,e){
		that.closeSelect();
	},
	onProductListBoxClick : function(that,e){
		e.stopPropagation();
		e.preventDefault();
	},
	//搜索
	onSearchInpKeyup : function(that,e){
		var tarInp = that.searchInp;
		var val =tarInp.val();
		var data = that.filterData(val);
		that.render(data);
	},
	onItemClick : function(that,e){
		var tarItem = $(e.currentTarget);
		var id = tarItem.attr("data-id");
		var salerid = tarItem.attr("data-salerid");
		var terminal = tarItem.attr("data-terminal");
		var text = tarItem.text();
		var imgSrc = tarItem.attr("data-img");
		tarItem.addClass("active").siblings().removeClass("active");
		$("#term_prodId").text(id);
		$("#term_termNum").text(terminal);
		$("#term_prodNum").text(salerid);
		that.triggerInp.val(text);
		that.loadPhotoImg(id,imgSrc);
		that.closeSelect();
	},
	filterData : function(keyword){
		var cacheData = this.statics.cacheData;
		var result = [];
		if(!keyword) return cacheData;
		for(var i in cacheData){
			var d = cacheData[i];
			var title = d["title"];
			if(title.indexOf(keyword)>-1) result.push(d);
		}
		return result;
	},
	posSelect : function(){
		var triggerInp = this.triggerInp;
		var offset = triggerInp.offset();
		this.selectBox.css({
			left : offset.left,
			top : offset.top + 36
		})
	},
	showSelect : function(){
		this.container.show();
		this.searchInp.focus();
		this.posSelect();
	},
	closeSelect : function(){
		this.container.hide();
	},
	showProdStatus : function(){
		$("#prodPhoto").hide();
		$("#prodMsg").hide();
		$("#prodBoxStatus").show();
	},
	hideProdStatus : function(){
		$("#prodPhoto").show();
		$("#prodMsg").show();
		$("#prodBoxStatus").hide();
	},
	//更换产品/景区  加载photo img
	loadPhotoImg : function(id,imgpath){
		if(!imgpath) return false;
		var container = $("#prodPhoto");
		var oimg = $("#photoImg"+id);
		var img = container.children(".loading");
		$(img).attr("src",imgpath);
		if(oimg.length){
			oimg.show().siblings().hide();
		}else{
			PFT.Help.LoadImage(container,imgpath,{
				loading : function(){
					container.children(".loading").show().siblings().hide();
				},
				success : function(container,src,img){
					container.children().hide();
					img = $(img);
					img.attr("id","photoImg"+id).attr("width",container.width()).attr("height",container.height()).show().appendTo(container);
				},
				error : function(){
					container.children(".error").show().siblings().hide();
				}
			})
		}
	},
	render : function(data){
		var html = this.buildHtml(data);
		if(!html) html = '<li style="height:100px; line-height:100px; text-align:center; border-bottom:0 none">没有匹配数据</li>';
		this.listUl.html(html);
	},
	buildHtml : function(data){
		var html = "";
		for(var i in data){
			var d = data[i];
			var id = d["id"];
			var salerid = d["salerid"];
			var terminal = d["terminal"];
			var imgpath = d["imgpath"];
			var title = d["title"] || "无标题产品";
			html += '<li class="pItem" data-id="'+id+'" data-salerid="'+salerid+'" data-terminal="'+terminal+'" data-img="'+imgpath+'">'+title+'</li>';
		}
		return html;
	}
});
module.exports = Product;