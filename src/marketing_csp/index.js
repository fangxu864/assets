require("./index.scss");
var Select = require("COMMON/modules/select");
var STip = require("COMMON/js/util.simple.tip");
var Datepicker = require("COMMON/modules/datepicker");
var Fileupload =require("COMMON/modules/fileupload");
var ListTpl = require("./index.xtpl");
var Main = PFT.Util.Class({
	container: "#bodyContainer",
	EVENTS: {
		"click #typeBox label": "changeShareType",
		"focus #couponNumber": "checkCouponNum",
		"click .inp-date":"initDatePicker"
	},
	init: function () {
		STip("success", "加载成功");
		this.initPage();
		this.datepicker = new Datepicker();

		



	},
	
	//初始化页面显示
	initPage: function () {
		var _this = this;
		var urlParams = PFT.Util.UrlParse();
		var spid = urlParams["did"] || "";
		var CalendarCore = Datepicker.CalendarCore;
		var date = CalendarCore.gettoday() + " ";
		var emptyData = {
			title: "",
			share_type: "1",
			coupon_id: "",
			relation_pid: "",
			content: "",
			image_path: "",
			red_pack_money: "0",
			mkid: "",
			beginDate: "",
			endDate: "",
			only_member: "0"
		};

		if (spid.length < 1) {
			_this.renderActivityPage(emptyData);
			console.log(emptyData["beginDate"])
		} else {
			_this.getSpidActivity(spid);

		}
		

	},
	//初始化富文本编辑器
	initUeditor: function (id) {
		window.UEDITOR_CONFIG.initialFrameWidth = 600;
		ue = UE.getEditor('content_' + id);
	},
	//初始化日历
	initDatePicker: function (e) {
		var datepicker = this.datepicker;
        var tarInp = $(e.currentTarget);
        var CalendarCore = Datepicker.CalendarCore;
        var date = tarInp.val();
        var time = tarInp.hasClass("begin") ? "00:00" : "23:00";
        if(!date){
            date = CalendarCore.gettoday() + " " + time;
        }
			console.log(date,time)
        datepicker.show(date,{
            picker : tarInp,              //必选
            top : 0,                     //可选，相对偏移量
            left : 0,                    //可选，相对偏移量
            todayBeforeDisable : false,  //可选，今天之前的日期都不显示
            todayAfterDisable : false    //可选，今天之后的日期都不显示
        })

	},
	//初始化图片上传插件
	initImgUpload: function(){
		var uploader = new Fileupload({
            container : '#imgUploadWrap',
            id        : 1,  //唯一
            extra     : { identify: "coupon" },
            action    : '/r/Resource_ImageUpload/upload',
            loading   : function(formControls){
                	PFT.Util.STip("success",'<p style="width:160px;">正在上传图片,请稍后</p>',4000);
            },
            complete  : function(res){
                if( res.code == 200 ) {
                    $('#imagePath').attr({"src": res.data.src,"data-path":res.data.src} ).css({"width":"240px","height":"160px"});;
                    PFT.Util.STip("success",'<p style="width:160px;">上传图片成功</p>');
                } else {
                    PFT.Util.STip("fail",'<p style="width:220px;">' + res.msg + '</p>');
                }
            }
        });

		var uploader_2 = new Fileupload({
            container : '#imgUploadWrap_2',
            id        : 2,  //唯一
            extra     : { identify: "coupon" },
            action    : '/r/Resource_ImageUpload/upload',
            loading   : function(formControls){
					PFT.Util.STip("success",'<p style="width:160px;">正在上传图片,请稍后</p>',4000);
            },
            complete  : function(res){
               
                if( res.code == 200 ) {
                    $('#imagePath_2').attr({"src": res.data.src,"data-path":res.data.src} ).css({"width":"240px","height":"160px"});
                    PFT.Util.STip("success",'<p style="width:160px;">上传图片成功</p>');
                } else {
                    PFT.Util.STip("fail",'<p style="width:220px;">' + res.msg + '</p>');
                }
            }
        });


	},
	//根据spid获取活动详细
	getSpidActivity: function (spid) {
		var _this = this;
		PFT.Util.Ajax('/r/product_Coupon/marketingListSp', {
			type: 'POST',
			dataType: 'JSON',
			params: {
				spid: spid
			},
			success: function (res) {
				if (res.code == 200) {
					_this.renderActivityPage(res.data.data[0]);

				} else {
					STip("fail", res.msg);
				}
			},
			fail: function () {
				STip("fail", res.msg);
			}
		})
	},
	//时间戳转换
	formatTimeStamp: function (timestamp) {
		var date = new Date(timestamp * 1000);
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes();
		
		var dateTime = Y + M + D + h + m ;
		return dateTime;
	},
	//渲染活动页面
	renderActivityPage: function (data) {
		var _this = this;
		var render = PFT.Util.ParseTemplate(ListTpl);
		var html = "";
		
		var beginDate = data.activity_bt ? _this.formatTimeStamp(data.activity_bt) : "";
		var endDate =data.activity_et ? _this.formatTimeStamp(data.activity_et) : "";
		data["beginDate"] = beginDate;
		data["endDate"] = endDate;
		html = render({ data: data });
		_this.container.html(html);
		_this.initUeditor(1);//初始化默认富文本编辑器
		_this.initUeditor(2);
		_this.getActivityList();//初始化活动产品
		_this.initGetCouponId("couponId");//初始化获取优惠券列表
		_this.initGetCouponId("couponIdInp");
		_this.initImgUpload();//初始化图片上传插件
	},
	//切换分享类型
	changeShareType: function (e) {
		var _this = this;
		var tarLabel = $(e.currentTarget);
		var tarRadio = tarLabel.children(".inp-r");
		if (tarRadio.prop("checked")) return false;
		var tarNum = tarRadio.attr("value");
		$("#share_type_" + tarNum).show().siblings(".share_type").hide();

	},
	//获取产品列表
	getActivityList: function () {
		var select = new Select({
			source: "/r/product_Coupon/getProducts",
			ajaxType: "POST",
			ajaxParams: {
			},
			isFillContent: false,
			filterType: "ajax",  //指定过滤方式为ajax
			field: {
				id: "id",
				name: "title",
			},
			trigger: $("#schProInp"),
			filter: false,
			adaptor: function (res) {
				$(".selectOptionUl").css("padding-left", 0);
				var result = { code: 200 };
				var list = res.data;
				if (!list) {
					return result;
				}

				var newList = [];
				for (var i = 0; i < list.length; i++) {

					newList.push({
						id: list[i].fid,
						title: list[i].ltitle
					});
				}
				//console.log(newList)
				result["data"]=newList;
				return result;
			},
		});
	},
	//获取优惠券id 初始化富文本编辑器
	initGetCouponId: function (id) {
		var selectId = new Select({
			source: "/r/product_Coupon/getCoupon",
			ajaxType: "POST",
			ajaxParams: {
			},
			isFillContent: false,
			filterType: "ajax",  //指定过滤方式为ajax
			field: {
				id: "id",
				name: "title",
			},
			trigger: $("#" + id),
			filter: false,
			adaptor: function (res) {
				$(".selectOptionUl").css("padding-left", 0);
				var result = { code: 200 };
				var list = res.data.data;
				if (!list) {
					return result;
				}

				var newCouList = [];
				for (var i = 0; i < list.length; i++) {

					newCouList.push({
						id: list[i].pid,
						title: list[i].coupon_name
					});
				}
				// console.log(newList)
				result["data"]=newCouList;
				return result;
			},
		});
	},
	//票券张数输入时选中radio
	checkCouponNum: function () {
		$("#couponNumRadio").prop("checked", true);
	},
	//保存新增优惠活动
	saveAddNewActivity: function(){

	},

})

