/**
 * Created by Administrator on 15-6-29.
 */
var CalendarCore={
	strpad:function(str){
		str=String(str);
		if(str.length==1){
			return "0"+str;
		}else{
			return str;
		}
	},
	/**
	 * 输出日期
	 * @param yearmonth
	 * @param type
	 *   todayValid : 今天可用
	 *   todayUnvalid : 今天不可用
	 *   allValid : 所有日期可用
	 *
	 * @returns {string}
	 */
	outputHtml:function(yearmonth,type){
		var that = this;
		var type = type || "todayValid";
		if(!yearmonth) yearmonth = this.gettoday();
		yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
		var nowtime=new Date();
		nowtime.setHours(0,0,0,0);
		nowtime=nowtime.getTime();//凌晨时间
		var begintime=yearmonth+"-01";
		begintime=begintime.split("-");
		begintime=begintime.join("/");
		var beginDate=new Date(begintime);
		var year=beginDate.getFullYear();
		var month=beginDate.getMonth()+1;
		var lastmonth=(month-1==0)?12:month-1;
		var nextmonth=(month+1==13)?1:month+1;
		var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
		var monthdays=days;
		var emptydays=beginDate.getDay();
		var endtime=yearmonth+"-"+days;
		endtime=endtime.split("-");
		endtime=endtime.join("/");
		var endDate=new Date(endtime);
		days+=beginDate.getDay()+(7-endDate.getDay());
		beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
		var nextday = new Date(this.gettoday()).getTime().toString();
		var lastmonth_none="lastmonth_none";
		var nextmonth_none="nextmonth_none";
		var html='<div class="calendar" id="calendarContent"><div class="monthbox">'+
			'<div id="calendarHead" class="title calendarHead" data-date="'+year+"-"+month+'"><span class="lastmonth '+lastmonth_none+'"><a title="'+lastmonth+'月">&nbsp;</a></span><span class="nextmonth '+nextmonth_none+'"><a title="'+nextmonth+'月">&nbsp;</a></span><span class="year">'+year+'年'+month+'月</span><span class="close"></span></div>'+
			'<table>'+
			'<tr>'+
			'<th class="weeken">日</th>'+
			'<th>一</th>'+
			'<th>二</th>'+
			'<th>三</th>'+
			'<th>四</th>'+
			'<th>五</th>'+
			'<th class="weeken">六</th>'+
			'</tr>';
		for(var i=0,j=0;i<days-1;i++){
			if(i%7==0){
				html+='<tr>';
			}
			var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
			var price="";
			var priceT="";
			var valid="";
			var validT="";
			var remain;
			var beginDate_time = beginDate.getTime();
			var beginDate_day = that.strpad(beginDate.getDate());
			if(i<emptydays||i>=monthdays+emptydays){
				html+='<td><div class="detail"></div></td>';
			}else if(type=="allValid"){ //所有可用
				html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
			}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
				html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
			}else{
				html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
			}
//			if(i<emptydays||i>=monthdays+emptydays){
//				html+='<td><div class="detail"></div></td>';
//			}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
//				html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
//			}else{
//				html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
//			}
			if(i%7==6){
				html+='</tr>';
			}
			beginDate.setTime(beginDate.getTime()+24*3600000);
		}
		html+="</table></div>";
		return html;
	},
	outputDate : function(yearmonth){
		var that = this;
		if(!yearmonth) yearmonth = this.gettoday();
		yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
		var nowtime=new Date();
		nowtime.setHours(0,0,0,0);
		nowtime=nowtime.getTime();//凌晨时间
		var begintime=yearmonth+"-01";
		begintime=begintime.split("-");
		begintime=begintime.join("/");
		var beginDate=new Date(begintime);
		var month=beginDate.getMonth()+1;
		var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
		var monthdays=days;
		var emptydays=beginDate.getDay();
		var endtime=yearmonth+"-"+days;
		endtime=endtime.split("-");
		endtime=endtime.join("/");
		var endDate=new Date(endtime);
		days+=beginDate.getDay()+(7-endDate.getDay());
		beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
		var resultArr = [];
		var dateArr = [];
		for(var i=0;i<days-1;i++){
			var json = {};
			var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
			var beginDate_day = that.strpad(beginDate.getDate());
			json["weeken"] = (i%7);
			if(i<emptydays){
				json["day"] = "";
				json["month"] = month-1;
			}else if(i>=monthdays+emptydays){
				json["day"] = "";
				json["month"] = month+1;
			}else if(beginDate.getTime()<nowtime){
				json["day"] = beginDate_day;
				json["date"] = date;
				json["today"] = "before";
				json["month"] = "current";
				json["yearmonth"] = yearmonth;
			}else if(beginDate.getTime()==nowtime){
				json["day"] = beginDate_day;
				json["date"] = date;
				json["today"] = "today";
				json["month"] = "current";
				json["yearmonth"] = yearmonth;
			}else{
				json["day"] = beginDate_day;
				json["date"] = date;
				json["today"] = "after";
				json["month"] = "current";
				json["yearmonth"] = yearmonth;
			}
			dateArr.push(json);
			if(dateArr.length==7){
				resultArr.push(dateArr);
				dateArr=[];
			}
			beginDate.setTime(beginDate.getTime()+24*3600000);
		}
		return resultArr;
	},
	getnowdate : function(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		m = this.strpad(m);
		var d = date.getDate();
		d = this.strpad(d);
		return y+"-"+m+"-"+d;
	},
	getnowYearMonth : function(){
		var yearmonth = this.getnowdate().split("-");
		return yearmonth[0]+"-"+yearmonth[1];
	},
	nextday : function(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		var a = new Date(y,m,0);
		var maxDay = a.getDate();
		var nextday = d+1;
		if(nextday>maxDay){
			nextday = "01";
			m++;
			if(m>12){
				m = "01";
				y++;
			}
		}
		nextday = this.strpad(nextday);
		m = this.strpad(m);
		return y+"-"+m+"-"+nextday;
	},
	//获取前一天
	prevDay : function(date){
		date = date ? (+new Date(date)) : (+new Date());
		var yestoday = date-(24*60*60*1000);
		yestoday = new Date(yestoday);
		return[
			yestoday.getFullYear(),
			yestoday.getMonth()+1,
			yestoday.getDate()
		].join("-")
	},
	/**
	 * 获取指定日期的前几天
	 * 从beginDate往前推几天(days)
	 * 如果beginDate缺省，则默认从今天算起
	 * containBeginDate : 是否包含beginDate
	 */
	prevDays : function(beginDate,dayCount,containBeginDate){
		var that = this;
		var result = [];
		var args = arguments;
		var len = args.length;
		var _beginDate = len>1 ? args[0] : this.gettoday();
		var _dayCount = len>1 ? args[1] : args[0];
		if(!_beginDate || !_dayCount) return result;
		if(len<3){
			containBeginDate = false;
		}else{
			containBeginDate = !!containBeginDate;
		}

		var _getPrev = function(date){
			var prev = that.prevDay(date);
			result.push(prev);
			_dayCount--;
			if(_dayCount>0) _getPrev(prev);
		};

		_getPrev(_beginDate);

		if(containBeginDate){
			result.unshift(beginDate);
			return result;
		}

		return result;

	},
	//获取后一天
	nextDay : function(date){
		date = date ? (+new Date(date)) : (+new Date());
		var nextDay = date+(24*60*60*1000);
		nextDay = new Date(nextDay);
		return[
			nextDay.getFullYear(),
			nextDay.getMonth()+1,
			nextDay.getDate()
		].join("-")
	},
	/**
	 * 获取指定日期的后几天
	 * 从beginDate往后推几天(days)
	 * 如果beginDate缺省，则默认从今天算起
	 * containBeginDate : 是否包含beginDate
	 */
	nextDays : function(beginDate,dayCount,containBeginDate){
		var that = this;
		var result = [];
		var args = arguments;
		var len = args.length;
		var _beginDate = len>1 ? args[0] : this.gettoday();
		var _dayCount = len>1 ? args[1] : args[0];
		if(!_beginDate || !_dayCount) return result;
		if(len<3){
			containBeginDate = false;
		}else{
			containBeginDate = !!containBeginDate;
		}

		var _getNext = function(date){
			var prev = that.nextDay(date);
			result.push(prev);
			_dayCount--;
			if(_dayCount>0) _getNext(prev);
		};

		_getNext(_beginDate);

		if(containBeginDate){
			result.unshift(beginDate);
			return result;
		}

		return result;

	},
	nextMonth : function(yearmonth){
		return this._siblingMonth(yearmonth,"next");
	},
	prevMonth : function(yearmonth){
		return this._siblingMonth(yearmonth,"prev");
	},

	nextYear : function(year){

		year = year ? (year+"") : this.getnowdate();

		return year.replace(/(\d{4})(.*)/,function($1,$2,$3){
			return ($2*1+1) + $3;
		})

	},
	prevYear : function(year){
		year = year ? (year+"") : this.getnowdate();

		return year.replace(/(\d{4})(.*)/,function($1,$2,$3){
			return ($2*1-1) + $3;
		})
	},


	_siblingMonth : function(yearmonth,nextOrPrev){ //2015-06
		yearmonth = yearmonth || "";
		if(yearmonth.length==7){
			yearmonth = yearmonth;
		}else if(yearmonth.length==10){
			yearmonth = yearmonth.substring(0,7);
		}else{
			yearmonth = this.gettoday().substring(0,7);
		}
		if(!nextOrPrev) nextOrPrev = "next";
		var time=yearmonth+"-01";
		time=time.split("-");
		time=time.join("/");
		time=new Date(time);
		var lasttime=new Date(time.getFullYear(),time.getMonth()-1,1);
		var lastmonth=lasttime.getFullYear()+"-"+this.strpad(lasttime.getMonth()+1);
		var nexttime=new Date(time.getFullYear(),time.getMonth()+1,1);
		var nextmonth=nexttime.getFullYear()+"-"+this.strpad(nexttime.getMonth()+1);
		return nextOrPrev=="next" ? nextmonth : lastmonth;
	},
	gettoday : function(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		m = this.strpad(m);
		var d = date.getDate();
		d = this.strpad(d);
		return y+"-"+m+"-"+d;
	},
	getCurYearmonth : function(){
		return $("#calendarHead").attr("data-date");
	}
};
module.exports = CalendarCore;