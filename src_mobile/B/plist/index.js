
require("./index.scss");

var XScroll = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/xscroll");
var PullUp = require("NODE_MODULES/vux/node_modules/vux-xscroll/build/cmd/plugins/pullup");
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");

var Plist = PFT.Util.Class({

	container : $("#productOrderBox"),
	EVENTS : {      
		"click .typeSelect" : "onTypeSelect",              
		"click .themeSelect" : "onThemeSelect",              
		"click .citySelect" : "onCitySelect",              
	},
	init : function(opt){         
		
		this.typeSelect = new SheetCore({

		});

		this.citySelect = new SheetCore({
			
		});

		this.themesSelect = new SheetCore({
			
		});
		
	},

	onTypeSelect : function(){

		PFT.Util.Ajax("/r/MicroPlat_Product/getTypeList/",{
		    dataType : "json",
		    params : {
		    	token : PFT.getToken()	
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
		            //do something...
		        }else{
		            alert(res.msg || PFT.AJAX_ERROR)
		        }
		    },
		    timeout : function(){ alert("请求超时") },
		    serverError : function(){ alert("请求出错")}
		})

	},

	onThemeSelect : function(){



	},

	onCitySelect : function(){



	}

});


$(function(){
	new Plist();
});





