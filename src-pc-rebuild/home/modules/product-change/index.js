

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");

module.exports = function(parent){

	var container = $('<div id="ProductChangeBox" class="ProductChangeBox"></div>').appendTo(parent);

	var PriceChange = PFT.Util.Class({

		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			this.Size = 10;
			this.fetch();
		},

		render : function(data){
			var html = this.template(data);
			this.container.html(html);
			this.changeStatusColor();
		},

		fetch : function(){
			var that = this;
			var html = Loading("努力加载中...");
			var container = this.container;
			Common.Ajax(Common.api.Home_HomeNotice.productChange,{
				params : {
				    size : that.Size,
				},
				loading : function(){
					container.html(html);
				},
				// complete : function(){ container.html("")},
				success : function(res){
					var code = res.code;
					var msg = res.msg;
					if(code==200){
						that.render(res);
					}else{
						alert(msg);
					}
				}
			})
		},

		changeStatusColor : function(){
			$("#ProductChangeBox .upOrDown").each(function(){
				var type = $(this).attr("data-status");
				if(type == "1"){
					$(this).addClass("icon-shangjia");
					$(this).css("color","#0396DB");
				}else if(type == "2"){
					$(this).addClass("icon-xiajia");
					$(this).css("color","#EF7743");
				}
			});
		}


	});

	return new PriceChange;

	
}

