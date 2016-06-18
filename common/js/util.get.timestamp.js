/**
 * Author: huangzhiyang
 * Date: 2016/6/16 12:06
 * Description: ""
 */
// ios 时间转时间戳
// 兼容所有浏览器
// ios 使用 new Date("2010-03-15 10:30:00").getTime() 获取时间戳报错
// @time "2010-03-15 10:30:00"
module.exports = function(time){
	var arr = time.split(/[- :]/),
		_date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
		timeStr = Date.parse(_date);
	return timeStr;
}