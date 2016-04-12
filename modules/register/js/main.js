/**
 * Created by Administrator on 16-4-12.
 */
require("../css/register.css");
var SlideManager = require("./modules/slide.manager.js");
var Router = Backbone.Router.extend({
	routes : {
		"" : "main",
		"step/:id" : "step"
	},
	initialize : function(){
		var that = this;
		this.slideManager = new SlideManager();
		this.slideManager.on("slide.before",function(id){
			console.log("slide.before");
		})
		this.slideManager.on("slide.after",function(id){
			console.log("slide.after");
		})
	},
	main : function(){

	},
	step : function(id){
		this.slideManager.slide(id);
	}
});
var router = new Router;
Backbone.history.start();