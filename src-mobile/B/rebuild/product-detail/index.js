
require("./index.scss");
//tpl
// var InfoTpl = require("./tpl/info.xtpl");	
// var InfoBottomTpl = require("./tpl/infoBottom.xtpl");	
// var TicketTpl = require("./tpl/ticket.xtpl");	
//组件
var Toast = require("COMMON/modules/Toast");
var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

var Product_detail = PFT.Util.Class({
	// container : $("#productDetailBox"),
	EVENTS : {     
	},
	init : function(opt){      
		var that = this;

		var url = window.location.href;
		var urlPara = Parse(url);
		this.urlPara = urlPara; 

		this.lid = urlPara.lid;

		this.toast = new Toast();

		this.getTicketList();

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
		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
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

					console.log(data);

		        }else{
		            PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	}
	// ,
	// onclickOrderBtn : function(e){
	// 	var target = $(e.target);
	// 	var url = "order_fill.html?aid=" + target.attr("data-aid") + "&pid=" + target.attr("data-pid") ;
	// 	var urlPara = this.urlPara;
	// 	var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
	// 	for( var i in urlPara){
	// 		if( i != fullHost){
	// 			url += "&" + i +"=" + urlPara[i] ;
	// 		}
	// 	}
	// 	window.location.href = url;
	// }

});


$(function(){
	new Product_detail();
});





