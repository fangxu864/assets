/**
 * Created by Administrator on 15-11-25.
 */
var time=new Date();
var When=function(){};
When.prototype.today = function() {
	return moment().format('YYYY-MM-DD');
};
When.prototype.yestoday=function(){
	return moment().subtract('days',1).format('YYYY-MM-DD');
};
When.prototype.lastweek=function(){
	var thisDay=new Date().getDay();
	if(thisDay===0){
		return [
			moment().day(-13).format('YYYY-MM-DD'),
			moment().day(-7).format('YYYY-MM-DD')
		];
	}else{
		return [
			moment().day(-6).format('YYYY-MM-DD'),
			moment().day(0).format('YYYY-MM-DD')
		];
	}

};
When.prototype.week=function(){
	var thisDay=new Date().getDay();
	if(thisDay===0){
		return [
			moment().day(-6).format('YYYY-MM-DD'),
			moment().day(0).format('YYYY-MM-DD')
		];
	}else{
		return [
			moment().day(1).format('YYYY-MM-DD'),
			moment().day(7).format('YYYY-MM-DD')
		];
	}
};
When.prototype.month=function(){
	return [
		moment().startOf('month').format('YYYY-MM-DD'),
		moment().endOf('month').format('YYYY-MM-DD')
	];
};
When.prototype.lastmonth=function(){
	var currentMonth = moment().month()+1,
		currentYear  = moment().year();
	//跨年1月份的问题
	if(currentMonth!=1) {
		lastMonsth   = currentMonth-1;
		lastMonsth   = lastMonsth<10?'0'+lastMonsth:lastMonsth;
		return [
			currentYear +'-'+ lastMonsth + '-01',
			moment().startOf('month').subtract('d',1).format('YYYY-MM-DD')
		];
	} else {
		return [
			currentYear-1 +'-12-01',
			moment().startOf('month').subtract('d',1).format('YYYY-MM-DD')
		];
	}
};
module.exports = When;


