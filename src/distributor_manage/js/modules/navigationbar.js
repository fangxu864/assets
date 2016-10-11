/**
 * Created by Administrator on 15-11-27.
 */
var NavigationBar = RichBase.extend({
	EVENTS : {
		"click" : {
			".navBtn" : "onNavBtnClick",
			".pageB" : "onpageB",
            ".tiaosub" : "tiaosub",
            ".pagelsub" : "pageli"
		}
	},
	init : function(){
		this.container_ = $("#navigationBar");
		this.currentPage = $("#whichPageInp");
		this.totalPage = $("#totalPageInp");
		this.nextBtn = $("#nextPageBtn");
		this.prevBtn = $("#prevPageBtn");
		this.tpl = $("#navigaionbar_tpl").html();
	},
	onNavBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var current_page = $("#whichPageInp").text() * 1;
		var newPage = tarBtn.hasClass("next") ? (current_page+1) : (current_page-1)
		that.fire("navigation",{
			dir : tarBtn.hasClass("next") ? "next" : "prev",
			current_page : current_page,
			new_page : newPage
		})
	},
    tiaosub : function(that,e){
            tarBtn = $(e.currentTarget);
            var sub = $(".subnum").val();
            count = String(sub);
            var type="^[0-9]*[1-9][0-9]*$";
            var re = new RegExp(type);
            var all = Number($("#totalPageInp").html());
            if(sub>all){
                alert("抱歉输入页数超出总页数，请重新输入");
                $(".subnum").val("");
                $(".subnum").focus();
                return;
            }
            if(count.match(re) == null){
                alert("抱歉输入页数格式有误，请重新输入");
                $(".subnum").val("");
                $(".subnum").focus();
                return;
            }
            that.fire("navisub",{
                new_page : sub
            })
        },
        pageli : function(that,e){
            var tarBtn = $(e.currentTarget); 
            var group_id = tarBtn.attr("group_id");
            var page_size = "10";
            var current = Number(tarBtn.parents().find(".pagelis").val());           
            var allcurrent = Number(tarBtn.parents().find(".allnum_"+group_id).html());  
            if(current>allcurrent){
                alert("抱歉输入页数超出总页数，请重新输入");
                $(".pagelis").val("");
                $(".pagelis").focus();
                return;
            }
            count = String(current);
            var type="^[0-9]*[1-9][0-9]*$";
            var re = new RegExp(type);
            if(count.match(re) == null){
                alert("抱歉输入页数格式有误，请重新输入");
                $(".pagelis").val("");
                $(".pagelis").focus();
                return;
            }
            that.fire("navili",{
				group_id : group_id,
				page_size: page_size,
				new_page : current 
			})
        },
	onpageB : function(that,e){
		var tarBtn = $(e.currentTarget); 
		if(tarBtn.hasClass("disable")) return false;
		var group_id = tarBtn.attr("group_id");
		var page_size = "10";
		//var current_page = Number($("#num_one").html()) * 1; 
		var current_page = Number(tarBtn.parents().find("#num_one").html()) * 1;  
		var current_all = Number($(".allnum_"+group_id).html());
		var newPage = tarBtn.hasClass("next") ? (current_page+1) : (current_page-1)
		var current_p = current_page+1;
		that.fire("navipage",{
			group_id : group_id,
			page_size: page_size,
			new_page : newPage
		})
	},
	render : function(data){
		var current_page = data.current_page;
		var total_page = data.total_page;
		var nextBtnCls = "";
		var prevBtnCls = "";
		if(current_page==1 && total_page==1){
			nextBtnCls = "disable";
			prevBtnCls = "disable";
		}else if(current_page==total_page){
			nextBtnCls = "disable";
		}else if(current_page==1){
			prevBtnCls = "disable";
		}
		var html = this.parseTemplate(this.tpl,{
			current_page : current_page,
			total_page : total_page,
			nextBtnCls : nextBtnCls,
			prevBtnCls : prevBtnCls
		});
		this.container_.html(html);
	},
	Pagerender : function(data){
		var current_page = data.current_page;
		var total_page = data.total_page;
		var nextBtnCls = "";
		var prevBtnCls = "";
		if(current_page==1 && total_page==1){
			nextBtnCls = "disable";
			prevBtnCls = "disable";
		}else if(current_page==total_page){
			nextBtnCls = "disable";
		}else if(current_page==1){
			prevBtnCls = "disable";
		}
		var html = this.parseTemplate(this.tpl,{
			current_page : current_page,
			total_page : total_page,
			nextBtnCls : nextBtnCls,
			prevBtnCls : prevBtnCls
		});
		this.container_.html(html);
	},
	show : function(){
		this.container_.show();
	},
	hide : function(){
		this.container_.hide();
	}
});
module.exports = NavigationBar;