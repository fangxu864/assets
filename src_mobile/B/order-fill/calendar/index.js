
require("./index.scss");

var CalendarCore = require("COMMON/js/calendarCore.js");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");


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

					console.log(selectedDay);

					if(selectedDay != "disable"){
						that.CalendarBox.close();
					}
					
					// that.getPriceAndStorage(selectedDay); //获取价格和库存
				}				
			}

		});

		this.CalendarBox.mask.on("click",function(){
			that.CalendarBox.close();			
		});

		$(".calContentCon").html(listHtml);



		this.handleCalPrice(nowDate);


		this.show();


		return this;

	},


	handleCalPrice : function(date,list){

		//从10号开始，有天数的
		date = '2017-2-10';
		var list = '{"code":200,"data":{"2017-02-10":2,"2017-02-11":2,"2017-02-12":2,"2017-02-13":2,"2017-02-14":2,"2017-02-15":2,"2017-02-16":2,"2017-02-17":2,"2017-02-18":2,"2017-02-19":2,"2017-02-20":2,"2017-02-21":2,"2017-02-22":2,"2017-02-23":2,"2017-02-24":2,"2017-02-25":2,"2017-02-26":2,"2017-02-27":2,"2017-02-28":2},"msg":""}';
		list = JSON.parse(list);
		list = list.data;
		console.log(list);

		//没有天数的，从1号开始
		// date = '2017-2';
		// var list = '{"code":200,"data":{"2017-02-01":2,"2017-02-02":2,"2017-02-03":2,"2017-02-04":2,"2017-02-05":2,"2017-02-06":2,"2017-02-07":2,"2017-02-08":2,"2017-02-09":2,"2017-02-10":2,"2017-02-11":2,"2017-02-12":2,"2017-02-13":2,"2017-02-14":2,"2017-02-15":2,"2017-02-16":2,"2017-02-17":2,"2017-02-18":2,"2017-02-19":2,"2017-02-20":2,"2017-02-21":2,"2017-02-22":2,"2017-02-23":2,"2017-02-24":2,"2017-02-25":2,"2017-02-26":2,"2017-02-27":2,"2017-02-28":2},"msg":""}';
		// list = JSON.parse(list);
		// list = list.data;
		// console.log(list);

		console.log("price:"+date)

		var date = date.split("-");

		if(date.length == 2){//2017-2格式
			// this.nowYearFlag = parseInt(date[0]);
			// this.nowMonthFlag = parseInt(date[1]);
			// this.nowDayFlag = 1;



		}else if(date.length == 3){//2017-2-9格式
			// this.nowYearFlag = parseInt(date[0]);
			// this.nowMonthFlag = parseInt(date[1]);
			// this.nowDayFlag = parseInt(date[2]);




		}



		// var PG = $("span.price");

		// for( var i in res){
		// 	for(var j = 0;j<PG.length;j++){
		// 		var data_day = PG.eq(j).attr("data-day");
		// 		dateGroup.month = parseInt(dateGroup.month);
		// 		dateGroup.month =(dateGroup.month<10 ? "0"+dateGroup.month:dateGroup.month);
		// 		var data_date = dateGroup.year+ "-" +dateGroup.month+ "-" +data_day;
		// 		if(data_date == i){
		// 			PG.eq(j).find("em").text(res[i]);
		// 		}
		// 	}
		// }		

		// var items = $(".calConItem.column"); 

		// for(var j = 0;j<items.length;j++){

		// 	if(items.eq(j).find('em').text() == ""){
		// 		items.eq(j).find('.yen').text("");
		// 		items.eq(j).addClass('disable');
		// 	}

		// }










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
		console.log(date);

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

	},


	show : function(){
		this.CalendarBox.show()
	}


});


module.exports = Calendar;
























