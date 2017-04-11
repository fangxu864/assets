
require("./index.scss");
var CalendarCore = require("COMMON/js/calendarCore.js");
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗
var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");
var Calendar = PFT.Util.Class({
	Template : PFT.Util.ParseTemplate(tpl),
	listTemplate : PFT.Util.ParseTemplate(listTpl),

	//可选配置还未做完
	opt : {
		date : false, //初始天数,默认为当天,格式如"2017-02-15"
		maxDate : false, //最大天数
		minDate : false, //最小天数
		disableTodayBefore : false, //是否今天之前都为disable
	},
	init : function(opt){

		var that = this;

		opt = $.extend({},this.opt,opt);

		this.dateGroup =  this.getNowDate();
		if( typeof opt.date == "string"){
			var nowDate = opt.date ;
		}else{
			var nowDate = this.dateGroup.nowDate;
		}
		//随机id以供标识
		this.onlyId = "calendar" + parseInt(Math.random()*1000); 
		var yearMonth = this.handleDate(nowDate);//分别获取年月//立日期flag
		var arr = CalendarCore.outputDate(yearMonth);//返回当月数据 //传入年月  

		var listHtml = this.listTemplate({list:arr});
		var html = this.Template({data : {
			nowDate : nowDate,
			id : that.onlyId
		}});

		//new出弹窗
		this.CalendarBox =  new SheetCore({
			content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  
			height : "auto",      //弹层占整个手机屏幕的高度
			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			EVENTS : {            //弹层上面绑定的所有事件放在这里
				"click .prev" : function(e){
					that.changeCal("prev");
					that.trigger("prev"); //发布消息,运行外部的回调					
				},
				"click .next" : function(e){
					that.changeCal("next");
					that.trigger("next"); //发布消息,运行外部的回调
				},
				"click .calConItem.column" : function(e){
					that.selectedDay = that.calDaySelect(e); //日历天数选择//返回被选中的天数
					if(that.selectedDay != "disable"){
						that.trigger("daySelect"); //发布消息,运行外部的回调					
						that.CalendarBox.close();
					}

				}				
			}
		});
		this.CalendarBox.mask.on("click",function(){
			that.CalendarBox.close();			
		});
		this.container = $("#"+that.onlyId);
		$("#"+that.onlyId+" .calContentCon").html(listHtml);

		//初始化select
		this.daySelect(nowDate);

		return this;

	},
	//高亮天数(改变月份的时候)
	daySelect : function(date){
		
		var list = this.getNowMonthList();
		var dateArr = date.split("-");
		if(dateArr.length == 3 ){//xxxx-xx-xx
			list.each(function(index,item){
				item = $(item);
				if(item.attr("data-date") == date){
					item.addClass("select");
				}
			});
		}else if( dateArr.length == 2 ){//xxxx-xx
			list.eq(0).addClass("select");
		}
		
	},	
	//获取现在日期
	getNowDate : function(){

		var date=new Date;
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		month =(month<10 ? "0"+month:month); 
		var day = date.getDate(); 
		day =(day<10 ? "0"+day:day); 

		var dateGroup = {
			year : year,
			month : month,
			day : day,
			nowDate : (year.toString()+'-'+month.toString()+'-'+day.toString())
		}

		return dateGroup;

	},
	//获得当月的list
	getNowMonthList : function(){
		var items = this.container.find(".calConItem.column[data-date]");
		return items
	},

	//选择日期
	calDaySelect : function(e){
		var that = this;
		var target = $(e.target);
		var tagName = target.attr("tagName");
		if(tagName != "DIV"){
			target = target.parent();
			tagName = target.attr("tagName");
			if(tagName != "DIV"){
				target = target.parent();
			}
		}
		this.nowSelectWeek = target.attr("data-week");
		if(target[0].className.indexOf("disable")>0){
			return "disable"
		}
		target.addClass("select");
		var nowTargetDate = target.find('.day').text();
		var list = $("#"+that.onlyId+" .calConItem.column");
		for( var i = 0;i<list.length;i++){
			var className = list[i].className;
			if( className.indexOf("disable") < 0 ){//除去disable
				
				var t = list.eq(i).find('.day').text();
				if(t != nowTargetDate ){
					list.eq(i).removeClass('select');
				}
			}
		}
		var nowMonth = $("#"+that.onlyId+" .calTopText").text();
		var nowMonthArr = nowMonth.split("-");
		if( nowMonthArr.length ){
			nowTargetDate = nowMonthArr[0] + "-" + nowMonthArr[1] + "-" + nowTargetDate;  
		}
		this.nowTarget = target; //当前被选中的格子
		return nowTargetDate; //返回当前被选中的天数

	},

	handleDate : function(date){
		var date = date.split("-");
		//固定不变的当天
		this.nowYear = parseInt(date[0]);//当年
		this.nowMonth = parseInt(date[1]);//当月
		this.nowday = parseInt(date[2]);//当日		
		//flag用于加减
		this.nowYearFlag = parseInt(date[0]);
		this.nowMonthFlag = parseInt(date[1]);
		this.nowDayFlag = parseInt(date[2]);
	},

	//月份变化
	changeCal : function(dir){

		var that = this;	

		if(dir == "prev"){
			if(this.nowMonthFlag > 1){
				this.nowMonthFlag -= 1; 
			}else{
				this.nowMonthFlag = 12;
				this.nowYearFlag -= 1;
			}
			if(this.nowMonthFlag != this.nowday){
				this.nowDayFlag = 1;	
			}
		}else if(dir == "next"){
			$("#"+that.onlyId+" .calTop .prev i.icon").css("color","#0797d9");
			if(this.nowMonthFlag < 12){
				this.nowMonthFlag += 1; 
			}else{
				this.nowMonthFlag = 1;
				this.nowYearFlag += 1;
			}
			if(this.nowMonthFlag != this.nowday){
				this.nowDayFlag = 1;	
			}
		}
		//回到当前月份当前天数的情况
		if(this.nowMonthFlag == this.nowMonth && this.nowYearFlag == this.nowYear){
			var month = (this.nowMonthFlag < 10 ? "0"+this.nowMonthFlag:this.nowMonthFlag);
			var day = (this.nowday < 10 ? "0"+this.nowday:this.nowday);
			var monthDate = (this.nowYearFlag.toString()+'-'+month); 
			var dayDate = (this.nowYearFlag.toString()+'-'+ month + '-' + day );
			this.change(monthDate,dayDate); //改变日历状态 //分别传入月份的date和天数的date
			return false
		}
		var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());
		this.change(date,date); //改变日历状态//两个参数是一样的

	},
	//改变日历状态(重新渲染)
	change : function(monthDate,dayDate){  
		var that = this;
		$("#"+that.onlyId+" .calTopText").text(dayDate);
		var arr = CalendarCore.outputDate(monthDate); 
		var listHtml = this.listTemplate({list:arr});
		$("#"+that.onlyId+" .calContentCon").html(listHtml);
		this.daySelect(dayDate);

		this.renderdisable();

	},

	renderdisable : function(){

		

	},

	show : function(){
		this.CalendarBox.show();
	},
	close : function(){	
		this.CalendarBox.close();
	}

});


module.exports = Calendar;


