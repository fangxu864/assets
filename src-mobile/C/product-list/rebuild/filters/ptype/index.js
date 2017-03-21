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
		this.initSheet();
	},
	initSheet : function(){
		var that = this;
		var data = this.data;
		var content = this.host.renderHtml(data);
		this.sheet = new opt.SheetCore({
			content : content,
			noBtn : true,
			EVENTS : {
				"click .actionItem" : function(e){
					var tarItem = $(e.currentTarget);
					var key = tarItem.attr("data-key");
					var value = tarItem.text();
					tarItem.addClass("selected").siblings().removeClass("selected");
					that.trigger("select",{key:key,value:value});
				}
			}
		});
	}
});
module.exports = Ptype;