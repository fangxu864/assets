/**
 * Author: huangzhiyang
 * Description: 新版微商城全民分销相关接口
 */

var api = PFT.Config.Api.get("Mall_AllDis");

//获取开店状态  是否可以开店
exports.getStatus = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){

	}

	PFT.Util.Ajax(api("getAllDisStatus"),{
		type : "post",
		params : {
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			var data = res.data;
			if(code==200){
				opt.success(data);
			}else{
				opt.fail(msg,code)
			}
		},
		serverError : function(){
			alert(PFT.AJAX_ERROR_TEXT);
		}
	})
}

//获取全民分销数据列表
exports.getList = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(opt.debug){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				"nickname": "慢慢",  // 昵称
				"head_img": "xxxx.img", // 头像
				"sumComm": 0.49, // 总佣金
				"dis_list": [
					{
						"nickname": "111",  // 昵称
						"order_count": "3", // 订单数量
						"develop_money": 0, // 发展佣金
						"recommend_money": 2.47 // 介绍佣金
					},
					{
						"nickname": "111",  // 昵称
						"order_count": "3", // 订单数量
						"develop_money": 0, // 发展佣金
						"recommend_money": 2.47 // 介绍佣金
					},
					{
						"nickname": "111",  // 昵称
						"order_count": "3", // 订单数量
						"develop_money": 0, // 发展佣金
						"recommend_money": 2.47 // 介绍佣金
					},
					{
						"nickname": "111",  // 昵称
						"order_count": "3", // 订单数量
						"develop_money": 0, // 发展佣金
						"recommend_money": 2.47 // 介绍佣金
					}
				]
			})
		},1000);
		return false;
	}


	PFT.Util.Ajax(api("getAllDisCenterData"),{
		type : "post",
		params : {
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			var data = res.data;
			if(code==200){
				opt.success(data);
			}else{
				opt.fail(msg,code)
			}
		},
		serverError : function(){
			alert(PFT.AJAX_ERROR_TEXT);
		}
	})
}


//提现佣金到红包
exports.cash = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(opt.debug){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({});
		},1000)
		return false;
	}


	console.log(api("cash"))

	PFT.Util.Ajax(api("cash"),{
		type : "post",
		params : {
			money : opt.money,
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			var code = res.code;
			if(code==200){
				opt.success(data);
			}else{
				opt.fail(res.msg,code);
			}
		},
		serverError : function(){
			alert(PFT.AJAX_ERROR_TEXT);
		}
	})

}