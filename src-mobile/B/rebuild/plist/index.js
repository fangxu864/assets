
require("./index.scss");

var XScroll = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/xscroll");
var PullUp = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/plugins/pullup");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");

var Toast = require("./Toast");

var TypeTpl = require("./tpl/type.xtpl");	
var ThemeTpl = require("./tpl/theme.xtpl");
var CityTpl = require("./tpl/city.xtpl");
var SearchTpl = require("./tpl/search.xtpl");
var ListTpl = require("./tpl/list.xtpl");
var TicketTpl = require("./tpl/ticket.xtpl");

var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

var Plist = PFT.Util.Class({

	container : $("#productOrderBox"),
	EVENTS : {      
		"click .typeSelect" : "onTypeSelect",   //类型           
		"click .themeSelect" : "onThemeSelect",  //主题            
		"click .citySelect" : "onCitySelect",   //城市        
		"focus .productNameSearch" : "focusAllInput",  //产品类型搜索
		"click .spotTicketMore" : "recommendTicket",   //推荐票类
		"click .writeOrderLink" : "onclickLink" //点击票类 
 	},
	init : function(opt){ 

		var that = this;  

		this.toast = new Toast();

		this.checkMemberType();

		var url = window.location.href;
		var urlPara = Parse(url);
		this.urlPara = urlPara;
		// console.log(this.urlPara);

		if(urlPara.ctx){
			this.ctx = urlPara.ctx;		
		}else{
			this.ctx = 0;//默认为0
		}
		if(urlPara.ctype){
			this.ctype = urlPara.ctype;		
		}else{
			this.ctype = 0;//默认为0
		}

		this.typeTemplate = PFT.Util.ParseTemplate(TypeTpl);  
		this.themeTemplate = PFT.Util.ParseTemplate(ThemeTpl);  
		this.cityTemplate = PFT.Util.ParseTemplate(CityTpl);  
		this.searchTemplate = PFT.Util.ParseTemplate(SearchTpl);  
		this.listTemplate = PFT.Util.ParseTemplate(ListTpl);  
		this.ticketTemplate = PFT.Util.ParseTemplate(TicketTpl);  

		// 产品列表参数
		this.lastListLid = 0;
		this.lastListProPos = 0;
		this.ptype = "";//景区类型[A,B,C,F,H]之一
		this.keyword = "";
		this.topic = "";
		this.city = "";
		this.pageSize = 4;   //默认一页4个产品

		if(urlPara.ptype){
			this.ptype = urlPara.ptype;	
			this.initType();
		}else{
			// this.ptype = "A";//默认为A
			// this.ptype = "";//默认为空

			PFT.Util.Ajax("/r/MicroPlat_Product/getTypeList/",{
				type : "POST",
				dataType : "json",
				params : {
					token : PFT.Util.getToken()	
				},
				loading : function(){
					that.toast.show("loading");
				},
				complete : function(){
					that.toast.hide();
				},
				success : function(res){
					var code = res.code;
					var data = res.data;
					if(code==200){
						var list = data.list;
						var arr = [];
						for(var i in list){
							if(i){
								this.ptype = i;
								that.initType();
								return true
							}
						}
					}else{
						PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
					}
				},
				timeout : function(){ PFT.Mobile.Alert("请求超时") },
				serverError : function(){ PFT.Mobile.Alert("请求出错")}
			})

		}

		//搜索城市关键字
		this.cityKeyWord = "";
		
		this.renderScroll();		
		
	},

	initType : function(){

		$("#typeText").attr("data-type",this.ptype);
		if( this.ptype == "A"){
			$("#typeText").text("景区");
		}else if( this.ptype == "B" ){
			$("#typeText").text("线路");
		}else if( this.ptype == "C" ){
			$("#typeText").text("酒店");
		}else if( this.ptype == "F" ){
			$("#typeText").text("套票");
		}else if( this.ptype == "G" ){
			$("#typeText").text("餐饮");
		}else if( this.ptype == "H" ){
			$("#typeText").text("演出");
		}else if( this.ptype == "I" ){
			$("#typeText").text("年卡");
		}

	},

	//判断登陆类型
	checkMemberType : function(){

		var that = this;

		PFT.Util.Ajax("/r/MicroPlat_Member/checkMemberType/",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken()	
		    },
		    loading : function(){
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
		    },
		    success : function(res){
				

				var code = res.code;
				var msg = res.msg;
				var data = res.data;
				if( code == 200){
					return true
				}else if( code == 201){
					window.location.href = "login.html";					
				}else if( code == 202){
					window.location.href = "transit.html";
				}else if( code == 203){
					window.location.href = data.url;					
				}else if( code == 205){
					window.location.href = "noauth.html";
				}else if( code == 207 ){
					var para = that.getpara();
					window.location.href = "login.html" + para ;
				}
				
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})


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
			content : '<div id="pullupUndefined">暂无产品</div>',
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
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
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
		//主题要基于类型
		if(this.topic != ""){ 
			this.topic = "";
			$("#themeText").text("全部主题");
		}
    	if(this.typeSelect){
		    this.typeSelect.show();	
    	}else{
			this.typeSelect = new SheetCore({
				header : "类型",
				content : typeHtml,       
				height : "auto",    
				yesBtn : false,
				noBtn : true,
				zIndex : 200,       
				EVENTS : {      
					"click .typeBtn" : function(e){
						var target = $(e.target);	 
						var type = target.attr("data-type");
					    that.changeType(target,type);

						that.lastListLid = 0;
						that.lastListProPos = 0;
						that.renderSearch();

						that.typeSelect.close();
					}
				}
			});

			this.typeSelect.mask.on("click",function(){
				that.typeSelect.close();	
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
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
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
		data.list = res.data;
    	var themeHtml = this.themeTemplate(data);
    	if(this.themeSelect){
			//动态改变
			var list = res.data;
			var html = "";
			html += '<li id="allThemeBtn">全部主题</li>';
			if(list.length > 0){
				for( var i = 0;i<list.length;i++ ){
					html += '<li class="themeBtn">'+list[i]+'</li>';
				}
			}else{
				html += '<li class="themeBtn">无主题</li>';
			}
			$("#themeWrap").html(html);
    		this.themeSelect.show();	
    	}else{
    		var that = this;
			this.themeSelect = new SheetCore({
				header : "主题",
				content : themeHtml,       
				height : "auto",      
				yesBtn : false,
				noBtn : true,
				zIndex : 200,       
				EVENTS : {      
					"click .themeBtn" : function(e){
					  that.changeTheme($(e.target));
					},

					"click #allThemeBtn" : function(e){

						var target = $(e.target);

						that.topic = "";
						$("#themeText").text("全部主题");

						that.lastListLid = 0;
						that.lastListProPos = 0;
						that.renderSearch();

						that.themeSelect.close();	

					}
				}
			});
			this.themeSelect.mask.on("click",function(){
				that.themeSelect.close();
			});
		    this.themeSelect.show();
    	}

	},

	changeTheme : function(obj){
		var text = obj.text();
		if(text == "无主题"){
			return false
		}
		this.topic = text;
		$("#themeText").text(text);

		this.lastListLid = 0;
		this.lastListProPos = 0;
		this.renderSearch();

        this.themeSelect.close();
	},

	onCitySelect : function(){

		var that = this;

		this.cityReq = PFT.Util.Ajax("/r/MicroPlat_Product/getAreaList",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	keyword : that.cityKeyWord 
		    },
		    loading : function(){
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
		    },
		    success : function(res){
		        var code = res.code;
		        if(code==200){

		        	if(that.cityKeyWord == ""){
		        		that.cityHandler(res);
		        	}else{
		        		that.citySearch(res);
		        	}
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

   			

	},

	cityHandler : function(res){

		var that = this;

		var data = {};
    	var cityList = this.dealCityList(res);		
    	data.list = res.data;

    	var cityHtml = this.cityTemplate(data);

    	if(this.citySelect){

			var con = this.citySelect.container.find(".sheet-content");
			con.html(cityHtml);
		    this.citySelect.show();			
    	}else{
			this.citySelect = new SheetCore({
				content : cityHtml,       
				height : "100%",     
				yesBtn : false,
				noBtn : true,
				zIndex : 200,       
				EVENTS : {      
					"click .cityBtn" : function(e){

						  var target = $(e.target);
						  var value = target.attr("value");
						  if(value == "1"){
							  return false
						  }
						  var t = target.text();
						  var code = target.attr("data-code");
						  $("#cityText").text(t);

						  that.city = code;

						  that.lastListLid = 0;
						  that.lastListProPos = 0;
						  that.renderSearch();

						  that.cityKeyWord = ""; 

						  that.citySelect.close();

					},
					"click .allCityBtn" : function(){
						that.city = "";
						$("#cityText").text("全部城市");

						that.lastListLid = 0;
						that.lastListProPos = 0;
						that.renderSearch();

						that.citySelect.close();
					},
					"input #citySearch" : function(e){
						var cityKeyWord = $(e.target).val();	
						var State = that.cityReq.readyState; 
						if(State == 4){
							that.cityKeyWord = cityKeyWord; 
							that.onCitySelect();
						}else{
							return false;
						}
					}
				}
			});
		    this.citySelect.show();
    	}

    	
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

	citySearch : function(res){

		var list = res.data;
		var listHtml = "";
		var emptyHtml = '<li class="cityBtn" value="1" >未搜索到相关城市</li>';
		for(var i = 0;i<list.length;i++){	
			listHtml += '<li class="cityBtn" data-code=' + list[i].code + '>'+list[i].name+'</li>';		
		}
		if(list.length == 0){	
			$("#allCityWrap").html(emptyHtml);
		}else{
			$("#allCityWrap").html(listHtml);
		}
		// this.cityKeyWord = "";

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
						var noneType = "";
						that.renderSearch(noneType);
					    that.searchSelect.close();
					}
				}
			});
		    this.searchSelect.show();
    	}

    	$(".searchInput").focus();

	},

	renderSearch : function(Type){

		var that = this;

		this.toast2 = new Toast();

		// if(!this.lastListLid){
		// 	this.lastListLid = 0;
		// }
		// if(!this.lastListProPos){
		// 	this.lastListProPos = 0;
		// }

		var typeFlag = "";
		if(Type != ""){
			typeFlag = this.ptype;
		}

		PFT.Util.Ajax("/r/MicroPlat_Product/getProductList/",{
		    dataType : "json",
			type : "POST",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lastLid : that.lastListLid,
		    	lastProPos : that.lastListProPos,
		    	ptype : typeFlag,
		    	keyword : that.keyword,
		    	topic : that.topic,
		    	city : that.city,
		    	pageSize : that.pageSize,
				ctx : that.ctx,
				ctype : that.ctype
		    },
		    loading : function(){
		        that.toast2.show("loading");
		    },
		    complete : function(){
		        that.toast2.hide();
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
		        	that.renderList(data);
					that.keyword = "";
					$(".productNameSearch").val("");
					$(".searchInput").val("");
		        }else if(code==207){
		            var para = that.getpara();
					window.location.href = "login.html" + para ;
		        }else{
					PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
					that.keyword = "";
					$(".productNameSearch").val("");
					$(".searchInput").val("");
				}
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	},

	renderList : function(data){

		var that = this;

		var list = data.list;
		if(list.length == 0){
			PFT.Mobile.Alert("没有更多了");
			this.pullup.pluginDestructor();
			return false
		}
		if(list.length < 4){
			this.pullup.pluginDestructor();
			$("#xContainer").css("transform","translate(0px, 0px) translateZ(0px)");//回到顶部
		}

		if(list.length >= 4){
			that.xscroll.plug(that.pullup);
		}

		data.ctx = this.ctx;
		data.ctype = this.ctype;
		data.ptype = this.ptype;

		var listHtml = this.listTemplate(data);

		if(this.lastListLid == 0 && this.lastListProPos == 0){
			$("#xContent").html(listHtml);
		}else{
			$("#xContent").append(listHtml);
		}

		this.lastListLid = data.lastLid;
		this.lastListProPos = data.lastProPos;

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
				that.toast.show("loading");
		    },
		    complete : function(){
				that.toast.hide();
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
		        	that.renderTicketList(data,target);
		        }else if(code == 207){
		            var para = that.getpara();
					window.location.href = "login.html" + para ;
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

		this.xscroll.render();
		this.pullup.complete();

	},
	onclickLink : function(e){
		if(this.ctype == 4){
			return false
		}
		var target = $(e.target);	
		if(target.attr("class") != "writeOrderLink"){
			target = target.parent();
		}
		var pid = target.attr("data-pid");
		var aid = target.attr("data-aid");
		var url = "order_fill.html?aid=" + aid + "&" + "pid=" + pid; 

		var urlPara = this.urlPara;
		var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;

		for( var i in urlPara){
			if( i != fullHost){
				url += "&" + i +"=" + urlPara[i] ;
			}
		}

		window.location.href = url;
	},


	getpara : function(){
		var url = window.location.href;
		var urlPara = Parse(url);
		var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
		delete urlPara[fullHost]
		var url = "?";
		for( var i in urlPara){
			url += i +"=" + urlPara[i] + "&";
		}
		url = url.substring( 0 , url.length-1 );

		return url

	}



});


$(function(){
	new Plist();
});
