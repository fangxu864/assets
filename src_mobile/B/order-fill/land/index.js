

var tpl = require("./index.xtpl");

var Calendar = require("../calendar/index.js");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

var GetCalendarPrice = require("../service/getCalendarPrice.js");

module.exports = function(parent){


	var container = $(tpl).appendTo(parent);

	var Land = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click #playDate":"initCalendar"
		},
		init : function(){

		},

		initCalendar : function(){

			console.log("景区模块中的");

			var that = this;

			var dateGroup = this.getNowDate();	
			var nowDate = dateGroup.nowDate ; //没有天数的
			var nowDate = dateGroup.nowDate + "-" +dateGroup.day; //有天数的






			








			//日历分离测试

			if(this.calendar){
				this.calendar.show();
			}else{
				this.calendar = new Calendar(nowDate);
			}



























			// var html = allHtml.html;
			// var listHtml = allHtml.listHtml;

			// if(this.CalendarBox){
			// 	this.CalendarBox.show();
			// }else{
			// 	this.CalendarBox =  new SheetCore({
					
			// 		content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  
			// 		height : "auto",      //弹层占整个手机屏幕的高度
			// 		yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			// 		noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
			// 		zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			// 		EVENTS : {            //弹层上面绑定的所有事件放在这里
			// 			"click .prev" : function(e){
			// 				//往前需要判断不能低于当前月份当天
			// 				that.changeCal("prev");
			// 			},
			// 			"click .next" : function(e){
			// 				that.changeCal("next");
			// 			},

			// 			"click .calConItem.column" : function(e){

			// 				var selectedDay = that.calDaySelect(e); //日历天数选择//返回被选中的天数

			// 				if(selectedDay != "disable"){
			// 					that.CalendarBox.close();
			// 				}
							
			// 				// that.getPriceAndStorage(selectedDay); //获取价格和库存
			// 			}				
			// 		}
			// 	});
			// 	this.CalendarBox.mask.on("click",function(){
			// 		that.CalendarBox.close();			
			// 	});
			// 	this.CalendarBox.show();
			// 	this.getCalPrice();
			// 	$(".calContentCon").html(listHtml);
				
			// }


		},

		getNowDate : function(){

			var date=new Date;
			var year=date.getFullYear(); 
			var month=date.getMonth()+1;
			// month =(month<10 ? "0"+month:month); 
			var day = date.getDate(); 

			var dateGroup = {
				year : year,
				month : month,
				day : day,
				nowDate : (year.toString()+'-'+month.toString())
			}

			return dateGroup;

		},


		getCalPrice : function(change){

			var that = this;

			if(change == "change"){   

				var dateGroup = {};
				console.log("change");

				dateGroup.year = this.nowYearFlag;
				dateGroup.month = this.nowMonthFlag;
				dateGroup.day = 0;

				var date = dateGroup.year + "-" + dateGroup.month;

				var params = {
					token : PFT.Util.getToken(),
					aid : this.aid,
					pid : this.pid,
					date : date
				};

				console.log(dateGroup.year);
				console.log(dateGroup.month);
				console.log(dateGroup.day);


			}else{

				var dateGroup = this.getNowDate();
				var day = dateGroup.day; 
				var month = dateGroup.month; 
				var year = dateGroup.year; 
				var date = year.toString() + "-" + month.toString() + "-" + day.toString();
				var params = {
					token : PFT.Util.getToken(),
					aid : this.aid,
					pid : this.pid,
					date : date
				};
					

			}


			GetCalendarPrice(params,{
				loading:function () {},
				success:function (res) {

					that.handleCalPrice(res,dateGroup);

				},
				complete:function () {}
			});	
			

		},

		handleCalPrice : function(res,dateGroup){

			var PG = $("span.price");
			for( var i in res){
				for(var j = 0;j<PG.length;j++){
					var data_day = PG.eq(j).attr("data-day");
					dateGroup.month = parseInt(dateGroup.month);
					dateGroup.month =(dateGroup.month<10 ? "0"+dateGroup.month:dateGroup.month);
					var data_date = dateGroup.year+ "-" +dateGroup.month+ "-" +data_day;
					if(data_date == i){
						PG.eq(j).find("em").text(res[i]);
					}
				}
			}		

			var items = $(".calConItem.column"); 

			for(var j = 0;j<items.length;j++){

				if(items.eq(j).find('em').text() == ""){
					items.eq(j).find('.yen').text("");
					items.eq(j).addClass('disable');
				}

			}

			



			var today = (dateGroup.day < 10&&dateGroup.day != 0 ? "0" + dateGroup.day : dateGroup.day); 	
			var days = $(".calConItem.column .day");

			if( dateGroup.day == 0 ){//日历改变月份
				
				for( var n = 0 ; n<days.length ; n++){
					var t = days.eq(n).text(); 
					if( t == "01"){
						var pItem = days.eq(n).parent();
						pItem.addClass('select');
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

			Calendar.change(date); //改变日历状态

			this.getCalPrice("change");

		}

	});


	return new Land;

}