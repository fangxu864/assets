
require("./index.scss");

var InfoTpl = require("./tpl/info.xtpl");	
var InfoBottomTpl = require("./tpl/infoBottom.xtpl");	
var TicketTpl = require("./tpl/ticket.xtpl");	



var Product_detail = PFT.Util.Class({

	container : $("#productDetailBox"),
	EVENTS : {     
		"click .moreTicket" : "onMoreTicket"               
	},
	init : function(opt){      

		this.lid = "6603";  
		var that = this;

		this.infoTemplate = PFT.Util.ParseTemplate(InfoTpl);  
		this.infoBottomTemplate = PFT.Util.ParseTemplate(InfoBottomTpl);  
		this.ticketTemplate = PFT.Util.ParseTemplate(TicketTpl);  

		this.lastTid = 0;
		this.lastTicketPos = 0;

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
		        //正在请中...
		    },
		    complete : function(){
		        //请求完成
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){

		        	that.handleInfo(res);

		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
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
		    	// lastTid : that.lastTid,
		    	// lastTicketPos : that.lastTicketPos,
		    	//先用0测试,因为会没有更多票了
		    	lastTid : 0,  
		    	lastTicketPos : 0		
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

		        	that.handleTicket(res);

		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})


	},

	handleTicket : function(res){

		console.log(res);

		var data = res.data;
		var list = data.list;
		console.log(list);
		if(list.length == 0){
			alert("没有更多票了");//应该用移动端专用的alert
		}
		var ticketHtml = this.ticketTemplate(data);

		this.lastTid = data.lastTid;
		this.lastTicketPos = data.lastTicketPos;

		$("#productDetailList").append(ticketHtml);


	},

	onMoreTicket : function(){

		this.getTicketList();

	}



});


$(function(){
	new Product_detail();
});





