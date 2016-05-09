/**
 * Author: huangzhiyang
 * Date: 16-5-9 下午2:16
 * Description: ""
 */
var DialogBindCardModel = Backbone.Model.extend({
	defaults : {
		bank : "",
		province : "",
		city : "",
		keyword : "",
		targetBank : ""
	},
	initialize : function(){
		this.on("change:bank",this.onChange);
		this.on("change:province",this.onChange);
		this.on("change:city",this.onChange);
		this.on("change:keyword",this.onChange);
	},
	onChange : function(model){
		this.trigger("targetBank.ajax.loading");
		this.set({targetBank:model.toJSON().keyword})
	}
});
module.exports = DialogBindCardModel;