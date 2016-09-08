/**
 * Created by Administrator on 15-8-24.
 */
var Core = require("./core.js");
var AreaLine = require("./areaLine.js");
var ContextMenu = RichBase.extend({
	statics : {
		tpl : {
			areaGroup : '<li class="menuLi setAreaLi" data-color="<%=color%>" data-areaid="<%=zone_id%>">归为：<%=zone_name%></li>'
		},
		status : Core.STATUS
	},
	EVENTS : {
		"contextmenu" : {
			"" : "onWrapContextMenu"
		},
		"click" : {
			"" : "onWrapClick",
			".contextMenuUl" : "onContextMenuConClick",
			".setAreaLi" : "onSetAreaLiClick",
			"#modifySeatBtn" : "onModifySeatBtnClick",
			".cannelAllSelected" : "onCannelAllSelected",
			".menuLiState" : "setSeatStatus",
			".cannelAreaMenuGroup" : "onCannelArea"
		},
		"focus" : {
			".setSeatInput" : "onInputFocus"
		},
		"blur" : {
			".setSeatInput" : "onInputBlur"
		}
	},
	init : function(opt){
		this.container = opt.container;
		this.contextMenuUl = $("#contextMenuUl");
		this.stageUl = $("#stageUl");
	},
	onWrapContextMenu : function(that,e){
		e.preventDefault ? e.preventDefault():(e.returnValue = false);
		that.container.hide()
	},
	onWrapClick : function(that,e){
		var target = $(e.currentTarget);
		var container = that.container;
		if(target.attr("id")=="contextMenuWrap"){
			container.hide()
		}
	},
	onContextMenuConClick : function(that,e){
		e.stopPropagation();
	},
	onCannelArea : function(that,e){
		that.stageUl.children(".active").each(function(){
			var box = $(this);
			var areaid = box.attr("data-areaid");
			if(areaid==-1) return true;
			box.removeClass("active").css("backgroundColor","#d1d1d1").attr("data-areaid","-1").attr("data-state","-1").find(".state").hide().html("");
		})
		that.stop();
	},
	getDefaultStaus : function(){
		return $("#topFormGroup").find(".radioDefStatus:radio:checked").attr("data-defstatus");
	},
	//右键菜单-构建分区
	buildAreaGroupMenu : function(data){
		if(!data) return false;
		var that = this;
		var html = "";
		var index = -1;
		for(var i in data){
			index++;
			data[i]["color"] = ("#"+AreaLine.color[index]);
			html += that.parseTemplate(that.statics.tpl.areaGroup,data[i]);
		}
		$("#menuGroupArea").html(html);
	},
	//右键菜单-action-归为分区
	onSetAreaLiClick : function(that,e){
		var tarLi = $(e.currentTarget);
		var areaId = tarLi.attr("data-areaid");
		var color = tarLi.attr("data-color");
		var defStaus = that.getDefaultStaus();
		that.stageUl.children(".active").each(function(){
			var box = $(this);
			box.css("backgroundColor",color).attr("data-areaid",areaId).attr("data-state",defStaus);
			if(defStaus==Core.STATUS["forbid_sale"]["status_id"]){ //不可售
				box.find(".state").show().html('<i class="iconfont">'+Core.STATUS["forbid_sale"]["icon"]+'</i>');
			}
			box.removeClass("active");
		})
		that.stop();
	},
	//自定义座位
	onModifySeatBtnClick : function(that,e){
		var container = that.container;
		var newRow = $("#setSeat_row_input").blur().val();
		var newCol = $("#setSeat_col_input").blur().val();
		var tarStageBox = container.data("opt").tarSelected;
		if(tarStageBox.length){
			var seat = tarStageBox.attr("data-seat");
			var newSeat = newRow+"-"+newCol;
			if(seat!==newSeat){
				tarStageBox.attr("data-seat",newSeat).attr("data-col",newCol).attr("data-row",newRow).removeClass("selected").find(".t").text(newSeat).show();
			}
		}
		that.container.click();
	},
	//自定义座位input focus
	onInputFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.attr("data-orign",tarInp.val());
	},
	//自定义座位input blur
	onInputBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var val = tarInp.val();
		var orignVal = tarInp.attr("data-orign");
		if(!val || !PFT.Help.isPositiveNum(val)) tarInp.val(orignVal);
	},
	//取消所有已选择项
	onCannelAllSelected : function(that,e){
		$("#stageUl").children(".active").removeClass("active");
		that.stop();
	},
	//设为座位状态
	setSeatStatus : function(that,e){
		var roundId = $("#hidInp_roundId").val();
		var tarMenu = $(e.currentTarget);
		var status_val = tarMenu.attr("data-state");
		var status_key = Core.getStatusKeyByID(status_val);
		var status = Core.STATUS[status_key];
		var icon = status["icon"];
		var color = status["color"];
		var background = status["background"];
		var fontSize = status["fontSize"];
		var style = [];
		if(color) style.push('color:'+color);
		if(background) style.push('backgroundColor:'+background);
		if(fontSize) style.push('fontSize:'+fontSize);
		style = style.length ? style.join(";") : "";
		//if((status_val=="4" || status_val=="5") && roundId){ //场次页面
		//	if(icon){
		//		that.stageUl.children(".active").filter(function(){
		//			return ($(this).attr("data-areaid") != -1);
		//		}).attr("data-roundstate",status_val).removeClass("active").find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
		//	}else{
		//		that.stageUl.children(".active").filter(function(){
		//			return ($(this).attr("data-areaid") != -1);
		//		}).attr("data-roundstate",status_val).removeClass("active").find(".state").hide();
		//	}
		//}else{ //场馆页面
		//	if(icon){
		//		that.stageUl.children(".active").filter(function(){
		//			return ($(this).attr("data-areaid") != -1);
		//		}).attr("data-state",status_val).removeAttr("data-roundstate").removeClass("active").find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
		//	}else{
		//		that.stageUl.children(".active").filter(function(){
		//			return ($(this).attr("data-areaid") != -1);
		//		}).attr("data-state",status_val).removeAttr("data-roundstate").removeClass("active").find(".state").hide();
		//	}
		//}

		//alert(status_val)

		if(icon){
			that.stageUl.children(".active").filter(function(){
				return ($(this).attr("data-areaid") != -1);
			}).attr("data-state",status_val).removeAttr("data-roundstate").removeClass("active").find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
		}else{
			that.stageUl.children(".active").filter(function(){
				return ($(this).attr("data-areaid") != -1);
			}).attr("data-state",status_val).removeAttr("data-roundstate").removeClass("active").find(".state").hide();
		}

		that.stop();
	},
	run : function(opt){
		var win = $(window);
		var winW = win.width();
		var winH = win.height();
		var x = opt.x;
		var y = opt.y;
		var tarRow = opt.tarRow;
		var tarCol = opt.tarCol;
		$("#setSeat_row_input").val(tarRow).attr("data-oval",tarRow);
		$("#setSeat_col_input").val(tarCol).attr("data-oval",tarRow);
		if(opt.tarSelected.attr("data-areaid")){
			$("#menuGroupSetseat").show();
			$("#menuGroupState .menuLiDefStatus").show();
		}else{
			$("#menuGroupSetseat").hide();
			$("#menuGroupState .menuLiDefStatus").hide();
		}
		var contextMenuUl = $("#contextMenuUl");
		this.container.show().data("opt",opt); //将opt缓存到container
		var menuW = contextMenuUl.width();
		var menuH = contextMenuUl.height();
		if((winW-x)<menuW) x = x - menuW;
		if((winH-y)<menuH) y = y - menuH;
		contextMenuUl.css({left:x,top:y});
	},
	stop : function(){
		this.container.hide();
	}
});
module.exports = ContextMenu;