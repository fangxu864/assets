/**
 * Author: huangzhiyang
 * Date: 2016/6/14 17:39
 * Description: ""
 */
var List = Backbone.View.extend({
	el : $("#cardList"),
	events : {
		"click .deleteBtn" : "onDeleteBtnClick"
	},
	initialize : function(){},
	onDeleteBtnClick : function(e){
		if(!confirm("是否确定删除该卡？")) return false;
		var tarBtn = $(e.currentTarget);
		tarBtn.parents(".cardItem").remove();
	},
	render : function(data){
		var html = "";
		for(var i in data){
			var card = data[i];
			html += '<tr class="cardItem"><td class="virtual">'+card+'</td><td class="card">--</td><td class="physics">--</td><td><a class="deleteBtn" href="javascript:void(0);">删除</a></td></tr>'
		}
		this.$el.html(html);
	}
});
module.exports = List;