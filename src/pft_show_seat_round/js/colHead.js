/**
 * Created by Administrator on 15-8-21.
 */
var Core = require("./core.js");
var core = new Core();
var ColHead = RichBase.extend({
	statics : {
		width : Core.STAGE_BOX_WIDTH
	},
	EVENTS : {
		"click" : {
			".stage-col-head-box" : "onHeadBoxClick",
			".stage-col-head-box input" : "onHeadBoxInpClick"
		},
		"blur" : {
			".headBox input" : "onChangeHeadBoxBlur"
		}
	},
	init : function(opt){
		this.container = opt.container;
		this.allow_modify = opt.allow_modify;
	},
	onHeadBoxClick : function(that,e){
		if(that.allow_modify===false) return false;
		var tarBox = $(e.currentTarget);
		var tarNum = tarBox.text();
		tarBox.html('<input class="numInp" type="text" data-orign="'+tarNum+'" value="'+tarNum+'"/>');
		setTimeout(function(){
			tarBox.children().focus();
		},10)
	},
	onChangeHeadBoxBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var parent = tarInp.parent();
		var oVal = tarInp.attr("data-orign");
		var val = tarInp.val();
		var col = parent.attr("data-col");
		if(!val || !PFT.Help.isPositiveNum(val) || (val==oVal)){
			parent.text(oVal);
			tarInp.remove();
			return false;
		}
		parent.text(val);
		tarInp.remove();
		$("#stageUl").children(".stageBox-col-"+col).each(function(){
			var box = $(this);
			var oSeat = box.attr('data-seat');
			var oRow = oSeat.split("-")[0];
			box.attr("data-seat",oRow+"-"+val).attr("data-col",val);
		});
	},
	onHeadBoxInpClick : function(that,e){
		e.stopPropagation();
	},
	render : function(opt){
		var col_head = opt.col_head || [];
		var col_len = col_head.length;
		var col = (col_head && col_len) ? col_len : opt.col;
		var layout = opt.layout;
		var colArr = (col_head && col_len) ? col_head : core.getColArray(col,layout);
		var w = this.statics.width;
		var ulW = w*col+col;
		var html = "";
		for(var i=0; i<colArr.length; i++){
			var c = colArr[i];
			var index = i*1+1;
			html += '<li id="col-head-box-'+index+'" class="stage-col-head-box box headBox" data-col="'+c+'" style="width:'+w+'px;">'+c+'</li>';
		}
		this.container.children().html(html).width(ulW);
	},
	scroll : function(x){
		this.container.children().css("left",x)
	}
});

module.exports = ColHead;