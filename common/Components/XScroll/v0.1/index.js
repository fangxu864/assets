/**
 * Author: huangzhiyang
 * Date: 2016/12/1 16:10
 * Description: ""
 */
var Defaults = function(){
	return{
		BOUNDRY_CHECK_ACCELERATION : 0.1,
		BOUNDRY_CHECK_DURATION : 500,
		BOUNDRY_CHECK_EASING : "ease",
		bounce : true,
		boundryCheck : true,
		container : ".xs-container",
		content : ".xs-content",
		fixedElements : ".xs-fixed",
		indicatorInsets : {},
		lockX : true,
		lockY : false,
		preventDefault : true,
		preventTouchMove : true,
		renderTo : "#J_Scroll",
		scrollbarX : false,
		scrollbarY : true,
		stickyElements : ".xs-sticky",
		touchAction : "auto",
		useOriginScroll : false,
		useTransition : true,
		zoomType : "y"
	}
};
var PullupDefs = function(){
	return{

	}
};
var PullDownDefs = function(){
	return{

	}
};
var Scroll = function(opt){
	opt = opt || {};
	var defs = Defaults();
	for(var i in defs){
		if(typeof opt[i]!=="undefined") defs[i] = opt[i];
	}
	new XScroll(defs);
	this.userConfig = defs;

	var plugins = opt.plugins;
	if(plugins.pullup){

	}
	if(plugins.pulldown){

	}



};
Scroll.prototype = {

};
module.exports = Scroll;


var req1 = url => new Promise((resolve,reject) => setTimeout(()=> resolve(3),300));
var req2 = url => new Promise((resolve,reject) => setTimeout(()=> resolve(4),400));
var req3 = (api3,opt) => new Promise((resolve,reject) => setTimeout(()=> resolve(5),500));
Promise.all([req(api1),req2(api2)]).then((data1,data2)=>{
	return req3(api_3,{id:data1.id}).then((data3)=>{

	})
})