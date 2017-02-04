
require("./index.scss");

var XScroll = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/xscroll");
var PullUp = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/plugins/pullup");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");

var TypeTpl = require("./tpl/type.xtpl");	
var ThemeTpl = require("./tpl/theme.xtpl");
var CityTpl = require("./tpl/city.xtpl");
var SearchTpl = require("./tpl/search.xtpl");
var ListTpl = require("./tpl/list.xtpl");
var TicketTpl = require("./tpl/ticket.xtpl");

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
		this.ticketTemplate = PFT.Util.ParseTemplate(TicketTpl);  

		// 产品列表参数
		this.lastListLid = 0;
		this.lastListProPos = 0;
		this.ptype = "A";//景区类型[A,B,C,F,H]之一
		this.keyword = "";
		this.topic = "";
		this.city = "";
		this.pageSize = 4;   //默认一页4个产品

		//搜索城市关键字
		this.cityKeyWord = "";

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

	//景区类型
	onTypeSelect : function(){

		var that = this;

		PFT.Util.Ajax("/r/MicroPlat_Product/getTypeList/",{
			type : "POST",
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
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
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
				yesBtn : {            
					text : "确定提交",   
					handler : function(e){
						var nowSel = $(".typeBtn.selectNow");
					  	var type = nowSel.attr("data-type");
					  	that.changeType(nowSel,type);
					}
				},
				noBtn : {            
				  text : "取消",   
				  handler : function(e){
				    console.log("点击时执行")
				  }
				},     
				zIndex : 200,       
				EVENTS : {      
					"click .typeBtn" : function(e){
						// var type = $(e.target).attr("data-type");
					    // that.changeType($(e.target),type);
					 	$(e.target).css("background","#123456").addClass("selectNow");
					 	$(e.target).siblings().removeClass("selectNow").css("background","");
					}
				}
			});
		    this.typeSelect.show();	
    	}
    	
	},

	changeType : function(obj,type){
		var text = obj.text();
		this.ptype = type;
		$("#typeText").text(text);
		$("#typeText").attr("data-type",type);
        this.typeSelect.close();	
	},

	onThemeSelect : function(){
		var that = this;
		var type = $("#typeText").attr("data-type");

		PFT.Util.Ajax("/r/MicroPlat_Product/getThemes",{
			type : "POST",
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
		        var code = res.code;
		        if(code==200){
		        	that.themeHandler(res);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})
	},

	themeHandler : function(res){
		var that = this;
		var data = {};
		// var type = "A";
		// if(type == "A"){
		// 	data.list = res.data.A;
		// }else if(type == "B"){
		// 	data.list = res.data.B;
		// }else if(type == "C"){
		// 	data.list = res.data.C;
		// }else if(type == "F"){
		// 	data.list = res.data.F;
		// }else if(type == "H"){
		// 	data.list = res.data.H;
		// }

		data.list = res.data;
		
    	var themeHtml = this.themeTemplate(data);

    	// if(this.themeSelect){
    	// 	this.themeSelect.show();	
    	// }else{
			this.themeSelect = new SheetCore({
				header : "标题",
				content : themeHtml,       
				height : "auto",    
				yesBtn : {            
					text : "确定提交",   
					handler : function(e){
						var nowSel = $(".themeBtn.selectNow");
					  	that.changeTheme(nowSel);
					}
				},
				noBtn : {            
				  text : "取消",   
				  handler : function(e){
				    console.log("点击时执行")
				  }
				},       
				zIndex : 200,       
				EVENTS : {      
					"click .themeBtn" : function(e){
					  // that.changeTheme($(e.target));
					  $(e.target).css("background","#123456").addClass("selectNow");
					  $(e.target).siblings().removeClass("selectNow").css("background","");
					}
				}
			});
		    this.themeSelect.show();
    	// }

	},

	changeTheme : function(obj){
		var text = obj.text();
		this.topic = text;
		$("#themeText").text(text);
        // this.themeSelect.close();
	},

	onCitySelect : function(){

		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getAreaList",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	keyword : that.cityKeyWord 
		    },
		    loading : function(){
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		        var code = res.code;
		        if(code==200){
		        	that.cityHandler(res);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

   			

	},

	cityHandler : function(res){

		var data = {};
    	var cityList = this.dealCityList(res);		
    	data.list = res.data;

    	console.log(data);

    	var cityHtml = this.cityTemplate(data);

		this.citySelect = new SheetCore({
			content : cityHtml,       
			height : "100%",    
			yesBtn : {            
				text : "确定提交",   
				handler : function(e){
					var nowSel = $(".cityBtn.selectNow");
				}
			},
			noBtn : {            
			  text : "取消",   
			  handler : function(e){
			    console.log("点击时执行")
			  }
			},       
			zIndex : 200,       
			EVENTS : {      
				"click .cityBtn" : function(e){
				  	$(e.target).css("background","#123456").addClass("selectNow");
				  	$(e.target).siblings().removeClass("selectNow").css("background","");
				},

				"input #citySearch" : function(e){
					var cityKeyWord = $(e.target).val();	
					console.log(cityKeyWord);
				}
			}
		});
	    this.citySelect.show();

	},


	//处理城市列表的数据
	dealCityList : function(res){

		var data = res.data;
		var cityList = [];
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].length;j++){
				data[i].pin = data[i][0].pin;
			}
		}
		return data; 

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
						that.keyword = inputText;
						that.lastListLid = 0;
						that.lastListProPos = 0;
						that.renderSearch();
					    that.searchSelect.close();
					}
				}
			});
		    this.searchSelect.show();
    	}

    	$(".searchInput").focus();

	},

	renderSearch : function(){

		var that = this;

		// if(!this.lastListLid){
		// 	this.lastListLid = 0;
		// }
		// if(!this.lastListProPos){
		// 	this.lastListProPos = 0;
		// }

		PFT.Util.Ajax("/r/MicroPlat_Product/getProductList/",{
		    dataType : "json",
			type : "POST",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lastLid : that.lastListLid,
		    	lastProPos : that.lastListProPos,
		    	ptype : that.ptype,
		    	keyword : that.keyword,
		    	topic : that.topic,
		    	city : that.city,
		    	pageSize : that.pageSize
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
		        	that.lastListLid = data.lastLid;
		        	that.lastListProPos = data.lastProPos;
		        	that.renderList(data);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	},

	renderList : function(data){

		var list = data.list;
		if(list.length == 0){
			PFT.Mobile.Alert("没有更多了");
		}
		var listHtml = this.listTemplate(data);

		$("#xContent").append(listHtml);

		this.xscroll.render();
		this.pullup.complete();

	},

	recommendTicket : function(e){

		var target = e.target;
		var lid = $(target).attr("data-id");

		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getTicketList/",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lid : lid
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
		        	that.renderTicketList(data,target);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	},


	renderTicketList : function(data,target){
		
		var ticketHtml = this.ticketTemplate(data);
		target = $(target).parent();
		$(ticketHtml).insertBefore(target);
		target.hide();

	}

});


$(function(){
	new Plist();
});
