/**
 * Created by Administrator on 15-10-21.
 */
var Core = require("./modules/core.js");
var Query = require("./modules/queryList.js");
var Queryor = null;
var Main = RichBase.extend({
	init : function(){
		var that = this;
		Queryor = new Query();
		var gotopBtn = $("#gotopBtn");
		var advanceSearchBox = $("#advanceSearchBox");
//		var leftBar = $("#special_w").children(".left_memb");
		var leftBar = $("#siteLeftBar").children(".left_memb");
		var leftBarH = leftBar.height();
		var ListContainer = new PFT.ListContainer({
			container : $(window),
			distanceToBottom : 0
		});
		ListContainer.on("scrollAtBottom",function(data){
			if(Queryor.get_ifAllowScrollToMore()) Queryor.getMore();
		})
		ListContainer.on("scroll",function(data){
			var scrollTop = data.scrollTop;
			if(scrollTop>200){
				gotopBtn.fadeIn("normal");
			}else{
				gotopBtn.fadeOut("normal");
			}
			if(scrollTop>leftBarH){
				leftBar.addClass("fixed");
			}else{
				leftBar.removeClass("fixed");
			}
			if(scrollTop>184){
				$("#fixDisSwitchor_backup").show();
				$("#fixDisSwitchor").addClass("fixed");
			}else{
				$("#fixDisSwitchor_backup").hide();
				$("#fixDisSwitchor").removeClass("fixed");
			}
		})

		gotopBtn.on("click",function(e){
			$("html,body").animate({scrollTop:0})
		})

		Queryor.initGet();

		if($("#fixDisSwitchor").length){
			var Jidiao = require("./modules/jidiao.js");
			var dispatch = $("#disDname_text");
			this.jidiao = new Jidiao();
			this.jidiao.on("dis.change",function(data){
				var id = data.id;
				var account = data.account;
				var dname = data.dname;
				dispatch.attr("data-id",id).attr("data-account",account).text(dname);
				Queryor.initGet();
			})
			$("#switchDisBtn").on("click",function(e){
				if($(this).hasClass("disable")) return false;
				var id = dispatch.attr("data-id");
				var account = dispatch.attr("data-account");
				var dname = dispatch.text();
				that.jidiao.showPop({
					id : id,
					account : account,
					dname : dname
				});
			})
		}

	}
})

$(function(){ new Main()})