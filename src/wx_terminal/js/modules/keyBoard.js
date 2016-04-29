/**
 * Created by Administrator on 15-9-28.
 */
var KeyBoard = RichBase.extend({
	statics : {
		getVal : function(){
			return this.result || (this.result="");
		},
		setVal : function(val){
			if(!val) return false;
			var oval = this.getVal();
			if(val=="empty") return this.result = "";
			if(val=="back") return this.result = oval.substring(0,oval.length-1);
			this.result = oval+val;
		}
	},
	EVENTS : {
		"tap" : {
			".keyBox" : "onKeyboxTap"
		}
	},
	init : function(opt){
		this.container = opt.container;
	},
	onKeyboxTap : function(that,e){
		var tarKey = $(e.currentTarget);
		if(tarKey.hasClass("num")){
			that.statics.setVal(tarKey.attr("data-key"));
			that.fire("tap.num",that.statics.getVal());
		}else if(tarKey.hasClass("empty")){
			that.statics.setVal("empty");
			that.fire("tap.empty",that.statics.getVal());
		}else if(tarKey.hasClass("back")){
			that.statics.setVal("back");
			that.fire("tap.back",that.statics.getVal());
		}else if(tarKey.hasClass("valify")){
			that.fire("tap.valify",that.statics.getVal());
			//that.statics.setVal("empty");
		}
		that.fire("tap",that.statics.getVal());
	}
});

module.exports = KeyBoard;