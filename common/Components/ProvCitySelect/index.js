/**
 * Created by Administrator on 16-4-15.
 */
/**
 * 插件使用说明
 * 1》require本插件。
 * var ProvCitySelector = require("COMMON/Components/ProvCitySelect");
 * 2》实例化对象
 * var selector = new ProvCitySelector({
 *   provId : "#provSelect",                               //参数为<select></select>省标签的id
 *  cityId : "#citySelect",                                //参数为<select></select>市标签的id
 *  onProvChange : function (provId) {                     //当省下拉框变化时执行的回调函数，参数为 省下拉框中 所选省份对应的省份代号
 *      // console.log(provId)
 *      $("#province_input").val(provId)
 *  },
 *  onCityChange : function (cityId) {                     //当省下拉框变化时执行的回调函数，参数为 市下拉框中 所选城市对应的城市代号
 *      // console.log(cityId)
 *      $("#city_input").val(cityId)
 *   }
 *});
 *
 */
var fn = new Function();
var Select = function(opt){
	var opt = opt || {};
	this.data = require("./province.city.data.js");
	this.provId = opt.provId;
	this.cityId = opt.cityId;
	if(!this.provId || !this.cityId) return false;
	this.provSelect = null;
	this.citySelect = null;
	this.onProvChange = opt.onProvChange || fn;
	this.onCityChange = opt.onCityChange || fn;
	this.defaults = opt.defaults || {};
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
		this.buildProvs(this.data);
	},
	getCitysByProv : function(provid){
		if(!provid) return false;
		var result = null;
		var data = this.data;
		for(var i in data){
			var d = data[i];
			var pid = d["id"];
			var citys = d["city"];
			if(pid==provid){
				result = citys;
				break;
			}
		}
		return result;
	},
	buildCitys : function(citys){
		if(Object.prototype.toString.call(citys)!=="[object Array]") return false;
		var html = "";
		var default_city = this.defaults.city;
		for(var i in citys){
			var city = citys[i];
			var id = city["id"];
			var name = city["name"];
			var pid = city["pid"];
			var selected = (id==default_city && default_city) ? "selected" : "";
			html += '<option '+selected+' data-pid="'+pid+'" value="'+id+'">'+name+'</option>';
		}
		this.citySelect.html(html);
	},
	buildProvs : function(data){
		var that = this;
		var html = "";
		var default_prov = this.defaults.province;
		for(var i in data){
			var d = data[i];
			var pid = d["id"];
			var name = d["name"];
			var selected = pid==default_prov ? "selected" : "";
			html += '<option value="'+pid+'" '+selected+'>'+name+'</option>';
		}
		this.provSelect.html(html);
		setTimeout(function(){
			that.provSelect.trigger("change");
		},10)
	},
	setVal : function(prov,city){
		if(arguments.length==0) return false;
		this.provSelect.val(prov);
		if(city) this.defaults.city = city;
		this.provSelect.trigger("change");
	},
	getVal : function(){
		return{
			prov : this.provSelect.val(),
			city : this.citySelect.val()
		}
	}
};
module.exports = Select;