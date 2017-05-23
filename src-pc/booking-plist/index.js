require("./index.scss");


var HeaderFilter = require("./modules/header-filter");

var Jidiao = require("./modules/jidiao");

var ListManager = require("./modules/list-manager");

var AnnaulCardDialog = require("./modules/annual-card-dialog");

// var MainBodyScrollManager = PFT.Util.MainBodyScrollManager;
var MainBodyScrollManager = PFT.Util.ScrollManager;

var Main = PFT.Util.Class({
	container :"#pageRightContainer",
	init : function(){
		
		if($("#fixDisSwitchor").length){
			var jidiao = this.jidiao = new Jidiao();
			jidiao.on("dis.change",function(data){
				headerFilter.refresh();
				listManager.refresh();
			})
		}

		var annaulCardDialog = new AnnaulCardDialog();

		var listManager = new ListManager();
		
		var headerFilter = new HeaderFilter();
		headerFilter.on("search",function(params){
			if(listManager.getState("isLoading")) return false;
			listManager.resetState();
			listManager.refresh(params);
		})
		headerFilter.on("reset",function(){
			if(listManager.getState("isLoading")) return false;
			headerFilter.resetParams();
			headerFilter.trigger("search");
		})

		var scroll = MainBodyScrollManager({
			container : "#G_Body",
			distanceToBottom : 17,
			scroll : function(data){

			},
			scrollAtBottom : function(data){
				var params = headerFilter.getParams();
				params["page"] = listManager.getCurrentPage() + 1;
				listManager.getMore(params);
			}
		});
		
		// scroll.on("scroll",function(data){
		// 	console.log(data);
		// })
		// scroll.on("scrollAtBottom",function(data){
		// 	console.log("scrollAtBottom")
		// 	var params = headerFilter.getParams();
		// 	params["page"] = listManager.getCurrentPage() + 1;
		// 	listManager.fetch(params);
		// })
		

		//如果是年卡类产品   点击购买按钮时，弹窗
		listManager.on("buyBtn.click",function(e){
			var tarBtn = $(e.currentTarget);
			var ptype = tarBtn.attr("data-ptype");
			if(ptype!=="I") return false;
			e.preventDefault();
			var aid = tarBtn.attr("data-aid");
			var pid = tarBtn.attr("data-pid");
			var sid = tarBtn.attr("data-applydid");
			annaulCardDialog.open({
				pid : pid,
				aid : aid,
				sid : sid
			})
		})



	}
});

$(function(){
	new Main();
})



