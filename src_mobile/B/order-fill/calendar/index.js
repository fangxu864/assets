
require("./index.scss");

var CalendarCore = require("COMMON/js/calendarCore.js");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");


var GetCalendarPrice = require("../service/getCalendarPrice.js"); 


var Calendar = PFT.Util.Class({

	init : function(nowDate){//如2017-2或2017-2-9

		var that = this;

		var yearMonth = this.handleDate(nowDate);//获取年月//立日期flag

		var arr = CalendarCore.outputDate(yearMonth);//返回当月数据 //传入年月  

		//tpl数据
		var data = {};
		data.list = arr;
		var date = {};
		date.nowDate = nowDate;
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
				},
				"click .next" : function(e){
					that.changeCal("next");
				},
				"click .calConItem.column" : function(e){

					var selectedDay = that.calDaySelect(e); //日历天数选择//返回被选中的天数

					if(selectedDay != "disable"){
						that.CalendarBox.close();
					}

					
				}				
			}

		});

		this.CalendarBox.mask.on("click",function(){
			that.CalendarBox.close();			
		});

		$(".calContentCon").html(listHtml);


		this.getCalPrice(date.nowDate);//第一次获取


		this.show();

		return this;

	},


	getCalPrice : function(date){

		var that = this;

		var params = {
			token : PFT.Util.getToken(),
			aid : 3385, //先写死
			pid : 58052, //先写死
			date : date
		};

		GetCalendarPrice(params,{
			loading:function () {},
			success:function (list) {

				that.handleCalPrice(date,list);

			},
			complete:function () {}
		});	


	},


	handleCalPrice : function(date,list){

		// console.log("price:"+date)

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
		var PG = $("span.price");
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
		var items = $(".calConItem.column"); 
		for(var j = 0;j<items.length;j++){

			if(items.eq(j).find('em').text() == ""){
				items.eq(j).find('.yen').text("");
				items.eq(j).addClass('disable');
			}

		}

		//初始化被选中的天数，没有天数就选一个月的第一天
		var today = (dateGroup.day < 10&&dateGroup.day != 0 ? "0" + dateGroup.day : dateGroup.day); 	
		var days = $(".calConItem.column .day");
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

		var target = $(e.target);
		var tagName = target.attr("tagName");
		if(tagName != "DIV"){
			target = target.parent();
			tagName = target.attr("tagName");
			if(tagName != "DIV"){
				target = target.parent();
			}
		}

		if(target[0].className.indexOf("disable")>0){
			return "disable"
		}

		target.addClass("select");
		var nowTargetDate = target.find('.day').text();
		var list = $(".calConItem.column");
		for( var i = 0;i<list.length;i++){
			var className = list[i].className;
			if( className.indexOf("disable") < 0 ){//除去disable
				
				var t = list.eq(i).find('.day').text();
				if(t != nowTargetDate ){
					list.eq(i).removeClass('select');
				}
			}
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

			return this.nowYearFlag + "-" + this.nowMonthFlag;

		}

	},

	//月份变化
	changeCal : function(dir){
		
		if(dir == "prev"){
			if(this.nowMonthFlag > 1){
				this.nowMonthFlag -= 1; 
			}else{
				this.nowMonthFlag = 12;
				this.nowYearFlag -= 1;
			}
			if(this.nowMonthFlag < this.nowMonth){
				this.nowMonthFlag = this.nowMonthFlag+1;
				return false
			}
		}else if(dir == "next"){
			if(this.nowMonthFlag < 12){
				this.nowMonthFlag += 1; 
			}else{
				this.nowMonthFlag = 1;
				this.nowYearFlag += 1;
			}
		}

		var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());
		this.change(date); //改变日历状态

	},

	//改变日历状态(重新渲染)
	change : function(date){  

		$(".calTopText").text(date);
		var arr = CalendarCore.outputDate(date); 
		var data = {};
		data.list = arr;  
		var listHtml = this.listTemplate(data);
		$(".calContentCon").html(listHtml);

		this.getCalPrice(date);

	},


	show : function(){
		this.CalendarBox.show()
	}


});


module.exports = Calendar;
























