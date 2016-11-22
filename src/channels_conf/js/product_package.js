var PROVINCES = [
	{
		"area_id": "1",
		"area_name": "北京市"
	},
	{
		"area_id": "2",
		"area_name": "天津市"
	},
	{
		"area_id": "3",
		"area_name": "上海市"
	},
	{
		"area_id": "4",
		"area_name": "重庆市"
	},
	{
		"area_id": "5",
		"area_name": "河北省"
	},
	{
		"area_id": "6",
		"area_name": "山西省"
	},
	{
		"area_id": "7",
		"area_name": "辽宁省"
	},
	{
		"area_id": "8",
		"area_name": "吉林省"
	},
	{
		"area_id": "9",
		"area_name": "江苏省"
	},
	{
		"area_id": "10",
		"area_name": "浙江省"
	},
	{
		"area_id": "11",
		"area_name": "安徽省"
	},
	{
		"area_id": "12",
		"area_name": "福建省"
	},
	{
		"area_id": "13",
		"area_name": "江西省"
	},
	{
		"area_id": "14",
		"area_name": "山东省"
	},
	{
		"area_id": "15",
		"area_name": "河南省"
	},
	{
		"area_id": "16",
		"area_name": "湖北省"
	},
	{
		"area_id": "17",
		"area_name": "湖南省"
	},
	{
		"area_id": "18",
		"area_name": "广东省"
	},
	{
		"area_id": "19",
		"area_name": "海南省"
	},
	{
		"area_id": "20",
		"area_name": "四川省"
	},
	{
		"area_id": "21",
		"area_name": "贵州省"
	},
	{
		"area_id": "22",
		"area_name": "云南省"
	},
	{
		"area_id": "23",
		"area_name": "陕西省"
	},
	{
		"area_id": "24",
		"area_name": "甘肃省"
	},
	{
		"area_id": "25",
		"area_name": "青海省"
	},
	{
		"area_id": "26",
		"area_name": "黑龙江省"
	},
	{
		"area_id": "27",
		"area_name": "西藏自治区"
	},
	{
		"area_id": "28",
		"area_name": "内蒙古自治区"
	},
	{
		"area_id": "29",
		"area_name": "广西壮族自治区"
	},
	{
		"area_id": "30",
		"area_name": "宁夏回族自治区"
	},
	{
		"area_id": "31",
		"area_name": "新疆维吾尔自治区"
	},
	{
		"area_id": "32",
		"area_name": "香港"
	},
	{
		"area_id": "33",
		"area_name": "澳门"
	},
	{
		"area_id": "34",
		"area_name": "台湾"
	}
];


var qQuery = new Query({container:$("#listWrap")});
var sSearch = new Search({ container : $("#searchWrap")});
//var sSelected = new Selected({container:$("#seledUl")})
var Main = RichBase.extend({
	statics : {},
	EVENTS : {
		"click" : {
			".topUl" : "onTopUlClick",
			".list_data .yujbtn" : "onSetSelected"
		}
	},
	init : function(opt){
		var that = this;
		this.container = opt.container;
		this.prevBtn = $("#prevPageBtn");
		this.nextBtn = $("#nextPageBtn");
		sSearch.on("search",function(opt){
			that.prevBtn.addClass("disable");
			$("#whichPageNum").text(1)
			qQuery.setCurPage(0);
			qQuery.setData();
			qQuery.query(opt);
		});
		qQuery.on("no_next",function(res){
			that.nextBtn.addClass("disable");
		});
		qQuery.on("has_next",function(res){
			that.nextBtn.removeClass("disable");
		});
		qQuery.on("query_nexta",function(last){
			$(".checkbox_local").attr("checked",false);
			$(".checkbox_local").attr("da","0");
			$(".checkbox_local").attr("data-y",null);
			var searchData = sSearch.getData();
			//console.log(searchData.province)
			qQuery.query({
				province : searchData.province,
				city : searchData.city,
				title : searchData.title,
				supplier : searchData.supplier,
				last : last
			})
		});
		qQuery.on("query_ago",function(last){
			var searchData = sSearch.getData();
			qQuery.query({
				city : searchData.city,
				province : searchData.province,
				title : searchData.title,
				supplier : searchData.supplier,
				last : last
			})
		});
		qQuery.query();
		$(".prevBtn").attr("data-last","");
	},


	onSetSelected : function(that,e){
		var target = $(e.currentTarget);
		var parent = target.parent();
		var yucln = e.target.className;
		var lid_pid = target.attr("data-pid");
		var aid = target.attr("data-id");
		var active = target.attr("data-active");
		//var lid_pid = parent.children("[name=lid_pid]").val();
		//if(target.attr("checked")){
		if(yucln == "yujbtn onyuj"){  // 清
			sData.set(lid_pid,aid,{
				active : 0
			},function(data){
				//sSelected.render(data);
				//console.log(data);
			});
		}else{
			sData.set(lid_pid,aid,{
				active : 1
			},function(data){
				//console.log(data);
				//sSelected.render(data);
			})
		}
	},
	onTopUlClick : function(that,e){
		var tarTop = $(e.currentTarget);
		var p = tarTop.parent();
		var botW = tarTop.next();
		if(p.hasClass("selected")){
			botW.slideToggle(function(){
				p.toggleClass("selected");
			});
		}else{
			p.toggleClass("selected");
			botW.slideToggle();
		}
	}
});






