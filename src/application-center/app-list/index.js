/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var appAjaxUrl = require('../common/js/ajaxurl.js')['appListInPage'];

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-app.xtpl"))
};

var loadingHTML = require("COMMON/js/util.loading.pc.js");

var Main = PFT.Util.Class({

	init : function(){
		var _this = this;
		this.pageSize = 10;

		_this.pagination = new Pagination({
	        container : "#pagination",  //必须，组件容器id
	        count : 7,                //可选  连续显示分页数 建议奇数7或9
	        showTotal : true,         //可选  是否显示总页数
	        jump : true               //可选  是否显示跳到第几页
	    });

		_this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
		    // toPage :      要switch到第几页
		    // currentPage : 当前所处第几页
		    // totalPage :   当前共有几页
			_this.swichPage(toPage);
		});

		this.swichPage(1); //初始化第一页

	},

	underCarriage : function(type,id,jqThis){ //上架为1，下架为0

		console.log("type:" + type);
		console.log("id:" + id);
		this.carriageAjax({
			type : type ,
			id : id ,
			loading: function() {
			},
			complete : function(){
			},
			success: function( res ) {

				console.log(res);
				console.log(type);
				if(res.code == 200 && type == 1){
					alert("上架成功");
					jqThis.text("下架").css("color","#e11d2c");
				}else if(res.code == 200 && type == 0){
					alert("下架成功");	
					jqThis.text("上架").css("color","#2A98DA");
				}else{
					console.log("失败");
					alert(res.msg);
				}
				
			}
		});

	},

	carriageAjax : function(opts){
		

		PFT.Util.Ajax( "/r/AppCenter_ModuleConfig/underCarriage" , {
			params: {
				module_id : opts.id,
				type : opts.type
			},
			type:"POST",
			loading: function(){
				opts.loading();
			},
			complete : function(){
				opts.complete();	
			},	
			success: function(res) {
				opts.success(res);
			}
		});


	},

	swichPage : function(topage){

		var _this = this;

		this.ajaxGetData({
			page: 			topage,
			loading: function() {
				var loadingHtml = loadingHTML("请稍后...",{
				    tag : "tr",
				    colspan : 6,
				    className : "loading"
				});
				$("table#tbApp tbody").html(loadingHtml);
			},
			complete : function(){
				$(".loading").remove();
			},
			success: function( res ) {

				console.log(res);
				if(res.code == 200){
					_this.renderAppBox(res.data.list);
					_this.pagination.render({current: topage, total: res.data.total});


					$(".underCarriage").each(function(i){
						var status = $(this).attr("data-status");
						if(status == 0){  //处于下架状态
							$(this).text("上架").css("color","#2A98DA");
						}else if(status == 1){ //处于上架状态
							$(this).text("下架").css("color","#e11d2c");
						}
					});

					//绑定上下架事件
					$(".underCarriage").on("click",function(e){
						e.preventDefault();
						var jqThis = $(this);
						var id = $(this).attr("data-id");
						if($(this).text() == "下架"){
							_this.underCarriage(0,id,jqThis);  //下架为0
						}else if($(this).text() == "上架"){
							_this.underCarriage(1,id,jqThis);  //上架为1
						}
					});

				}else{
					alert(res.msg);
				}
				
				
			}
		})


	},

	ajaxGetData: function( opts ){
		var fn = new Function,
			_this = this;
		var defaultOpts = {
			page: 			1,
			success: 		fn
		};

		var opts = $.extend(true, defaultOpts, opts);

		PFT.Util.Ajax( appAjaxUrl , {
			params: {
				page: 		opts.page,
				page_size: 	_this.pageSize
			},
			type:"POST",
			loading: function(){
				opts.loading();
			},
			complete : function(){
				opts.complete();	
			},	
			success: function(res) {
				opts.success(res);
			}
		})
	},

	renderAppBox : function(data){
		var html = Template.appBox({data:data});
		$('#tbApp tbody').html(html);
	}
});

$(function(){
	new Main();
})