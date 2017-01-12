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
	__hasMore : true,
	__hasInit : false,
	imgHeight : 115,
	isScrollDestroyed: false,
	enablePullup: true,

	dom: {
		container: 			'bodyContainer',
		scrollcontainer: 	'scrollWrap',
		xs_container: 		'xs-container',
		ul: 				'scrollInerCon',
		filterbar: 			'filterBar',
		searchInp: 			'searchInp'
	},
	init : function(){
		var that = this;

		this.params = {
            keyword : "",
            topic : "",
            type : PFT.Util.UrlParse()["ptype"] || "A",
            city : "",
            lastPos : this.__lastPos
        };

		this.initSearch();

		/* create dom element */
		this.listUl = $('<ul />', { id: this.dom.ul, class: this.dom.ul });
		this.listUl.appendTo($('#'+this.dom.container));
		this.listUl.wrap($('<div />', { id: this.dom.scrollcontainer, class: this.dom.scrollcontainer}));
		this.listUl.wrap($('<div />', { id: this.dom.xs_container, class: this.dom.xs_container}));

		this.template = ItemTpl;

		this.scrollContainerHeight = $('#' + this.dom.scrollcontainer).height();

		this.initScroll();

		this.initPullup();

		this.fetchList( this.params );
	},
	initScroll: function() {
		this.xscroll = new XScroll({
		   	renderTo: '#' + this.dom.scrollcontainer,
            lockY: false,
            scrollbarY: false,
            scrollbarX: false,
            container: '#' + this.dom.xs_container,
            content: '#' + this.dom.ul
		});
	},
	initPullup: function() {
		var that = this;

        this.pullup = new XScroll.Plugins.PullUp({
            upContent: 		"上拉加载更多 ...",
            downContent: 	"放开加载 ...",
            loadingContent: "加载中 ...",
            bufferHeight: 	0
        });

        // this.xscroll.plug( this.pullup );

        this.pullup.on("loading",function(){
            that.fetchList( that.params );
        });

		this.xscroll.plug( this.pullup );
	},
	initFilter: function(type,themes,citys){
		this.filter = new Filter({
			Page: this,
			container: '#' + this.dom.container,
			data : {
				type : type,
				theme : themes,
				city : citys
			}
		})
	},
	reInit: function () {
		if( !this.__hasMore ) {
			this.__hasMore = true;
		}
	},
	filterParamsChange: function() {
		this.reInit();

		this.params = {
            keyword : this.getKeyword(),
            topic : this.getTopic(),
            type : this.getType(),
            city : this.getCity(),
            lastPos : 0
        };

        this.fetchList( this.params );
	},
	initSearch : function(){
		var that = this;

		this.search = new Search({
			container: '#' + this.dom.container,
			callbacks: {
				input: function( val ) {
					that.filterParamsChange();
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
	getKeyword: function() {
		return $.trim( $('#' + this.dom.searchInp ).val() );
	},
	getTopic: function() {
		return $('#' + this.dom.filterbar ).find('[data-filter=theme]').text()=='主题' ? '' : $('#' + this.dom.filterbar ).find('[data-filter=theme]').text();
	},
	getType: function() {
		return $('#' + this.dom.filterbar ).find('[data-filter=type]').attr('data-type');
	},
	getCity: function() {
		return $('#' + this.dom.filterbar ).find('[data-filter=city]').attr('data-code');
	},
	fetchList : function( params ){
		var that = this;

        if( !that.__hasMore ) {

            return;

        };

		var lastPos = params.lastPos,
			type = "",
			paramKeyword = params.keyword;

		FetchList(params,{
			loading : () => {
				if(lastPos==0){
					Toast.show("loading","努力加载中..");
					that.listUl.html("");
					// this.disablePullup();
					// this.refreshScroll();
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

				that.initFilter( type, themes, citys );
			},
			empty : () => {
				that.__hasMore = false;
        		that.xscroll.unplug( that.pullup );
        		that.enablePullup = false;

				if(lastPos==0){
					type = paramKeyword ? "searchEmpty" : "filterEmpty";
					that.render(type);
					if( !that.isScrollDestroyed ) {
						that.xscroll.destroy();
						that.isScrollDestroyed = true;
					}
				}else{
					that.render("noMore");
				}
			},
			success : (data) => {
				that.params.lastPos = data.lastPos;

				that.render(lastPos==0 ? "success" : "successMore", data, params);

				// 参数更改时 判断scroll插件是否销毁，是则初始化
				if( lastPos == 0 ) {
					if( that.isScrollDestroyed ) {
						that.initScroll();
						that.isScrollDestroyed = false;
					}
				}

				// 判断scroll的上拉加载插件是否被移除， 是则引入插件
				if( !that.enablePullup ) {
					that.xscroll.plug( that.pullup );
					that.xscroll.scrollTop(0, 0);
				}

		        that.xscroll.render();

		        that.pullup.complete();
			},
			fail : (msg) => {
				if(lastPos==0){
					that.render("fail");
				}else{
					that.render("failMore");
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

			listUl.html( '<li class="noSearchResult">' + text + '</li>' );
		}else if(type=="noMore"){

		}else if(type=="fail" || type=="failMore"){

		}

		return html;
	}
});

$(function(){
	new Main();
})