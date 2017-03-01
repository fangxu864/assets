/**
 * Created by Administrator on 15-12-4.
 */
var Filter = RichBase.extend({
	EVENTS : {
		"click" : {
			".searchBtn" : "onSearchBtnClick",
			"#upload_" : "uploadd"
		}
	},
	init : function(){
		//this.container = $("#searchWrap");
		this.keywordInp = $("#searchInp");
		this.proSelect = $("#d_province");
		this.citySelect = $("#d_city");
		this.checkBoxGroup = $("#checkBoxGroup");
	},
	getKeyword : function(){ return this.keywordInp.val()},
	getProvince : function(){ 
		if(this.proSelect.val()==null){
			return ""
		}else{
			return this.proSelect.val()
		}
	},
	getCity : function(){ 
		if(this.citySelect.val()==null){
			return ""
		}else{
			return this.citySelect.val()
		}
	//return this.citySelect.val()
	},
	getCtype : function(){
		var result = [];
		this.checkBoxGroup.find("input[type=checkbox]:checked").each(function(){
			result.push($(this).val())
		});
		return result.join(",");
	},
	getupCtype : function(){
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
	// getParams_upload : function(){
		// var upload = {};
		// var com_type = {};
		// this.checkBoxGroup.find("input[type=checkbox]:checked").each(function(){
			// com_type[] = $(this).val();
		// });
		// upload = com_type;
		// upload.act = "loadExcel";
		// upload.keyword = this.getKeyword();
		// upload.city : this.getCity(),
		// upload.ctype : this.getupCtype()
		// return{
			// keyword : this.getKeyword(),
			// province : this.getProvince(),
			// city : this.getCity(),
			// ctype : this.getupCtype()
		// }
	// },
	getupload : function(){
		return{
			act : "loadExcel",
			txt : this.getKeyword(),
			d_province : this.getProvince(),
			d_city : this.getCity(),
			com_type : this.getCtype()
		}
	},
	onSearchBtnClick : function(that,e){
		that.fire("searchBtn",{
			queryParam :that.getParams() 
		})
		//console.log(that.getParams());
	},
	uploadd : function(that,e){
		that.fire("uploadd",{
			data :that.getParams()
		})
		
		
	}
	// uploadd : function(that,e){
		// if($("#d_city").val()==null){
			// var city = "";
		// }else{
			// var city = $("#d_city").val()
		// }
		// if($("#d_province").val()==null){
			// var d_province = "";
		// }else{
			// var d_province = $("#d_province").val()
		// }
		// var upload = {};
		// var com_type = {};
		// $("#checkBoxGroup").find("input[type=checkbox]:checked").each(function(i){
			// com_type[i]= $(this).val();
		// });
		// upload.act = "loadExcel";
		// upload.com_type = com_type;
		// upload.d_city = city;
		// upload.dtype ="";
		// upload.txt = $("#searchInp").val();
		// upload.d_province = d_province;
		// that.fire("uploadd",{
			// act : upload.act,
			// com_type : upload.com_type,
			// d_city : upload.d_city,
			// d_province : upload.d_province,
			// txt : upload.txt,
			// dtype : upload.dtype
			
			
		// })
	// }
});
module.exports = Filter;