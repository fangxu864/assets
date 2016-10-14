/**
 * Author: huangzhiyang
 * Date: 2016/9/19 16:25
 * Description: select下拉框显示时的遮罩层
 */
var maskerObj = null;
var Masker = PFT.Util.Class({
	init : function(){
		this.create();
	},
	create : function(){
		var that = this;
		this.masker = $('<div id="pftui-select-masker" class="pftui-select-masker"></div>').appendTo($("body"));
		this.masker.on("click",function(e){
			$(this).hide();
			that.trigger("click");
		})
	},
	show : function(){
		this.masker.show();
	},
	hide : function(){
		this.masker.hide();
	}
});
module.exports = function(){
	if(maskerObj) return maskerObj;
	maskerObj = new Masker;
	return maskerObj;
}

