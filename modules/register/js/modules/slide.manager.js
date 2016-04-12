/**
 * Created by Administrator on 16-4-12.
 */
var SlideManager = Backbone.View.extend({
	el : $("#slideContainer"),
	initialize : function(){
		this.stepWidth = this.$el.children().first().width();
	},
	slide : function(id){
		var that = this;
		var dir = -1;
		var id = id-1;
		this.trigger("slide.before",id);
		this.$el.animate({left:dir*id*this.stepWidth},200,function(){
			that.trigger("slide.after",id);
		});
	}
});
module.exports = SlideManager;