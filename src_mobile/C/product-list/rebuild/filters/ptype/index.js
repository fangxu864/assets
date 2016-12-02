/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:47
 * Description: ""
 */
var Ptype = PFT.Util.Class({
	init : function(opt){
		this.container = opt.container;
		this.sheet = new opt.SheetCore();
		var item = '<a id="switchPtypeBtn" data-filter="type" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-ptype ptype" style="color:#fff"><span class="t"></span></a>';
		this.container.children(".con").append(item);
	}
});
module.exports = Ptype;