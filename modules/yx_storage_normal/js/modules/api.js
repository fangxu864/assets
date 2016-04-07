/**
 * Created by Administrator on 16-2-3.
 */
var Api = {
	api : "/route/?c=product_storage",
	fn : new Function,
	AJAX_TIMEOUT : 60*1000,
	AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
	AJAX_SERVER_ERROR_TEXT : "请求出错，请稍后重试",
	getVenusId : function(){
		return $.trim($("#venueIdHidInp").val());
	},
	//获取默认场次id
	getDefaultRoundId : function(){
		return $.trim($("#default_roundIdHidInp").val());
	},
	getDefaultDate : function(){
		return $.trim($("#default_dateHidInp").val());
	},
	//获取分区id
	getAreaId : function(){
		return $("#areaSelect").val()
	},
	//获取分销商列表
	fetchList : function(venus_id,area_id,opt){
		var that = this;
		var api = that.api+"&a=getListDefault";
		var opt = opt || {};
		var fn = that.fn;
		var ajax_timeout = that.AJAX_TIMEOUT;
		var loading = opt.loading || fn;
		var removeLoaidng = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var fail = opt.fail || fn;
		var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
		if(!venus_id) return alert("缺少venus_id");
		if(!area_id) return alert("缺少area_id");
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : {
				venus_id : venus_id,
				area_id : area_id
			},
			ttimeout : ajax_timeout,
			loading : function(){loading()},
			removeLoading : function(){removeLoaidng()},
			timeout : function(res){timeout(res)},
			serverError : function(res){serverError(res)}
		},function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data || {};
			var list = data.list;
			var summary = data.summary || {};
			var msg = res.msg;
			if(code==200){
				if(list.length){
					success(res);
				}else{
					empty(res)
				}
			}else{
				fail(res);
			}
		})
	},
	getAreaList : function(opt){
		var that = this;
		var venus_id = this.getVenusId();
		if(!venus_id) return alert('缺少venus_id');
		var api = that.api+"&a=getConfigDefault";
		var opt = opt || {};
		var fn = that.fn;
		var ajax_timeout = that.AJAX_TIMEOUT;
		var loading = opt.loading || fn;
		var removeLoaidng = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			ttimeout : ajax_timeout,
			data : {
				venus_id : venus_id
			},
			loading : function(){loading();},
			removeLoading : function(){removeLoaidng();},
			timeout : function(){timeout();},
			serverError : function(){serverError();}
		},function(res){
			var res = res || {};
			var code = res.code;
			if(code==200){
				success(res);
			}else{
				fail(res);
			}
		})
	},
	//开启&&关闭分销库存设置

	/**
	 * 保存设置
	 */
	submit : function(data,opt){
		var that = this;
		var api = that.api+"&a=setListDefault";
		var opt = opt || {};
		var fn = that.fn;
		var ajax_timeout = that.AJAX_TIMEOUT;
		var loading = opt.loading || fn;
		var removeLoaidng = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
		var status = $("#switchStorageBtn").hasClass("on") ? 1 : 0;
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			ttimeout : ajax_timeout,
			data : {
				area_id : that.getAreaId(),
				venus_id : that.getVenusId(),
				status : status,
				data : that.stringify(data)
			},
			loading : function(){loading()},
			removeLoading : function(){removeLoaidng()},
			timeout : function(){timeout()},
			serverError : function(){serverError()}
		},function(res){
			var res = res || {};
			var code = res.code;
			var msg = res.msg || "请求出错，请稍后重试";
			if(code==200){
				success(res);
			}else{
				res["msg"] = msg;
				fail(res);
			}
		})
	},
	stringify : function(obj){
		//如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
		if(window.JSON) return JSON.stringify(obj);
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			if (t == "string") obj = '"' + obj + '"';
			return String(obj);
		} else {
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			var self = arguments.callee;
			for (n in obj) {
				v = obj[n];
				t = typeof(v);
				if (obj.hasOwnProperty(n)) {
					if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
						v = self(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	},
	parse : function(jsonString) {
		if (window.JSON) return window.JSON.parse(jsonString);
		return $.parseJSON(jsonString);
	}
};
module.exports = Api;