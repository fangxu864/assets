/**
 * Author: huangzhiyang
 * Date: 2016/9/26 21:20
 * Description: ""
 */
var State = {
	today : {
		text : "今天",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	},
	yesterday : {
		text : "昨天",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	},
	week : {
		text : "本周",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	},
	lastWeek : {
		text : "上周",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	},
	mon : {
		text : "本月",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	},
	lastMon : {
		text : "上月",
		count : {
			order : -1,
			ticket : -1,
			money : -1
		}
	}
};
module.exports = State;