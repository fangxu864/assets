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
		price_section["storage"] = -1;
		price_section["weekdays"] = "1,2,3,4,5,6,7";

		if(!price_section.sdate) return this.errorHander(pckId,"预字时间段开始时间不能为空");
		if(!price_section.edate) return this.errorHander(pckId,"预字时间段结束时间不能为空");

		//供货价、零售价、门市价
		var js = $.trim(container.find("input[name=js]").val());         //供货价
		var ls = $.trim(container.find("input[name=ls]").val());         //零售价
		var tprice = $.trim(container.find("input[name=tprice]").val()); //门市价
		if(isNaN(js) || js=="" || js<0) return this.errorHander(pckId,"供货价请填写不小于0的数值（可以精确到分）");
		if(isNaN(ls) || ls=="" || ls<0) return this.errorHander(pckId,"零售价请填写不小于0的数值（可以精确到分）");
		if(isNaN(tprice) || tprice=="" || tprice<0) return this.errorHander(pckId,"门市价请填写不小于0的数值（可以精确到分）");
		price_section["js"] = js*100;
		price_section["ls"] = ls*100;
		data["price_section"] = [price_section];
		data["tprice"] = tprice*100;

		//产品说明
		var notes = $.trim(container.find("input[name=notes]").val());
		if(notes=="") return this.errorHander(pckId,"产品说明不能为空");
		data["notes"] =notes;

		//使用说明
		var getaddr = $.trim(container.find("textarea[name=getaddr]").val());
		if(getaddr=="") return this.errorHander(pckId,"使用说明不能为空");
		data["getaddr"] =getaddr;

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


		//购票限制
		data["search_limit"] = (function(){
			var result = [];
			container.find("input[type=checkbox][name=search_limit]:checked").each(function(){
				var val = $(this).val();
				result.push(val);
			});
			return result.join(",");
		})();



		//使用说明
		data["getaddr"] = $("#getaddrTextArea_"+pckId).val();

		//供应商手机号
		var fax = $.trim(container.find("input[type=text][name=fax]").val());
		if(fax=="") return this.errorHander(pckId,"供应商手机号不能为空");
		if(!PFT.Util.Validate.typePhone(fax)) return this.errorHander(pckId,"供应商手机号，请填写正确格式手机号");
		data["fax"] = fax;


		//消息通知
		//年卡激活时是否通知供应商
		var nts_sup_input = container.find("input[type=checkbox][name=nts_sup]");
		data["nts_sup"] = nts_sup_input.is(":checked") ? 1 : 0;

		//年卡激活时是否通知游客
		var nts_tour_input = container.find("input[type=checkbox][name=nts_tour]");
		data["nts_tour"] = nts_tour_input.is(":checked") ? 1 : 0;

		//年卡激活时是否通到微信
		var confirm_wx_input = container.find("input[type=checkbox][name=confirm_wx]");
		data["confirm_wx"] = confirm_wx_input.is(":checked") ? 1 : 0;


		//特权套餐
		var priv = (function(){

			var result = {};
			//result = {
			//	1 : {
			//		aid : 1,
			//		use_limit : "",
			//		limit_count : ""
			//	}
			//}
			$("#pckRightListUl_"+pckId).children().each(function(){
				var item = $(this);
				var tid = item.attr("data-ticid");
				var aid = item.attr("data-aid");
				var use_limit = item.find("input[type=radio][name=uselimit]:checked").val();
				result[tid] = {
					aid : aid
				};
				if(use_limit==-1){ //使用限制为不限
					result[tid]["use_limit"] = use_limit;
				}else{
					var daily_limit = $.trim(item.find(".limitCountInp_daily").val());
					var month_limit = $.trim(item.find(".limitCountInp_month").val());
					var total_limit = $.trim(item.find(".limitCountInp_total").val());
					if(!PFT.Util.Validate.typeInit(daily_limit) && !PFT.Util.Validate.typeInit(month_limit) && !PFT.Util.Validate.typeInit(total_limit)){
						result["error"] = "限制次数至少填写一个且须为正整数";
						return false;
					}else{
						if(!PFT.Util.Validate.typeInit(daily_limit)) daily_limit = -1;
						if(!PFT.Util.Validate.typeInit(month_limit)) month_limit = -1;
						if(!PFT.Util.Validate.typeInit(total_limit)) total_limit = -1;
						result[tid]["use_limit"] = [daily_limit,month_limit,total_limit].join(",");
					}
				}
			});
			return result;

		})();

		if(priv.error) return this.errorHander(pckId,priv.error);
		data["priv"] = priv;


		//是否发布
		data["apply_limit"] = container.find(".apply_limit_input:checked").val();

		data["lid"] = PFT.Util.UrlParse()["sid"] || "";

		return data;

	},
	errorHander : function(pckId,errorTxt){
		this.trigger("submit.error",{pckId:pckId,error:errorTxt});
		return null;
	}
});
module.exports = Submit;