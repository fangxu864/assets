/**
 * Created by Administrator on 15-11-27.
 */
var NavigationBar = RichBase.extend({
	EVENTS : {
		"click" : {
			".navBtn" : "onNavBtnClick"
		}
	},
	init : function(){
		var that = this;
		this.container = $("#navigationBar");
		this.currentPage = $("#whichPageInp");
		this.totalPage = $("#totalPageInp");
		this.nextBtn = $("#nextPageBtn");
		this.prevBtn = $("#prevPageBtn");
		$(document).on("keyup",function(e){
			that.onKeyupToNav(that,e);
		})
	},
	onNavBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var current_page = that.currentPage.text() * 1;
		that.fire("navigation",{
			dir : tarBtn.hasClass("next") ? "next" : "prev",
			fromPage : current_page,
			toPage : tarBtn.hasClass("next") ? (current_page+1) : (current_page-1)
		})
	},
	onKeyupToNav : function(that,e){
		var that = this;
		var keyCode = e.keyCode;
		var nextBtn = this.nextBtn;
		var prevBtn = this.prevBtn;
		if(keyCode==39 && !nextBtn.hasClass("disable")){ //next
			var current = that.currentPage.text() * 1;
			that.fire("navigation",{
				dir : "next",
				fromPage : current,
				toPage : current+1
			})
		}else if(keyCode==37 && !prevBtn.hasClass("disable")){ //prev
			var current = that.currentPage.text() * 1;
			that.fire("navigation",{
				dir : "prev",
				fromPage : current,
				toPage : current-1
			})
		}
	},
	show : function(){
		this.container.show();
	},
	hide : function(){
		this.container.hide();
	},
	render : function(data){ // data={current:1,total:1} data=null
		if(!data){
			this.nextBtn.addClass("disable");
			this.prevBtn.addClass("disable");
			this.hide();
			return;
		}
		var total = data.total;
		var current = data.current;
		var totalInp = this.totalPage;
		var currentInp = this.currentPage;
		var nextBtn = this.nextBtn;
		var prevBtn = this.prevBtn;
		if(total==0){
			this.nextBtn.addClass("disable");
			this.prevBtn.addClass("disable");
			this.hide();
			return;
		}
		this.show();
		totalInp.text(total);
		currentInp.text(current);
		if(current<total){
			if(current!=1){
				prevBtn.removeClass("disable");
			}else{
				prevBtn.addClass("disable");
			}
			nextBtn.removeClass("disable");
		}else{
			if(current!=1){
				prevBtn.removeClass("disable");
			}else{
				prevBtn.addClass("disable");
			}
			nextBtn.addClass("disable");
		}
	}
});
module.exports = NavigationBar;