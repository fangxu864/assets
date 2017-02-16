/**
 * Created by Administrator on 15-6-29.
 */
var Selected = RichBase.extend({
	statics : {
		isPositiveNum : function(count){
			count = String(count);
			var type="^[0-9]*[1-9][0-9]*$";
			var re = new RegExp(type);
			if(count.match(re) == null){
				return false;
			}
			return true;
		}
	},
	EVENTS : {
		"click" : {
			".countBtn" : "onCountBtnClick"
		},
		"focus" : {
			".countInp" : "onCountInpFocus"
		},
		"blur" : {
			".countInp" : "onCountInpBlur"
		}
	},
	init : function(){
		var that = this;
		$("#saveToNext").on("click",function(e){
			that.submit(e);
		})
	},
	render : function(data){
		var that = this;
		var landItemTpl = $("#landItemTpl").html();
		var ticketItemTpl = $("#ticketItemTpl").html();
		var html = "";
		for(var land in data){
			var landData = data[land];
			var title = landData.title;
			var tids = landData.tids;
			var ticketList = "";
			// for(var t in tids){
				// var tdata = tids[t];
				// ticketList += that.parseTemplate(ticketItemTpl,{
					// lid_sid : land,
					// lid : tdata.lid,
					// tid : tdata.tid,
					// aid : tdata.aid,
					// pid : tdata.pid,
					// count : tdata.count,
					// tname : tdata.tname,
					// uprice : tdata.uprice,
					// jsprice : tdata.jsprice
				// })
			// }
			// html += that.parseTemplate(landItemTpl,{
				// title : title,
				// ticketList : ticketList
			// })
		}
		if(html){
			this.container.html(html).removeClass("noSeledUl");
			$("#totalMoneyWrap").show();
		}else{ //没有选择任何产品
			this.container.html('<li>还未选择任何产品</li>').addClass("noSeledUl");
			$("#totalMoneyWrap").hide();
		}
	},
	total : function(){
		var tuprice = 0;
		var tjsprice = 0;
		var round2 = function(number,fractionDigits){
			with(Math){
				return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);
			}
		};
		this.container.find(".countInp").each(function(){
			var tarInp = $(this);
			var uprice = tarInp.attr("data-uprice") * 1;
			var jsprice = tarInp.attr("data-jsprice") * 1;
			var count = tarInp.val() * 1;
			tuprice += (uprice*count);
			tjsprice += (jsprice*count);
		})
		tuprice = round2(tuprice,2);
		tjsprice = round2(tjsprice,2);
		$("#total_gprice").text(tuprice);
		$("#total_lprice").text(tjsprice);
	},
	onCountBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var tarInp = tarBtn.siblings(".countInp");
		var val = tarInp.val();
		var newVal = tarBtn.hasClass("plus") ? (Number(val)+1) : (Number(val)-1);
		var lid_sid = tarInp.attr("data-lidsid");
		var tid = tarInp.attr("data-tid");
		if(newVal<0) newVal=0;
		tarInp.val(newVal);
		if(Number(val)<=0 && newVal==0) return false;
		sData.setCount(lid_sid,tid,newVal);
		that.total();
	},
	onCountInpFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.data("orignval",tarInp.val());
	},
	onCountInpBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var val = tarInp.val();
		var orign = tarInp.data("orignval");
		if(!val || !that.statics.isPositiveNum(val) || (val==orign)){
			tarInp.val(orign);
			return false;
		}
		that.total();
	},
	submit : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var formData = [];
		$("#seledUl").find(".countInp").each(function(){
			var tarInp = $(this);
			var val = tarInp.val();
			var d = "";
			if(!val || val*1<=0) return true;
			d += "{";
			d += '"lid":"'+ tarInp.attr("data-lid") + '",';
			d += '"pid":"'+ tarInp.attr("data-pid") + '",';
			d += '"aid":"'+ tarInp.attr("data-aid") + '",';
			d += '"num":"'+ tarInp.val() + '"';
			d += "}";
			formData.push(d);
		});
		if(formData.length==0) return false;
		tarBtn.text("正在提交数据...");
		$("#formResult").val("["+formData.join(",")+"]");
		$("#resultForm").submit();
	}
});