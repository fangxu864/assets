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
	DEFAULT_CITY : "����", //Ĭ�ϳ���
	LOCALSTORAGE_KEY : "wx-16u-local-city",
	UNLIKE_CITY_STORAGE_KEY : "wx-16u-unlink-city",
	//��localstorageȡ����λ�ĳ���
	getStorageCity : function(){
		var key = this.LOCALSTORAGE_KEY;
		var city = localStorage.getItem(key);
		return !!city ? city : this.DEFAULT_CITY;
	},
	//���ö�λ���ĳ���to localstorage
	setStorageCity : function(city){
		if(!city) return false;
		localStorage.setItem(this.LOCALSTORAGE_KEY,city);
		return city;
	},
	//�û������л����Ķ�λ����
	unLikeCitys : function(city){ //set or get
		var key = this.UNLIKE_CITY_STORAGE_KEY;
		var citys = localStorage.getItem(key);
		if(!city){
			if(!!citys) return citys.split(",");
			return [];
		}else{
			if(!!citys){ //���localstorage���Ѿ�����һЩcity��
				citys += ","+city;
			}else{
				citys = city;
			}
			localStorage.setItem(key,citys);
		}
	},
	//�жϸ��������Ƿ���unLikeCitys�б���
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
		if(!BMap) return console.log("ȱ��BMap����");
		loading();
		that.fire("loading");
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
						that.fire("complete",res);
						if(res && res.result && res.result.addressComponent && res.result.addressComponent.city){
							var city = res.result.addressComponent.city;
							if(city.indexOf("��")) city = city.substring(0,city.length-1);
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