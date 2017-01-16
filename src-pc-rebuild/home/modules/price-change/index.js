

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");

module.exports = function(parent){

	var container = $('<div id="PriceChangeBox" class="PriceChangeBox"></div>').appendTo(parent);

	var PriceChange = PFT.Util.Class({

		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			this.Size = 10;
			this.fetch();
			console.log(this.container);
		},

		render : function(data){
			var html = this.template(data);
			this.container.html(html);
			this.changePriceColor(data);
		},

		fetch : function(){
			var that = this;
			var html = Loading("努力加载中...");
			var container = this.container;

			Common.Ajax(Common.api.Home_HomeNotice.priceChange,{
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


		changePriceColor : function(){

			var priceList = $("#PriceChangeBox .changePrice");
			priceList.each(function(){
				var tprice = $(this).text();
				var price = parseInt(tprice);
				var abPrice = Math.abs(price);
				if (price>0) {
					$(this).html(abPrice);
					$(this).css("color","#F27137");
				}else{
					$(this).html(abPrice);
					$(this).css("color","#25C328");
				}
			});
		}


	});

	return new PriceChange;

	
}

