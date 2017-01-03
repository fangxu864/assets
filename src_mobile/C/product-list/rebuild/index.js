/**
 * Author: huangzhiyang
 * Date: 2016/12/1 16:00
 * Description: ""
 */
require('./index.scss');

var Toast = new PFT.Mobile.Toast();
var Alert = PFT.Mobile.Alert;

var ItemTpl = PFT.Util.ParseTemplate(require("./item.xtpl"));
var FetchList = require("SERVICE_M/product-list");
var Filter = require("./filters");
var Search = require("./search");

var CityData = require("COMMON/js/config.province.city.data2");

var Main = PFT.Util.Class({
	__lastPos : 0,
	__hasInit : false,
	imgHeight : 115,

	dom: {
		container: 			'bodyContainer',
		scrollcontainer: 	'scrollWrap',
		ul: 				'scrollInerCon',
		filterbar: 			'filterBar'
	},
	init : function(){
		var that = this;
		this.listUl = $('<ul />', { id: this.dom.ul, class: this.dom.ul });

		this.template = ItemTpl;

		this.params = {
            keyword : "",
            topic : "",
            type : PFT.Util.UrlParse()["ptype"] || "A",
            city : "",
            lastPos : this.__lastPos
        };

		this.initSearch();
		this.listUl.appendTo($('#'+this.dom.container)).wrap($('<div />', { id: this.dom.scrollcontainer, class: this.dom.scrollcontainer}));
		this.fetchList( this.params );

		// this.xscroll = new XScroll({
		//    container: '#scrollWrap',
		//    content: '#scrollInerCon'
		// });
		// xscroll.render();
	},
	initFilter : function(type,themes,citys){
		this.filter = new Filter({
			container: '#' + this.dom.container,
			data : {
				type : type,
				theme : themes,
				city : citys
			}
		})
	},
	initSearch : function(type,themes,citys){
		this.search = new Search({
			container: '#' + this.dom.container,
			callbacks: {
				input: function( val ) {

				},
				focus: function( val ) {

				},
				blur: function( val ) {

				},
				clear: function() {

				}
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
	fetchList : function( params ){
		var that = this;

		var lastPos = params.lastPos,
			type = "",
			paramKeyword = params.keyword;

		FetchList(params,{
			loading : () => {
				if(lastPos==0){
					Toast.show("loading","努力加载中..");
					this.listUl.html("");
					this.disablePullup();
					this.refreshScroll();
				}
			},
			complete : (res) => {
				Toast.hide();

				if(that.__hasInit) return false;

				that.__hasInit = true;

				var res = res || {},
					code = res.code,
					data = res.data;

				if(code !== 200) return false;

				var citys = data.citys,
					themes = data.themes,
					type = data.type;

				that.initFilter(type,themes,citys);
			},
			empty : () => {
				if(lastPos==0){
					type = paramKeyword ? "searchEmpty" : "filterEmpty";
					this.render(type);
				}else{
					this.render("noMore");
				}
				this.disablePullup();
				this.refreshScroll();
			},
			success : (data) => {
				var that = this;

				this.render(lastPos==0 ? "success" : "successMore", data, params);
				this.enablePullup();
				this.refreshScroll();
			},
			fail : (msg) => {
				if(lastPos==0){
					this.render("fail");
					this.disablePullup();
					this.refreshScroll();
				}else{
					this.render("failMore");
					Alert(msg);
				}
			}
		})
	},
	render : function( type , data, params ){
		var html = "";
		var template = this.template;
		var listUl = this.listUl;

		if(type=="success" || type=="successMore"){
			html = template( { data: data.list, params: params, imgHeight: this.imgHeight } );
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

$(function(){
	new Main();
})