/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: ""
 */
module.exports = function(lid,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	opt.loading()
	setTimeout(function(){
		opt.success({
			ptype:"C",
			list:[{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			},{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			},{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			},{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			},{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			},{
				ticket : "自定誃票名称",
				intro : "说明说胆说明说胆",
				pid : 121,
				aid : 1231,
				tid : 234,
				jsprice : 4.3,
				tprice : 5.30,
				tags : ["不可退","今日可用"]
			}]
		})
	},1000)

	return false;



	PFT.Util.Ajax(PFT.Api.C.getTicketList(),{
		params : {
			lid : lid
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var list = res.list;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				if(list.length){
					success(list);
				}else{
					empty(list);
				}
			}else{
				opt.fail(msg);
			}
		}
	})
}