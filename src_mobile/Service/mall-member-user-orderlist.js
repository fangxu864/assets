/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 个人中心  我的订单 列表  http://123624.12301.local/r/Mall_Member/getOrderList/
 *  page	  int	第几页
 	pageSize  int	每页几条
 	type	  string	unuse or history
 */

var UserOrder = {
	/**
	 * Description: 个人中心  我的订单 列表  http://123624.12301.local/r/Mall_Member/getOrderList/
	 * page	  int	第几页
	 * pageSize  int	每页几条
	 * type	  string	unuse or history
	*/
	list : function(params,opt){

		opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

		if(__DEBUG__){
			opt.loading();
			setTimeout(function(){
				opt.complete();
				opt.success();
			},1000)

			return false;
		}

		params = params || {};
		params["token"] = PFT.Util.getToken();

		PFT.Util.Ajax(PFT.Api.C.userCenterOrderList(),{
			type : "post",params : params,loading : opt.loading,complete : opt.complete,success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				var list = data.list;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200 && list){
					if(list.length){
						opt.success(data);
					}else{
						opt.empty(data);
					}
				}else{
					opt.fail(msg);
				}
			}
		})
	}
};

module.exports = UserOrder;