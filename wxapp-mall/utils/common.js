/**
 * Author: huangzhiyang
 * Date: 2017/1/4 14:09
 * Description: ""
 */
var Common = {
	appId : "wxd1e8494ae3b6d821",
	getAccount : function(){
		return "123624";
	},
	//全局显示loading状态
	showLoading : function(text){
		wx.showToast({
			title : text || "努力加载中..",
			icon : "loading",
			duration : 10 * 1000
		})
	},
	//隐藏loading
	hideLoading : function(){
		wx.hideToast();
	},

	/**
	 * 简单封装了wx.request
	 * 这里已为每个请求附带flag、account两个参数
	 * 具体写业务时就不需要在每写一个request时都传这两个参数
	 * opt中的url参数还是跟以前的方式一样: /r/c/a/
	 * @param opt
	 *
	 * how to use:
	 *
	 * Common.request({
	 * 		debug : true,                  //debug==true时 用于脱离后端开发，模拟假数据
	 * 		url : "/r/c/a/",               //路径写法还是用微商城一样的写法，不需要写api.12301dev.com，这个方法已经为你做好路径转换
	 * 		data : {                       //传给后端的数据
	 * 			key : value
	 * 		},
	 *		loading : function(){},        //请求加载时
	 *		complete : function(res){},    //请求完成时执行  不论成功或失败都会执行
	 *		success : function(res){},     //服务器成功处理了请求 code==200
	 *		error : function(msg,code){}   //服务器无法处理该请求或处理时出错  msg:错误消息   code:具体的错误代码
	 * })
	 *
	 *
	 */
	request : function(opt){
		var defaults = {
			url : "",
			method : "POST",
			dataType : "json",
			data : {},
			header : {},
			loading : function(){},
			success : function(){},
			fail : function(){
				wx.showModal({
					title : "出错",
					content : "请求出错",
					showCancel : false
				})
			},
			error : function(msg,code){
				wx.showModal({
					title : "出错",
					content : msg + "  错误代码："+code,
					showCancel : false
				})
			},
			complete : function(){}
		};

		for(var i in defaults){
			if(typeof opt[i]=="undefined") opt[i] = defaults[i];
		}

		opt.header["Small-App"] = this.getAccount();

		opt.loading();

		if(opt.debug){

			setTimeout(function(){
				opt.complete();
				opt.success();
			},1000)

		}else{
			var url = opt.url;
			if(!url) return false;
			//index.php?c=Mall_Product&a=productList
			var host = "https://api.12301dev.com/index.php";
			var urlArray = [];
			url.split("/").forEach(function(item){
				if(item) urlArray.push(item);
			});
			var c = "?c=" + urlArray[1];
			var a = "&a=" + urlArray[2];
			opt["url"] = host + c + a;


			//complete中间件
			var _complete = opt.complete;
			opt["complete"] = function(res){
				var _res = res.data;
				var statusCode = res.statusCode;
				if(statusCode==200){
					_complete(_res);
				}else{
					wx.showModal({
						title : "出错",
						content : _res,
						showCancel : false
					})
				}
			}

			//success中间件
			var _success = opt.success;
			opt["success"] = function(res){
				var _res = res.data;
				var statusCode = res.statusCode;
				if(statusCode==200){
					var code = _res.code;
					var msg = _res.msg;
					if(_res.code==200){
						_success(_res);
					}else{
						opt.error(msg,code);
					}
				}else{
					wx.showModal({
						title : "出错",
						content : _res,
						showCancel : false
					})
				}
			}

			return wx.request(opt);
		}

	}
};


module.exports = Common;



