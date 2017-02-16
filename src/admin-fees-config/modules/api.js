/**
 * Created by Administrator on 16-6-15.
 */
var Api = {
	fn : new Function,
	AJAX_TIMEOUT : "请求超时，请稍后重试",
	AJAX_SERVERERROR : "请求出错，请稍后重试",
	api : {
		jh_refund_audit : "/r/Finance_SettleBlance/",
	},
    //开始
    getinfo : function(action,params,callbacks){
        var that = this;
		var opt = opt || {};
		var fn = new Function;
		var action = action;
        //var action = "udpate";
		var url = this.api.jh_refund_audit+action+"/";
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		var unlogin = opt.unlogin || fn;
        var data = {
                "id" :"19",
                "mode"	: "3",	//自动清分模式，1=日结，2=周结，3=月结
                "freeze_type" : "1"	,   //int	自动清分模式，1=日结，2=周结，3=月结
                "close_date" : "27",	    //int	周结和月结模式中的清算日期，周结=1-7，月结=1-31
                "close_time" : "15",	    //int	具体的清算时间
                "transfer_date"	: "27",   //int	月结模式中清分日期
                "transfer_time"	: "15",   //int	月结模式中清分时间
                "account_no" : "1",	    //int	银行账户的序号 1或2
                "service_fee"	: "12", //float	提现手续费百分百
                "money_type"	: "1",  //int	资金冻结详情类别：1=比例，2=具体金额
                "money_value"	: "12"//float	自资金冻结详情数值：具体比例或是具体金额
			};
		PFT.Ajax({
			url :url,
			type : "POST",
			dataType : "json",
			data : params,
			//data :data,
			ttimeout : 30 * 60 *1000,
			loading : function(){
				loading()
			},
			removeLoading : function(){
				removeLoading()
			},
			timeout : function(){ 
                PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">'+that.AJAX_TIMEOUT+'</p>');
            },
			serverError : function(){ 
                PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">'+that.AJAX_TIMEOUT+'</p>');
                $("#mask").hide();
            }
		},function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data;
			if(!res["msg"]) res["msg"] = that.AJAX_SERVERERROR;
			if(code==200){
				success(res);
			}else if(code==102){
				unlogin(res);
			}else{
				fail(res)
			}
		})
        
        
    },
    
    
    
    //结束
	//获取列表
	getList : function(page,params,callbacks){
		var that = this;
		var opt = opt || {};
		var page = page || 1;
		var fn = new Function;
		var page = "&page="+page;
		var action = "c=Finance_TradeRecord";
		var getList = "&a=getList"; 
		var limit = "&limit=15"
		var url = this.api.jh_refund_audit+"?"+action+getList+page+limit;
		var loading = callbacks.loading || fn;
		var removeLoading = callbacks.removeLoading || fn;
		var success = callbacks.success || fn;
		var empty = callbacks.empty || fn;
		var fail = callbacks.fail || fn;
		var unlogin = callbacks.unlogin || fn;
		var timeout = callbacks.timeout || fn;
		var serverError = callbacks.serverError || fn;
		var unlogin = opt.unlogin || fn;
		PFT.Ajax({
			url :url,
			type : "get",
			dataType : "json",
			data : params,
			ttimeout : 30 * 60 *1000,
			loading : function(){
				loading()
			},
			removeLoading : function(){
				removeLoading()
			},
			timeout : function(){ alert(that.AJAX_TIMEOUT)},
			serverError : function(){ 
                alert(that.AJAX_SERVERERROR);
                $("#mask").hide();
            }
		},function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data;
			var list = data.list;
			if(!res["msg"]) res["msg"] = that.AJAX_SERVERERROR;
			if(code==200){
				if(list.length){
					success(res);
				}else{
					empty(res);
				}
			}else if(code==102){
				unlogin(res);
			}else{
				fail(res)
			}
		})
	}
};
module.exports = Api;