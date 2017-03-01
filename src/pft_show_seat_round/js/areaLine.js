/**
 * Created by Administrator on 15-8-25.
 */
var AreaLine = RichBase.extend({
	statics : {
		tpl : '<li id="areaList_li_<%=zone_id%>" data-areaid="<%=zone_id%>" data-color="<%=color%>" class="areaLineItem areaLi areaLi_<%=zone_id%>"><span class="color" style="background:<%=color%>"></span><span class="t"><%=zone_name%></span></li>',
		color : [
			"41bc95",
			"f37777",
			"edb734",
			"3cafd4",
			"e19acd",
			"5eb854",
			"9b8cdd",
			"4e95a1",
			"a7d57c",
			"f9d48f"
		]
	},
	init : function(opt){
		this.container = $("#areaHeadWrap");
	},
	//计算该场次各个分区坐位数及剩余数
	calculateSeatCount : function(data){
		var zones = data.zones;
		for(var areaid in zones){
			var area = zones[areaid];
			var total = area["total"];
			var left = area["left"];
			var areaItem = $("#areaList_li_"+areaid);
			areaItem.append('<span class="count">(<em class="surp_count">'+left+'</em>/<em class="all_count">'+total+'</em>)</span>');
		}
	},
	build : function(data){
		var that = this;
		var tpl = this.statics.tpl;
		var container = this.container;
		var colors = this.statics.color;
		var html = "";
		var index = -1;
		for(var i in data){
			var d = data[i];
			index++;
			d["color"] = "#"+colors[index];
			html += that.parseTemplate(tpl,d);
		}
		container.html(html);
	}
});
module.exports = AreaLine;