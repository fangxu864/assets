/**
 * Created by Administrator on 15-11-24.
 */
var Common = require("./common.js");
var common = new Common();
var Api = require("./api.js");
var api = new Api();
var Filter = require("./filter.js");
var filter = null;
var NavigationBar = require("./navigationbar.js");
var navigationBar = null;
var sortBar = null;
var tooltip = null;
var loadingImg = common.loadingImg;
var ListDoAction = require("./list.doaction.js");
var listDoaction = null;
var Query = RichBase.extend({
	statics : {
		PAGE_SIZE : 15,
		doBtn : {}
	},
	EVENTS : {
		"mouseenter" : {
			"#resultListUl .hover-cursor" : "onHover"
		},
		"mouseleave" : {
			"#resultListUl .hover-cursor" : "onMouseLeave"
		}
	},
	cacheData : {},
	init : function(){
		var that = this;
		this.resultListUl = $("#resultListUl");
		this.tpl = $("#order-list-item-tpl").html();
		filter = new Filter();
		filter.on("filter.param.change",function(data){
			if(!common.canAjax) return false;
			that.refresh(1,data);
		})
		navigationBar = new NavigationBar();
		navigationBar.on("navigation",function(data){
			that.refresh(data.toPage);
		});
		sortBar = filter.sortBar;
		tooltip = new PFT.UI.Tooltip();
		listDoaction = new ListDoAction();
		listDoaction.on("cancelOrder.success",function(){
			that.clearCache();
		});
		listDoaction.on("modifyTicket.success",function(){
			that.clearCache();
		})
		this.refresh(1);
	},
	refresh : function(page,data){
		var that = this;
		var listUl = this.resultListUl;
		var queryData = data || filter.getFilterParam();
		if(!page || !common.canAjax) return false;
		var params = that.serializeParam(queryData);
		var cacheData = that.cacheData[params] || (that.cacheData[params]={});
		if(cacheData[page]){ //如果已有缓存
			common.canAjax = false;
			navigationBar.render();
			listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><img style="vertical-align:middle" src="'+loadingImg+'" alt=""/> <span class="t">数据加载中...</span></td></tr>');
			setTimeout(function(){
				listUl.html("");
				sortBar.show();
				navigationBar.render({current:page,total:cacheData[page].total.all_page});
				listUl.html(that.render(cacheData[page]));
				setTimeout(function(){
					common.canAjax = true;
				},200)
			},150);
			return;
		}
		api.query(page,this.statics.PAGE_SIZE,queryData,{
			loading : function(){
				sortBar.hide();
				navigationBar.render();
				common.canAjax = false;
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><img style="vertical-align:middle" src="'+loadingImg+'" alt=""/> <span class="t">数据加载中...</span></td></tr>');
			},
			removeLoading : function(){
				listUl.html("");
				setTimeout(function(){
					common.canAjax = true;
				},200)
			},
			timeout : function(){
				navigationBar.render();
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><i class="iconfont">&#xe669;</i> <span class="t">请求超时，请稍后重试...</span></td></tr>');
			},
			serverError : function(){
				navigationBar.render();
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><i class="iconfont">&#xe669;</i> <span class="t">请求出错，请稍后重试...</span></td></tr>')
			},
			fail : function(res){
				navigationBar.render();
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><i class="iconfont">&#xe669;</i> <span class="t">请求出错，请稍后重试...</span></td></tr>')
			},
			empty : function(res){
				if(page!=1){
					navigationBar.render({current:page,total:page});
				}else{
					navigationBar.render();
				}
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><i class="iconfont">&#xe669;</i> <span class="t">没有符合条件的订单...</span></td></tr>')
			},
			unlogin : function(res){
				listUl.html('<tr><td  colspan="6" style="padding:200px 0; text-align:center; background:#fff"><i class="iconfont">&#xe669;</i><span style="margin-left:3px;" class="t">登录状态已过期，请<a style="margin-left:4px; color:#0797d9" href="dlogin_n.html">重新登录</a></span></td></tr>')
			},
			success : function(res){
				sortBar.show();
				listUl.html(that.render(res));
				cacheData[page] = res;
				navigationBar.render({current:page,total:res.total.all_page});
			}
		})
	},
	clearCache : function(){
		var cache = this.cacheData;
		for(var i in cache){
			delete cache[i];
		}
		this.cacheData = {};
	},
	serializeParam : function(queryData){
		var params = [];
		for(var i in queryData){
			params.push(i+"="+queryData[i]);
		}
		return params.join("&");
	},
	render : function(data){
		var tpl = this.tpl;
		var template = _.template(tpl);
		var html = template({data:data});
		return html;
	},
	onHover : function(that,e){
		var tar = $(e.currentTarget);
		var content = tar.find(".tooltipContentTpl").html();
		var offset = {};
		offset["offsetX"] = tar.attr("data-offsetx") || 0;
		offset["offsetY"] = tar.attr("data-offsety") || 0;
		tooltip.tip(tar,content,offset);
	},
	onMouseLeave : function(that,e){
		tooltip.hide();
	}
});
module.exports = Query;