/**
 * Created by Administrator on 16-4-15.
 */
var fn = new Function();
var Select = function(opt){
	var opt = opt || {};
	this.data = opt.data.citylist;
	this.provId = opt.provId;
	this.cityId = opt.cityId;
	if(!this.provId || !this.cityId) return false;
	this.provSelect = null;
	this.citySelect = null;
	this.onProvChange = opt.onProvChange || fn;
	this.onCityChange = opt.onCityChange || fn;
	this.defaults = opt.defaults || this.data[0]["p"];
	this.init();
};
Select.prototype = {
	init : function(){
		var that = this;
		this.provSelect = $(this.provId);
		this.citySelect = $(this.cityId);
		this.provSelect.on("change",function(e){
			var prov = $(this).val();
			var citys = that.getCitysByProv(prov);
			if(citys) that.buildCitys(citys);
			that.onProvChange(prov);
		})
		this.citySelect.on("change",function(e){
			var city = $(this).val();
			that.onCityChange(city);
		})
		this.buildProvs(this.defaults);
	},
	getCitysByProv : function(prov){
		if(!prov) return false;
		var result = null;
		var Data = this.data;
		for(var i in Data){
			var d = Data[i];
			var p = d["p"];
			if(p==prov){
				result = d["c"];
				break;
			}
		}
		return result;
	},
	buildCitys : function(citys){
		if(Object.prototype.toString.call(citys)!=="[object Array]") return false;
		var html = "";
		for(var i in citys){
			var city = citys[i]["n"];
			html += '<option value="'+city+'">'+city+'</option>';
		}
		this.citySelect.html(html);
	},
	buildProvs : function(defaultProv){
		var that = this;
		var html = "";
		var Data = this.data;
		for(var i in Data){
			var d = Data[i];
			var p = d["p"];
			var selected = p==defaultProv ? "selected" : "";
			html += '<option value="'+p+'" '+selected+'>'+p+'</option>';
		}
		this.provSelect.html(html);
		setTimeout(function(){
			that.provSelect.trigger("change");
		},10)
	},
	setVal : function(prov,city){
		if(arguments.length==0) return false;
		this.provSelect.val(prov);
		if(city) this.citySelect.val(city);
	},
	getVal : function(){
		return{
			prov : this.provSelect.val(),
			city : this.citySelect.val()
		}
	}
};
module.exports = Select;