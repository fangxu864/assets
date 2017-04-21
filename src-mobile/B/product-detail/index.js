
require("./index.scss");
//tpl
var InfoTpl = require("./tpl/info.xtpl");	
// var InfoBottomTpl = require("./tpl/infoBottom.xtpl");	
var TicketTpl = require("./tpl/ticket.xtpl");	
//组件
var Toast = require("COMMON/modules/Toast");
var Parse = require("COMMON/js/util.url.parse.query");//解析url参数
var ScrollTopAnimation = require("COMMON/modules/scrolltop-animation");

var Product_detail = PFT.Util.Class({

	container : $("#productDetailBox"),
	EVENTS : {     
	},
	init : function(opt){      
		var that = this;
		var __timer__ = null;
		var url = window.location.href;
		var urlPara = Parse(url);
		this.urlPara = urlPara; 
		this.lid = urlPara.lid;
		if(urlPara.ctx){
			this.ctx = parseInt(urlPara.ctx);		
		}else{
			this.ctx = 0;//默认为0
		}
		if(urlPara.ctype){
			this.ctype = parseInt(urlPara.ctype);		
		}else{
			this.ctype = 0;//默认为0
		}
		this.toast = new Toast();
		this.ListTemplate = PFT.Util.ParseTemplate(TicketTpl);  
		this.InfoTemplate = PFT.Util.ParseTemplate(InfoTpl);  
		this.getInfo();
		$(window).scroll(function(e){
			clearTimeout(__timer__);
            __timer__ = setTimeout(function(){
				var scrollTop = document.body.scrollTop;
                that.onScroll(scrollTop);
			},10)
		})
	},
	onScroll : function(scrollTop){
		var photoHeight = $("#topImg").height();
		if( scrollTop >= photoHeight ){
			$(".tabHeader").addClass("fix");
			$(".ticketListCon").addClass("fix");
		}else{
			$(".tabHeader").removeClass("fix");
			$(".ticketListCon").removeClass("fix");
		}
	},
	getInfo : function(){
		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getLandInfo",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lid : that.lid	
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
					that.renderInfo(data);
					var H = $("#topImg").height();
					$(".uiImageBox").css("height",H);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})
	},
	renderInfo : function(data){
		var that = this;
		var infoHtml = this.InfoTemplate({ data : data });
		$("#productDetailBox").html(infoHtml);
		this.getTicketList();
		$(".tabHeader .tabHeadItem").on("click",function(e){
			var target = e.target;
			if( target.className == "t" ){
				var item = $(target).parent();
			}
			item.addClass("active").siblings().removeClass("active");
			that.onHeaderBarClick(item);
		});
	},
	onHeaderBarClick : function(item){
		var type = item.attr("data-type");
		var body = document.body;
		var tarBoxMod = $("#"+type+"Box");
		var oTop = tarBoxMod.offset().top;
		var offsetTop = type == "buy" ? ( oTop - $("#tabHeader").height() + 1 ) : oTop ;
		ScrollTopAnimation({
			elem : body,
			top : offsetTop,
			duration : 300,
			delay : 20,
			callback : function(){}
		})
	},
	getTicketList : function(){
		var that = this;
		PFT.Util.Ajax("/r/MicroPlat_Product/getTicketList/",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lid : that.lid,
		    	// lastTid : that.lastTid,
		    	// lastTicketPos : that.lastTicketPos,
				pageSize : 1000, //不传默认返回3个
				ctx : that.ctx,
				ctype : that.ctype
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
					that.renderTicketList(data);
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	},
	renderTicketList : function(data){
		var that = this;
		var listHtml = this.ListTemplate(data);
		$("#ticketList").html(listHtml);
		//更多票类
		var items = $("ul#ticketList li.item");
		var fiveH = 0;
		items.each(function(i,item){
			if( i < 5){
				fiveH += $(item).height();
			}
		});
		if( items.length > 5 ){
			$(".moreT").css("display","block");
			$("ul#ticketList").css("height",fiveH + "px");
		}
		$(".moreT").on("click",function(e){
			if( $(this).attr("flag") == "0" ){
				$(this).attr("flag","1");
				$("ul#ticketList").css("height","auto");
			}else if( $(this).attr("flag") == "1" ){
				$(this).attr("flag","0");
				$("ul#ticketList").css("height",fiveH + "px");
			}	
		});
		//预定按钮
		$(".buyBtn").on("click",function(e){
			that.onclickOrderBtn(e);
		});
	},
	//点击预定时
	onclickOrderBtn : function(e){
		var target = $(e.target);
		var url = "order_fill.html?aid=" + target.attr("data-aid") + "&pid=" + target.attr("data-pid") ;
		var urlPara = this.urlPara;
		var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
		for( var i in urlPara){
			if( i != fullHost){
				url += "&" + i +"=" + urlPara[i] ;
			}
		}
		window.location.href = url;
	}

});

$(function(){
	new Product_detail();
});





