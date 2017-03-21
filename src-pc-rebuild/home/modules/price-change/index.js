require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var ItemTpl = require("./item.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
var LoadingHtml = Loading("努力加载中...",{
	height : 400
});
var numberToFixed = PFT.Util.numberToFixed;
module.exports = function(parent){

	var container = $('<div id="PriceChangeBox" class="PriceChangeBox"></div>').appendTo(parent);

	var PriceChange = PFT.Util.Class({
		__hasLoaded : false,
		container : container,
		template : PFT.Util.ParseTemplate(ItemTpl),
		init : function(){
			this.Size = 10;
			container.html(Tpl);
			this.listUl = container.find(".infoList");
			this.listUl.html(LoadingHtml);
		},

		render : function(data,type){
			if(type=="empty"){
				this.listUl.html('<li style="width:100%; height:100px; line-height:100px; text-align:center;">暂无产品价格变动..</li>')
			}else{
				var html = this.template({data:data});
				this.listUl.html(html);
				this.changePriceColor(data);
			}
			this.trigger("ready");
		},

		fetch : function(){

			if(this.__hasLoaded) return false;
			this.__hasLoaded = true;

			var that = this;
			var container = this.container;
			var listUl = this.listUl;
			
			Common.Ajax(Common.api.Home_HomeNotice.priceChange,{
				params : {
					size : that.Size,
				},
				loading : function(){},
				complete : function(){ listUl.html("")},
				success : function(res){
					var code = res.code;
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					var data = res.data || [];
					if(code==200){
						if(data.length==0){
							that.render(null,"empty");
						}else{
							//涉及到价格的，后端现在统一返回分为单位，前端需要转化为元
							for(var i=0,len=data.length; i<len; i++){
								data[i]["diff"] = numberToFixed(data[i].diff/100,2);
							}
							that.render(data);
						}
					}
				},
				timeout : function(){},
				serverError : function(){}
			})
			
		},


		changePriceColor : function(){
			var priceList = $("#PriceChangeBox .changePrice");
			priceList.each(function(){
				var tprice = $(this).text();
				// var price = parseInt(tprice);
				var abPrice = Math.abs(tprice);
				if (tprice>0) {
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

