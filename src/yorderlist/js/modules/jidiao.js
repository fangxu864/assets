/**
 * Created by Administrator on 16-3-16.
 */
var Jidiao = RichBase.extend({
	CacheData : {
		"" : null
	},
	keyupTimer : null,
	KEY_UP_TIMER : 200,
	PLACE_HOLDER : "分销商名称 / 帐号 / 手机号",
	loadingImg : "http://www.12301.cc/images/icons/loading_small.gif",
	init : function(){
		this.popBox = $("#disSelectorWrap");
		this.maskPage = $("#gMasker");
		this.downSelector = $("#disSelectUlWrap");
		this.downSelectorUl = $("#disSelectUl");
		this.searchBox = $("#disSelectUlWrap-searchBox");
		this.searchInp = $("#disSelect_searchInp");
		this.closeBtn = $("#disSelectorWrap-closeBtn");
		this.disSelectorTrigger = $("#disSelectorTrigger");
		this.disSelectorTrigger_text = $("#disSelectorTrigger_text");
		this.bindEvent();
	},
	bindEvent : function(){
		var that = this;
		//点击遮罩
		this.maskPage.on("click",function(e){
			that.slideUpSelector();
			return false;
		})
		//点击pop
		this.popBox.on("click",function(e){
			that.slideUpSelector();
			return false;
		});
		//点击右上角关闭按钮
		this.popBox.on("click",".closeBtn",function(e){
			that.slideUpSelector(function(){
				that.hidePop();
			});
			return false;
		})
		//点击下拉selector
		this.popBox.on("click",".disSelectorTrigger",function(e){
			var target = $(this);
			if(target.hasClass("loading")) return false;
			target.toggleClass("active");
			that.slideToggleSelectUl();
			return false;
		})
		//点击取消按钮
		this.popBox.on("click",".btnGroup .no",function(e){
			that.closeBtn.trigger("click");
			return false;
		})
		//点击确定按钮
		this.popBox.on("click",".btnGroup .yes",function(e){
			var disSelectorTrigger_text = that.disSelectorTrigger_text;
			var id = disSelectorTrigger_text.attr("data-id");
			var account = disSelectorTrigger_text.attr("data-account");
			var dname = disSelectorTrigger_text.text();
			that.fire("dis.change",{
				id : id,
				account : account,
				dname : dname
			});
			that.closeBtn.trigger("click");
			return false;
		})
		this.on("pop.slideDown.before",function(){
			that.onPopSlideDownBefore();
		})
		this.on("pop.slideDown.after",function(){
			// do something...
		})
		//搜索框
		this.searchInp.on("keyup",function(e){
			var keyCode = e.keyCode;
			if(keyCode==38 || keyCode==40) return false;
			if(keyCode==13){
				that.onNavDownUp(keyCode);
			}else{
				clearTimeout(that.keyupTimer);
				that.keyupTimer = setTimeout(function(){
					that.onSearchInpKeyup(that,e);
				},that.KEY_UP_TIMER)
			}
		})
		this.searchInp.on("keydown",function(e){
			var keyCode = e.keyCode;
			if(keyCode==38 || keyCode==40){
				that.onNavDownUp(keyCode);
			}
		})
		//点击搜索结果ul item
		this.downSelectorUl.on("click",".disItem",function(e){
			that.onDisItemClick(that,e);
		});
		//兼容ie6-9的placeholder问题
		this.fixPlaceholder();
	},
	fixPlaceholder : function(){
		var searchInp = this.searchInp;
		var placeholder = this.PLACE_HOLDER;
		if(!"placeholder" in document.createElement("input")){
			searchInp.on("focus",function(e){
				var tarInp = $(this);
				var val = $.trim(tarInp.val());
				if(val==placeholder) tarInp.val("");
			})
			searchInp.on("blur",function(e){
				var tarInp = $(this);
				var val = $.trim(tarInp.val());
				if(!val) tarInp.val(placeholder);
			})
		}
	},
	onDisItemClick : function(that,e){
		var tarItem = $(e.currentTarget);
		var id = tarItem.attr("data-id");
		var account = tarItem.attr("data-account");
		var dname = tarItem.find(".col_1").text();
		this.selectDisItem(id,dname,account);
	},
	//对搜索结果列表用键盘上下键导航
	onNavDownUp : function(keyCode){
		var downSelectorUl = this.downSelectorUl;
		if(downSelectorUl.children().first().hasClass("sta")) return false;
		var activeItem = downSelectorUl.children(".active");
		if(keyCode==13){
			if(!activeItem.length) return false;
			this.selectDisItem(activeItem.attr("data-id"),activeItem.find(".col_1").text(),activeItem.attr("data-account"));
		}else{
			if(!activeItem.length){
				activeItem = downSelectorUl.children().first();
				activeItem.addClass("active").siblings().removeClass("active");
			}else{
				var toItem = keyCode==38 ? activeItem.prev() : activeItem.next();
				if(!toItem.length) toItem = activeItem;
				toItem.addClass("active").siblings().removeClass("active");
			}
//			var tarItem = downSelectorUl.children(".active");
//			var tarItemH = tarItem.height()+1;
//			var Ul_h = $("#disSelectUl").height();
//			var top = tarItem.position().top+tarItemH;
//			if(top>Ul_h){
//				document.getElementById("disSelectUl").scrollTop = (top-Ul_h);
//			}
		}
	},
	//搜索过滤
	onSearchInpKeyup : function(that,e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		var cacheData = that.CacheData[val];
		if(cacheData){ //如果已经有缓存了，直接走缓存
			var list = cacheData.list;
			var type = list.length ? "success" : "empty";
			that.downSelectorUl.html(that.renderList(type,cacheData.list));
		}else{
			JiDiaoAjax.getList({
				keyword : val,
				loading : function(){
					that.searchBox.addClass("loading");
				},
				removeLoading : function(){
					that.searchBox.removeClass("loading");
				},
				success : function(res){
					var data = res.data;
					that.CacheData[val] = data;
					that.downSelectorUl.html(that.renderList("success",data.list));
				},
				empty : function(res){
					var data = res.data;
					that.CacheData[val] = data;
					that.downSelectorUl.html(that.renderList("empty",data.list));
				},
				fail : function(res){
					var msg = res.msg;
					that.downSelectorUl.html(that.renderList("fail",msg));
				}
			})
		}
	},
	onPopSlideDownBefore : function(){
		var that = this;
		if(!this.CacheData[""]){ //首次加载分销商列表
			var keyword = "";
			JiDiaoAjax.getList({
				keyword : keyword,
				loading : function(){
					that.disSelectorTrigger.addClass("loading");
//					that.disSelectorTrigger_text.text("正在加载分销商，请稍后...")
				},
				removeLoading : function(){
					that.disSelectorTrigger.removeClass("loading");
//					that.disSelectorTrigger_text.text("")
				},
				success : function(res){
					var data = res.data;
					that.CacheData[keyword] = data;
					that.downSelectorUl.html(that.renderList("success",data.list));
				},
				empty : function(res){
					var data = res.data;
					that.CacheData[keyword] = data;
					that.downSelectorUl.html(that.renderList("empty",data));
				},
				fail : function(res){
					var msg = res.msg;
					that.downSelectorUl.html(that.renderList("fail",msg));
				}
			})
		}
	},
	//选中分销商列表里的item
	selectDisItem : function(id,dname,account){
		$("#resultUl-disItem-"+id).addClass("active").siblings().removeClass("active");
		this.disSelectorTrigger_text.text(dname).attr("data-id",id).attr("data-account",account);
		this.disSelectorTrigger.removeClass("active");
		this.slideToggleSelectUl();
	},
	renderList : function(type,data){
		var html = "";
		if(type=="success"){
			for(var i in data){
				var d = data[i];
				var id = d["id"];
				var account = d["account"];
				var mobile = d["mobile"];
				var dname = d["dname"] || mobile;
				var concact = d["concact"] ? (d["concact"]+" / ") : "";
				html += '<li id="resultUl-disItem-'+id+'" class="disItem" data-id="'+id+'" data-account="'+account+'">';
				html += 	'<span class="col col_1">'+dname+'</span>';
				html += 	'<span class="col col_2">'+concact+mobile+'</span>';
				html += '</li>';
			}
		}else if(type=="empty"){
			html = '<li class="sta empty">查无匹配结果...</li>';
		}else if(type=="fail"){
			data = data || "请求出错，请稍后重试";
			html = '<li class="sta fail">'+data+'</li>';
		}
		return html;
	},
	showPop : function(opt){
		var that = this;
		var opt = opt || {};
		var id = opt.id;
		var account = opt.account;
		var dname = opt.dname;
		this.disSelectorTrigger_text.attr("data-id",id).attr("data-account",account).text(dname);
		that.fire("pop.slideDown.before");
		this.maskPage.fadeIn();
		this.popBox.show().animate({top:100},200,function(){
			that.fire("pop.slideDown.after");
		});
	},
	hidePop : function(){
		var that = this;
		this.popBox.animate({top:-800},200,function(){
			that.popBox.hide();
			that.maskPage.hide();
		})
	},
	slideUpSelector : function(callback){
		$("#disSelectorTrigger").removeClass("active");
		this.downSelector.slideUp(130,function(){
			callback && callback();
		});
	},
	slideToggleSelectUl : function(callback){
		this.downSelector.slideToggle(130,function(){
			callback && callback();
		})
	}
});
module.exports = Jidiao;