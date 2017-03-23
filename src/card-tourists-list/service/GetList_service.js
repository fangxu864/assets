
module.exports = function(params,opt){

	opt.loading();
	setTimeout(function(){
		send();
	},2000*Math.random());
	
	function send(){
		PFT.Util.Ajax( "http://List.cn" ,{
			type : "post",
			params : {
			},
			loading : opt.loading,
			complete : opt.complete,
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					opt.success(res);
				}else{
					opt.fail(msg);
				}
			}
		})
	}
	
}