/**
 * Created by Administrator on 15-7-27.
 */
var Core = require("./core.js");
var StageBox = require("./stageBox.js");
var mContextMenu = require("./contextMenu.js");
var core = new Core();
var ContextMenu = new mContextMenu({container:$("#contextMenuWrap")});
var Stage = RichBase.extend({
	statics : {
		mouseMoveTimer : null
	},
	EVENTS : {
		"click" : {
			".stageUl .stageBox" : "onStageBoxClick"
		},
		"contextmenu" : {
			".stageUl .stageBox" : "onStageContextMenu"
		}
	},
	selected : [],
	init : function(opt){
		var that = this;
		this.container = opt.container;
		this.ContextMenu = ContextMenu;
		document.addEventListener("keydown",function(e){
			that.onKeyDown(that,e)
		},false)
		document.addEventListener("keyup",function(e){
			that.onKeyUp(that,e)
		},false)
	},
	onStageBoxClick : function(that,e){
		e.preventDefault();
		if(e.ctrlKey) return false;
		var tarBox = $(e.currentTarget);
		if(e.shiftKey){//如果按住shiftKey键
			if(tarBox.hasClass("active")){
				tarBox.removeClass("active");
			}else{
				var prev = tarBox.prevAll(".active");
				if(prev.length){
					while(!tarBox.hasClass("active")){
						tarBox.addClass("active");
						tarBox = tarBox.prev();
					}
				}else{
					tarBox.addClass("active");
				}
			}
		}else{
			tarBox.toggleClass("active");
		}
		that.fire("stageBoxClick",tarBox);
	},
	onStageContextMenu : function(that,e){
		e.preventDefault ? e.preventDefault():(e.returnValue = false);
		var tarBox = $(e.currentTarget);
		var tarSeat = tarBox.attr("data-seat");
		tarSeat = tarSeat.split("-");
		var tarRow = tarSeat[0];
		var tarCol = tarSeat[1];
		var selected = null;
		if(tarBox.hasClass("active")){
			selected = that.container.children(".stageUl").children(".active");
		}else{
			tarBox.addClass("active");
			selected = tarBox;
		}
		ContextMenu.run({
			tarSelected : tarBox,
			tarRow : tarRow,
			tarCol : tarCol,
			selected : selected,
			e : e,
			x : e.clientX,
			y : e.clientY
		});
		that.fire("contextMenu",selected);
	},
	onKeyDown : function(that,e){
		if(!e.ctrlKey) return false;
		that.container.css("cursor","move");
	},
	onKeyUp : function(that,e){
		that.container.css("cursor","default");
	},
	render : function(opt){
		var that = this;
		var rowCount = opt.row;
		var colCount = opt.col;
		var layout = opt.layout;
		var colArr = core.getColArray(colCount,layout);
		var stageWidth = (StageBox.width+1) * colCount;
		var listUl = this.container.children(".stageUl");
		var html = "";
		for(var row=1; row<=rowCount; row++){
			for(var s=0; s<colCount; s++){
				var col = colArr[s];
				html += StageBox.render({
					col_id  : s+1,
					col_num : col,
					row_id  : row,
					row_num : row,
					seat    : row+"-"+col,
					id : "",
					state   : "-1",
					area_id : "-1"
				});
			}
		}
		listUl.width(stageWidth).html(html).css({top:0,left:"auto"});
		that.fire("refresh");
	}
});

module.exports = Stage;


