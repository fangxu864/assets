/**
 * Author: huangzhiyang
 * Date: 2017/1/4 14:09
 * Description: ""
 */
var Common = {
	appId : "wxd1e8494ae3b6d821",
	SESSION_STORAGE_KEY : "pft-session-storage",
	SESSION_STORAGE_EXPIRE_KEY : "pft-session-storage-expire",  //session过期时长的key
	SESSION_STORAGE_AT_TIME : "pft-session-storage-attime",
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
	 * 弹窗显示错误信息
	 * @param errMsg  错误信息  必填
	 * @param title   弹窗标题  可选
	 */
	showError : function(errMsg,title){
		wx.showModal({
			title : title || "出错",
			content : errMsg || "出错",
			showCancel : false
		})
	},
	/**
	 * 每次发ajax请求给后端时，需要先判断是否已经微信登录
	 * 如果已登录，接着判断登录session有没有过期，如果过期需重新登录
	 * 如果未登录，需登录后通过返回的code，请求后端，用code换回session_key，存在本地
	 * 每次发请求需检查此session_key是否过期
	 * @param callback
	 */
	auth : function(callback){
		var sessionKey = this.SESSION_STORAGE_KEY;
		var expireKey = this.SESSION_STORAGE_EXPIRE_KEY;
		var atTimeKey = this.SESSION_STORAGE_AT_TIME;
		var showError = this.showError;
		var account = this.getAccount();

		//判断是否过期
		var isOverTime = function(sucCallback,failCallback){
			sucCallback = sucCallback || function(){};
			failCallback = failCallback || function(){};
			wx.getStorage({
				key : atTimeKey,
				success : function(res){
					var lastTime = res.data;
					if(lastTime){
						wx.getStorage({
							key : expireKey,
							success : function(res){
								var expire = res.data;
								if(expire){
									var nowTime = +new Date();
									if(nowTime-lastTime>=(expire * 1000)){ //过期
										sucCallback({isOver:true,expire:expire});
									}else{ //未过期
										sucCallback({isOver:false,expire:expire});
									}
								}else{
									failCallback();
								}
							},
							fail : function(){
								failCallback();
							}
						})
					}else{
						failCallback();
					}
				},
				fail : function(){
					failCallback();
				}
			})
		};
		//登录微信 然后用返回的code去服务器取sessionKey
		var login = function(callback){
			console.log("缓存过期，调用登录登录接口重新登录");
			wx.login({
				success : function(res){
					var code = res.code;
					if(code){
						wx.request({
							url : "https://api.12301dev.com/index.php?c=Mall_Member&a=smallAppLogin",
							method : "POST",
							header : {
								"Small-App" : account
							},
							data : {
								code : code
							},
							success : function(res){
								var _res = res.data;
								var data = _res.data;
								var code = _res.code;
								if(code==200){ //由code换session成功后，把session存入本地storage
									var sessionValue = data.sessionKey;
									var expireValue = data.expire;
									wx.setStorage({
										key : sessionKey,
										data : sessionValue
									})
									wx.setStorage({
										key : expireKey,
										data : expireValue
									})
									//把当前登录成功后换回session的时间点存下来
									//用于后面比对是否过期
									wx.setStorage({
										key : atTimeKey,
										data : (+new Date())
									})
									callback && callback(sessionValue,expireValue);
								}else{
									showError(res.msg);
								}
							},
							fail : function(){
								showError("code换session出错");
							}
						})
					}else{
						showError('获取用户登录态失败！' + res.errMsg)
					}
				},
				fail : function(){
					showError("微信登录接口调用失败");
				}
			})
		};

		wx.getStorage({
			key : sessionKey,
			success : function(res){ //如果存在
				var session = res.data;

				//判断此session是否过期
				isOverTime(function(result){
					if(result.isOver){ //已过期,则重新登录去获取session
						login(function(session,expire){
							callback && callback(session,expire);
						});
					}else{ //未过期
						callback && callback(session,result.expire);
					}
				},function(){
					showError("判断是否过期失败");
				})
			},
			fail : function(err){ //不存在 则重新登录
				login(function(session,expire){
					callback && callback(session,expire);
				});
			}
		})
	},
	/**
	 * 封装wx.request
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

		if(opt.debug) return setTimeout(function(){
			opt.complete();
			opt.success();
		},1000)

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

		//权限校验中间件
		this.auth(function(session,expire){
			opt["header"]["Session-Key"] = session;
			wx.request(opt);

		})
	},
	getToday : function(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		if(m<10) m = "0" + m;
		if(d<10) d = "0" + d;
		return y+"-"+m+"-"+d;
	}
};


module.exports = Common;



