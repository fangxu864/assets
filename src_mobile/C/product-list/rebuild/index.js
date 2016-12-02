/**
 * Author: huangzhiyang
 * Date: 2016/12/1 16:00
 * Description: ""
 */
var ItemTpl = PFT.Util.ParseTemplate(require("./item.xtpl"));
var FetchList = require("SERVICE_M/product-list");
var Filter = require("./filters");
var Main = PFT.Util.Class({
	__lastPos : 0,
	__hasInit : false,
	init : function(){
		var that = this;
		this.listUl = $("#scrollInerCon");

		this.on("fetchList.complete",function(res){
			if(that.__hasInit) return false;
			that.__hasInit = true;
			var res = res || {};
			var code = res.code;
			var data = res.data;
			if(code!==200) return false;
			var citys = data.citys;
			var themes = data.themes;
			var type = data.type;
			that.initFilter(type,themes,citys);
		})

	},
	initFilter : function(type,themes,citys){
		this.filter = new Filter({
			data : {
				type : type,
				theme : themes,
				city : citys
			}
		})
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
		FetchList(params,{
			loading : () => {
				if(lastPos==0){
					Toast.show("loading","努力加载中..");
					this.listUl.html("");
					this.disablePullup();
					this.refreshScroll();
				}
				this.trigger('fetchList.loading');
			},
			complete : (res) => {
				Toast.hide();
				this.trigger('fetchList.complete');
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
				this.trigger('fetchList.empty');
			},
			success : (data) => {
				var that = this;
				render(lastPos==0 ? "success" : "successMore",data);
				this.enablePullup();
				this.refreshScroll();
				this.trigger('fetchList.success');
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
				this.trigger('fetchList.fail');
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
