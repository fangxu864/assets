/**
 * Author: huangzhiyang
 * Date: 2016/7/29 18:21
 * Description: ""
 */
var Mix = require("COMMON/js/util.mix.js");
var Pubsub = require("COMMON/js/util.pubsub.js");
var Location = Mix({

	//用户最近一次自主选择要切的城市，如果用户是第一次使用此应用，则默认为全国
	__LAST_SWITCH_CITY : "全国",

	//最近一次切换的城市id
	__LAST_SWITCH_CITY_ID : "",

	//定位到的城市
	__LOCATION_CITY : "",

	//获取上一次切换的城市
	getLastSwitchCity : function(){
		return{
			city : this.__LAST_SWITCH_CITY,
			id : this.__LAST_SWITCH_CITY_ID
		}
	},

	//设置要切换的城市
	setLastSwitchCity : function(city,id){
		if(typeof city!=="string") return false;
		id = id || "";
		this.__LAST_SWITCH_CITY = city;
		this.__LAST_SWITCH_CITY_ID = id;
	}

},Pubsub);

module.exports = Location;