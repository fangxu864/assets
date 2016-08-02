/**
 * Author: huangzhiyang
 * Date: 2016/7/29 18:21
 * Description: ""
 */
var Mix = require("COMMON/js/util.mix.js");
var Pubsub = require("COMMON/js/util.pubsub.js");
var LoadScript = require("COMMON/js/util.loadScript");
var Location = Mix({

	//百度地度ak key
	BAIDU_MAP_KEY : "485641E293ABd3523de065f7c1bbfeba",

	__getBaiMapSrc : function(){
		return ("http://api.map.baidu.com/getscript?v=2.0&ak="+this.BAIDU_MAP_KEY+"&services=&t=20160728192322");
	},
	BAIDU_MAP_SCRIPT_SRC : "http://api.map.baidu.com/api?v=2.0&ak=",

	__LAST_SWITCH_CITY_KEY : "PFT_WX_LAST_SWITCH_CITY",

	//用户如果没有切换过城市(如第一次使用此应用，则需要设置一个默认城市)
	//大多数情况下为全国，但有一部分客户产品较多，需要指定某个特定城市
	getDefaultSwitchCity : function(){
		//这里可以做特殊定制
		//如123933这个帐号，需要指定默认城市为福州
		//可以这样：
		//  if(window.location.hostname.split(".")[0]=="123933"){
		//		return{
		//			city : "福州",
		//			id : "3219"
		//		}
		//  }
		return {
			city : "全国",
			id : ""
		}
	},

	//定位到的城市
	__LOCATION_CITY : "",

	//获取上一次切换的城市,如果没有，就取默认预设的城市
	getLastSwitchCity : function(){
		var lastCity = window.localStorage.getItem(this.__LAST_SWITCH_CITY_KEY);
		lastCity = lastCity ? JSON.parse(lastCity) : this.getDefaultSwitchCity();
		return{
			city : lastCity.city,
			id : lastCity.id
		}
	},

	//设置要切换的城市
	setLastSwitchCity : function(city,id){
		if(typeof city!=="string") return false;
		id = id || "";
		var cityObj = {
			city : city,
			id : id
		};
		window.localStorage.setItem(this.__LAST_SWITCH_CITY_KEY,JSON.stringify(cityObj));
		return this;
	},

	//获取定位到的城市
	getLocationCity : function(){
		return this.__LOCATION_CITY;
	},

	//设置定位到的城市
	setLocationCity : function(city){
		if(typeof city!=="string") return false;
		this.__LOCATION_CITY = city;
		return this;
	},

	/**
	 * 定位城市  可选择h5定位或IP地址定位(type参数)
	 * @param opt
	 * locate({
	 * 		loading : function(){},
	 * 		complete : function(res){},
	 * 		success : function(cityname){},
	 * 		fail : function(res){}
	 * })
	 * locate.on("loading",function(){})
	 * locate.on("complete",function(res){})
	 * locate.on("success",function(cityname){})
	 * locate.on("fail",function(res){})
	 */
	locate : function(opt){
		var that = this;
		opt = opt || {};
		var fn = new Function;
		var type = opt.type || "H5";
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var __locate = function(BMap){
			if(type=="H5"){
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(res){
					//关于状态码
					//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
					//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
					//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
					//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
					//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
					//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
					//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
					//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
					//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
					var status = this.getStatus();
					if(status==0){
						var point = res.point;
						var lng = point.lng;
						var lat = point.lat;
						$.getJSON('http://api.map.baidu.com/geocoder/v2/?ak=485641E293ABd3523de065f7c1bbfeba&callback=?&location='+lat+','+lng+'&output=json&pois=1', function(res){
							complete(res);
							that.fire("complete",res);
							if(res && res.result && res.result.addressComponent && res.result.addressComponent.city){
								var city = res.result.addressComponent.city;
								if(city.indexOf("市")) city = city.substring(0,city.length-1);
								success(city);
								that.setLocationCity(city);
								that.fire("success",city);
							}else{
								fail(res);
								that.fire("fail",res);
							}
						});
					}else{
						complete(res);
						that.fire("complete",res);
						fail(res);
						that.fire("fail",res);
					}
				},{enableHighAccuracy:true});
			}else{
				var myCity = new BMap.LocalCity();
				myCity.get(function(result){
					complete(result);
					that.fire("complete",result);
					if(result && result.name){
						success(result.name);
						that.fire("success",result.name);
					}else{
						fail(result);
						that.fire("fail",result);
					}
				});
			}
		};

		LoadScript(this.__getBaiMapSrc(),{
			async : false,
			loading : function(){
				loading();
				that.fire("loading");
			},
			complete : function(){
				if(!window.BMap || !window.BMap.Geolocation) return alert("加载baidu map失败");
				__locate(window.BMap);
			}
		});

	}

},Pubsub);


module.exports = Location;