/**
 * Created by Administrator on 16-2-4.
 */
var Api = require("./api.js");
var ListManager = RichBase.extend({
	EVENTS : {
		"click" : {
			"#listContainer .countBtn" : "onCountBtnClick",
			"#submitBtn" : "onSubmitClick"
		},
		"blur" : {
			"#listContainer .countInp" : "onCountInpBlur"
		},
		"focus" : {
			"#listContainer .countInp" : "onCountInpFocus"
		}
	},
	input_last_val : "",
	init : function(){
		this.listUl = $("#listContainer");
	},
	onCountBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var trParent = tarBtn.parents(".item");
		var tarInp = trParent.find(".countInp");
		var selled = trParent.find(".selled").text()*1;
		var val = $.trim(tarInp.val());
		var newVal = tarBtn.hasClass("add") ? (val*1+1) : (val*1-1);
		that.onCountInpChange(tarInp,newVal,val);
	},
	onCountInpBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var newVal = $.trim(tarInp.val());
		var oldVal = tarInp.attr("data-lastval");
		if(newVal=="") newVal="0";
		that.onCountInpChange(tarInp,newVal,oldVal);
	},
	onCountInpChange : function(tarInp,newVal,oldVal){
		if(newVal==-1){
			tarInp.val(newVal);
			this.setTotal_unallocated();
		}else{
			if(!PFT.Help.isPositiveNum(newVal,true)) return tarInp.val(oldVal);
			tarInp.val(newVal);
			var unallocated = this.calculate_unallocated();
			var total_all = $("#total_total").text()*1;
			if(total_all-unallocated<0){
				alert("保留库存总和不能超出总库存");
				tarInp.val(oldVal);
				return false;
			}
			this.setTotal_unallocated(unallocated);
		}
	},
	onCountInpFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.attr("data-lastval",tarInp.val());
	},
	onSubmitClick : function(that,e){
		var submitBtn = $(e.currentTarget);
		var total_unallocated = $("#total_unallocated").text() * 1;
		var total_total = $("#total_total").text() * 1;
		if(total_unallocated<0) return alert("保留库存总和不能大于总库存"+total_total);
		if(submitBtn.hasClass("disable")) return false;
		var data = [];
		$("#listContainer").children(".item").each(function(){
			var tarItem = $(this);
			var tarInp = tarItem.find(".countInp");
			var id = tarInp.attr("data-id");
			var val = tarInp.val();
			data.push({
				"reseller_id" : id,
				"total_num" : val
			})
		})
		Api.submit(data,{
			loading : function(){
				submitBtn.addClass("disable").text("正在保存...");
			},
			removeLoading : function(){
				submitBtn.removeClass("disable").text("保存配置")
			},
			timeout : function(){ alert(Api.AJAX_TIMEOUT_TEXT)},
			serverError : function(){ alert(Api.AJAX_SERVER_ERROR_TEXT)},
			success : function(res){
				PFT.Help.AlertTo("success",'<p style="width:200px">保存成功</p>');
			},
			fail : function(res){ alert(res.msg)}
		})
	},
	calculate_unallocated : function(){
		var total = 0;
		this.listUl.children(".item").each(function(){
			var tarItem = $(this);
			var save = $.trim(tarItem.find(".countInp").val())*1;
			if(save==-1) return true;
			total = total+save;
		})
		return total;
	},
	setTotal_unallocated : function(unallocated){
		var total_all = $("#total_total").text()*1;
		var unallocated = typeof unallocated=="undefined" ? this.calculate_unallocated() : unallocated;
		$("#total_unallocated").text(total_all-unallocated);
	}
});
module.exports = ListManager;