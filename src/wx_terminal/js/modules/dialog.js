/**
 * Created by Administrator on 15-9-29.
 */
var TerDialog = RichBase.extend({
	init : function(opt){
		this.container = opt.container;
	},
	show : function(opt){
		var that = this;
		var opt = opt || {};
		var top = opt.top;
		var bottom = opt.bottom;
		var title = typeof(opt.title)=="function" ? opt.title() : (opt.title || "提示");
		var content = typeof(opt.content)=="function" ? opt.content() : (opt.content || "内容");
		var btns = opt.btns || [{
			text : "确定",
			type : "yes",
			handler : function(){}
		}];
		var btnBox = this.container.find(".btnBox");
		var onTerminalBtnTap = opt.onTerminalBtnTap;
		if(btns.length==2){
			btnBox.addClass("doub");
		}else{
			btnBox.removeClass("doub");
		}
		this.container.show();
		if(top) this.container.children(".con").css("top",top);
		if(bottom) this.container.children(".con").css("bottom",bottom);
		this.container.find(".title").html(title);
		this.container.find(".listUl").html(content);
		this.container.off();
		for(var i in btns){
			var btn = btns[i];
			var text = btn["text"];
			var type = btn["type"];
			var handler = btn["handler"];
			var cls = type=="yes" ? "yesBtn" : "noBtn";
			btnBox.append('<a class="'+cls+' btn" href="javascript:void(0)">'+text+'</a>');
			if(type=="yes"){
				that.container.on("tap",".btnBox .yesBtn",function(e){
					var tarBtn = $(e.currentTarget);
					if(handler) handler(tarBtn);
				});
			}else if(type=="no"){
				that.container.on("tap",".btnBox .noBtn",function(e){
					var tarBtn = $(e.currentTarget);
					if(handler) handler(tarBtn);
				});
			}
		}
		this.container.on("tap",".listUl .terminalBtn",function(e){
			var tarBtn = $(e.currentTarget);
			if(onTerminalBtnTap) onTerminalBtnTap(tarBtn);
		});
	},
	close : function(){
		this.container.hide();
	}
});
module.exports = TerDialog;