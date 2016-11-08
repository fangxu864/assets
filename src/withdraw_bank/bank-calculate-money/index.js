/**
 * Author: huangzhiyang
 * Date: 2016/10/28 10:50
 * Description: ""
 */
var CalculatMoney = {
	debug : false,
	timer : null,
	INTERVAL : 60,
	init : function(){
		this.calculateAdBtn = $("#calculateAdBtn");
		this.moneyInp = $("#money");
		this.shouxuPer = $("#shouxu").attr("value") * 1;
		this.shouxuMoney = $("#shouxuMoney");
		this.kouMethodTypeGroup = $("#kouMethodTypeGroup");
		this.finalyMoney = $("#shiji");
		this.bindEvent();
	},
	bindEvent : function(){
		var that = this;
		this.calculateAdBtn.on("click",function(e){
			that.onCalculateAdBtnClick(e);
		})
	},
	reCalculateWait:function(tarBtn,orignText){
		var that = this;
		var minue = this.INTERVAL;
		this.timer = setInterval(function(){
			if(minue==0){
				clearInterval(that.timer);
				that.timer = null;
				tarBtn.removeClass("disable").html(orignText);
				return false;
			}
			minue -= 1;
			tarBtn.html(minue+"秒后可重新计算");
		},1000);
	},
	onCalculateAdBtnClick : function(e){
		var tarBtn = $(e.target);
		var orignText = tarBtn.html();
		if(tarBtn.hasClass("disable")) return false;
		this.queryMoney({
			loading : function(){
				tarBtn.addClass("disable").text("正在计算，请稍后...");
			},
			complete : function(){},
			success : function(money){

				this.reCalculateWait(tarBtn,orignText);
				this.moneyInp.val(money);
				//计算
				this.calculate(money);

			},
			below:function(){
				alert("您所能提现的金额小于200");
				this.reCalculateWait(tarBtn,orignText);
			},
			fail : function(msg,code){
				tarBtn.removeClass("disable");
				alert(msg);
			}
		},this)
	},
	calculate : function(money){
		var per = this.shouxuPer;
		var shouxuMoney = Math.round((money*per/100)*100)/100;
		var cardType = this.kouMethodTypeGroup.find('input:radio[name="account"]:checked').val();
		shouxuMoney = per==0 ? 0 : (shouxuMoney < 1 ? 1 : shouxuMoney);
		this.shouxuMoney.text(shouxuMoney);

		var finalyMoney = cardType==1 ? money : (money-shouxuMoney).toFixed(2);

		this.finalyMoney.text(finalyMoney);

	},
	//查询建议提现金额
	queryMoney : function(opt,cxt){
		opt = opt || {};
		cxt = cxt || this;
		var url = "/r/Finance_WithDraw/withDrawFre";
		var fn = new Function;
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var below = opt.below || fn;

		PFT.Util.Ajax(url,{
			loading : function(){
				loading.call(cxt);
			},
			complete : function(){
				complete.call(cxt);
			},
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data || {};
				// data = 500;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				var wdMoney = data.wdMoney * 1;
				if(code=="success"){
					if(wdMoney>=200){
						success.call(cxt,wdMoney);
					}else{
						below.call(cxt);
					}
				}else if(data==0){
					fail.call(cxt,msg,code);
				}

			}
		})


	}
};


module.exports = CalculatMoney;