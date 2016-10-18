/**
 * Author: huangzhiyang
 * Date: 2016/10/12 18:27
 * Description: ""
 */
module.exports = function(daytime){
	var day = daytime/(24*60);
	var day_init = Math.floor(day);
	var hour = (day-day_init) * 24;
	var hour_init = Math.floor(hour);
	var mine = (hour-hour_init) * 60;
	var mine_init = Math.floor(mine);
	var day_text = day_init==0 ? "" : (day_init+"天");
	var hour_text = (day_init==0 && hour_init==0) ? "" : (hour_init+"小时");
	var mine_text = mine_init!=0 ? (mine_init + "分钟") : "";
	return day_text+hour_text+mine_text;
}