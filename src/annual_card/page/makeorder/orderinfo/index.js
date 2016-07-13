/**
 * Author: huangzhiyang
 * Date: 2016/6/17 16:27
 * Description: ""
 */
var Api = require("../../../common/api.js");
var Loading_Pc = require("COMMON/js/util.loading.pc.js");
var tpl = require("./info.xtpl");
var OrderIno = Backbone.View.extend({
	initialize : function(){
		this.listUl = $("#orderInfoList");
		this.urlParams = PFT.Util.UrlParse();
		this.pid = this.urlParams["pid"];
		this.aid = this.urlParams["aid"];
		this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
		this.type = this.physics ? "physics" : "virtual";
		if(!this.pid || !this.aid || !this.type) return false;
		this.getInfo(this.pid,this.aid,this.type);
	},
	template : _.template(tpl),
	getInfo : function(pid,aid,type){
		var that = this;
		var listUl = this.listUl;
		PFT.Util.Ajax(Api.Url.makeOrder.getOrderInfo,{
			params : {
				pid : pid,
				aid : aid,
				type : type
			},
			loading : function(){
				listUl.html(that.renderInfo("loading"));
			},
			complete : function(){
				listUl.html("");
			},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				var product = data.product;
				if(res.code==200){

					var needID = data.need_ID;
					var idCardInp = $("#userinfo_idCardInp");
					var tip = idCardInp.siblings(".tip");
					idCardInp.attr("data-needid",needID);
					if(needID==1){ //限制身份证必填
						tip.text("必填项");
					}

					$("#ltitle_text").text(product.ltitle+"-"+product.title);
					var pay = data.pay;
					if(pay.is_self==1){//自供应
						$("#payLine_no").show().find("input[type=checkbox]").prop("checked","checked");
						$("#payLine_credit").remove();
						$("#payLine_remain").remove();
						$("#payLine_online").remove();
					}
					$("#creditNum").text(pay.credit);
					$("#remainNum").text(pay.remain);
					$("#totalMoney").text(product.price);
					var supplier = data.supplier;
					var supplier_name = supplier.name; //供应商生名
					var supplier_link = supplier.linkman; //联系人
					var intro = supplier.intro; //产品介
					$("#supplierName").text(supplier_name);
					$("#contactsName").html(supplier_link);
					$("#introduceBoxCon").html(intro || "暂无产品介绍");
					listUl.html(that.renderInfo(data));
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	renderInfo : function(data){
		var html = "";
		if(data=="loading"){
			html = Loading_Pc("请稍后...",{
				tag : "tr",
				colspan : 6,
				height : 100
			});
		}else{
			html = this.template({data:data});
		}
		return html;
	}
});
module.exports = OrderIno;