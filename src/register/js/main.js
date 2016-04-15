/**
 * Created by Administrator on 16-4-12.
 */
require("../css/register.css");
var Placeholder = require("../../../common/js/util.placeholder.js");
var SlideManager = require("./modules/slide.manager.js");
var VRegister = require("./modules/view.register.js");
var VInfo = require("./modules/view.info.js");
var Router = Backbone.Router.extend({
	routes : {
		"" : "main",
		"step/:id" : "step"
	},
	initialize : function(){
		var that = this;
		this.slideManager = new SlideManager();
		this.VRegister = new VRegister({router:this});
		this.VInfo = new VInfo({router:this});
		this.slideManager.on("slide.before",function(id){

		})
		this.slideManager.on("slide.after",function(id){

		})
		Placeholder.init();
	},
	main : function(){
		this.slideManager.slide(1);
	},
	step : function(id){
		this.slideManager.slide(id);
	}
});
var router = new Router;
Backbone.history.start();
