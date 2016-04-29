/**
 * Created by Administrator on 15-9-30.
 */
var TerminalCore = require("./terminal.core.js");
var TodayOrder = RichBase.extend({
	statics : {
		cache : true,
		cacheData : {},
		getSalerid : function(){
			return TerminalCore.getSalerid();
		}
	},
	init : function(opt){
		this.container = opt.container;
		this.listUl = this.container.find(".listUl");
	},
	fetchData : function(salerid,page,opt){
		if(!salerid) return false;
		var page = page || 1;
		var opt = opt || {};
		var fn = new Function;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var error = opt.error || fn;
		var timeout = opt.timeout || fn;
		var serverError = opt.serverError || fn;
		PFT.Ajax({
			url : TerminalCore.api,
			type : "post",
			dataType : "json",
			ttimeout : TerminalCore.timeout,
			data : {
				act : "day_orders",
				salerid : salerid
			},
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			serverError : function(res){ serverError(res)}
		},function(res){
			var sta = res.sta;
			var errormsg = res.errormsg;
			var list = res.list;
			if(sta=="success" && !errormsg){
				if(list.length){
					success(res);
				}else{
					empty(res);
				}
			}else{
				error(res);
			}
		})
	},
	show : function(){
		var that = this;
		var salerid = this.statics.getSalerid();
		this.container.show().css("z-index",10001);
		if(!salerid) return false;
		var cacheData = this.statics.cacheData[salerid];
		if(this.statics.cache && cacheData){
			this.listUl.html(this.renderHtml(cacheData))
		}else{
			this.fetchData(salerid,1,{
				loading : function(){
					that.listUl.html('<li style="" class="loading sta"><i class="iconfont loading">&#xe644;</i><span class="t">正在加载数据...</span></li>');
				},
				removeLoading : function(){ that.listUl.html("")},
				success : function(res){
					var list = res.list;
					that.listUl.html(that.renderHtml(list));
					that.statics.cacheData[salerid] = list;
				},
				empty : function(){
					that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">今日没有已验证的订单</span></li>');
				},
				error : function(){
					that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求出错，请稍后重试</span></li>');
				},
				timeout : function(){
					that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求超时，请稍后重试</span></li>');
				},
				serverError : function(){
					that.listUl.html('<li style="" class="sta"><i class="iconfont">&#xe669;</i><span class="t">请求出错，请稍后重试</span></li>');
				}
			})
		}
	},
	close : function(){
		this.container.hide().css("z-index",10001);
	},
	renderHtml : function(data){
		var html = "";
		var tpl = $("#todayOrderTpl").html();
		var template = _.template(tpl);
		html = template({data:data});
		return html;
	}
});
module.exports = TodayOrder;
