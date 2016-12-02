/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:47
 * Description: ""
 */
var Ptype = PFT.Util.Class({
	init : function(opt){
		this.host = opt.host;
		this.container = opt.container;
		this.data = opt.data;
		var item = '<a id="switchPtypeBtn" data-filter="type" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-ptype ptype" style="color:#fff"><span class="t"></span></a>';
		this.container.children(".con").append(item);
	},
	initSheet : function(){
		var data = this.data;
		var content = this.host.renderHtml(data);
		this.sheet = new opt.SheetCore({
			content : content
		});
	},
	renderHtml : function(){

	}
});
module.exports = Ptype;