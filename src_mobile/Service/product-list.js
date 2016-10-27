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
				var _lsi = JSON.parse('[{"id":"15838","title":"\u6d4b\u8bd5\u666f\u533a01\u6d4b\u8bd5\u6d4b\u8bd5\u6d4b\u8bd5\u540d\u79f0\u6d4b\u8bd5\u957f\u5ea6\u6d4b\u8bd5\u4ea7\u54c1\u6d4b\u8bd5\u7528\u7684\u4e0d\u8981\u4e71","addr":"\u6d4b\u8bd5","topic":"","area":"\u5317\u4eac\u5e02|\u4e1c\u57ce\u533a|","ptype":"A","jtype":"AAAAA","imgpath":"http:\/\/www.12301.cc\/images\/defaultThum.jpg","px":"0","opentime":"","areacode":"1000","apply_did":"3385","jsprice":1,"uprice":1,"tprice":1,"min_pid":"31876","min_last_aid":"3385","account":"123624","min_g_price":null},{"id":"14765","title":"\u6d4b\u8bd5\u9636\u68af\u9000\u7968\u624b\u7eed\u8d39\u52ff\u52a8","addr":"fz","topic":"","area":"\u5317\u4eac\u5e02|\u5d07\u6587\u533a|","ptype":"A","jtype":"AAAAA","imgpath":"http:\/\/images.12301.cc\/123624\/20160113\/14526652608825_thumb.jpg","px":"0","opentime":"","areacode":"1000","apply_did":"3385","jsprice":2,"uprice":2,"tprice":5,"min_pid":"29093","min_last_aid":"3385","account":"123624","min_g_price":null},{"id":"2633","title":"\u63a5\u53e3\u6d4b\u8bd5\u4ea7\u54c1\uff08\u4ec5\u4f9b\u6d4b\u8bd5\uff09","addr":"\u5317\u4eac\u5e02\u671d\u9633\u533a\u671b\u4eacsohoT3","topic":"","area":"\u5317\u4eac\u5e02|\u671d\u9633\u533a|","ptype":"A","jtype":"AAAAA","imgpath":"http:\/\/www.12301.cc\/prodimgs\/100019\/20140714\/14053213389362_thumb.jpg","px":"0","opentime":"8:00~15:30","areacode":"1000","apply_did":"113","jsprice":2,"uprice":2,"tprice":100,"min_pid":"2380","min_last_aid":"113","account":"123624","min_g_price":null}]');
				var _llss = [];
				for(var i=0; i<20; i++){
					_llss.push(_lsi[0])
				}
				opt.success({
					list : _lsi,
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
		type : "post",
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
				if(data.citys) data["citys"] = adaptCity(data.citys);
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