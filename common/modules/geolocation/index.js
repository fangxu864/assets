/**
 * Author: huangzhiyang
 * Date: 2016/5/23 15:28
 * Description: ""
 */
var Location = {
	DEFAULT_CITY : "福州",
	LOCALSTORAGE_KEY : "wx-16u-local-city",
	UNLIKE_CITY_STORAGE_KEY : "wx-16u-unlink-city",
	getStorageCity : function(){
		var key = this.LOCALSTORAGE_KEY;
		var city = localStorage.getItem(key);
		return !!city ? city : this.DEFAULT_CITY;
	},
	setStorageCity : function(city){
		if(!city) return false;
		localStorage.setItem(this.LOCALSTORAGE_KEY,city);
		return city;
	},
	unLikeCitys : function(city){ //set or get
		var key = this.UNLIKE_CITY_STORAGE_KEY;
		var citys = localStorage.getItem(key);
		if(!city){
			if(!!citys) return citys.split(",");
			return [];
		}else{
			if(!!citys){
				citys += ","+city;
			}else{
				citys = city;
			}
			localStorage.setItem(key,citys);
		}
	},
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
	 * ��λ����  ��ѡ��h5��λ��IP��ַ��λ(type����)
	 * @param opt
	 * local({
	 * 		loading : function(){},
	 * 		complete : function(res){},
	 * 		success : function(cityname){},
	 * 		fail : function(res){}
	 * })
	 */
	local : function(opt){
		var that = this;
		var opt = opt || {};
		var fn = new Function;
		var type = opt.type || "H5";
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		if(!BMap) return console.log("缺省BMap对象");
		loading();
		if(type=="H5"){
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(res){
				//����״̬��
				//BMAP_STATUS_SUCCESS	�����ɹ�����Ӧ��ֵ��0����
				//BMAP_STATUS_CITY_LIST	�����б���Ӧ��ֵ��1����
				//BMAP_STATUS_UNKNOWN_LOCATION	λ�ý��δ֪����Ӧ��ֵ��2����
				//BMAP_STATUS_UNKNOWN_ROUTE	�������δ֪����Ӧ��ֵ��3����
				//BMAP_STATUS_INVALID_KEY	�Ƿ���Կ����Ӧ��ֵ��4����
				//BMAP_STATUS_INVALID_REQUEST	�Ƿ����󡣶�Ӧ��ֵ��5����
				//BMAP_STATUS_PERMISSION_DENIED	û��Ȩ�ޡ���Ӧ��ֵ��6����(�� 1.1 ����)
				//BMAP_STATUS_SERVICE_UNAVAILABLE	���񲻿��á���Ӧ��ֵ��7����(�� 1.1 ����)
				//BMAP_STATUS_TIMEOUT	��ʱ����Ӧ��ֵ��8����(�� 1.1 ����)
				var status = this.getStatus();
				if(status==0){
					var point = res.point;
					var lng = point.lng;
					var lat = point.lat;
					$.getJSON('http://api.map.baidu.com/geocoder/v2/?ak=485641E293ABd3523de065f7c1bbfeba&callback=?&location='+lat+','+lng+'&output=json&pois=1', function(res){
						complete(res);
						if(res && res.result && res.result.addressComponent && res.result.addressComponent.city){
							var city = res.result.addressComponent.city;
							if(city.indexOf("市")) city = city.substring(0,city.length-1);
							success(city);
						}else{
							fail(res);
						}
					});
				}else{
					complete(res);
					fail(res);
				}
			},{enableHighAccuracy:true});
		}else{
			var myCity = new BMap.LocalCity();
			myCity.get(function(result){
				complete(result);
				if(result && result.name){
					success(result.name);
				}else{
					fail(result);
				}
			});
		}
	}
};
module.exports = Location;