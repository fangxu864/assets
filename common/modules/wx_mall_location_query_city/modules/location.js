/**
 * Author: huangzhiyang
 * Date: 2016/5/23 15:28
 * Description: ""
 */
var Location = {
	init : function(opt){
		this.opt = opt || {};
		this.BMap = opt.BMap;
	},
	DEFAULT_CITY : "福州", //默认城市
	LOCALSTORAGE_KEY : "wx-16u-local-city",
	UNLIKE_CITY_STORAGE_KEY : "wx-16u-unlink-city",
	//从localstorage取出定位的城市
	getStorageCity : function(){
		var key = this.LOCALSTORAGE_KEY;
		var city = localStorage.getItem(key);
		return !!city ? city : this.DEFAULT_CITY;
	},
	//设置定位到的城市to localstorage
	setStorageCity : function(city){
		if(!city) return false;
		localStorage.setItem(this.LOCALSTORAGE_KEY,city);
		return city;
	},
	//用户不想切换到的定位城市
	unLikeCitys : function(city){ //set or get
		var key = this.UNLIKE_CITY_STORAGE_KEY;
		var citys = localStorage.getItem(key);
		if(!city){
			if(!!citys) return citys.split(",");
			return [];
		}else{
			if(!!citys){ //如果localstorage里已经存在一些city了
				citys += ","+city;
			}else{
				citys = city;
			}
			localStorage.setItem(key,citys);
		}
	},
	//判断给定城市是否在unLikeCitys列表里
	isUnLikeCitys : function(city){
		var result = false;
		if(!city) return result;
		var unLikeCitys = this.unLikeCitys().split(",");
		for(var i in unLikeCitys){
			if(city===unLikeCitys[i]){
				result = true;
				break;
			}
		}
		return result;
	},
	/**
	 * 定位城市  可选择h5定位或IP地址定位(type参数)
	 * @param opt
	 * local({
	 * 		loading : function(){},
	 * 		complete : function(res){},
	 * 		success : function(cityname){},
	 * 		fail : function(res){}
	 * })
	 * local.on("loading",function(){})
	 * local.on("complete",function(res){})
	 * local.on("success",function(cityname){})
	 * local.on("fail",function(res){})
	 */
	local : function(opt){
		var that = this;
		var fn = new Function;
		var type = opt.type || "H5";
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var BMap = this.BMap;
		if(!BMap) return console.log("缺少BMap对象");
		loading();
		that.fire("loading");
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
	}
};
module.exports = Location;