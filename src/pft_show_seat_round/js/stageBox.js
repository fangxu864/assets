/**
 * Created by Administrator on 15-8-14.
 */
var Core = require("./core.js");
var StageBox = RichBase.extend({
	statics : {
		width : Core.STAGE_BOX_WIDTH,
		height : Core.STAGE_BOX_HEIGHT,
		//	tpl : $("#stageBoxTpl").html(),
		tpl : (function(){
			return [
				'<li id="stageBox_<%=row_id%>_<%=col_id%>"',
				'class="stageBox box stageBox-col-<%=col_num%> stageBox-row-<%=row_num%>"',
				'data-areaid="<%=area_id%>"',
				'data-row="<%=row_num%>"',
				'data-col="<%=col_num%>"',
				'data-state="<%=state%>"',
				'data-seat="<%=seat%>"',
				'data-id="<%=id%>"',
				'style="width:<%=width%>px; height:<%=height%>px; line-height:<%=height%>px">',
				'<i class="iconfont gou">&#xe668;</i><span class="t"></span><span class="state"></span>',
				'</li>'
			].join("")
		})(),
		render : function(opt){
			var opt = opt || {};
			opt["width"] = this.width;
			opt["height"] = this.height;
			var _t = new this();
			return _t.parseTemplate(this.tpl,opt);
		}
	}
});

module.exports = StageBox;