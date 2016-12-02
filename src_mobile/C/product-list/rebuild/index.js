/**
 * Author: huangzhiyang
 * Date: 2016/12/1 16:00
 * Description: ""
 */
var ItemTpl = PFT.Util.ParseTemplate(require("./item.xtpl"));
var SheetCore = require("COMMON/modules/sheet-core/v1");
var FetchList = require("SERVICE_M/product-list");
var Main = PFT.Util.Class({
	__lastPos : 0,
	init : function(){
		this.listUl = $("#scrollInerCon");
	},
	//启动&恢复 上拉加载功能
	enablePullup : function(){},
	//禁用上拉加载功能
	disablePullup : function(){},
	//刷新scroll插件
	refreshScroll : function(){},

	getLastPos : function(){
		return this.__lastPos;
	},
	setLastPos : function(pos){
		this.__lastPos = pos * 1;
	},
	fetchList : function(param){
		var lastPos = params.lastPos;
		var render = this.render;
		var type = "";
		var paramKeyword = param.keyword;
		var template = this.template;
		FetchList(params,{
			loading : () => {
				if(lastPos==0){
					Toast.show("loading","努力加载中..");
					this.listUl.html("");
					this.disablePullup();
					this.refreshScroll();
				}
			},
			complete : () => {
				Toast.hide();
			},
			empty : () => {
				if(lastPos==0){
					type = paramKeyword ? "searchEmpty" : "filterEmpty";
					render(type);
				}else{
					render("noMore");
				}
				this.disablePullup();
				this.refreshScroll();
			},
			success : (data) => {
				var that = this;
				render(lastPos==0 ? "success" : "successMore",data);
				this.enablePullup();
				this.refreshScroll();
			},
			fail : (msg) => {
				if(lastPos==0){
					render("fail");
					this.disablePullup();
					this.refreshScroll();
				}else{
					render("failMore");
					Alert(msg);
				}
			}
		})
	},
	render : function(type,data){
		var html = "";
		var template = this.template;
		var listUl = this.listUl;
		if(type=="success" || type=="successMore"){
			html = template(data);
			if(type=="success"){
				listUl.html(html);
			}else if(type=="successMore"){
				listUl.append(html);
			}
		}else if(type=="empty" || type=="filterEmpty" || type=="searchEmpty"){
			var text = {
				empty : "暂无产品",
				filterEmpty : "暂无相关产品",
				searchEmpty : "查无匹配产品"
			}[type];
		}else if(type=="noMore"){

		}else if(type=="fail" || type=="failMore"){

		}
		return html;
	}
});
