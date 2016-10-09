/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: ""
 */

var __pos = 0;

module.exports = function(params,opt,cxt){

	var adaptCity = function(citys){
		var __citys = {};
		for(var i in citys){
			var city = citys[i];
			var pin = city.pin;
			var code = city.code;
			var group = __citys[pin] || (__citys[pin]={});
			var _city = group[code] = {};
			_city["name"] = city.name;
			_city["code"] = city.code;
			_city["pin"] = city.pin;
		}
		return __citys;
	};

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	cxt = cxt || this;

	if(__DEBUG__){
		opt.loading()
		setTimeout(function(){
			var list = [];
			if(__pos>=29){
				opt.complete();
				opt.empty({
					list : list,
					lastPos : 0
				})
			}else{
				params["lastPos"] = params["lastPos"] || 10;
				for(var i=__pos; i<(__pos+params.lastPos); i++){
					list.push(i);
				}
				__pos += params.lastPos;
				opt.complete();
				opt.success({
					list : list,
					citys : {
						f : {
							382 : {
								name : "福州",
								code : 382,
								pin : "f"
							},
							239 : {
								name : "福田区",
								code : 239,
								pin : "f"
							}
						},
						x : {
							384 : {
								name : "厦门",
								code : 384,
								pin : "x"
							}
						},
						z : {
							442 : {
								name : "张家界",
								code : 442,
								pin : "z"
							}
						}
					},
					lastPos : 10
				})
			}
		},1000)

		return false;
	}

	params = params || {};
	params["pageSize"] = params["pageSize"] || 10;
	params["token"] = PFT.Util.getToken();


	PFT.Util.Ajax(PFT.Api.C.productList(),{
		params : params,
		loading : function(){
			opt.loading.call(cxt);
		},
		complete : function(){
			opt.complete.call(cxt);
		},
		success : function(res){
			res = res || {};
			var data = res.data || {};
			var list = data.list;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(res.code==200){

				//citys = [{name:"福州",code:382,pin:"f"},{name:"厦门",code:384,pin:"x"}]
				//以上是后端返回的citys字段格式，这里前端需要自己按首字母分组
				data["citys"] = adaptCity(data.citys);

				if(list.length){
					opt.success.call(cxt,data);
				}else{
					opt.empty.call(cxt,data);
				}
			}else{
				opt.fail.call(cxt,msg);
			}
		}
	})
}