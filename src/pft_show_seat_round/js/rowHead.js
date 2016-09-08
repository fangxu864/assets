/**
 * Created by Administrator on 15-8-21.
 */
var Core = require("./core.js");
var RowHead = RichBase.extend({
	statics : {
		height : Core.STAGE_BOX_HEIGHT
	},
	EVENTS : {
		"click" : {
			".stage-row-head-box" : "onHeadBoxClick",
			".stage-row-head-box input" : "onHeadBoxInpClick"
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
		var col = parent.attr("data-row");
		if(!val || !PFT.Help.isPositiveNum(val) || (val==oVal)){
			parent.text(oVal);
			tarInp.remove();
			return false;
		}
		parent.text(val);
		tarInp.remove();
		$("#stageUl").children(".stageBox-row-"+col).each(function(){
			var box = $(this);
			var oSeat = box.attr('data-seat');
			var oCol = oSeat.split("-")[1];
			box.attr("data-seat",val+"-"+oCol).attr("data-row",val);
		});
	},
	onHeadBoxInpClick : function(that,e){
		e.stopPropagation();
	},
	render : function(opt){
		var row_head = opt.row_head || [];
		var row_len = row_head.length;
		var row = (row_head && row_len) ? row_len : opt.row;
		var h = this.statics.height;
		var ulH = h*row+row;
		var html = "";
		for(var i=0; i<row; i++){
			var col = (row_head && row_len) ? row_head[i] : (i+1);
			var index = i*1+1;
			html += '<li id="row-head-box-'+index+'" class="stage-row-head-box box headBox" data-row="'+col+'" style="height:'+h+'px; line-height:'+h+'px">'+col+'</li>';
		}
		this.container.children().html(html).height(ulH);
	},
	scroll : function(y){
		this.container.children().css("top",y);
	}
});

module.exports = RowHead;