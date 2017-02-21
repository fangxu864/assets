
require("./index.scss");

var InfoTpl = require("./tpl/info.xtpl");	
var InfoBottomTpl = require("./tpl/infoBottom.xtpl");	
var TicketTpl = require("./tpl/ticket.xtpl");	

var Toast = require("COMMON/modules/Toast");

var Product_detail = PFT.Util.Class({

	container : $("#productDetailBox"),
	EVENTS : {     
		"click .moreTicket" : "onMoreTicket"               
	},
	init : function(opt){      
		//lid
		var url = window.location.href;
		url = url.split("?");
		lid = url[1].split("=");
		lid = lid[1];
		this.lid = lid;

		//ctx,ctype
		this.ctx = 0;//默认为0
		this.ctype = 1;//默认为1

		var that = this;

		this.infoTemplate = PFT.Util.ParseTemplate(InfoTpl);  
		this.infoBottomTemplate = PFT.Util.ParseTemplate(InfoBottomTpl);  
		this.ticketTemplate = PFT.Util.ParseTemplate(TicketTpl);  

		this.lastTid = 0;
		this.lastTicketPos = 0;

		this.toast = new Toast();

		this.getInfo();
			
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
		// console.log(infoHtml);

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
		    	//先用0测试,因为会没有更多票了
		    	// lastTid : 0,  
		    	// lastTicketPos : 0		
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

		console.log(res);

		var data = res.data;
		var list = data.list;
		console.log(list);
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

	}



});


$(function(){
	new Product_detail();
});





