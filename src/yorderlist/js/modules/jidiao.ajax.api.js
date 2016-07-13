/**
 * Created by Administrator on 16-3-16.
 */
var JiDiaoAjax = {
	url : "route/index.php",
	Ajax_Timeout : function(res){
		alert("请求超时，请稍后重试");
	},
	Ajax_Error : function(res){
		alert("请求出错，请稍后重试");
	},
	Ajax_Unlogin : function(res){
		alert("未登录或登录状态已过期，请重新登录");
		window.location.href = "dlogin_n.html";
	},
	Ajax_Fail : function(res){
		var res = res || {};
		var msg = res.msg || "请求出错，请稍后重试";
		alert(msg);
	},
	getList : function(opt){
		var that = this;
		var opt = opt || {};
		var keyword = opt.keyword || "";
		var page = opt.page;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var unlogin = opt.unlogin || this.Ajax_Unlogin;
		var fail = opt.fail || this.Ajax_Fail;
		var timeout = opt.timeout || this.Ajax_Timeout;
		var serverError = opt.serverError || this.Ajax_Error;
		var data = {
			c: "DispatchOrder",
			a : "getDistributor",
			search : keyword
		};
		if(page) data["page"] = page;

		//debug

//		var timeout = 1;
//		loading();
//		setTimeout(function(){
//			removeLoading();
//			var data = [{
//				id : 1,
//				dname : "陈光鹏测试",
//				account : 1
//			},{
//				id : 2,
//				dname : "慢慢测试三",
//				account : 2
//			},{
//				id : 3,
//				dname : "大仙测试",
//				account : 3
//			},{
//				id : 4,
//				dname : "test公司",
//				account : 4
//			},{
//				id : 5,
//				dname : "接口测试de",
//				account : 5
//			}];
//			for(var i=6; i<20; i++){
//				data.push({
//					id : i,
//					dname : "接口测试de",
//					account : i
//				})
//			}
//			success({
//				code : 200,
//				data : {
//					page : 1,
//					limit : 20,
//					total : 50,
//					list : data
//				}
//			})
//		},timeout*1000);
//		return false;





		PFT.Ajax({
			url : that.url,
			type : "get",
			dataType : "json",
			data : data,
			loading : function(){loading()},
			removeLoading : function(){removeLoading()},
			timeout : function(){timeout()},
			serverError : function(){serverError()}
		},function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data;
			var list = data.list || [];
			if(code==200){
				if(list.length){
					success(res);
				}else{
					empty(res);
				}
			}else if(code==102){
				unlogin(res);
			}else{
				fail(res);
			}
		})
	}
};
