/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:48
 * Description: ""
 */
require("./index.scss");
var Dialog = require("COMMON/modules/dialog-simple");
var dialog_content = require("./index.xtpl");
var Select = require("COMMON/modules/select");
var Api = require("../api.js");
var Main = function(){
	var that = this;
	this.dialog = new Dialog({
		width : 750,
		content : dialog_content,
		drag : true,
		speed : 100,
		onReady : function(){
			that.bankSelect = $("#bankName");
			that.provSelect = $("#provSelect");
			that.citySelect = $("#citySelect");
			that.subBankSelect = $("#subBranchName");
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
					that.getCityByProvId(province[0]["code"]);
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
		var renderOption = function(list){
			var html = "";
			for(var i in list){
				var d = list[i];
				var code = d["code"];
				var name = d["name"];
				html += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
			}
			var bank_id = that.bankSelect.val();
			if(bank_id) that.getBankBranch(bank_id,list[0]["code"]);
			return html;
		};
		if(ifCache && Cache){
			that.citySelect.html(renderOption(Cache));
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
						if(ifCache) that.__cityCache[id] = list;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
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
		var renderOption = function(list){
			var html = "";
			for(var i in list){
				var d = list[i];
				var code = d["code"];
				var name = d["name"];
				var phone = d["phone"];
				html += '<option data-name="'+name+'" data-phone="'+phone+'" value="'+code+'">'+name+'</option>';
			}
			return html;
		};
		if(ifCache && Cache){
			that.subBankSelect.html(renderOption(Cache));
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
						that.subBankSelect.html(renderOption(list));
						if(ifCache) that.__bankCache[params] = list;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT)
					}
				}
			})
		}
	},
	open : function(){
		var that = this;
		this.dialog.open({
			onAfter : function(){
				if(!that.__bankList && !that.__province){
					that.getBankList();
				}
			}
		});
	}
};
module.exports = Main;