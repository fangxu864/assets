
require("./index.scss");

var CalendarCore = require("COMMON/js/calendarCore.js");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗
var Toast = require("COMMON/modules/Toast");


var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");


var GetCalendarPrice = require("../service/getCalendarPrice.js"); 




var Calendar = PFT.Util.Class({

	init : function(nowDate,aid,pid){//如2017-2或2017-2-9

		this.aid = aid;
		this.pid = pid;

		this.toast = new Toast();

		//随机id以供标识
		this.onlyId = "id" + parseInt(Math.random()*100000); 

		var that = this;

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
					//往前需要判断不能低于当前月份当天
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

		$("#"+that.onlyId+" .calContentCon").html(listHtml);

		this.getCalPrice(date.data.nowDate);//第一次获取
		
		return this;

	},


	getCalPrice : function(date){

		var that = this;

		var params = {
			token : PFT.Util.getToken(),
			aid : this.aid, 
			pid : this.pid, 
			date : date
		};

		GetCalendarPrice(params,{
			loading:function () {
				that.toast.show("loading");
			},
			success:function (list) {
				that.toast.hide();
				that.handleCalPrice(date,list);

			},
			complete:function () {},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});	


	},


	handleCalPrice : function(date,list){

		// console.log("price:"+date)

		var that = this;

		var date = date.split("-");		

		if(date.length == 2){//2017-2格式

			var dateGroup = {
				year : parseInt(date[0]),
				month : parseInt(date[1]),
				day : 0
			}

		}else if(date.length == 3){//2017-2-9格式

			var dateGroup = {
				year : parseInt(date[0]),
				month : parseInt(date[1]),
				day : parseInt(date[2])
			}

		}

		//将所有em塞入价格
		var PG = $("#"+that.onlyId+" span.price");
		for( var i in list){
			for(var j = 0;j<PG.length;j++){
				var data_day = PG.eq(j).attr("data-day");
				dateGroup.month = parseInt(dateGroup.month);
				dateGroup.month =(dateGroup.month<10 ? "0"+dateGroup.month:dateGroup.month);
				var data_date = dateGroup.year+ "-" +dateGroup.month+ "-" +data_day;
				if(data_date == i){
					PG.eq(j).find("em").text(list[i]);
				}
			}
		}		
		//em没有价格的加入disable，并清空yen
		var items = $("#"+that.onlyId+" .calConItem.column"); 
		for(var j = 0;j<items.length;j++){

			if(items.eq(j).find('em').text() == ""){
				items.eq(j).find('.yen').text("");
				items.eq(j).addClass('disable');
			}

		}

		//初始化被选中的天数，没有天数就选一个月的第一天
		var today = (dateGroup.day < 10&&dateGroup.day != 0 ? "0" + dateGroup.day : dateGroup.day); 	
		var days = $("#"+that.onlyId+" .calConItem.column .day");
		if( dateGroup.day == 0 ){//日历改变月份

			for( var n = 0 ; n<days.length ; n++){
				var pItem = days.eq(n).parent();
				var className = pItem[0].className; 
				var index = className.indexOf("disable");
				if( index < 0){
					var pItem = days.eq(n).parent();
					pItem.addClass('select');
					return false
				}
			}	
				
		}else{

			for( var n = 0 ; n<days.length ; n++){
				var t = days.eq(n).text(); 
				if( t == today){
					var pItem = days.eq(n).parent();
					pItem.addClass('select');
				}
			}	

		}


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
			if(this.nowMonthFlag < this.nowMonth){
				this.nowMonthFlag = this.nowMonthFlag+1;
				return false
			}
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

		this.getCalPrice(dayDate);

	},


	show : function(){
		this.CalendarBox.show()
	}


});


module.exports = Calendar;
























