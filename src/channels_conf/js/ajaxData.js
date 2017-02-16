
var Query = RichBase.extend({
	statics : {
		currentPage : 0,
		last : "",
		oData : {},
		queryState : {
			loading : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">加载数据...</p><img src="images/other/loading_1.gif" alt="" /></li>',
			empty : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">没有产品...</p></li>',
			fail : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">请求失败...</p></li>',
			unlogin : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">登录过期，请重新登录...</p></li>',
			timeout : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">网络请求超时...</p></li>',
			serverError : '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">请求出错...</p></li>'
		},
		getProv : function(id){
			var prov = "";
			var p = PROVINCES;
			if(!id) return prov;
			for(var i in p){
				var areaid = p[i]["area_id"];
				if(areaid==id){
					prov = p[i]["area_name"];
					break;
				}
			}
			return prov;
		},
		isObjEmpty : function(obj){
			for(var i in obj){
				return false;
			}
			return true;
		}
	},
	EVENTS : {
		"click" : {
			"#pagenavW .pageBtn" : "onPrevNextClick",
			".secl .countBtn" : "onCountBtnClick",
			".page_sub" : "bl"
		},
		"focus" : {
			".formInp" : "onInputFocus"
		},
		"blur" : {
			".formInp" : "onInputBlur"
		},
		"keyup" : {
			".serhBtn" : "ser"
		},
	},
	init : function(opt){
		this.prevBtn = $("#prevPageBtn");
		this.nextBtn = $("#nextPageBtn");
		// $(".serhBtn").on("keyup",function(e){
			// alert("ddd")
				// var keyCode = e.keyCode;
				// if(keyCode==13){
					// alert("ddd")
				// }
		// })
		
	},
	ser : function(e){
		var keyCode = e.keyCode;
		alert(keyCode)
	},
	
	setCurPage : function(page){
		this.statics.currentPage = page;
	},
	getCurPage : function(){
		return this.statics.currentPage;
	},
	getData : function(){
		return this.statics.oData;
	},
	setData : function(id,data){
		if(id && data){
			this.statics.oData[id] = data;
		}else{
			this.statics.oData = {};
		}
	},
	bl : function(that,e){
		var total_pag = Number($(".nextBtn").attr("total"));
		var pag = Number($(".page_num_").val());
		if(!pag || !PFT_GLOBAL.U.istiveNum(pag)){
			$(".page_num_").val("");
			PFT_GLOBAL.U.Alert("fail",'<p style="width:240px">抱歉输入有误</p>');
			return false;
		}
		if(pag<=total_pag){
			that.fire("query_nexta",pag);
			$(".page_num_").val("");
		}else{
			PFT_GLOBAL.U.Alert("fail",'<p style="width:240px">抱歉输入页数大于总页数</p>');
			$(".page_num_").val("");
			return false;
		}
		
		
	},
	onPrevNextClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var first_ = Number($("#prevPageBtn").attr("data-first"));
		if(first_=="0"){
			that.prevBtn.addClass("disable");
		}else{
			that.prevBtn.removeClass("disable");
		}
		if(tarBtn.hasClass("disable")) return false;
		var type = $(".page_sub").attr("data");
		var curPage = $(".page_num_").val();
		var toPage = tarBtn.hasClass("prevBtn") ? (curPage-1) : (curPage+1);
		var all = $(".nextBtn").attr("total");
		var mid = Number($("#prevPageBtn").attr("data-mid"));
		var last_ = Number($("#prevPageBtn").attr("data-last"));
		var total_ = Number($("#nextPageBtn").attr("total"));
			if(tarBtn.hasClass("prevBtn")){
				that.nextBtn.removeClass("disable");
				if(first_=="0"){
					that.prevBtn.addClass("disable");
					return false;
				}
				else{

					that.fire("query_nexta",first_);
				}
			}else{
				that.prevBtn.removeClass("disable");
				if(last_<=total_){
					that.fire("query_nexta",last_);
					
				}else{
					that.nextBtn.addClass("disable");
				}
			}
			
	},
	query : function(opt){
		var that = this;
		var opt = opt || {};
		var pageSize = opt.pageSize || 8;
		var last = opt.last || "";
		var provice = opt.provice || "";
		var city = opt.city || "";
		var title = opt.title || "";
		var supplier = opt.supplier || "";
		var ttimeout = opt.ttimeout || 20 * 60 * 1000;
		var data = {
			pageSize : pageSize,
			last : last,
			city : city,
			provice : provice,
			title : title,
			supplier : supplier,
			act : "lists",
			currentPage : last,
			set_page : "1"
		};
		var listUl = $("#mlistUl");
		var pagenavW = $("#pagenavW");
		var status = this.statics.queryState;
		PFT.Ajax({
			url : "channels_conf.html",
			type : "GET",
			dataType : "json",
			ttimeout : ttimeout,
			data : data,
			loading : function(){
				listUl.html(status["loading"]);
				pagenavW.hide();
			},
			removeLoading : function(res){
				that.statics.last = "";
				that.statics.currentPage += 1;
				listUl.html("");
				pagenavW.show();
			},
			timeout : function(){ listUl.html(status["timeout"]);},
			serverError : function(){ listUl.html(status["serverError"]);} 
		},function(res){
			var code = res.status;
			var lists = res.lists;
			var last = res.last;
			if(code=="success"){
				if(!that.statics.isObjEmpty(lists)){
					that.statics.oData[that.statics.currentPage] = res;
					that.buildHtml(res);
				}else{
					listUl.html(status["empty"]);
					if(provice) that.fire("search_empty",res);
				}
				that.statics.last = last;
				if(!last){
					that.fire("no_next",res);
				}else{
					that.fire("has_next",res);
				}
			}else if(code==0){
				listUl.html(status["unlogin"]);
			}else{
				listUl.html(status["fail"]);
			}
		})
	},
	buildHtml : function(res){
		var that = this;
		var code = res.code;
		var lists = res.lists;
		var str = "";
		var last = res.last;
		var data = lists;
		var total = res.total;
		var totalPage = res.totalPage;
		$(".nextBtn").attr("total",totalPage);
		if(last==""){
			totalPage = Number(totalPage);
			$("#prevPageBtn").attr("data-mid",totalPage);
			$("#prevPageBtn").attr("data-last","");
			$("#prevPageBtn").attr("data-first",totalPage-1);
		}else{
			last = Number(last);
			$("#prevPageBtn").attr("data-mid",last-1);
			$("#prevPageBtn").attr("data-last",last);
			$("#prevPageBtn").attr("data-first",last-2);
		}
		str += '<div class="tbbox">';
			str += '		<table class="tb_scenic" border="0" cellpadding="0" cellspacing="0">';
			str += '			<thead>';
			str += '			  <tr>';
			str += '				<th class="setalign">票类</th>';
			str += '				<th class="supplier">供应商</th>';
			str += '				<th class="setwidth1"></th>';
			str += '				<th class="setwidth">推荐级别</th>';
			str += '				<th class="setwidth1"></th>';
			str += '				<th class="pay_sale">销售渠道</th> ';
			str += '			  </tr>';
			str += '			</thead>';
		for(var i in data){
			is_data_empty = false;
			var lid = data[i]["list"][0]["lid"];
			var aid = data[i]["list"][0]["aid"];
			var channel = data[i]["list"][0]["channel"];
			var px  = data[i]["list"][0]["px"];
			str += '	<tbody class="check_body" id="check_body">'; 
			str += ' 		<tr class="setbg">';
			str += '			<td colspan="3" class="setalign setcolor_b"><input class="check_set sethe" data-y="0"name="" data-set="'+i+'" type="checkbox" value="'+i+'" />'+data[i]["title"]+'</td>';
			str += '			<td  class="secl"><a href="javascript:void(0)" class="iconfont add_icon sub subBtn countBtn" data-lid="'+lid+'"  data-annel="'+channel+'" data-aid="'+aid+'">&#xe67a;</a><input class="ticket_num ui-form-txt-a formInp countInp" data-annel="'+channel+'" data-lid="'+lid+'" data-aid="'+aid+'" type="text" value="'+px+'" data-orign="'+px+'"><a href="javascript:void(0)" data-lid="'+lid+'" data-annel="'+channel+'" data-aid="'+aid+'" class="iconfont cut_icon plus countBtn plusBtn"> &#xe639; </a></td>';
			str += '			<td  class="secl"><span class="setcolor_a"></span> <input type="text" class="select_text"  value=""><span class="setcolor_b btn_edit"></span><span class="setcolor_save save_edit" id="save_edit"></span></td>';
			str += '			<td class="secl_bottom"></td>';
			str += '		</tr>';
			for(var s in data[i]["list"]){
				var lists =data[i]["list"][s]; 
				var pid = data[i]["list"][s]["pid"];
				var lid = data[i]["list"][s]["lid"];
				var aid = data[i]["list"][s]["aid"];
				var dname = data[i]["list"][s]["dname"];
				var tt = data[i]["list"][s]["title"];
				var channel = data[i]["list"][s]["channel"];
				var px = data[i]["list"][s]["px"];
				str += '<tr class="set_all_data find_'+lid+'" id="list_'+pid+'" lid="'+lid+'" pid="'+pid+'">';
				str += '<input type="hidden" class="pida_" value="">';
				str += '<input type="hidden" class="aida_" value="">';
				str += '<input type="hidden" class="lida_" value="">';
				str += '<input type="hidden" name="" class="aid_" value="">';
				str += '<input type="hidden" name="" class="pid_" value="">';
				str += '<input type="hidden" name="" class="lid_" value="">';
				str += '<input type="hidden"  class="allid" data-pid="'+pid+'" data-aid="'+aid+'" data-lid="'+lid+'">';
				str += '<td class="setalign setpadding"   pid="'+pid+'">';
                str += '<i class="inspan InfoIcon InfoQqIcon"  lid="'+lid+'" pid="'+pid+'"></i>';
                str += '<input class="set_check sethe" name="" type="checkbox"  data-pid="'+pid+'" data-aid="'+aid+'" data-lid="'+lid+'" data-x="0" data_test="" data-check="'+lid+'" value="'+lid+'" /><span class="ctitles" title="'+tt+'">'+tt+'</span></td>';
				str += '<td class="suppl" title="'+dname+'">'+dname+'</td>';
				str += '<td></td>';
				//str += '<td class="coutTd"><a href="javascript:void(0)" class="iconfont add_icon sub subBtn countBtn" data-pid="'+pid+'"  data-annel="'+channel+'" data-aid="'+aid+'">&#xe67a;</a><input class="ticket_num ui-form-txt-a formInp countInp" data-annel="'+channel+'" data-pid="'+pid+'" data-aid="'+aid+'" type="text" value="'+px+'" data-orign="'+px+'"><a href="javascript:void(0)" data-pid="'+pid+'" data-annel="'+channel+'" data-aid="'+aid+'" class="iconfont cut_icon plus countBtn plusBtn"> &#xe639; </a></td>';
				str += '<td class="coutTd"></td>'
				str += '<td></td>';
				str += '<td class="setalign_a "><span class="annel" pid="'+pid+'">'+channel+'</span><span class="btna_edit btn_choose" data-aid="'+aid+'"  data-lid="'+lid+'" data-pid="'+pid+'">更改</span></td>';
				str += '</tr>';  
			}
			str += '</tbody>';
		}
		str += '</table>';
		str += '	</div>';
		
		$("#mlistUl").html(str);
		$("#total_num").text("共"+totalPage+"页"); 
		if(last==""){
			totalPage = Number(totalPage);
			$("#whichPageNum").text(totalPage);
		}else{
			last = Number(last);
			$("#whichPageNum").text(last-1);
			
		}
	},
	onInputFocus : function(that,e){
		var tarInp = $(e.currentTarget);
		tarInp.attr("data-orign",tarInp.val());
	},
	onInputBlur : function(that,e){
		var tarInp = $(e.currentTarget);
		var areaid = tarInp.attr("data-lid");
		var orignVal = tarInp.attr("data-aid");
		var dVal = tarInp.attr("data-orign"); 
		var val = tarInp.val();
		if(!val || !PFT_GLOBAL.U.istiveNum(val)){
			tarInp.val(dVal);
			PFT_GLOBAL.U.Alert("fail",'<p style="width:240px">抱歉输入有误</p>');
			return false;
		}
		var has_type = tarInp.attr("data-annel");
		if(!has_type){
			var type = "0";  //为空
		}else{
			var type = "1";  //不为空
		}
		that.changeCount(that,tarInp,areaid,orignVal,val,type);
	},
	onCountBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		tarBtn.attr("data","0");
		var has_type = tarBtn.attr("data-annel");
		if(!has_type){
			var type = "0";  //为空
		}else{
			var type = "1";  //不为空
		}
		var hi = tarBtn.attr("data-i")
		var active_list_a = tarBtn;
		var tarInp = tarBtn.siblings(".formInp");
		var val = tarInp.val(), newVal=0;
		var storage = tarInp.attr("data-aid");
		var areaid = tarInp.attr("data-lid");
		if(tarBtn.hasClass("disable")) return false;
		if(tarBtn.hasClass("plus")){
			
			newVal = Number(val)+1;
			
		}else{
			if(val=="0"){return false;}
			newVal = Number(val)-1;
		}
		that.changeCount(that,tarInp,areaid,storage,newVal,type);
	},
	changeCount : function(that,tarInp,areaid,storage,newCount,type){
		
		storage = Number(storage);
		newCount = Number(newCount);
		$(".count_num").val(newCount);
		tarInp.val(newCount); 
		var has_type = tarInp.attr("data-annel");
		if(!has_type){
			var type = "0";  //为空
		}else{
			var type = "1";  //不为空
		}
		
		var minuBtn = tarInp.siblings(".sub");
		var addBtn = tarInp.siblings(".plus");
		var tprice = Number(tarInp.attr("data-tprice"));
		var inps = $("#proTable").find(".countInp");
		var totalCount = (function(){
			var totalCount = 0;
			inps.each(function(){
				totalCount += Number($(this).val());
			})
			return totalCount;
		})();
		var totalMoney = 0;
		var totalTicket = 0; 
		if(newCount==0){
			tarInp.val(newCount);
		}else{
			$("#proTable").find(".countInp").each(function(){
				var tarInp = $(this);
				var minuBtn = tarInp.siblings(".sub");
				var addBtn = tarInp.siblings(".plus");
				addBtn.removeClass("disable");
			})
		}
		that.setSort(that,tarInp,areaid,storage,newCount,type);
	},
	setSort : function(that,tarInp,areaid,storage,newCount,type){
		var setData = {
			lid : areaid,
			aid : storage,
			sort : newCount,
			action : "setSort"
		};
		var url = "call/jh_channels.php";
			$.ajax({type:'POST',url: url,data: setData, dataType:'json'}).done(function(res) {
				if(res.status=="success"){
					PFT_GLOBAL.U.Alert("success",'<p style="width:240px">'+res.msg+'</p>');
				}
				else{
					PFT_GLOBAL.U.Alert("fail",'<p style="width:240px">'+res.msg+'</p>');
					tarInp.val("0");
				}
			})
	}
	
	
	
});





