/**
 * Created by Administrator on 15-10-22.
 */
var ListManager = RichBase.extend({
	statics : {
		MAX_TICKETUL_SIZE : 3
	},
	EVENTS : {
		"click" : {
			".ticTypeToggleBtn" : "onTicTypeToggleBtnClick",
			".slideTicketUlBtn" : "onSlideTicketUlBtnClick",
			".getMoreBtn" : "onGetMoreBtnClick",
			".ticketUl .refBtn" : "onRefreshPriceBtnClick"
		}
	},
	onTicTypeToggleBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var parent = tarBtn.parents(".line");
		var tipBox = parent.children(".ticketTypeMsgBox");
		tarBtn.toggleClass("on");
		tipBox.slideToggle();
	},
	onSlideTicketUlBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return e.stopPropagation();
		tarBtn.toggleClass("on");
		var ticketUl = tarBtn.prev(".ticketUl");
		var oHeight = ticketUl.attr("data-oheight");
		var sHeight = ticketUl.attr("data-sheight");
		if(tarBtn.hasClass("on")){
			ticketUl.css({height:"auto"})
		}else{
			ticketUl.animate({height:sHeight});
		}
	},
	init : function(opt){
//		this.container = opt.container;
		this.container = $("#orderListUl");
		this.autoFixTicketUl();
	},
	onGetMoreBtnClick : function(that,e){
		that.fire("getMoreBtn.click")
	},
	//获取实时价格
	onRefreshPriceBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var pid = tarBtn.attr("data-pid");
		var aid = tarBtn.attr("data-aid");
		var tid = tarBtn.attr("data-tid");
		var fsid = tarBtn.attr("data-fsid");
		var fsaccount = tarBtn.attr("data-fsaccount");
		if(!pid || !aid ||!tid) return false;
		var loadingImg = "http://www.12301.cc/images/icons/gloading.gif";
		var line = tarBtn.parents(".line");
		var col_4 = line.children(".col_4");
		var col_5 = line.children(".col_5");
		var data = {
			act : "RefreshPrice",
			pid : pid,
			aid : aid,
			tid : tid
		};
		if(fsid && fsaccount){
			data["fsid"] = fsid;
			data["fsaccount"] = fsaccount;
		}
		PFT.Ajax({
			url : "api/inside/plist.php",
			type : "get",
			dataType : "json",
			data : data,
			loading : function(){
				tarBtn.addClass("disable");
				col_4.append('<img style="width:22px" class="loading" src="'+loadingImg+'"/>').find(".priceBox").hide();
				col_5.append('<img style="width:22px" class="loading" src="'+loadingImg+'"/>').find(".priceBox").hide();
			},
			removeLoading : function(){
				tarBtn.removeClass("disable");
				col_4.find('.loading').remove().end().find(".priceBox").show();
				col_5.find('.loading').remove().end().find(".priceBox").show();
			},
			timeout : function(res){},
			serverError : function(res){}
		},function(res){
			var status = res.status;
			var msg = res.msg;
			var data = res.data || {};
			if(status=="success"){
				var js = data.js || {};
				var ls = data.ls || {};
				var jsp = js.p;
				var lsp = ls.p;
				col_4.find(".num").text(lsp);
				col_5.find(".num").text(jsp);
			}else{

			}
		})
	},
	autoFixTicketUl : function(){
		var that = this;
		var MAX_TICKETUL_SIZE = this.statics.MAX_TICKETUL_SIZE;
		this.container.children().children(".ticketBox").children(".ticketUl").each(function(){
			var tarUl = $(this);
			if(!tarUl.hasClass("fix")){
				tarUl.addClass("fix");
				var lines = tarUl.children();
				var line_len = lines.length;
				if(line_len>MAX_TICKETUL_SIZE){
					var lineHeight = lines.first().height();
					var sHeight = lineHeight * MAX_TICKETUL_SIZE + 3;
					var oHeight = (lineHeight+1) * line_len;
					tarUl.height(sHeight).attr("data-oheight",oHeight).attr("data-sheight",sHeight);
					tarUl.next(".slideTicketUlBtn").removeClass("disable");
				}
			}
		})
	}
});
module.exports = ListManager;