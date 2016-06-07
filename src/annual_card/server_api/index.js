/**
 * Author: huangzhiyang
 * Date: 2016/6/7 11:51
 * Description: ""
 */
module.exports = function(Http){

	//发布年卡产品-编辑产品信息页-图片上传
	Http.post("/upload",require("./fileupload"));

	//发布年卡产品-编辑产品信息页-保存产品信息
	Http.post("/r/publish_prod_info/submit",function(req,res){
		setTimeout(function(){
			res.end({code:200})
		},1000)
	});

	//发布年卡产品-套餐信息页-获取产品内的套餐列表
	Http.get("/r/publish_prod_package/fetch_list",require("./get.package.list"));

	//发布年卡产品-套餐信息页-获取产品列表
	Http.get("/r/publish_prod_package/fetch_prod_list",require("./get.prod.list"));

}