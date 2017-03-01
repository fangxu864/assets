/**
 * Created by Administrator on 15-12-4.
 */
var Api = RichBase.extend({
	statics : {
		api : "partner_dt.php",
		pageSize : 10
	},
	fetchList : function(page,queryParam,callbacks){
		var queryParam = queryParam || {};
		queryParam["page"] = page || 1;
		queryParam["act"] = "get_distributors";
		queryParam["page_size"] = this.statics.pageSize;
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;

		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;

		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : queryParam,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			tttimeout : 60,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status==1){ //请求成功
				if(data.length){
					success(res);
				}else{
					empty(res);
				}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}
		})
	},
	disfetchList : function(page,group_id,page_size,Params,callbacks){
		var queryParam = {};
		queryParam["page"] = page || 1;
		queryParam["gid"] = group_id;
		queryParam["params"] = Params;
		queryParam["page_size"] = page_size || 10;
		queryParam["page_size"] = 5;
		queryParam["act"] = "get_group_members";
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;

		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;

		PFT.Ajax({
			//url : "tpl/distributor/tpl/pppp.php",
			url : api, 
			type : "post",
			dataType : "json",
			data : queryParam,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			tttimeout : 60,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status==1){ //请求成功
				//if(data.length){
					success(res);
					// for(var i in res){
						// var gid = res[i]["data"][0]["group_id"];
						// console.log(gid)
					// }
					
				//}else{
				//	empty(res);
				//}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}
		})
	},
	groupMove : function(data,callbacks){
		var that = this;
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unfail = callbacks.unfail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : data,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			ttimeout : 60000,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status==1){ //请求成功
				//if(data.length){
					success(res);
					//this.fetch();
				//}else{
				//	empty(res);
				//}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}else if(status==-2){
				unfail(res);
			}
		})	
	},
	groupdelete : function(data,callbacks){
		var that = this;
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		PFT.Ajax({
			url : "call/chRela.php",
			type : "get",
			dataType : "json",
			data : data,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			tttimeout : 60,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status=="ok"){ //请求成功
				//if(data.length){
					success(res);
					//this.fetch();
				//}else{
				//	empty(res);
				//}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}
		})	
	},
	groupName : function(data,callbacks){
		var that = this;
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : data,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			tttimeout : 60,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status==1){ //请求成功
				//if(data.length){
					success(res);
					//this.fetch();
				//}else{
				//	empty(res);
				//}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}
		})	
	},
	deletegroup : function(data,callbacks){
		var that = this;
		var fn = new Function;
		var callbacks = callbacks || {};
		var api = this.statics.api;
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : data,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			tttimeout : 60,
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var data = res.data;
			var info = res.info;
			var current_page = res.current_page;
			var total_page = res.total_page;
			if(status==1){ //请求成功
				//if(data.length){
					console.log(res)
					success(res);
					//this.fetch();
				//}else{
				//	empty(res);
				//}
			}else if(status==-1){ //未登录或登录过期
				unlogin(res);
			}else if(status==0){ //出错
				fail(res);
			}
		})	
	}
});
module.exports = Api;


