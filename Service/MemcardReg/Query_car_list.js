/**
 * Author: huangzhiyang
 * Date: 2016/12/22 15:24
 * Description: ""
 */
module.exports = function(opt){
	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt || {});
	var cxt = opt.cxt || null;
	var debug = opt.debug;
	var url = PFT.Config.Api.get("product_MemberCardBasic","getCarList");
	var type = opt.type || "post";

	if(debug){
		opt.loading.call(cxt);
		setTimeout(function(){
			opt.complete.call(cxt);
			opt.success.call(cxt,[{
			"type":0,//车类型编号（注册，编辑的时候传这个）
			"name":"5座专车"//车名称
		},
        {"type":1,"name":"7座专车"},
        {"type":2,"name":"9座专车"},
        {"type":3,"name":"11座专车"},
        {"type":4,"name":"15座专车"},
        {"type":5,"name":"15座以上"},
        {"type":6,"name":"飞马出租"},
        {"type":7,"name":"弘瑞出租"},
        {"type":8,"name":"天行出租"},
        {"type":9,"name":"盛捷出租"},
        {"type":10,"name":"海棠湾出租"},
        {"type":11,"name":"智慧快的出租"}]);
		},1000)
	}else{
		PFT.Util.Ajax(url,{
			type : type,
			loading : function(){
				opt.loading.call(cxt);
			},
			complete : function(){
				opt.complete.call(cxt);
			},
			success : function(res){
				var code = res.code;
				var data = res.data;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					opt.success.call(cxt,data);
				}else{
					opt.error.call(cxt,msg,code);
				}
			}
		})
	}


}