$("#mlistUl").on("click",".set_check",function(e){
				var target = $(e.currentTarget);
				var checx_ = target.attr("data-x");
				var set_pllid = target.parents(".set_all_data").find('.allid').attr("data-pid");
				var set_allid = target.parents(".set_all_data").find('.allid').attr("data-aid");
				var set_lllid = target.parents(".set_all_data").find('.allid').attr("data-lid");
				if(checx_=="0"){
					var pa_l =set_pllid+"_"+set_allid;
					var aid = "aid["+pa_l+"]";
					var pid = "pid["+pa_l+"]";
					var lid = "lid["+pa_l+"]";
					target.parents(".set_all_data").find('.aid_').attr("name",aid);
					target.parents(".set_all_data").find('.aid_').val(set_allid);
					target.parents(".set_all_data").find('.pid_').attr("name",pid);
					target.parents(".set_all_data").find('.pid_').val(set_pllid);
					target.parents(".set_all_data").find('.lid_').attr("name",lid);
					target.parents(".set_all_data").find('.lid_').val(set_lllid);
					target.attr("data-x","1")
				}
				else{
					target.attr("data-x","0")
					target.parents(".set_all_data").find('.aid_').attr("name",null);
					target.parents(".set_all_data").find('.aid_').val(null);
					target.parents(".set_all_data").find('.pid_').attr("name",null);
					target.parents(".set_all_data").find('.pid_').val(null);
					target.parents(".set_all_data").find('.lid_').attr("name",null);
					target.parents(".set_all_data").find('.lid_').val(null);

				}
			})
			//大的选产品
			$("#mlistUl").on("click",".check_set",function(e){
				var target = $(e.currentTarget);
				var check_ = target.attr("data-y");
				var check_type = target.val()
				var active_list = target.parents(".check_body").find('.set_check');
				var active_set_all_data = target.parents(".check_body").find('.set_all_data');
				var set_allid = target.parents(".set_all_data").find('.allid').attr("data-pid");
				if(check_=="0"){
					$(active_list).each(function(){
						var che = $(this).attr("data-x");
						var aide = $(this).attr("data-aid");
						$(this).attr("checked","checked");
						$(this).attr("data-x","1");
						var num = $(this).attr("data-x");
						if(num=="1"){
								var set_pllid = $(this).parents(".set_all_data").find('.allid').attr("data-pid");
								var set_allid = $(this).parents(".set_all_data").find('.allid').attr("data-aid");
								var set_lllid = $(this).parents(".set_all_data").find('.allid').attr("data-lid");
									var pa_l =set_pllid+"_"+set_allid;
									var aid = "aid["+pa_l+"]";
									var pid = "pid["+pa_l+"]";
									var lid = "lid["+pa_l+"]";
									$(this).parents(".set_all_data").find('.aid_').attr("name",aid);
									$(this).parents(".set_all_data").find('.aid_').val(set_allid);
									$(this).parents(".set_all_data").find('.pid_').attr("name",pid);
									$(this).parents(".set_all_data").find('.pid_').val(set_pllid);
									$(this).parents(".set_all_data").find('.lid_').attr("name",lid);
									$(this).parents(".set_all_data").find('.lid_').val(set_lllid);
							}
						target.attr("data-y","1")

					})
				}
				else{
					$(active_list).each(function(){
						var che = $(this).val()
						target.attr("data-y","0")
						$(this).attr("checked",null);
						$(this).attr("data-x","0");
						var num = $(this).attr("data-x");
						if(num=="0"){
									$(this).parents(".set_all_data").find('.aid_').attr("name",null);
									$(this).parents(".set_all_data").find('.aid_').val(null);
									$(this).parents(".set_all_data").find('.pid_').attr("name",null);
									$(this).parents(".set_all_data").find('.pid_').val(null);
									$(this).parents(".set_all_data").find('.lid_').attr("name",null);
									$(this).parents(".set_all_data").find('.lid_').val(null);

							}
					})
				}
			})
			//本页全选
			$(".checkbox_local").click(function(e){
				var target = $(e.currentTarget);
				var check_da = target.attr("da");
				var active_ = $(".check_body").find('.set_check');
				if(check_da=="0"){
					$(".sethe").attr("checked","checked");
					$(".checkbox_all").attr("checked",null);
					$(".check_set").attr("data-y","1");
					target.attr("da","1");
					$(".checkbox_all").attr("ca","0");
					$(active_).each(function(){
						var che = $(this).attr("data-x");
						var aide = $(this).attr("data-aid");
						$(this).attr("checked","checked");
						$(this).attr("data-x","1");
						var num = $(this).attr("data-x");
						if(num=="1"){
								var set_pllid = $(this).parents(".set_all_data").find('.allid').attr("data-pid");
								var set_allid = $(this).parents(".set_all_data").find('.allid').attr("data-aid");
								var set_lllid = $(this).parents(".set_all_data").find('.allid').attr("data-lid");
									var pa_l =set_pllid+"_"+set_allid;
									var aid = "aid["+pa_l+"]";
									var pid = "pid["+pa_l+"]";
									var lid = "lid["+pa_l+"]";
									$(this).parents(".set_all_data").find('.aid_').attr("name",aid);
									$(this).parents(".set_all_data").find('.aid_').val(set_allid);
									$(this).parents(".set_all_data").find('.pid_').attr("name",pid);
									$(this).parents(".set_all_data").find('.pid_').val(set_pllid);
									$(this).parents(".set_all_data").find('.lid_').attr("name",lid);
									$(this).parents(".set_all_data").find('.lid_').val(set_lllid);
							}
						target.attr("data-y","1")

					})
				}
				else{
					$(".set_check").attr("data-x","0");
					$(".sethe").attr("checked",null);
					$(".checkbox_all").attr("checked",null);
					$(".check_set").attr("data-y","0");
					target.attr("da","0")
					$(".checkbox_all").attr("ca","0")
					$(active_).each(function(){
						var che = $(this).val()
						target.attr("data-y","0")
						$(this).attr("checked",null);
						$(this).attr("data-x","0");
						var num = $(this).attr("data-x");
						if(num=="0"){
									$(this).parents(".set_all_data").find('.aid_').attr("name",null);
									$(this).parents(".set_all_data").find('.aid_').val(null);
									$(this).parents(".set_all_data").find('.pid_').attr("name",null);
									$(this).parents(".set_all_data").find('.pid_').val(null);
									$(this).parents(".set_all_data").find('.lid_').attr("name",null);
									$(this).parents(".set_all_data").find('.lid_').val(null);

							}
					})
				}

			})

			//单独设置

			var h=$(window).height();
			var w=$(window).width();
			$("#mlistUl").on("click",".btn_choose",function(e){

				var target = $(e.currentTarget);
				var zhi = target.parents(".setalign_a").find(".annel").text();
				//console.log(zhi)
				var strs= new Array(); //定义一数组
				strs=zhi.split(","); //字符分割
				for (i=0;i<strs.length ;i++ )
				{
				//console.log(strs[i]); //分割后的字符输出
				}
				$(".dlc").each(function () {

					$(this).attr('checked',false);
				});
				$(".btn_sure").attr("id","btn_sure");
				var data_pid = $(this).attr("data-pid");
				target.parents(".setalign_a").find(".annel").addClass("chose_"+data_pid);
				$("#showpid").val(data_pid)
				$(".bgbox").css("display","block");
				$(".checkchoose_").css("display","block");
				$(".checkchoose_").animate({"top":200});
				$(".bgbox").css("height",h);
				$(".bgbox").css("width",w);

				var data_aid = $(this).attr("data-aid");
				var data_lid = $(this).attr("data-lid");
				$(".pidb").val(data_pid);
				$(".aidb").val(data_aid);
				$(".lidb").val(data_lid);
				var paid = $(".pidb").val();
				var aaid = $(".aidb").val();
				var laid = $(".lidb").val();
				var pa =paid+"_"+aaid;
				var aid = "aid["+pa+"]";
				var pid = "pid["+pa+"]";
				var lid = "lid["+pa+"]";
				$("#aidb").attr("name",aid);
				$("#aidb").val(aaid);
				$("#pidb").attr("name",pid);
				$("#pidb").val(paid);
				$("#lidb").attr("name",lid);
				$("#lidb").val(laid);

			$(".btn_cancels,.close_btn").one("click",function(){
				$(".checkchoose_").animate({"top":-200});
				$(".bgbox,.checkchoose_").css("display","none");
			    $(".btn_sure").attr("id",null);
				target.parents(".setalign_a").find(".annel").removeClass("chose_"+pid);

				});
			});
			//设置推荐度
			$("#mlistUl").on("click",".btn_edit",function(e){
				var divcss = {border: '1px solid #dcdcdc'};
				var inp = $(e.target);
				inp.parents(".secl").find(".setcolor_a").css("color","#f7f7f7;");
				inp.parents(".secl").find("#save_edit").show();
				inp.parents(".secl").find("#save_edit").css("color","#0797D9");
				inp.parents(".secl").find(".select_text").css(divcss);
				inp.parents(".secl").find(".select_text").animate({"width":27});
				$(this).removeClass("btn_edit");
				$(this).addClass("btn_cancel");
				$(this).text("取消");
			});
			$("#mlistUl").on("click",".btn_cancel",function(e){
				var divcss = {border: '0px solid #dcdcdc'};
				var inp = $(e.target);
				inp.parents(".secl").find(".setcolor_a").css("color","#F07845");
				inp.parents(".secl").find("#save_edit").css("color","#f7f7f7");
				inp.parents(".secl").find("#save_edit").hide();
				inp.parents(".secl").find(".select_text").css(divcss);
				inp.parents(".secl").find(".select_text").animate({"width":0});
				$(this).addClass("btn_edit");
				$(this).removeClass("btn_cancel");
				$(this).text("更改");
			});





			$("#btn_sure").live("click",function(){
				var postData = $("form#select_form").serialize();
				//console.log(postData)
				type_con = $("#type_type").val();
				if(type_con=="0"){
						var url = "call/jh_channels.php";
				}
				else{
					var url = "call/jh_channels.php";
				}
				$.ajax({
					type:'POST',url: url,data: postData, dataType:'json'
					//type:'POST',url: 'http://www.12301.cc/admin/pppp.php',data: postData, dataType:'json',
				}).done(function(res) {
					if(res.status=="success"){

						var pids_ = $("#showpid").val();
						PFT_GLOBAL.U.Alert("success",'<p style="width:120px">'+res.msg+'</p>');
						$(".chose_"+pids_).text(res.channel);
					}
					else{
						PFT_GLOBAL.U.Alert("fail",'<p style="width:120px">'+res.msg+'</p>');
						//alert(res.msg)
					}
				})
				$(".checkchoose_").animate({"top":-200});
				$(".bgbox,.checkchoose_").css("display","none");
			});



			//设置全部
			$("#serhBtnb").on("click",function(){
				var active_d = $(".check_body").find('.set_check');
				$(active_d).each(function(){
					var dnum = $(this).attr("data-x");
					if(dnum=="1"){
						$(this).parents(".set_all_data").find('.annel').addClass("chose_l");
						}
					else{
						$(this).parents(".set_all_data").find('.annel').removeClass("chose_l");
					}
				});
				$('.check').each(function () {
					$(this).attr('checked',false);
				});
				$(".btn_sure_all").attr("id","btn_sure_all");
				$(".bgbox").show();
				$("#checkchoose_box").show();

				$("#checkchoose_box").animate({"top":200});
				$(".bgbox").css("height",h);
				$(".bgbox").css("width",w);
			$(".btn_cancels,.close_btn").one("click",function(e){
				var active_d = $(".check_body").find('.set_check');
				$(active_d).each(function(){
						var dnum = $(this).attr("data-x");
						if(dnum=="1"){
							$(this).parents(".set_all_data").find('.annel').removeClass("chose_l");
							}
						else{
							$(this).parents(".set_all_data").find('.annel').addClass("chose_l");
						}

					})
				$(".btn_sure_all").attr("id",null);
				var target = $(e.currentTarget);

				$("#checkchoose_box").animate({"top":-200});
				$(".bgbox,#checkchoose_box").hide();
			});

			})
		$("#btn_sure_all").live("click",function(){
				var postData = $("form#select_all").serialize();
				//console.log(postData)
				type_con = $("#type_type").val();
				if(type_con=="0"){
						var url = "call/jh_channels.php";
				}
				else{
					var url = "call/jh_channels.php";
				}
				$.ajax({
					type:'POST',url: url,data: postData, dataType:'json'
					//type:'POST',url: 'http://www.12301.cc/admin/pppp.php',data: postData, dataType:'json',
				}).done(function(res) {
					if(res.status=="success"){
						PFT_GLOBAL.U.Alert("success",'<p style="width:120px">'+res.msg+'</p>');
						$(".chose_l").text(res.channel);
					}
					else{
						PFT_GLOBAL.U.Alert("fail",'<p style="width:120px">'+res.msg+'</p>');
						//alert(res.msg);

					}
				})
				$("#checkchoose_box").animate({"top":-200});
				$(".bgbox,#checkchoose_box").hide();

			});
			//});
			//全选
			$(".all_choose").click(function(){
				$(".selectlist .check").attr("checked",true);
			})
			//取消全选
			 $(".cancel_choose").click(function(){
				$(".selectlist .check").attr("checked",false);

			})
			//全选
			$(".all_choosec").click(function(){
				$(".selectlist .check").attr("checked",true);
			})
			//取消全选
			 $(".cancel_choosec").click(function(){
				$(".selectlist .check").attr("checked",false);

			})


















new Main({container:$("#mlistUl")});

