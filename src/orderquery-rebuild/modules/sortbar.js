/**
 * Created by Administrator on 15-11-30.
 */
var SortBar = RichBase.extend({
	EVENTS : {
		"click" : {
			".sortItem" : "onSortItemClick"
		}
	},
	init : function(){
		this.container = $("#sortBar");
	},
	onSortItemClick : function(that,e){
		var tarItem = $(e.currentTarget);
		var orderby = tarItem.attr("data-orderby");
		tarItem.addClass("on").siblings().removeClass("on");
		if(tarItem.hasClass("asc")){ //升序
			tarItem.removeClass("asc").addClass("desc");
			tarItem.attr("data-sort",1)
		}else{
			tarItem.removeClass("desc").addClass("asc");
			tarItem.attr("data-sort",0)
		}
		that.fire("sort.change",that.getParam());
	},
	getParam : function(){
		var result = {orderby:"",sort:""};
		var activeItem = this.container.children(".on");
		if(activeItem.length==0) return result;
		result["orderby"] = activeItem.attr("data-orderby");
		result["sort"] = activeItem.attr("data-sort");
		return result;
	},
	show : function(){
		this.container.show();
	},
	hide : function(){
		this.container.hide();
	}
});
module.exports = SortBar;