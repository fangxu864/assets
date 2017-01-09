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
		this.listUl.appendTo($('#'+this.dom.container))
		this.listUl.wrap($('<div />', { id: this.dom.scrollcontainer, class: this.dom.scrollcontainer}));
		this.listUl.wrap($('<div />', { id: this.dom.xs_container, class: this.dom.xs_container}));
		this.fetchList( this.params );

		this.xscroll = new XScroll({
		   	renderTo: '#' + this.dom.scrollcontainer,
            lockY:false,
            container: '#' + this.dom.xs_container,
            content: '#' + this.dom.ul
		});

        var infinite = new XScroll.Plugins.Infinite({
            infiniteElements:'#'+this.dom.container + ' .item',
            renderHook:function(el,data){
                el.innerText = data.data.num;
            }
        })
        this.xscroll.plug(infinite);

        var pullup = new XScroll.Plugins.PullUp({
            upContent:"上拉加载更多 ...",
            downContent:"放开加载 ...",
            loadingContent:"加载中 ...",
            bufferHeight:0
        });

        this.xscroll.plug(pullup);

        // pullup.on("loading",function(){
        //     that.fetchList( this.params );
        //     if( !that.__hasMore ) {
        //         that.xscroll.unplug(pullup);
        //         return;
        //     };
        //     // infinite.append(0,data);
        //     that.xscroll.render();
        //      //loading complete
        //     pullup.complete();
        // });

        // getData();
        console.log(this.xscroll)
        this.xscroll.render();

	},
	initScroll: function() {
		var that = this;
		that.xscroll = new XScroll({
		   	renderTo: '#scrollWrap',
            lockY:false
		});

        // var infinite = new XScroll.Plugins.Infinite({
        //     infiniteElements:"#scrollWrap .item",
        //     renderHook:function(el,data){
        //         el.innerText = data.data.num;
        //     }
        // })
        // that.xscroll.plug(infinite);

        // var getData = function(){
        //     if(!pageCache[page]){
        //         pageCache[page] = 1;
        //         $.ajax({
        //             url:"./data.json",
        //             dataType:"json",
        //             success:function(data){
        //                 if(page > totalPage) {
        //                     //last page
        //                     // pullup.complete();
        //                     //destroy plugin
        //                     xscroll.unplug(pullup);
        //                     return;
        //                 };
        //                 infinite.append(0,data);
        //                 xscroll.render();
        //                  //loading complete
        //                 pullup.complete();
        //                 page++;
        //             }
        //         })
        //     }
        // }



        pullup.on("loading",function(){
            that.fetchList( this.params );
            if( !that.__hasMore ) {
                that.xscroll.unplug(pullup);
                return;
            };
            // infinite.append(0,data);
            that.xscroll.render();
             //loading complete
            pullup.complete();
        });

        // getData();

        that.xscroll.render();
	},
	initFilter : function(type,themes,citys){
		this.filter = new Filter({
			container: '#' + this.dom.container,
			data : {
				type : type,
				theme : themes,
				city : citys
			},
			onFilterParamsChange: this.filterParamsChange
		})
	},
	filterParamsChange: function() {
		this.__lastPos = 0;

		this.params = {
            keyword : encodeURIComponent( $('#' + this.dom.searchInp ).val() ),
            topic : $('#' + this.dom.filterbar ).find('[data-filter=theme]').text(),
            type : $('#' + this.dom.filterbar ).find('[data-filter=type]').attr('data-type'),
            city : $('#' + this.dom.filterbar ).find('[data-filter=city]').attr('data-code'),
            lastPos : this.__lastPos
        };

        this.fetchList( this.params );
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

		if( !that.__hasMore ) return;

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
				if(lastPos==0){
					type = paramKeyword ? "searchEmpty" : "filterEmpty";
					that.render(type);
				}else{
					that.render("noMore");
				}
				// this.disablePullup();
				// this.refreshScroll();
			},
			success : (data) => {
				if( data.lastPos == that.getLastPos ) {
					that.__hasMore = false;
				} else {
					that.setLastPos( data.lastPos );
					that.render(lastPos==0 ? "success" : "successMore", data, params);
					// this.enablePullup();
					// this.refreshScroll();
				}
			},
			fail : (msg) => {
				if(lastPos==0){
					that.render("fail");
					// this.disablePullup();
					// this.refreshScroll();
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
		}else if(type=="noMore"){

		}else if(type=="fail" || type=="failMore"){

		}

		return html;
	}
});

$(function(){
	new Main();
})