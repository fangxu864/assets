

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var ItemTpl = require("./item.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
var LoadingHtml = Loading("努力加载中...",{
	height : 400
});
module.exports = function(parent){

	var container = $('<div id="ProductChangeBox" class="ProductChangeBox"></div>').appendTo(parent);

	var PriceChange = PFT.Util.Class({
		__hasLoaded : false,
		container : container,
		template : PFT.Util.ParseTemplate(ItemTpl),
		init : function(){
			this.Size = 10;
			container.html(Tpl);
			this.listUl = container.find(".infoList");
			this.listUl.html(LoadingHtml);
			//this.fetch();
		},

		render : function(data,type){
			if(type=="empty"){
				this.listUl.html('<li style="width:100%; height:100px; line-height:100px; text-align:center;">暂无产品上下架消息..</li>')
			}else{
				var html = this.template({data:data});
				this.listUl.html(html);
				this.changeStatusColor();
			}
			this.trigger("ready");
		},

		fetch : function(){

			if(this.__hasLoaded) return false;
			this.__hasLoaded = true;

			var that = this;
			var container = this.container;
			var listUl = this.listUl;

			listUl.html(LoadingHtml);

			Common.Ajax(Common.api.Home_HomeNotice.productChange,{
				params : {
					size : that.Size,
				},
				loading : function(){},
				complete : function(){ listUl.html("")},
				success : function(res){
					var code = res.code;
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					var data = res.data;
					if(code==200){
						if(data.length==0){
							that.render(null,"empty");
						}else{
							that.render(data);
						}
					}else{
						//(code!=401) && alert(msg);
					}
				},
				timeout : function(){},
				serverError : function(){}
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