$(function () {
	new Main();
})
/*
jQuery(document).ready(function($){
	var did = $("#did").val();
	function date(format, timestamp){   
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());  
        var pad = function(n, c){  
            if((n = n + "").length < c){  
                return new Array(++c - n.length).join("0") + n;  
            } else {  
                return n;  
            }  
        };  
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];  
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};  
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
		var f = {  
				d: function(){return pad(f.j(), 2)},  
				D: function(){return f.l().substr(0,3)},  
				j: function(){return jsdate.getDate()},  
				l: function(){return txt_weekdays[f.w()]},  
				N: function(){return f.w() + 1},  
				S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},  
				w: function(){return jsdate.getDay()},  
				z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},  
				W: function(){  
					var a = f.z(), b = 364 + f.L() - a;  
					var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;  
					if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){  
						return 1;  
					} else{  
						if(a <= 2 && nd >= 4 && a >= (6 - nd)){  
							nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");  
							return date("W", Math.round(nd2.getTime()/1000));  
						} else{  
							return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);  
						}  
					}  
				},  
				F: function(){return txt_months[f.n()]},  
				m: function(){return pad(f.n(), 2)},  
				M: function(){return f.F().substr(0,3)},  
				n: function(){return jsdate.getMonth() + 1},  
				t: function(){  
					var n;  
					if( (n = jsdate.getMonth() + 1) == 2 ){  
						return 28 + f.L();  
					} else{  
						if( n & 1 && n < 8 || !(n & 1) && n > 7 ){  
							return 31;  
						} else{  
							return 30;  
						}  
					}  
				},  
				L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},  
				Y: function(){return jsdate.getFullYear()},  
				y: function(){return (jsdate.getFullYear() + "").slice(2)},  
				a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},  
				A: function(){return f.a().toUpperCase()},  
				B: function(){  
					var off = (jsdate.getTimezoneOffset() + 60)*60;  
					var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;  
					var beat = Math.floor(theSeconds/86.4);  
					if (beat > 1000) beat -= 1000;  
					if (beat < 0) beat += 1000;  
					if ((String(beat)).length == 1) beat = "00"+beat;  
					if ((String(beat)).length == 2) beat = "0"+beat;  
					return beat;  
				},  
				g: function(){return jsdate.getHours() % 12 || 12},  
				G: function(){return jsdate.getHours()},  
				h: function(){return pad(f.g(), 2)},  
				H: function(){return pad(jsdate.getHours(), 2)},  
				i: function(){return pad(jsdate.getMinutes(), 2)},  
				s: function(){return pad(jsdate.getSeconds(), 2)},  
				O: function(){  
					var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);  
					if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;  
					return t;  
				},  
				P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},  
				c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},  
				U: function(){return Math.round(jsdate.getTime()/1000)}  
			};  
              
        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){  
            if( t!=s ){  
                ret = s;  
            } else if( f[s] ){  
                ret = f[s]();  
            } else{   
                ret = s;  
            }  
            return ret;  
        });  
    }  
	
	if(did){	
		var data = {
			action : "marketing_list_sp",
			spid:did
			};
			
		var url = "http://s.12301.cc/pft/marketing/marketing.php";
			PFT.Ajax({
				url : url,
				type : "GET",  
				dataType : "json",
				data : data
			},function(res){ 
			
				var data = res.data;
				for(var i in data){
					var activity_bt = data[i]["activity_bt"];
					var activity_et = data[i]["activity_et"];
					var title = data[i]["title"];
					var share_type = data[i]["share_type"]; //分享赠送类型：1 分享送优惠券 2 分享送红包 3 购买即送
					var only_member = data[i]["only_member"]; //限会员卡用户：0 不限 1 仅限会员卡
					var coupon_id = data[i]["coupon_id"]; //优惠券id
					var coupon_num = data[i]["coupon_num"]; //优惠券赠送张数 -1 随票数  >= 0 固定
					var relation_pid = data[i]["relation_pid"]; //活动产品id
					var content = data[i]["content"]; //富文本框
					var image_path = data[i]["image_path"]; //图片地址
					var red_pack_money = data[i]["red_pack_money"]/100; //红包金额
					var mkid = data[i]["mkid"]; //mkid
					$("#alliNameInp").val(title); 
					$("#txtStartTime").val(date('Y-m-d H:i:s',activity_bt));
					$("#txtEndTime").val(date('Y-m-d H:i:s',activity_et));
					if(share_type=="1"){
						
						$(".a1").attr("checked","checked");
						$(".share_type_dis").hide();
						$("#share_type_1").show();
						$(".share").show();
						$("#imgUpload_form").show();
						$(".pa_coupon").val("1");
						$("#coupon_num").val(coupon_num);
						$("#coupon_num_id").val(coupon_num);
						$("#search_l").val(coupon_id);
						$(".coupon_id").val(coupon_id);
						checkCoupon(coupon_id);
						
					}
					if(share_type=="2"){
						$(".a2").attr("checked","checked");
						$(".share_type_dis").hide();
						$("#share_type_2").show();
						$(".share").show();
						$("#imgUpload_form").show();
						$(".pa_coupon").val("2");
					}
					if(share_type=="3"){
						$(".a3").attr("checked","checked");
						$("#share_type_1").hide();
						$("#share_type_3").show();
						$(".prodList_li,.prodList").hide();
						if(coupon_num=="-1"){ 
							$("#coupon_num_id").val(coupon_num);
							$(".up_num_3").attr("checked","checked");
							$(".pa_coupon").val("-1");
							
						}else{
							$(".pa_coupon").val("3");
							$("#coupon_num_t").val(coupon_num);
							$("#coupon_num_id").val(coupon_num);
							$(".up_num_4").attr("checked","checked");
						}
						checkBoupon(coupon_id);
						$("#search_li").val(coupon_id);
						$(".share").hide();
						$("#imgUpload_form").hide();
						
						$(".coupon_id").val(coupon_id);
						$("#relation_pid").val(relation_pid)
						checkTicket(relation_pid)
					}
					if(only_member=="0"){
						$(".a4").attr("checked","checked");
						$(".a5").attr("checked",null);
					}else{
						$(".a4").attr("checked",null);
						$(".a5").attr("checked","checked");
					}
					//setTimeout(function () { 
						$("#content").html(content);
					//}, 10);
					
					$("#discount_img").attr("src",image_path);
					$("#showimgPathInp").val(image_path);
					$("#red_pack_money").val(red_pack_money);
					$("#mkid").val(mkid);
						
				
				}

			});
	}else{
		//return false;
		
	}
	
})
	function checkTicket(pid){
		var fid = $("#fid").val();
			data ={
				fid : fid
			}
		PFT.Ajax({			//活动产品
			url : "saleProds.php", 
			type : "post",
			data : data,
			dataType : "json",
		},function(res){
			var list = res.lists;
			for(var i=0;i<list.length;i++){
				//console.log(list[i].pid)
				if(list[i].pid== pid){
					$("#search").val(list[i].ltitle+"-"+list[i].ttitle)
				}
			//$("#prodList").append("<li class='lis' data="++">"+list[i].ltitle+"-"+list[i].ttitle+"</li>");
		}
		})
	}
		
	
		
	function checkCoupon(pid){	
		var fid = $("#fid").val();
			data ={
				fid : fid
			}
		PFT.Ajax({			//优惠券
			url : "coupon.php", 
			type : "post",
			data : data, 
			dataType : "json",
		},function(res){
			var list = res.list;
			if(list==null){
				console.log("您尚未配置优惠券请先配置优惠券")
			}else{
				
				for(var i=0;i<list.length;i++){
					if(list[i].id== pid){
						$("#search_l").val(list[i].coupon_name)
					}
					//$("#prodList_l").append("<li data="+list[i].id+">"+list[i].coupon_name+"</li>");
				}
			}
		})
	}
	
	function checkBoupon(pid){	
		var fid = $("#fid").val();
			data ={
				fid : fid
			}
		PFT.Ajax({			//优惠券
			url : "coupon.php", 
			type : "post",
			data : data, 
			dataType : "json",
		},function(res){
			var list = res.list;
			if(list==null){
				
			}else{
				
				for(var i=0;i<list.length;i++){
					if(list[i].id== pid){
						$("#search_li").val(list[i].coupon_name)
					}
					//$("#prodList_l").append("<li data="+list[i].id+">"+list[i].coupon_name+"</li>");
				}
			}
		})
	}









    jQuery(document).ready(function($){
        var ue, rend_text_area;
        window.UEDITOR_CONFIG.initialFrameWidth = 640;
        rend_text_area = $("#content");
        ue = UE.getEditor('content');
        $("input[name=share_type]").live('click', function(){
            var val = $(this).val();
			$(".pa_coupon").val(val)
			//if(val=="1"){
				$(".share_type_dis").hide();
				$("#share_type_"+val).show();
			//}
			$(".share").show();
			$("#imgUpload_form").show();
			if(val=="3"){
				$(".prodList_li,.prodList").hide();
				$(".share").hide();
				$("#imgUpload_form").hide();
			}
            
        });
		$("input[name=coupon_]").live('click', function(){
            var ti = $(this).attr("ti");
			//console.log(ti)
			if(ti=="-1"){
				 $(".pa_coupon").val("-1");
			}else if(ti=="2"){
				$(".pa_coupon").val("3");
			}
        });
        $("#txtStartTime").bind("click focus", function () {
            var endtimeTf = $dp.$('txtEndTime');
            WdatePicker({ 
                maxDate: '#F{$dp.$D(\'txtEndTime\')}',
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                onpicked: function () { endtimeTf.focus(); }
            });
        });
        $("#txtEndTime").bind("click focus", function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'txtStartTime\')}',
                dateFmt: "yyyy-MM-dd HH:mm:ss"
            });
        });
        //保存营销活动信息
        $("button#saveProduct").live('click',function(){
			var pa = $(".pa_coupon").val();
			if(pa=="1"){
				$("#coupon_num_id").val($(".up_num_1").val());
			}else if(pa=="2"){
				
				$("#coupon_num_id").val(null);
			}else if(pa=="3"){
				$("#coupon_num_id").val($(".pon_num").val())
				
				
			}else if(pa=="-1"){
				$("#coupon_num_id").val("-1");
				
			}
			console.log($("#coupon_num_id").val())
			var alliNameInp = $("#alliNameInp").val();
			var txtStartTime = $("#txtStartTime").val();
			var txtEndTime = $("#txtEndTime").val();
			if(!alliNameInp){
				alert("抱歉活动名称不能为空");
				return false;
			}
			if(!txtStartTime || !txtEndTime){
				alert("抱歉时间不能为空");
				return false;
			}
            rend_text_area.val(ue.getContent());
            var postData = $("form#mainForm").serialize(),
                that     = $(this),
                btnTxt   = that.text();
            $.ajax({
              type:'POST',url: 'marketing.php',data: postData, dataType:'json',
              //type:'POST',url: 'pppp.php',data: postData, dataType:'json',
                beforeSend:function(){
                    that.text('保存中...').attr('disabled','disabled');
                }, 
                timeout: 10000})
                .done(function(result){

                    if(result.code=='200') {
                        alert(result.msg);
                        window.parent.frames.location.href="http://www.12301.cc/marketing_share_list.html"; 
                    } else{
                        alert(result.msg);
                    }
                    that.text(btnTxt).removeAttr('disabled');
                })
                .error(function(XMLHttpRequest, textStatus, errorThrown) {
                    that.text(btnTxt).removeAttr('disabled');
                    if(textStatus == 'timeout') {
                        alert("请求已经超时,保存失败");
                    } else {
                        alert("其他错误,保存失败。");
                    }
                });
        });
        //图片上传
        $("#BtnUpload").bind('click',function(){
            if(!$("input#imgup").val().length) return;
            $("#upload_mth").val("0");
            $("form#mainForm").submit();
            $("#waitingUpload").html('<img src="images/loading.gif" alt="图片上传中"/>图片上传中..').show();
        });
		
		
		
		var fid = $("#fid").val();
				data ={
					fid : fid
					
				}
		PFT.Ajax({			//活动产品
			url : "saleProds.php", 
			type : "post",
			data : data,
			dataType : "json",
		},function(res){
				list.list_search(res); 
		})
		
		PFT.Ajax({			//优惠券
			url : "coupon.php", 
			type : "post",
			data : data, 
			dataType : "json",
		},function(res){
			var list = res.list;
			if(list==null){  
				if(confirm("您尚未配置优惠券是否跳转配置优惠券"))
					//window.open("http://www.12301.cc/publish_manage.html");
					window.top.location.href='http://www.12301.cc/publish_manage.html';
					//window.parent.document.getElementById("inIframe").src=hrefVal
				else
				return false;
				//console.log("您尚未配置优惠券请先配置优惠券")
			}else{
				list_li.list_search_li(res);
			}
				 
		})
		

		PFT.Ajax({			//优惠券
			url : "coupon.php", 
			type : "post",
			data : data, 
			dataType : "json",
		},function(res){
				list_l.list_search_l(res); 
		})
		
    });
	
	$("#search").keyup(function(){	
			$("prodList").show();
			$(".prodList_li").hide();
			var sth=$('#search').val();
			var i=0;
			$("#prodList li").each(function(){
				var n=$(this).text().indexOf(sth);
				if(n==-1){
					$(this).css("display","none");
					
				}else{
					i+=1
					$(this).css("display","block");
					$(".prodList_li li").hide();
				}
			});
			if(i==0){
				$("#prodList").css("display","none");
			}else{
				$("#prodList").css("display","block");
				$(".prodList_li").hide();
			} 
			
			
	})
	
	$("#search_li").keyup(function(){	
			$(".prodList_li").show();
			$(".prodList").hide();
			var sth=$('#search_li').val();
			var i=0;
			$("#prodList_li li").each(function(){
				var n=$(this).text().indexOf(sth);
				if(n==-1){
					$(this).css("display","none");
				}else{
					i+=1
					$(this).css("display","block");
					$(".prodList li").hide();
				}
			});
			if(i==0){
				$("#prodList_li").css("display","none");
			}else{
				$("#prodList_li").css("display","block");
				$(".prodList").hide();
			} 
	
	})
	$("#search_l").keyup(function(){	
			$(".prodList_l").show();
			$(".prodList").hide();
			var sth=$('#search_l').val();
			var i=0;
			$("#prodList_l li").each(function(){
				var n=$(this).text().indexOf(sth);
				if(n==-1){
					$(this).css("display","none");
				}else{
					i+=1
					$(this).css("display","block");
					$(".prodList li").hide();
				}
			});
			if(i==0){
				$("#prodList_l").css("display","none");
			}else{
				$("#prodList_l").css("display","block");
				$(".prodList").hide();
			} 
	
	})
	var list = (function(){
		function list_search(data){
		//list_search : function(data){
		var that = this;
		var list = data.lists;
		for(var i=0;i<list.length;i++){
			$("#prodList").append("<li class='lis' data="+list[i].pid+">"+list[i].ltitle+"-"+list[i].ttitle+"</li>");
		}
		$("#prodList li").eq(0).addClass("setbg");
		$("#prodList li").click(function(){
		
			$(".must_sec").css("display","none");
			var i=$(this).index();
			$("#search").val(list[i].ltitle);
			$("#relation_pid").val(list[i].pid);
			$("#prodList li").removeClass("setbg");
			$("#prodList li").eq(i).addClass("setbg");
			$("#prodList").css("display","none"); 
			$("#lid_id").val(list[i].pid);
			//var lid_b = list[i].id;
			//that.data_list(lid_b);
			$(".cleartxt").css("display","block");
		});
		$("#search").click(function(){
			if($("#prodList").css("display")=='block')
				$("#prodList").css("display","none");
				
			else
				$("#prodList").css("display","block");
				$(".tbBind").hide();
			});
		}
		return{
            list_search : list_search
        }
	})();
	
	var list_li = (function(){				//优惠券
		function list_search_li(data){
		//list_search : function(data){
		var that = this;
		var list = data.list;
		if(!list) return false;
		for(var i=0;i<list.length;i++){
			$("#prodList_li").append("<li class='lo' data="+list[i].id+">"+list[i].coupon_name+"</li>");
		}
		$("#prodList_li li").eq(0).addClass("setbg");
		$("#prodList_li li").click(function(){
		
			$(".must_sec").css("display","none");
			var i=$(this).index();
			$("#search_li").val(list[i].coupon_name);
			$(".coupon_id").val(list[i].id);
			$("#prodList_li li").removeClass("setbg");
			$("#prodList li").eq(i).addClass("setbg");
			$("#prodList_li").css("display","none"); 
			$("#lid_id").val(list[i].pid);
			$(".cleartxt").css("display","block");
		});
		$("#search_li").click(function(){
			if($("#prodList_li").css("display")=='block')
				$("#prodList_li").css("display","none");
				
			else
				$("#prodList_li").css("display","block");
				$(".tbBind").hide();
			});
		}
		return{
            list_search_li : list_search_li
        }
	})();
	
	
	var list_l = (function(){				//优惠券
		function list_search_l(data){
		//list_search : function(data){
		var that = this;
		var list = data.list;
		if(!list) return false;
		for(var i=0;i<list.length;i++){
			$("#prodList_l").append("<li data="+list[i].id+">"+list[i].coupon_name+"</li>");
		}
		$("#prodList_l li").eq(0).addClass("setbg");
		$("#prodList_l li").click(function(){
		
			$(".must_sec").css("display","none");
			var i=$(this).index();
			$("#search_l").val(list[i].coupon_name);
			$(".coupon_id").val(list[i].id);
			$("#prodList_l li").removeClass("setbg");
			$("#prodList_l li").eq(i).addClass("setbg");
			$("#prodList_l").css("display","none"); 
			$("#lid_id").val(list[i].pid);
			$(".cleartxt").css("display","block");
		});
		$("#search_l").click(function(){
			if($("#prodList_l").css("display")=='block')
				$("#prodList_l").css("display","none");
				
			else
				$("#prodList_l").css("display","block");
				$(".tbBind").hide();
			});
		}
		return{
            list_search_l : list_search_l
        }
	})();
	
    $("#submitImgUploadBtn").on("click",function(e){
        //var active = $("#imgDialog-tabNavCon").children(".active");
        ImgUpload.upload();
    })
    $("#imgUpload_inpFile").on("change",function(e){
        ImgUpload.onFileChange(e.currentTarget);
    })
    var ImgUpload = (function(){
        function onFileChange(inpFile){
            var path = inpFile.value;
            path = path.replace(/c:\\fakepath\\/gi,"");
            path.replace(/c:/ig,"");
            $("#imgUpload_fileVal").val(path);
        }
        function upload(){
            // $("#image-container").hide();
            onloading();
            $("#imgUpload_form").submit();
        }
        function onloading(){
            var loadingImg = "http://www.12301.cc/images/other/loading_1.gif";
            var html = '<div class="uploadResult loading"><div class="con"><img src="'+loadingImg+'"/><span class="text">正在上传图片...</span></div></div>';
            $("#uploadFailTip").hide();
            $("#uploadResultCon").html(html);
        }
        function onload(data){ //上传图片完成
            console && console.log("上传图片完成，未知是否成功");
            if(data.status == "ok" && data.key){
                console && console.log("上传图片成功");
                onSuccess(data);
            }else{
                console && console.log("上传图片失败");
                onFail(data)
            }
        }
        function onSuccess(data){
            var path = data.key;
            //var html = '<div class="ui-form-item"><div class="lnk_prv"><img src="'+path+'"/></div></div>';
            //$("#uploadResultCon").html(html);
            $("#discount_img").attr('src',path);
            $("#showimgPathInp").val(path);
            $("#uploadResultCon").hide();
            WXB.G.Alert("success",'<p style="width:150px;">上传图片成功</p>',2000)
        }
        function onFail(data){
            var img = '<img src="http://www.12301.cc/wx_public/images/nopic.jpg"  class="img-responsive img-thumbnail" width="150">';
            $("#uploadResultCon").html(img);
            $("#uploadFailTip").show();
            WXB.G.Alert("fail",'<p style="width:150px;">上传图片失败</p>')
        }
        return{
            onFileChange : onFileChange,
            upload : upload,
            onload : onload
        }

    })();
	
	window.c = function(e){
		var num =e.currentTarget.value;
		if(num>99999){
			alert("输入的数字过大请重新输入");
			$("#red_pack_money").val("");
			return false;
		}
		if(num<0){
			alert("输入的数字不能为负数请重新输入");
			$("#red_pack_money").val("");
			return false;
		}
	} 
	window.gh = function(e){
		var num =e.currentTarget.value;
		if(num>99999){
			alert("输入的数字过大请重新输入");
			$("#coupon_num").val("");
			return false;
		}
		if(num<0){
			alert("输入的数字不能为负数请重新输入");
			$("#coupon_num").val("");
			return false;
		}
	}

	
//	$(".pon_num").live("keyup",function(e){
		var num = $(e.currentTarget).val()
		if(num>99999){
			alert("输入的数字过大请重新输入");
			$("#coupon_num_t").val("");
			return false;
		} 
		if(num<0){
			alert("输入的数字不能为负数请重新输入");
			$("#coupon_num_t").val("");
			return false;
		}
		
		
	})

	
	
	$(".lo").each(function(e){
		var target = $(e.currentTarget);
			var se = target.attr("data");
			console.log(se)
			
			
		})
*/