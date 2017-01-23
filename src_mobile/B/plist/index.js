
require("./index.scss");

var XScroll = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/xscroll");
var PullUp = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/plugins/pullup");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");

var TypeTpl = require("./tpl/type.xtpl");	
var ThemeTpl = require("./tpl/theme.xtpl");
var CityTpl = require("./tpl/city.xtpl");
var SearchTpl = require("./tpl/search.xtpl");
var ListTpl = require("./tpl/list.xtpl");

var Plist = PFT.Util.Class({

	container : $("#productOrderBox"),
	EVENTS : {      
		"click .typeSelect" : "onTypeSelect",              
		"click .themeSelect" : "onThemeSelect",              
		"click .citySelect" : "onCitySelect",          
		"focus .productNameSearch" : "focusAllInput",
		"click .spotTicketMore" : "recommendTicket"
	},
	init : function(opt){       

		this.typeTemplate = PFT.Util.ParseTemplate(TypeTpl);  

		this.themeTemplate = PFT.Util.ParseTemplate(ThemeTpl);  

		this.cityTemplate = PFT.Util.ParseTemplate(CityTpl);  

		this.searchTemplate = PFT.Util.ParseTemplate(SearchTpl);  

		this.listTemplate = PFT.Util.ParseTemplate(ListTpl);  

		this.renderScroll();
		
	},

	renderScroll : function(){

		var that = this;

		this.xscroll = new XScroll({
			renderTo:"#xScroll",
			lockY:false,
			container:"#xContainer",
			content:"#xContent"
		});
		this.pullup = new PullUp({
			upContent:"上拉加载更多...",
			downContent:"释放以加载更多...",
			loadingContent:"加载中...",
			bufferHeight:0,
			height : 50
		});
		this.xscroll.plug(that.pullup);
		this.pullup.on("loading",function(){
			that.renderSearch();
		});

		that.renderSearch();

	},

	onTypeSelect : function(){

		var that = this;

		PFT.Util.Ajax("/r/MicroPlat_Product/getTypeList/",{
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken()	
		    },
		    loading : function(){
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){

		        	that.handlerType(data);

		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})

	},

	handlerType : function(data){
		var that = this;

    	var typeHtml = this.typeTemplate(data);


    	if(this.typeSelect){
		    this.typeSelect.show();	
    	}else{
			this.typeSelect = new SheetCore({
				header : "标题",
				content : typeHtml,       
				height : "auto",    
				yesBtn : false,
				noBtn : false,      
				zIndex : 200,       
				EVENTS : {      
					"click .typeBtn" : function(e){
						var type = $(e.target).attr("data-type");
					  	that.changeType($(e.target),type);
					}
				}
			});
		    this.typeSelect.show();	
    	}
    	
	},

	changeType : function(obj,type){
		var text = obj.text();
		$("#typeText").text(text);
		$("#typeText").attr("data-type",type);
        this.typeSelect.close();	
	},

	onThemeSelect : function(){
		var that = this;
		var type = $("#typeText").attr("data-type");
		PFT.Util.Ajax("/r/MicroPlat_Product/getThemes",{
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	type : type
		    },
		    loading : function(){
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		    	console.log(res);
		        var code = res.code;
		        if(code==200){
		        	that.themeHandler(res);
		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})
	},

	themeHandler : function(res){
		var that = this;
		var data = {};
		var type = "A";
		if(type == "A"){
			data.list = res.data.A;
		}else if(type == "B"){
			data.list = res.data.B;
		}else if(type == "C"){
			data.list = res.data.C;
		}else if(type == "F"){
			data.list = res.data.F;
		}else if(type == "H"){
			data.list = res.data.H;
		}
    	var themeHtml = this.themeTemplate(data);

    	if(this.themeSelect){
    		this.themeSelect.show();	
    	}else{
			this.themeSelect = new SheetCore({
				header : "标题",
				content : themeHtml,       
				height : "auto",    
				yesBtn : false,
				noBtn : false,      
				zIndex : 200,       
				EVENTS : {      
					"click .themeBtn" : function(e){
					  that.changeTheme($(e.target));
					}
				}
			});
		    this.themeSelect.show();
    	}

	},

	changeTheme : function(obj){
		var text = obj.text();
		$("#themeText").text(text);
        this.themeSelect.close();
	},

	onCitySelect : function(){

		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getAreaList",{
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    },
		    loading : function(){
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		    	console.log(res);
		        var code = res.code;
		        if(code==200){
		        	// that.themeHandler(res);
		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})

    	var cityHtml = this.cityTemplate();

		this.citySelect = new SheetCore({
			content : cityHtml,       
			height : "100%",    
			yesBtn : false,
			noBtn : false,      
			zIndex : 200,       
			EVENTS : {      
				"click .themeBtn" : function(e){
				  	// that.changeTheme($(e.target));
				}
			}
		});
	    this.citySelect.show();

	},


	focusAllInput : function(){

		var that = this;
    	var searchHtml = this.searchTemplate();

    	if(this.searchSelect){
		    this.searchSelect.show();
    	}else{
			this.searchSelect = new SheetCore({
				content : searchHtml,       
				height : "100%",    
				yesBtn : false,
				noBtn : false,      
				zIndex : 200,       
				EVENTS : {      
					"click .returnBtn" : function(e){
					    that.searchSelect.close();
					},
					"click .searchBtn" : function(e){
						var inputText = $(".searchInput").val(); 
						$(".productNameSearch").val(inputText);
						that.renderSearch();
					    that.searchSelect.close();
					}
				}
			});
		    this.searchSelect.show();
    	}

	},

	renderSearch : function(){

		var that = this;

		PFT.Util.Ajax("/r/MicroPlat_Product/getProductList/",{
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken()
		    },
		    loading : function(){
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
		        	that.renderList(data);
		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})

	},

	renderList : function(data){

		console.log(data);

		var listHtml = this.listTemplate(data);

		console.log(listHtml);

		$("#xContent").append(listHtml);

		this.xscroll.render();
		this.pullup.complete();

	},

	recommendTicket : function(){

		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getTicketList/",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lid : "6603"
		    },
		    loading : function(){

		    },
		    complete : function(){

		    },
		    success : function(res){
		    	console.log(res);
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
		        	that.renderTicketList(data);
		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})

	},


	renderTicketList : function(data){



	}

});


$(function(){
	new Plist();
});





