/**
 * Created by banjin on 16-6-15.
 */
var Filter = require("./modules/filter.js");
var List = require("./modules/list.js");
var Main = RichBase.extend({
	EVENTS : {
		"click" : {
			".auto_withdraw" : "auto_withdraw",
            ".dropWrap .selectBox" : "selectBox",
            ".dropWrap .dropBox li" : "selectli",
            "html:not(.dropBox)" : "noselect",
            "#open" : "open",
            ".radioBox" : "radioBox"
		},
		"blur": {
            ".searchfid" : "hideadmin",
            ".prosearchfid" : "prohideadmin",
        },
		"keyup": {
			".searchfid" : "searchfid",
            ".prosearchfid" : "prosearchfid"
		}
	},
	init : function(){
		this.filter = new Filter();
		this.list = new List();
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
        that.time();
		this.filter.on("upBtn.click",function(data){    //更新
			var action = data.action;
			var params = data.data;
			that.list.upinfo(action,params);
		})
	},
    /*kaishi*/
	auto_withdraw : function(that,e){
		var tarBtn = $(e.currentTarget);
        var fid = tarBtn.attr("data-fid");
        var id = tarBtn.attr("data-id");
		var type = tarBtn.attr("type");               //0 还没有配置  1已配置 但处于关闭  2 更新
		var data_dname = tarBtn.attr("data-dname");   
        if(type=="0"){
            that.box(data_dname,type,fid);
            
        }else if(type=="1"){
            that.box(data_dname,type,id);
        }else{
            that.box(data_dname,type,id);
        }
        that.getbankinfo(fid);
	},
    box : function(data_dname,type,id){
        var that = this;
        var wheight = $(window).height();
        var alertH = $(".alertbox").height(); 
        var c = wheight-alertH;
        if(c>0){
            var s = c/2;
            $(".alertbox").css("top",s);
        }
        $("#mask").show();
        $(".alertbox").show();
        $(".topproduct").html(data_dname);
        $("#sure").attr("type",type);
        var action = "getSettingInfo";
        if(type=="0"){
            $("#withqing").hide();
            $(".toplasttime").hide();
            $(".alertbox").css("height","493px");
            $("#sure").attr("data-fid",id);
        }else{
            $("#withqing").show();
            $(".toplasttime").show();
            $(".alertbox").css("height","550px");
            var params={
                "id" : id
            }
            that.list.getaccountinfo(action,params);
        }
    },
    selectBox : function(that,e){
        var tarBtn = $(e.currentTarget);
        var type = tarBtn.parents(".dropWrap").hasClass("active");
        if(!type){
            tarBtn.find(".moreIcon").html("&#xe695;");
            $(".dropWrap").removeClass("active");
            tarBtn.parents(".dropWrap").addClass("active");
        }else{
            tarBtn.find(".moreIcon").html("&#xe673;");
            $(".dropWrap").removeClass("active");
            tarBtn.parents(".dropWrap").removeClass("active");
        }
        
    },
    selectli : function(that,e){
        var tarBtn = $(e.currentTarget);
        var val=tarBtn.text();
        var din=tarBtn.attr("in");
			var type = tarBtn.attr("type");
			if(type){
				tarBtn.parents(".dropWrap").find(".selected").attr("type",type);
				that.chose(type);
			}
            tarBtn.parents(".dropWrap").removeClass("active");
            tarBtn.parents(".dropWrap").find(".selected").text(val);
            tarBtn.parents(".dropWrap").find(".selected").attr("in",din);
            tarBtn.parents(".dropWrap").find(".moreIcon").html("&#xe673;");
            switch(type){
                case "1":
                $("#CounterFee").val("5");
                break;
                case "2":
                $("#CounterFee").val("4");
                break;
                default:
                $("#CounterFee").val("0");
            }
    },
    noselect : function(that,e){
        var tarBtn = $(e.currentTarget);
        $('.dropWrap').removeClass('active');
        $(".moreIcon").html("&#xe673;");
    },
    chose : function(type){
        if(type=="1"){
            $(".days").show();
            $(".week").hide();
            $(".mouth").hide();
        }else if(type=="2"){
            $(".days").hide();
            $(".week").show();
            $(".mouth").hide();
        }else{
            $(".days").hide();
            $(".week").hide();
            $(".mouth").show();
        }
    },
    time : function(){
        var html="";
        var mtml="";
        var j;
        var i;
        for(i=23;i>=0;i--){
            var i = i.toString();
            if(i.length<2){
                h = '0'+i;
                html += "<li in="+i+">"+h+":00</li>";
            }else{
                i = i;
                html += "<li in="+i+">"+i+":00</li>";
            }
        }
        for(j=1;j<=28;j++){
            var j = j.toString();
                j =j;
                mtml += "<li in="+j+">"+j+"</li>";
        }
        $(".daynum").html(html);
        $(".daynum").html(html);
        $(".mnum").html(mtml);
    },
    getbankinfo : function(fid){
       var that = this;
       var action = "getAccounts";
       var params = {
           "fid" : fid    
       }
       that.list.getbankinfo(action,params);
    },
    open : function(that,e){
        var tarBtn = $(e.currentTarget);
        var id = tarBtn.attr("data-id");
        var hasclose = tarBtn.hasClass("close");
        var action = "setStatus";
        if(hasclose){
            var params = {
                "id" : id,
                "status" : "on"
            }
            tarBtn.removeClass("close");
            that.list.setStatus(action,params);
        }else{
            var params = {
                "id" : id,
                "status" : "off"
            }
            tarBtn.addClass("close");
            that.list.setStatus(action,params);
        }
    },
	icheck : function(that,e){
		var tarBtn = $(e.currentTarget);
		var bol=tarBtn.hasClass("on");
		if(bol==true){
		   tarBtn.removeClass("on");
		}else{
		   tarBtn.addClass("on");
		}
	},
    radioBox : function(that,e){
        var tarBtn = $(e.currentTarget);
        tarBtn.addClass("active");
        tarBtn.siblings().removeClass("active");
    }
})


$(function(){
	new Main();
})