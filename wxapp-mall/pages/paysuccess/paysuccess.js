/**
 * Author: huangzhiyang
 * Date: 2017/1/6 10:26
 * Description: ""
 */
//获取应用实例
var Common = require("../../utils/common.js");
var QR = require("../../utils/qrcode.js");
var app = getApp();
Page({
	data : {
		whitchTemplate : "scenic",
		infoData :{}
		// 	"ptype" : "A",
		// 	"landTitle": "微商城演出测试（勿动）",
		// 	"totalmoney": "1",
		// 	"ordername": "翁彬",
		// 	"ordertel": "13023829679",
		// 	"qrcode": "978312",
		// 	"tickets": [
		// 		{
		// 			"title": "vip",
		// 			"num": "1"
		// 		},
		// 		{
		// 			"title": "12121",
		// 			"num": "3"
		// 		}
		// 	],
		// 	"extra": {
		// 		"date": "2016-08-12~2016-09-11",
		// 		"station" : "线路",//线路产品才有
		// 		"days" : 8,//住店天数，酒店才有
		// 		"seat" :"A_12", //座位信息，演出才有
		// 	}
		// }
	},


	/**
	 *  初始化页面
	 */
    onLoad: function( opt ) {
		var ordernum = opt.ordernum;
		console.log(ordernum);
		if(!ordernum){
			ordernum = 10000;
			console.log("ordernum缺失")
		}
		Common.request({
			url: "/r/Mall_Order/paySuccess/",
			data: {
				// lid: "2107"
				ordernum : ordernum
			},
			loading: function () {
				Common.showLoading()
			},
			complete: function () {
				Common.hideLoading();
			},
			success: function (res) {
				if(res.code == 200){
					QR.qrApi.draw(res.data.qrcode,"qrcodeCanvas","200","200");
					var ptype = res.data.ptype;
					switch  (ptype){
						case "A" :
						 _this.setData({
                    		whitchTemplate : "scenic",
							infoData : res.data
                		});
						break;
						case "B" :
						 _this.setData({
                    		whitchTemplate : "route",
							infoData : res.data
                		});
						break;
						case "C" :
						 _this.setData({
                    		whitchTemplate : "hotel",
							infoData : res.data
                		});
						break;
						case "F" :
						 _this.setData({
                    		whitchTemplate : "scenic",
							infoData : res.data
                		});
						break;
						case "H" :
						 _this.setData({
                    		whitchTemplate : "show",
							infoData : res.data
                		});
						break;
						case "I" :
						 _this.setData({
                    		whitchTemplate : "scenic",
							infoData : res.data
                		});
						break;
						case "G" :
						 _this.setData({
                    		whitchTemplate : "scenic",
							infoData : res.data
                		});
						break;
						default :
						 _this.setData({
                    		whitchTemplate : "scenic",
							infoData : res.data
                		});
					}
				}
			}
		})
	}
        
})