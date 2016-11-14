/**
 * Created by Administrator on 15-6-26.
 */
var Search = RichBase.extend({
	statics : {},
	EVENTS : {
		"change" : {
			".provSelect" : "onProvSelectChange"
		},
		"click" : {
			"#serhBtn" : "onSerhBtnClick"
		}
	},
	init : function(opt){
		this.container = opt.container;
		this.provs = PROVINCES;
		this.provSelect = $("#provSelect");
		this.citySelect = $("#citySelect");
		this.serhInp = $("#serhInp");
		this.loadProvs(this.provs);
	},
	loadProvs : function(provs){
		var provSelect = this.provSelect;
		var citySelect = this.citySelect;
		provSelect.append('<option value="">全部省份</option>');
		citySelect.append('<option value="000">全部城市</option>');
		$.each(provs,function(){
			var provid = this["area_id"];
			var provname = this["area_name"];
			provSelect.append('<option value="'+provid+'">'+provname+'</option>');
		})
	},
	onSerhBtnClick : function(that,e){
		var provice = that.provSelect.val();
		var city = that.citySelect.val();
		//var title = that.serhInp.val();
		var cv = $("#conSelect").val();
		//console.log(provice)
		if(cv == "1"){ //搜景区
					//console.log("diyi1");
					var title = that.serhInp.val();
					var supplier = "";
				}else{ //搜供应商
					//console.log("diyi2");
					var title = "";
					var supplier = that.serhInp.val();
				}
		//var supplier = that.serhInp.val();
		if(provice=="00") provice = "";
		if(city=="000") city = "";
		//console.log(title);
		//console.log(supplier);
		that.fire("search",{provice:provice,city:city,title:title,supplier:supplier});
	},
	getData : function(that,e){
		var that = this;
		var provice = that.provSelect.val();
		//console.log(province)
		var city = that.citySelect.val();
		var cv = $("#conSelect").val();
		if(cv == "1"){ //搜景区
					//console.log("diyi3");
					var title = that.serhInp.val();
					var supplier = "";
				}else{ //搜供应商
					//console.log("diyi4");
					var title = "";
					var supplier = that.serhInp.val();
				}
		//var title = that.serhInp.val();
		//var supplier = that.serhInp.val();
		if(provice=="00") provice = "";
		if(city=="000") city = "";
		return{
			provice : provice,
			city : city,
			title : title,
			supplier : supplier
		}
	},
	onProvSelectChange : function(that,e){
		var provid = that.provSelect.val();
		PFT.Ajax({
			url : "call/getAreas.php",
			type : "GET",
			dataType : "json",
			data : {
				act : "getCity",
				parentId : provid,
				area_deeppath : 2
			},
			loading : function(){},
			removeLoading : function(){},
			timeout : function(){},
			serverError : function(){}
		},function(res){
			that.citySelect.html("");
			that.citySelect.append('<option value="000">全部城市</option>');
			for(var i in res){
				var id = res[i]["area_id"];
				var name = res[i]["area_name"];
				that.citySelect.append('<option value="'+id+'">'+name+'</option>');
			}
		})
	}
});