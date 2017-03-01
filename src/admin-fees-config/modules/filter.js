/**
 * Created by banjin on 16-6-15.
 */
var Api = require("./api.js");
var Filter = RichBase.extend({
	EVENTS : {
			"click" : {
                "#close" : "close",
                "#sure" : "sure",
                ".bank" : "bank"
			}
		},
	init : function(){},
    close : function(){
        $("#mask").hide();
        $(".alertbox").hide();
        location.reload();
    },
    bank : function(that,e){
        var tarBtn = $(e.currentTarget);
        var status = tarBtn.attr("status");
        if(status=="0"){
            tarBtn.removeClass("acborder");
        }else{
            $(".bank").removeClass("acborder");
            tarBtn.addClass("acborder");
        }
    },
    sure : function(that,e){
        if(that.checksure()) return;
        var tarBtn = $(e.currentTarget);
        var type = tarBtn.attr("type");   //0 新配置 1 状态关闭 2 更新
        var data_id = tarBtn.attr("data-id");
        var data_fid = tarBtn.attr("data-fid");
        var data = that.getdata(type);
        if(type=="0"){
            var action = "add";
            var sougou = {
                "action" : action,
                "data" : data
            }
            that.fire("upBtn.click",sougou);
        }else{
            var action = "udpate";
            var sougou = {
                "action" : action,
                "data" : data
            }
            that.fire("upBtn.click",sougou);
        }
    },
    udpate : function(action,params){
        var that = this;
		if(params){
			Api.getinfo(action,params,{
				loading : function(){
					that.render("loading");
				},
				removeLoading : function(){
					that.render("removeLoading");
				},
				success : function(res){
					var data = res.data;
					that.setStatusinfo(data);
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
    // * id	int	记录ID
    // * mode	int	自动清分模式，1=日结，2=周结，3=月结
    // * freeze_type	int	资金冻结类型，1=冻结未使用的总额，2=按比例冻结
    // * close_date	int	周结和月结模式中的清算日期，周结=1-7，月结=1-31
    // * close_time	int	具体的清算时间
    // * transfer_date	int	月结模式中清分日期
    // * transfer_time	int	月结模式中清分时间
    // * account_no	int	银行账户的序号 1或2
    // * service_fee	float	提现手续费百分比例
    // * money_type	int	资金冻结详情类别：1=比例，2=具体金额
    // * money_value	float	自资金冻结详情数值：具体比例或是具体金额
    getdata : function(type){
        var that = this;
        var notuseda = $("#notused").hasClass("active");
        var cutaccount = $("#cutaccount").hasClass("active");  //选中 扣费方式账户余额1  否则从提现2扣
        if(cutaccount){
            var cut_way = "1";
        }else{
            var cut_way = "0";
        }
        if(type=="0"){
            var id = $("#sure").attr("data-fid");
        }else{
            var id = $("#sure").attr("data-id");
        }
        var mode = $("#manner").attr("type"),
            freeze_type = that.checkfreeze(),
            close_date = that.checkclose_data(mode),
            close_time = that.checkclose_time(mode),
            transfer_date = that.checkclose_data(3),
            transfer_time = that.checkclose_time(3),
            account_no = that.checkaccount_no(),
            service_fee = $("#CounterFee").val(),
            money_type = that.checkmoney_type(freeze_type),
            money_value = that.checkmoney_value(money_type);
            cut_way = cut_way;
        if(mode!="3"){
            if(notuseda){
                if(type=="0"){
                   var data ={
                        fid : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        cut_way : cut_way
                    } 
                }else{
                    var data ={
                        id : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        cut_way : cut_way
                    }
                }
            }else{
                if(type=="0"){
                   var data ={
                        fid : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        money_type : money_type,
                        money_value : money_value,
                        cut_way : cut_way
                    } 
                }else{
                    var data ={
                        id : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        money_type : money_type,
                        money_value : money_value,
                        cut_way : cut_way
                    }
                }
            }
        }else{
            if(notuseda){
                if(type=="0"){
                   var data ={
                        fid : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        transfer_date : transfer_date,
                        transfer_time : transfer_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        cut_way : cut_way
                    } 
                }else{
                    var data ={
                        id : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        transfer_date : transfer_date,
                        transfer_time : transfer_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        cut_way : cut_way
                    }
                }
            }else{
                if(type=="0"){
                   var data ={
                        fid : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        transfer_date : transfer_date,
                        transfer_time : transfer_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        money_type : money_type,
                        money_value : money_value,
                        cut_way : cut_way
                    } 
                }else{
                    var data ={
                        id : id,
                        mode : mode,
                        freeze_type : freeze_type,
                        close_date : close_date,
                        close_time : close_time,
                        transfer_date : transfer_date,
                        transfer_time : transfer_time,
                        account_no : account_no,
                        service_fee : service_fee,
                        money_type : money_type,
                        money_value : money_value,
                        cut_way : cut_way
                    }
                }
            }
        }
        
        
        
        
		return data;
    },
    checkfreeze : function(){
        var freeze = "";
        var notused = $("#notused").hasClass("active");
        if(notused){
            freeze = "1";
        }else{
            freeze = "2";
        }
        return freeze;
    },
    checkclose_data : function(type){
        var that = this;
        var data = "";
        if(type=="1"){
            data = "";
        }else if(type=="2"){
            data = that.checkweek();  
        }else{
            data = $("#mouthtime").html();            
        }
        return data;
    },
    checkclose_time : function(type){
        var time = "";
        if(type=="1"){
            time = $(".days").find(".etime").attr("in");
        }else if(type=="2"){
            time = $(".week").find(".etime").attr("in");
        }else{
            time = $(".mouth").find(".etime").attr("in");         
        }
        return time;
    },
    
    checkweek : function(){
        var week = "";
        if($("#one").hasClass("active")){
            week = "1";
        }
        if($("#two").hasClass("active")){
            week = "2";
        }
        if($("#three").hasClass("active")){
            week = "3";
        }
        if($("#four").hasClass("active")){
            week = "4";
        }
        if($("#five").hasClass("active")){
            week = "5";
        }
        return week;  
    },
    
    checkaccount_no : function(){
        var account_no = "";
        $(".bank").each(function(){
            var type = $(this).hasClass("acborder");
            if(type){
                account_no = $(this).attr("type");
            }
        })
        return account_no;
    },
    checkmoney_type : function(ptype){
        var type = "";
        if(ptype=="2"){
            var vclass = $("#Reserve").hasClass("active");
            var rclass = $("#reservation").hasClass("active");
            if(vclass){
                type = "1";
            }
            if(rclass){
                type = "2";
            }
        }
        return type; 
    },
    checkmoney_value : function(type){
        var value = "";
        if(type){
            if(type=="1"){
                value = $("#Reservetext").val();
            }else{
                value = $("#resetext").val();
            }
        }else{
            value = "";
        }
        return value;
    },
    checksure : function(){
        var type = false;
        var that = this;
        var CounterFeetext = $("#CounterFee").val();    //手续费 千分
        var resetext = $("#resetext").val();            //余额预留 元
        var Reservetext = $("#Reservetext").val();      //预留余额的 %
        var reservation = $("#reservation").hasClass("active");      //余额预留
        var Reserve = $("#Reserve").hasClass("active");                          //预留余额的
        if(!that.checkaccount_no()){
            type = true;
            PFT_GLOBAL.U.Alert("fail",'<p style="width:440px">抱歉您尚未选择提现账户，若用户未配置请联系客户进行配置！</p>');
        }
        if(!that.isbai(CounterFeetext)){
            PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">抱歉手续费数值输入有误请重新输入！</p>');
            $("#CounterFee").focus();
            type = true;
        }else{
            if(CounterFeetext>1001){
               PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">抱歉手续费数值输入有误不能大于1000！</p>');
               $("#CounterFee").focus();
               type = true;
            }
        }
        if(Reserve){
            if(!that.isbai(Reservetext)){
                PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">抱歉预留余额的数值输入有误请重新输入！</p>');
                $("#Reservetext").focus();
                type = true;
            }else{
                if(Reservetext>100){
                   PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">抱歉预留余额的数值输入有误不能大于100！</p>');
                   $("#Reservetext").focus();
                   type = true;
                }
            }
        }
        if(reservation){
            if(!that.isNum(resetext)){
                PFT_GLOBAL.U.Alert("fail",'<p style="width:440px">抱歉余额预留的数值输入有误请输入最多两位小数的数值！</p>');
                $("#resetext").focus();
                type = true;
            }else{
                if(resetext>1000000){
                   PFT_GLOBAL.U.Alert("fail",'<p style="width:340px">抱歉余额预留的数值输入有误不能大于1000000！</p>');
                   $("#resetext").focus();
                   type = true;
                }
            }
        }
       
        return type;
        
    },
    isNum : function(count){
        count = String(count);
        var type="^[0-9]+([.][0-9]{0,2}){0,1}$";   //只允许输入两位小数  大于等于0的数
        var re = new RegExp(type);
        if(count.match(re) == null){
            return false;
        } 
        return true;
    },
    isbai : function(count){
        count = String(count);
        var type="^[0-9]*[0-9][0-9]*$";				//只允许输入正整数 % 包括0
        var re = new RegExp(type);
        if(count.match(re) == null){
            return false;
        }
        return true;
    },
    
    
    
    
	
});
module.exports = Filter;