/**
 * Created by Administrator on 15-11-24.
 */
var AJAX_TIMEOUT_NUM = 5 * 60 * 1000; //5分钟超时，够了吧？？？？
var Api = RichBase.extend({
	statics : {},
	init : function(){},
	/**
	 * 查询订单
	 * @number current_page  想要查询当前第几页
	 * @number page_size     一页显示多少条数据
	 * @object opt           过滤条件(参数)
	 * @object cbs           callbacks
	 */
	query : function(current_page,page_size,opt,cbs){
		if(!current_page || !page_size) throw new Error("请指定请求参数");
		var toString = Object.prototype.toString;
		var opt = (toString.call(opt)=="[object Object]") ? opt : {};
		var cbs = (toString.call(cbs)=="[object Object]") ? cbs : {};
		var fn = new Function();
		var loading = cbs.loading || fn;
		var removeLoading = cbs.removeLoading || fn;
		var success = cbs.success || fn;
		var empty = cbs.empty || fn;
		var fail = cbs.fail || fn;
		var unlogin = cbs.unlogin || fn;
		var timeout = cbs.timeout || fn;
		var serverError = cbs.serverError || fn;
		var data = {};
		data["current_page"] = current_page;
		data["page_size"] = page_size;
		for(var i in opt){
			data[i] = opt[i];
		}
		PFT.Ajax({
			url : "module/zax/ProOrder_new.php",
			type : "post",
			dataType : "json",
			data : data,
			ttimeout : AJAX_TIMEOUT_NUM,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			serverError : function(res){ serverError(res)}
		},function(res){
			var status = res.status;
			var list = res.list;
			if(status=="success"){
				if(list.length){
					success(res);
				}else{
					empty(res);
				}
			}else if(status==-1){
				unlogin(res);
			}else{
				fail(res);
			}
		})
	},
	getDistors : function(opt){
		var fn = new Function();
		var opt = opt || {};
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var unlogin = opt.unlogin || fn;
		var timeout = opt.timeout || fn;
		var serverError = opt.serverError || fn;
		/*2016.08.11新增代码，添加分销商 供应商 集团账号的搜索类型*/
		var searchType=opt.search_type;
		PFT.Ajax({
			url : "module/zax/ProOrder_new.php",
			type : "post",
			dataType : "json",
			data : {getDistors:1,search_type:searchType},
			ttimeout : AJAX_TIMEOUT_NUM,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ timeout(res)},
			serverError : function(res){ serverError(res)}
		},function(res){
			if(res.status && res.status==-1){
				unlogin(res);
			}else if(Object.prototype.toString.call(res)=="[object Object]"){
				success(res);
			}else{
				fail(res);
			}
		})
	}
});
module.exports = Api;