/**
 * Created by Administrator on 16-5-5.
 */
var hasInit = false;
var DialogCard = {
	tpl : require("../../tpl/dialog_card.tpl"),
	init : function(opt){
		this.dialog = opt.dialog;
	},
	open : function(opt){
		if(!hasInit){
			hasInit = true;
			this.init(opt);
		}
		var title = opt.title || "标题";
		var tpl = this.tpl;
		this.dialog.open({
			container : {
				header : title,
				content : tpl
			},
			overlay : false,
			offsetY : -100,
			drag : true,
			events : {}
		})
	}
};
module.exports = DialogCard;