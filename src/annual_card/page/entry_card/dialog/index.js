/**
 * Author: huangzhiyang
 * Date: 2016/6/14 18:19
 * Description: ""
 */
var box_tpl = require("./dialog.box.xtpl");
var winWidthHeight = require("COMMON/js/util.window.width.height.js");
require("./index.scss");
var Dialog = Backbone.View.extend({
	state : 0,
	initialize : function(opt){
		var that = this;
		this.List = opt.List;
		this.dialogBox = this.createDialog();
		this.mask = this.createMask();
		this.readCardObj = document.getElementById("readCardObj");
		$("#dialogCloseBtn").on("click",function(e){
			that.close();
		})
		$("#relateCardBtn").on("click",function(e){
			that.relateCard(e);
		})
		$("#clearCardInpBtn").on("click",function(e){
			var inp = $("#physic_no_Inp");
			inp.val("").focus();
			$(e.currentTarget).hide();
		})
		$("#physic_no_Inp").on("keyup",function(e){
			var tarInp = $(e.currentTarget);
			var keycode = e.keyCode;
			if(keycode!=13) return false;
			$("#clearCardInpBtn").show();
		})
	},
	//关联卡
	relateCard : function(e){
		var physicInp = $("#physic_no_Inp");
		var cardNumInp = $("#cardNumberInput");
		var physic_number = physicInp.val();
		var card_number = $.trim(cardNumInp.val());
		if(!physic_number) return alert("请先把卡放在读卡器上，然后点击读卡按钮");
		if(!card_number) return alert("实体卡号不能为空");
		this.addCardToList(physic_number,card_number);
		physicInp.val("");
		cardNumInp.val("");
	},
	addCardToList : function(physic_number,card_number){
		if(!physic_number) return false;
		var hasExist = false;
		var cardList = $("#cardList");
		var unRelate_first = null;
		cardList.children().each(function(){
			var item = $(this);
			var physics = item.find(".physics").text();
			if(physics=="--") physics = "";
			if(physics=="" && !unRelate_first) unRelate_first = item;
			if(physics==physic_number && physics!=""){
				hasExist = true;
				return false;
			}
		})
		if(hasExist) return alert("此卡已关联过");
		unRelate_first.find(".physics").text(physic_number);
		unRelate_first.find(".card").text(card_number);
		var hasRelatedCount = $("#hasRelatedCount");
		hasRelatedCount.text(hasRelatedCount.text()*1+1);
	},
	readwuKa : function(e){
		var readCardObj = this.readCardObj;
		if(!readCardObj){
			alert("请使用IE浏览器读物理卡号");
			return false;
		}
		if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
			alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
			return false;
		}
		readCardObj.open();
		var val = readCardObj.ICReaderRequest();
		$("#physic_no_Inp").val(val);
	},
	createDialog : function(){
		if(this.dialogBox) return this.dialogBox;
		this.dialogBox = $('<div style="display:none; float:left" class="dialogBoxContainer"></div>');
		this.dialogBox.append(box_tpl);
		$("body").append(this.dialogBox);
		return this.dialogBox;
	},
	createMask : function(){
		if(this.mask) return this.mask;
		this.mask = $('<div style="display:none" class="dialogMask"></div>');
		$("body").append(this.mask);
		return this.mask;
	},
	position : function(box){
		var w = box.width();
		var h = box.height();
		var win = winWidthHeight();
		box.css({
			position : "fixed",
			left : (win.width-w)/2,
			top : (win.height-h)/2-(win.height-h)*0.1
		})
	},
	slide : function(callback){
		var slideStage = $("#dialog-slideStage");
		var step = slideStage.height();
		var slideCon = slideStage.children(".slideCon");
		var top = slideCon.css("top");
		top = top.substr(0,top.length-2)*1;
		var dir = top==0 ? -1 : 0;
		slideCon.animate({top:dir*step},100,function(){
			callback && callback()
		});
	},
	open : function(callback){
		if(this.state==1) return false;
		this.state = 1;
		this.dialogBox.show().css({zIndex:100});
		this.mask.show().css({zIndex:99});
		this.position(this.dialogBox);
		$("#dialog-slideStage").children(".slideCon").css({top:0});
		callback && callback();
	},
	close : function(callback){
		this.state = 0;
		this.dialogBox.hide().css({zIndex:-1});
		this.mask.hide().css({zIndex:-1})
		callback && callback()
	}
});
module.exports = Dialog;
