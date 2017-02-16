/**
 * Created by Administrator on 16-6-15.
 */
var Api = require("./api.js");
var Filter = require("./filter.js");
var List = RichBase.extend({
	trigger : null,
	AJAX_TIMEOUT : "请求超时，请稍后重试",
	AJAX_SERVERERROR : "请求出错，请稍后重试",
	loadingImg : 'http://www.12301.cc/images/icons/gloading.gif',
	init : function(opt){
		filter = new Filter();
		var self = this;
		this.container = $("#tbody");
	},
    
    /*开始*/
    getbankinfo : function(action,id){
        var that = this;
		if(id){
			//Api.getbank(action,id,{
			Api.getinfo(action,id,{
				loading : function(){
					that.render("loading");
				},
				removeLoading : function(){
					that.render("removeLoading");
				},
				success : function(res){
					var data = res.data;
                    //var data = res.data.account_info;
                    //如果是首次配置，显示默认值
                    //var default_config = res.data.default_config;
					that.setbankinfo(data);
				},
				empty : function(res){
					that.render("empty");
					$("#pagenavW").hide();
				},
				unlogin : function(res){
					that.render("unlogin");
				},
				fail : function(res){
					that.render("fail",res.msg);
					$("#pagenavW").hide();
				}
			})
		}
    },
    
    setbankinfo : function(date){
        var data = date.account_info;
        var default_config = date.default_config;
        var html ="";
        for(var i in data){
           var msg = data[i]["msg"];
           var status = data[i]["status"];
           var bank_name = data[i]['bank_name'];
           var account_name = data[i]['account_name'];
           var bank_account = data[i]['bank_account'];
           html += '<li class="bank  bank_'+i+'" type="'+i+'" status="'+status+'" msg="'+msg+'">';
           html += '<span class="curl" title="'+bank_name+'">'+'银行:'+bank_name+'</span>';
           html += '<span class="curl" title="'+bank_account+'">'+'账号:'+bank_account+'</span>';
           html += '<span class="curl" title="'+account_name+'">'+'户名:'+account_name+'</span>';
           html += ' </li>';
           $(".withaccount").html(html);
           
        }
        $(".bank").each(function(){
           var msg = $(this).attr("msg");
           var status = $(this).attr("status");
           if(status=="0"){
               $(this).html(msg);
               $(this).css("color","red");
               $(this).addClass("nocursor");
           }
        })
        var sureType = $("#sure").attr("type");  //0 代表未设置 填充默认值
        /*'service_fee'   : 5, //默认千分之五
          'reserve_money' : 200, //默认冻结多少钱
          'reserve_scale' : 20  //默认冻结的比例
        */
        if(sureType=="0"){
            var day = default_config.day;
            var month = default_config.month;
            var week = default_config.week;
            
            var dayservice_fee = day.service_fee;
            var dayreserve_money = day.reserve_money;
            var dayreserve_scale = day.reserve_scale; 
            
            var weekservice_fee = week.service_fee;
            var weekreserve_money = week.reserve_money;
            var weekreserve_scale = week.reserve_scale; 
            
            var monthservice_fee = month.service_fee;
            var monthreserve_money = month.reserve_money;
            var monthreserve_scale = month.reserve_scale;
            $("#CounterFee").val(monthservice_fee);
            $("#resetext").val(monthreserve_money);
            $(".dropWrap .dropBox li").click(function(){
                var type = $(this).attr("type");
                if(type){
                    if(type=="1"){
                        $("#CounterFee").val(dayservice_fee);
                        $("#resetext").val(dayreserve_money);
                    }else if(type=="2"){
                       $("#CounterFee").val(weekservice_fee);
                        $("#resetext").val(weekreserve_money);
                    }else{
                       $("#CounterFee").val(monthservice_fee);
                        $("#resetext").val(monthreserve_money);
                    }
                }
            })
        }
        
    },
    setStatus : function(action,params){
        var that = this;
		if(params){
			//Api.setStatus(action,params,{
			Api.getinfo(action,params,{
				loading : function(){
					//that.render("loading");
				},
				removeLoading : function(){
					//that.render("removeLoading");
				},
				success : function(res){
					var data = res.data;
					//that.setStatusinfo(data);
				},
				empty : function(res){
					that.render("empty");
					//$("#pagenavW").hide();
				},
				unlogin : function(res){
					//that.render("unlogin");
				},
				fail : function(res){
					//that.render("fail",res.msg);
					//$("#pagenavW").hide();
				}
				
				
			})
		}
        
    },
    getaccountinfo : function(action,params){
        var that = this;
		if(params){
			Api.getinfo(action,params,{
				loading : function(){
					//that.render("loading");
				},
				removeLoading : function(){
					//that.render("removeLoading");
				},
				success : function(res){
					var data = res.data;
					that.setaccount(data);
				},
				empty : function(res){
					//that.render("empty");
					$("#pagenavW").hide();
				},
				unlogin : function(res){
					//that.render("unlogin");
				},
				fail : function(res){
					//that.render("fail",res.msg);
					//$("#pagenavW").hide();
				}
				
				
			})
		}
    },
    
    upinfo : function(action,params){
        var that = this;
		if(params){
			Api.getinfo(action,params,{
				loading : function(){
				//	that.render("loading");
				},
				removeLoading : function(){
					//that.render("removeLoading");
				},
				success : function(res){
					var data = res.data;
					that.upinfosuccess(data);
				},
				empty : function(res){
					//that.render("empty");
					//$("#pagenavW").hide();
				},
				unlogin : function(res){
					//that.render("unlogin");
				},
				fail : function(res){
                    var res = res.msg;
					PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">'+res+'</p>');
					
				}
				
				
			})
		}
    },
    
    upinfosuccess : function(){
        PFT_GLOBAL.U.Alert("success",'<p style="width:340px">数据保存成功</p>');
        $("#mask").hide();
        $(".alertbox").hide();
        setTimeout(function () { 
           location.reload();
        }, 500);
    },
    
    
    
    // "id" : "18", // 记录ID
    // "fid" : "4971", // 账号ID
    // "mode" : "1", // 自动清分模式，1=日结，2=周结，3=月结
    // "freeze_type" : "1", // 资金冻结类型，1=冻结未使用的总额，2=按比例冻结
    // "service_fee" : "5", // 提现手续费百分比例
    // "close_time" : "1", // 具体的清算时间
    // "close_date" : "21", // 周结和月结模式中的清算日期，周结=1-7，月结=1-31
    // "transfer_date" : "31", // 月结模式中清分日期
    // "transfer_time" : "0", // 月结模式中清分时间
    // "status" : "on", // 状态 on=可用，off=不可用
    // "update_time" : "1465809070", // 记录更新的时间戳
    // "account_no" : "1", // 银行账户序号，1或2
    // "money_type" : "1", // 资金冻结详情类别：1=比例，2=具体金额  - freeze_type=2的时候才有
    // "money_value" : "20", // 冻结具体金额值或是比例 - freeze_type=2的时候才有
    // "last_settle_time" : "1465809070", // 最后一次清分时间戳，如果没有的话，返回空
    setaccount : function(data){
        var that = this;
        var status = data.status;                               // 状态 on=可用，off=不可用
        var mode = data.mode;                                   // 自动清分模式，1=日结，2=周结，3=月结
        var service_fee = parseInt(data.service_fee);           // 提现手续费百分比例
        var money_type = data.money_type;                       // 资金冻结详情类别：1=比例，2=具体金额
        var freeze_type = data.freeze_type;                     // 资金冻结类型，1=冻结未使用的总额，2=按比例冻结
        var money_value = data.money_value;                     // 冻结具体金额值或是比例 - freeze_type=2的时候才有
        var last_settle_time = data.last_settle_time;           // 最后一次清分时间戳，如果没有的话，返回空
        var close_time = data.close_time;                       // 具体的清算时间
        var close_date = data.close_date;                       // 周结和月结模式中的清算日期，周结=1-7，月结=1-31
        var account_no = data.account_no;                       // 银行账户序号，1或2
        var id = data.id;                                       // 记录ID
        var fid = data.fid;                                     // 账号fid
        var cut_way = data.cut_way;                                     // 账号fid
        $("#sure").attr("data-id",id);
        $("#sure").attr("data-fid",fid);
        if(status=="on"){
            $("#open").removeClass("close");
        }else{
            $("#open").addClass("close");
        }
        if(cut_way=="1"){
            $("#cutaccount").addClass("active");
            $("#cutmoney").removeClass("active");
        }else{
            $("#cutaccount").removeClass("active");
            $("#cutmoney").addClass("active");
        }
        if(mode=="1"){
            $("#manner").html("日结");
            $("#manner").attr("type","1");
            $("#ddaystime").html(close_time);
            $(".days").find(".selected").attr("in",close_time);
        }else if(mode=="2"){
            $("#manner").html("周结");
            $("#manner").attr("type","2");
            $(".days").hide();
            $(".week").show();
            $(".mouth").hide();
            $(".week").find(".selected").attr("in",close_time);
            $("#daystime").html(close_time);
            that.setweek(close_date);
        }else{
            $("#manner").html("月结");
            $("#manner").attr("type","3");
            $(".days").hide();
            $(".week").hide();
            $(".mouth").show();
            $(".mouth").find(".selected").attr("in",close_time);
            $("#mdaytime").html(close_time);
            $("#mouthtime").html(close_date);
        }
        $("#CounterFee").val(service_fee);
        
        if(last_settle_time=="0"){
            $(".timespan").html("无");
        }else{
            $(".timespan").html(that.getLocalTime(last_settle_time));
        }
        if(freeze_type=="1"){
            $(".sitds").removeClass("active");
            $("#notused").addClass("active");
        }else{
            $(".sitds").removeClass("active");
            if(money_type=="1"){
                $("#Reserve").addClass("active");
                $("#Reservetext").val(money_value);
            }else{
                $("#reservation").addClass("active");
                $("#resetext").val(money_value);
            }
        }
        setTimeout(function () { 
            if(account_no=="1"){
                $(".bank").removeClass("acborder");
                $(".bank_1").addClass("acborder");
            }else{
                $(".bank").removeClass("acborder");
                $(".bank_2").addClass("acborder");
            }
        }, 500);
        
    },
    
    
    
    getLocalTime : function (nS) { 
       return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
    },
    setweek : function(data){
        $(".weekdate").removeClass("active");
        if(data=="1"){
            $("#one").addClass("active");
        }else if(data=="2"){
            $("#two").addClass("active");
        }else if(data=="3"){
            $("#three").addClass("active");
        }else if(data=="4"){
            $("#four").addClass("active");
        }else{
            $("#five").addClass("active");
        }
        
        
    },
    /*结束*/
	
	render : function(type,data){
		var tpl = $("#listTpl").html();
		var container = $("#listtpl");
		if(type=="success"){
			var template = _.template(tpl);
			var btime = data.btime;
			var etime = data.etime;
			var data = data.list;
			$("#txtStartTime").val(btime);
			$("#txtEndTime").val(etime);
			container.html(template({data:data}));
            $(".dmoneytype").each(function(){
                var type = $(this).attr("type");
                if(type=="1"){
                    $(this).css("color","green");
                }else{
                    $(this).css("color","red");
                }
            })
			var checkadmin = $("#mlistUl").attr("type");
			if(checkadmin=="1"){
				$(".admin").show();
			}else{
				$(".admin").hide();
			}

		}else if(type=="loading"){
			$("#listtpl").hide();
			$("#pagenavW").hide();
			$(".loadgif").show();
			$(".imggif").attr("src","http://www.12301.cc/images/icons/gloading.gif");
			$(".loadmsg").html("数据加载中...");
		}else if(type=="removeLoading"){
			$("#listtpl").show();
			$("#pagenavW").show();
			$(".loadgif").hide();
		}else if(type=="unlogin"){
			$("#listtpl").hide();
			$("#pagenavW").hide();
			$(".loadgif").show();
			$(".imggif").attr("src","http://static.12301.cc/images/failicong.png");
			var url = "<a href='dlogin_n.html'>请重新登陆</a>"
			$(".loadmsg").html("登录状态已过期，"+url);
		}else if(type=="empty"){
			$("#listtpl").hide();
			$("#pagenavW").hide();
			$(".loadgif").show();
			$(".imggif").attr("src","http://static.12301.cc/images/failicong.png"); 
			$(".loadmsg").html("无数据");
		}else if(type=="fail"){
			$("#listtpl").hide();
			$("#pagenavW").hide();
			$(".loadgif").show();
			$(".imggif").attr("src","http://static.12301.cc/images/failicong.png");
			$(".loadmsg").html(data);
		}
	}
});
module.exports = List;