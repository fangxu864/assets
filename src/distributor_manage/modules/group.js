/**
 * Created by Administrator on 15-12-4.
 */
var Filter = RichBase.extend({
	EVENTS : {
		"click" : {
			".searchBtn" : "onSearchBtnClick"
		}
	},
	init : function(){
		//this.container = $("#searchWrap");
		this.keywordInp = $("#searchInp");
		this.proSelect = $("#provinceSelect");
		this.citySelect = $("#citySelect");
		this.checkBoxGroup = $("#checkBoxGroup");
	},
	getKeyword : function(){ return this.keywordInp.val()},
	getProvince : function(){ return this.proSelect.val()},
	getCity : function(){ return this.citySelect.val()},
	getCtype : function(){
		var result = [];
		this.checkBoxGroup.find("input[type=checkbox]:checked").each(function(){
			result.push($(this).val())
		});
		return result.join(",");
	},
	getParams : function(){
		return{
			keyword : this.getKeyword(),
			province : this.getProvince(),
			city : this.getCity(),
			ctype : this.getCtype()
		}
	},
	onSearchBtnClick : function(that,e){
		that.fire("searchBtn.click",that.getParams())
		console.log(that.getParams());
	}
});
module.exports = Filter;