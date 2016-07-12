/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:48
 * Description: ""
 */
require("./index.scss");
var Select = require("COMMON/modules/select");
var Dialog = require("COMMON/modules/dialog-simple");
var dialog_content = require("./index.xtpl");
var Api = require("../api.js");
var Main = function(){
	var that = this;
	this.dialog = new Dialog({
		width : 750,
		content : dialog_content,
		drag : true,
		speed : 100,
		events : {
			"keyup #bankCardNumInp" : function(e){
				that.onBankCardNumInpKeyup(e);
			},
			"focus #bankCardNumInp" : function(e){
				that.onBankCardNumInpKeyup(e);
			},
			"blur #bankCardNumInp" : function(e){
				that.onBankCardNumInpBlur(e);
			},
			"click #bankDialog-submitBtn" : function(e){
				that.onSubmitBtnClick(e);
			}
		},
		onReady : function(){
			that.bankSelect = $("#bankName");
			that.provSelect = $("#provSelect");
			that.citySelect = $("#citySelect");
			that.bankSelect.on("change",function(e){
				var bank_id = $(this).val();
				var city_id = that.citySelect.val();
				that.getBankBranch(bank_id,city_id);
			})
			that.provSelect.on("change",function(e){
				var provId = that.provSelect.val();
				that.getCityByProvId(provId);
			})
			that.citySelect.on("change",function(e){
				var bank_id = that.bankSelect.val();
				var city_id = $(this).val();
				that.getBankBranch(bank_id,city_id);
			})
		}
	})
};
Main.prototype = {
	__bankList : null,
	__province : null,
	__ifCache : true,
	__cityCache : {},
	__bankCache : {},
	__initOption : null,
	onBankCardNumInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		var bankCopyBox = $("#bankCopyBox");
		var format = val.replace(/(.{4})/g,function($1){
			return $1+" ";
		});
		if(!val) return bankCopyBox.hide().text("");
		bankCopyBox.show().text(format);
	},
	onBankCardNumInpBlur : function(e){
		$("#bankCopyBox").hide();
	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var bankCardNumInp = $("#bankCardNumInp");
		var usernameInp = $("#bankCardAccount");
		var bank_account = $.trim(bankCardNumInp.val());
		if(!bank_account) return alert("请输入银行卡号/存折号");
		if(!/^\d*$/.test(bank_account)) return alert("银行卡号格式错误");
		var account_name = $.trim(usernameInp.val());
		if(!account_name) return alert("请填写开户姓名");
		var subBank = this.subBankSelect.getValue();
		var bank_code = subBank.id;
		var bank_name = subBank.name;
		var acc_type = $("#cardTypeSelect").val();
		var type = this.__initOption.type;
		var mode = this.__initOption.mode;

		var submitData = {
			bank_name : bank_name,            //支行名称
			bank_code : bank_code,            //支行行号
			bank_account : bank_account,      //银行卡号
			account_name : account_name,      //开户人姓名
			acc_type : acc_type,              //银行卡类别
			type : type                       //编辑的是第几张银行卡
		};

		this.dialog.close();
		this.dialog.trigger("submit",{
			submitBtn : tarBtn,
			submitData : submitData,
			mode : mode
		});

	},
	serializeParams : function(opt){
		var res = [];
		for(var i in opt) res.push(i+"="+opt[i]);
		return res.join("&");
	},
	getBankList : function(){
		var that = this;
		PFT.Util.Ajax(Api.url("getList"),{
			type : "post",
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				var list = data.list;
				var province = data.province;
				if(res.code==200){
					that.__bankList = list;
					that.__province = province;
					var bankHtml = "";
					var provHtml = "";
					for(var i in list){
						var d = list[i];
						var code = d["code"];
						var name = d["name"];
						bankHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
					}
					for(var p in province){
						var d = province[p];
						var code = d["code"];
						var name = d["name"];
						provHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
					}
					that.bankSelect.html(bankHtml);
					that.provSelect.html(provHtml);
					var init_bank_id = that.__initOption.bank_id;
					var init_province_id = that.__initOption.province_id;
					if(init_bank_id) that.bankSelect.attr("value",init_bank_id);
					if(init_province_id){
						that.provSelect.attr("value",init_province_id);
						that.getCityByProvId(init_province_id);
					}else{
						that.getCityByProvId(province[0]["code"]);
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	getCityByProvId : function(id){
		if(!id) return false;
		var that = this;
		var ifCache = this.__ifCache;
		var Cache = this.__cityCache[id];
		var init_city_id = that.__initOption.city_id;
		var renderOption = function(list){
			var html = "";
			for(var i in list){
				var d = list[i];
				var code = d["code"];
				var name = d["name"];
				html += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
			}
			var bank_id = that.bankSelect.val();
			var _cityid = init_city_id ? init_city_id : list[0]["code"];
			if(bank_id) that.getBankBranch(bank_id,_cityid);
			return html;
		};
		if(ifCache && Cache){
			that.citySelect.html(renderOption(Cache));
			if(init_city_id) that.citySelect.attr("value",init_city_id);
		}else{
			PFT.Util.Ajax(Api.url("cityList"),{
				type : "post",
				params : {
					province_id : id
				},
				loading : function(){},
				complete : function(){},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					var list = data.list;
					if(res.code==200){
						that.citySelect.html(renderOption(list));
						if(init_city_id) that.citySelect.attr("value",init_city_id);
						if(ifCache) that.__cityCache[id] = list;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
		if(init_city_id) that.__initOption["city_id"] = "";
	},
	getBankBranch : function(bank_id,city_id,name,page,size){
		if(!bank_id || !city_id) return false;
		var that = this;
		name = name || "";
		page = page || 1;
		size = size || 200;
		var ifCache = this.__ifCache;
		var params = this.serializeParams({
			bank_id : bank_id,
			city_id : city_id,
			name : name,
			page : page,
			size : size
		});
		var Cache = this.__bankCache[params];
		var init_subBank_id = this.__initOption.subBank_id;
		if(ifCache && Cache){
			that.subBankSelect.refresh(Cache);
			if(init_subBank_id) that.subBankSelect.setValue(init_subBank_id);
		}else{
			PFT.Util.Ajax(Api.url("subbranchList"),{
				type : "post",
				params : {
					bank_id : bank_id,
					city_id : city_id,
					name : name,
					page : page,
					size : size
				},
				loading : function(){},
				complete : function(){},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					var list = data.list;
					if(res.code==200){
						if(!that.subBankSelect){
							that.subBankSelect = that.initSubBankSelect(list);
						}else{
							that.subBankSelect.refresh(list);
						}
						if(init_subBank_id) that.subBankSelect.setValue(init_subBank_id);
						if(ifCache) that.__bankCache[params] = list;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT)
					}
				}
			})
		}
		if(init_subBank_id) this.__initOption["subBank_id"] = "";
	},
	initSubBankSelect : function(data){
		this.subBankSelect = new Select({
			trigger : $("#subBranchName"),
			height : 300,
			filter : true,
			data : data,
			field : {
				id : "code",
				name : "name"
			}
		})
		this.subBankSelect.on("open",function(){
			$("#subBranchBankBox").addClass("on");
		});
		this.subBankSelect.on("close",function(){
			$("#subBranchBankBox").removeClass("on");
		})
		return this.subBankSelect;
	},
	open : function(opt){
		var that = this;
		opt = opt || {};
		//opt = {
		//	type : "",
		//	bank_id : "",
		//	subBank_id : "",
		//	province_id : "",
		//	city_id : "",
		//	card_number : "",
		//	account_name : "",
		//	card_type : ""
		//};
		this.__initOption = opt;
		this.dialog.open({
			onAfter : function(){
				if(!that.__bankList && !that.__province) that.getBankList();
				var card_number = opt.card_number || "";
				var account_name = opt.account_name || "";
				var card_type = opt.card_type;
				$("#bankCardNumInp").val(card_number);
				$("#bankCardAccount").val(account_name);
				if(card_type) $("#cardTypeSelect").attr("value",card_type);
			}
		});
	},
	on : function(type,fn){
		this.dialog.on(type,fn);
	}
};
module.exports = Main;