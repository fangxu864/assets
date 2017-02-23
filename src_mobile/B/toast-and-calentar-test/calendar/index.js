
require("./index.scss");

var CalendarCore = require("COMMON/js/calendarCore.js");
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");

var Calendar = PFT.Util.Class({

	init : function(){

		var that = this;

		this.dateGroup =  this.getNowDate();
		var nowDate = this.dateGroup.nowDate;
		//随机id以供标识
		this.onlyId = "id" + parseInt(Math.random()*10000); 

		var yearMonth = this.handleDate(nowDate);//获取年月//立日期flag

		var arr = CalendarCore.outputDate(yearMonth);//返回当月数据 //传入年月  

		//tpl数据
		var data = {};
		data.list = arr;
		var date = {};
		date.data = {
			nowDate : nowDate,
			id : that.onlyId
		};
		//处理tpl
		this.Template = PFT.Util.ParseTemplate(tpl);
		this.listTemplate = PFT.Util.ParseTemplate(listTpl);
		var listHtml = this.listTemplate(data);
		var html = this.Template(date);
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
					that.trigger("prev"); //发布订阅，运行外部的回调					
				},
				"click .next" : function(e){
					that.changeCal("next");
					that.trigger("next"); //发布订阅，运行外部的回调
				},
				"click .calConItem.column" : function(e){
					that.selectedDay = that.calDaySelect(e); //日历天数选择//返回被选中的天数
					if(that.selectedDay != "disable"){
						that.trigger("daySelect"); //发布订阅，运行外部的回调					
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
		
		return this;

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

		return nowTargetDate; //返回当前被选中的天数

	},

	handleDate : function(date){


		var date = date.split("-");
		// console.log(date);

		this.nowMonth = parseInt(date[1]);

		if(date.length == 2){//2017-2格式
			this.nowYearFlag = parseInt(date[0]);
			this.nowMonthFlag = parseInt(date[1]);
			this.nowDayFlag = 1;

			return this.nowYearFlag + "-" + this.nowMonthFlag;

		}else if(date.length == 3){//2017-2-9格式
			this.nowYearFlag = parseInt(date[0]);
			this.nowMonthFlag = parseInt(date[1]);
			this.nowDayFlag = parseInt(date[2]);
			this.nowStaticDay = parseInt(date[2]);

			return this.nowYearFlag + "-" + this.nowMonthFlag;

		}

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
			//再小就直接返回
			// if(this.nowMonthFlag < this.nowMonth){
			// 	this.nowMonthFlag = this.nowMonthFlag+1;
			// 	return false
			// }
			//回到当前月份当前天数的情况
			if(this.nowMonthFlag == this.nowMonth){
				$("#"+that.onlyId+" .calTop .prev i.icon").css("color","#dddce1");
				var monthDate = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString()); 
				var dayDate = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString()+ '-' +this.nowStaticDay.toString());
				this.change(monthDate,dayDate); //改变日历状态 //分别传入月份的date和天数的date
				return false
			}
		}else if(dir == "next"){
			$("#"+that.onlyId+" .calTop .prev i.icon").css("color","#0797d9");
			if(this.nowMonthFlag < 12){
				this.nowMonthFlag += 1; 
			}else{
				this.nowMonthFlag = 1;
				this.nowYearFlag += 1;
			}
		}


		var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());
		this.change(date,date); //改变日历状态//两个参数是一样的

	},

	//改变日历状态(重新渲染)
	change : function(monthDate,dayDate){  

		var that = this;

		$("#"+that.onlyId+" .calTopText").text(dayDate);
		var arr = CalendarCore.outputDate(monthDate); 
		var data = {};
		data.list = arr;  
		var listHtml = this.listTemplate(data);
		$("#"+that.onlyId+" .calContentCon").html(listHtml);

	},


	show : function(){
		this.CalendarBox.show()
	}


});


module.exports = Calendar;
























