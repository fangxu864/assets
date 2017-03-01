
require("./index.scss");

var InfoTpl = require("./tpl/info.xtpl");	
var InfoBottomTpl = require("./tpl/infoBottom.xtpl");	
var TicketTpl = require("./tpl/ticket.xtpl");	

var Toast = require("COMMON/modules/Toast");

var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

var Product_detail = PFT.Util.Class({

	container : $("#productDetailBox"),
	EVENTS : {     
		"click .moreTicket" : "onMoreTicket",
		"click .orderBtn" : "onclickOrderBtn"

	},
	init : function(opt){      
		
		var url = window.location.href;
		var urlPara = Parse(url);

		if(urlPara.ctx){
			this.ctx = urlPara.ctx;		
		}else{
			this.ctx = 0;//默认为0
		}
		if(urlPara.ctype){
			this.ctype = urlPara.ctype;		
		}else{
			this.ctype = 1;//默认为1
		}

		this.lid = urlPara.lid;

		var that = this;

		this.infoTemplate = PFT.Util.ParseTemplate(InfoTpl);  
		this.infoBottomTemplate = PFT.Util.ParseTemplate(InfoBottomTpl);  
		this.ticketTemplate = PFT.Util.ParseTemplate(TicketTpl);  

		this.lastTid = 0;
		this.lastTicketPos = 0;

		this.toast = new Toast();

		this.getInfo();

		if(this.ctype == 4){
			$(".orderBtn").css("display","none");
			return false
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

		        	that.handleInfo(res);

		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

		this.getTicketList();

	},

	handleInfo : function(res){

		var infoHtml = this.infoTemplate(res);
		var infoBottomHtml = this.infoBottomTemplate(res);

		$("#productDetailHeader").append(infoHtml);
		$("#orderInfoContent").append(infoBottomHtml);


	},

	getTicketList : function(){

		var that = this;

		PFT.Util.Ajax("/r/MicroPlat_Product/getTicketList/",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken(),
		    	lid : that.lid,
		    	lastTid : that.lastTid,
		    	lastTicketPos : that.lastTicketPos,
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

		        	that.handleTicket(res);

		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})


	},

	handleTicket : function(res){

		var data = res.data;
		var list = data.list;
		if(list.length == 0){
			PFT.Mobile.Alert("没有更多票了");
			$("#moreTicket").css("display","none");
		}
		var ticketHtml = this.ticketTemplate(data);

		this.lastTid = data.lastTid;
		this.lastTicketPos = data.lastTicketPos;

		$("#productDetailList").append(ticketHtml);

		for(var i = 0;i<list.length;i++){
			if(list[i].sonTickets){
				var pList = $("#productDetailList .productDetailTicket");
				var sonT = pList.eq(i).find(".sonTicket");
				var sonHtml = "";
				for(var j = 0;j<list[i].sonTickets.length;j++){
					if( j == list[i].sonTickets.length - 1){
						sonHtml += list[i].sonTickets[j].title + list[i].sonTickets[j].num + "张";
					}else{
						sonHtml += list[i].sonTickets[j].title + list[i].sonTickets[j].num + "张 + ";
					}
				}
				sonT.append(sonHtml);
			}
		}

	},

	onMoreTicket : function(){

		this.getTicketList();

	},

	onclickOrderBtn : function(e){
		var target = $(e.target);
		window.location.href = "order_fill.html?aid=" + target.attr("data-aid") + "&pid=" + target.attr("data-pid");
	}


});


$(function(){
	new Product_detail();
});





