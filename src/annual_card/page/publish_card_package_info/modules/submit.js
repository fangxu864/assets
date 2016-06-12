/**
 * Author: huangzhiyang
 * Date: 2016/6/12 16:35
 * Description: ""
 */
var Submit = Backbone.View.extend({
	serialize : function(pckId){
		var data = {};
		var container = $("#slideItem_"+pckId);
		//套餐id及套餐名称
		data["tid"] = $("#pckTitListUlItem_"+pckId).attr("data-id");
		var ttitle = $("#pckTitListUlItem_"+pckId).find(".editNameInp").val();
		ttitle = $.trim(ttitle);
		if(!ttitle) return this.errorHander(pckId,"套餐名称不能为空");
		data["ttitle"] = ttitle;

		//预定时间段
		var price_section = {};
		price_section["sdate"] = container.find("input[name=sdate]").val();
		price_section["edate"] = container.find("input[name=edate]").val();
		if(!price_section.sdate) return this.errorHander(pckId,"预字时间段开始时间不能为空");
		if(!price_section.edate) return this.errorHander(pckId,"预字时间段结束时间不能为空");

		//供货价、零售价、门市价
		var js = $.trim(container.find("input[name=js]").val());         //供货价
		var ls = $.trim(container.find("input[name=ls]").val());         //零售价
		var tprice = $.trim(container.find("input[name=tprice]").val()); //门市价
		if(isNaN(js) || js=="" || js<0) return this.errorHander(pckId,"供货价请填写不小于0的数值（可以精确到分）");
		if(isNaN(ls) || ls=="" || ls<0) return this.errorHander(pckId,"零售价请填写不小于0的数值（可以精确到分）");
		if(isNaN(tprice) || tprice=="" || tprice<0) return this.errorHander(pckId,"门市价请填写不小于0的数值（可以精确到分）");
		price_section["js"] = js;
		price_section["ls"] = ls;
		data["price_section"] = price_section;
		data["tprice"] = price;

		//产品说明
		var notes = $.trim(container.find("input[name=notes]").val());
		if(notes=="") return this.errorHander(pckId,"产品请明不能为空");
		data["notes"] =notes;

		//使用有效期
		var delaytypeRadio = container.find("input[type=radio][name=delaytype_"+pckId+"]:checked");
		var delaytype = delaytypeRadio.val();
		data["delaytype"] = delaytype;
		if(delaytype==2){
			var order_start = container.find("input[type=text][name=order_start]").val();
			var order_end = container.find("input[type=text][name=order_end]").val();
			if(new Date(order_start)*1>=new Date(order_end)*1) return this.errorHander(pckId,"使用有效期开始时间不能晚于结束时间");
			data["order_start"] = order_start;
			data["order_end"] = order_end;
		}else{ //delaytype==0 || 1
			var delaydays = $.trim(delaytypeRadio.parent().find("input[type=text][name=delaydays]").val());
			if(delaydays=="") return this.errorHander(pckId,"使用有效期，请填写有效天数");
			if(!PFT.Util.Validate.typeInit0(delaydays)) return this.errorHander(pckId,"使用有效期，天数请填写正整数");
			data["delaydays"] = delaydays;
		}

		//自动激活
		var auto_active_days = $.trim(container.find("input[type=text][name=auto_active_days]").val());
		if(!PFT.Util.Validate.typeInit0(auto_active_days)) return this.errorHander(pckId,"激活限制，请填写正整数");
		data["auto_active_days"] = auto_active_days;
		//是否需要身份证
		var certLimitInput = $("#cert_limit_"+pckId);
		if(certLimitInput.is(":checked")){
			data["cert_limit"] = 0;
		}else{
			data["cert_limit"] = 1;
		}
		


	},
	errorHander : function(pckId,errorTxt){
		this.trigger("submit.error",{packId:pckId,error:errorTxt});
		return null;
	},
	validate_js_ls_tprice : function(price){
		if(price=="") return
	}
});
module.exports = Submit;