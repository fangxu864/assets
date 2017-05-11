/**
 * Created by Administrator on 15-12-3.
 */
var dialog = null;
var dialog_speed = 100;
var ModifyDialog = RichBase.extend({
	statics : {
		modifyBtn : null,
		isPositiveNum : function(count){
			count = String(count);
			var type="^[0-9]*[1-9][0-9]*$";
			var re = new RegExp(type);
			if(count.match(re) == null){
				return false;
			}
			return true;
		}
	},
	init : function(){},
	onCountInpChange : function(tarInp,newVal,oldVal){
		var parent = tarInp.parent(),
			addBtn = parent.children(".addBtn"),
			minuBtn =  parent.children(".minuBtn"),
			min = tarInp.attr("data-min"),
			max = tarInp.attr("data-max"),
			listUl = tarInp.parents(".tlist"),
			listLis = listUl.children(),
			tarListLi = tarInp.parents(".ticketLi");

		if(newVal==oldVal) return false;

		if(newVal>oldVal){ //增加
			if(addBtn.hasClass("disable")) return tarInp.val(oldVal);
			minuBtn.removeClass("disable");
			if(newVal<=max){
				tarInp.val( newVal );
				newVal==max ? addBtn.addClass("disable") : addBtn.removeClass("disable");
			}else{
				addBtn.addClass("disable");
			}
		}else{ //减少
			if( minuBtn.hasClass("disable") ) return tarInp.val( oldVal );
			//新需求 2016-03-28
			//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
			//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
			// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
			if(min=="0|1"){
				if( listLis.length ){ //如果是联票
					var siblingInps = tarListLi.siblings().find(".numInp");
					var min = (function( siblingInps ){
						var min = 1;
						siblingInps.each(function(){
							var tarLi = $(this),
								val = tarLi.val();
							if( val>0 ){
								min = 0;
								return false;
							}
						});
						return min;
					})(siblingInps);
				}else{ //如果是单票
					min = 1;
				}
			}

			if(newVal<=min){

				newVal = min;
				minuBtn.addClass("disable");

				if(newVal==1){
					tarListLi.siblings().find(".numInp").each(function(){
						var tarInp = $(this);
						if(tarInp.val()!="0") tarInp.removeClass("disable");
					})
				}

			}else{
				minuBtn.removeClass("disable");
			}

			if(newVal>=max){

				newVal=max;
				addBtn.addClass("disable");

			}else{
				addBtn.removeClass("disable");
			}

			tarInp.val(newVal);
		}
	},
	open : function(tarBtn,ordernum){
		var that = this;

		var title = $("#landTit_"+ordernum).text(),
			dialogTpl = $("#modTicDiaTpl").html(),
			con = that.parseTemplate(dialogTpl,{ ticketList: "" });

		if(!dialog) dialog = that.createDialog();

		dialog.open({
			title : title,
			content : con,
			offset : -100,
			onBeforeOpen : function(){
				that.renderTicketList( tarBtn, ordernum );

				that.renderTouristInfo( tarBtn, ordernum );

				that.statics.modifyBtn = tarBtn;
				$("#modifyTicket_ordernum_hidInp").val(ordernum);
				$("#dialog-yes-btn").attr("data-ordernum",ordernum);
			}
		})
	},

	createDialog : function(){
		var self = this;
		var dialogTpl = $("#modTicDiaTpl").html();

		var con = self.parseTemplate(dialogTpl,{ ticketList: "" });

		dialog = new PFT.Dialog({
			content : con,
			speed : dialog_speed,
			EVENTS : {
				"click" : {
					//确认修改
					".modTicketDialogCon .modifyBtn" : function(that,e){
						e.preventDefault();
						that.close();
						self.fire("ticket.modify",{
							ordernum : $(e.currentTarget).attr("data-ordernum"),
							tarBtn : self.statics.modifyBtn
						});
					},
					//取消修改
					".modTicketDialogCon .cannelModifyBtn" : function(that,e){
						e.preventDefault();
						that.close();
					},
					//减票数
					".modTicketDialogCon .minuBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal-1;
						self.onCountInpChange(tarInp,newVal,oldVal);
					},
					//加票数
					".modTicketDialogCon .addBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal+1;
						self.onCountInpChange(tarInp,newVal,oldVal);
					}
				},
				"focus" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						tarInp.attr("data-lastval",tarInp.val());
					}
				},
				"blur" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						var val = tarInp.val() * 1;
						var lastVal = tarInp.attr("data-lastval") * 1;
						if(val==lastVal) return false;
						if(!self.statics.isPositiveNum(val)){
							tarInp.val(lastVal);
						}
						self.onCountInpChange(tarInp,val,lastVal);
					}
				}
			}
		});
		return dialog;
	},

	renderTicketList: function( tarBtn, ordernum ){
		var that = this;

		var isAjaxRequired = false,
			listTpl = $("#modTicDiaList").html();

		var tickets = tarBtn.attr("data-ticket").split("&"),
			list = "",
			tmin,
			tmax,
			// originTNumArr = tarBtn.attr('data-origin-tnum').split(','),		// type Array, 订单初始票数
			modRateArr = tarBtn.attr('data-mod-rate').split(','),			// type Array, 每个票类增加减少比例
			ticModListUl = $('#ticModListUl');

		var is_all_not_terminal = (function(tickets){ //判断联票是未验证(即其所有子票均未验证) 还是部分验证
			var result = true;
			for(var i in tickets){
				var t = tickets[i].split("|");
				var has_terminal_num = t[3];
				if(typeof has_terminal_num!="undefined"){
					has_terminal_num = has_terminal_num*1 || 0;
				}else{
					has_terminal_num = 0;
				}
				if(has_terminal_num!==0){
					result = false;
					break;
				}
			}
			return result;
		})(tickets);

		if( is_all_not_terminal ){ //未验证
			tmin = "0|1";
		}else{ //已验证
			tmin = "0";
		}

		for( var i = 0, len = modRateArr.length; i<len; i++ ) {
			if( +modRateArr[i] > 0 ) {
				isAjaxRequired = true;
				break;
			}
		}

		if( isAjaxRequired ) {
			PFT.Ajax({
				url: "/r/Order_OrderModify/getOriginTicketNum",
				type: "post",
				dataType: "json",
				data: {
					order_num: ordernum
				},
				loading: function () {
					ticModListUl.text("加载中");
				},
				removeLoading: function () {
					ticModListUl.text("");
				},
				timeout: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求超时，请稍后重试</p>');
				},
				serverError: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求出错，请稍后重试</p>');
				}
			}, function ( res ) {
				if( res.code == 200 ) {
					var originTNumArr = res.data;

					//新需求 2016-03-28
					//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
					//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
					// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
					for(var i in tickets){
						var t = tickets[i].split("|"),
							tname = t[0],
							tnum = t[1],
							tid = t[2],
							has_terminal_num = t[3],
							originMax,
							originMin;

						if(typeof has_terminal_num!="undefined"){
							has_terminal_num = has_terminal_num*1;
						}else{
							has_terminal_num = 0;
						}

						var readonly = tnum==1 ? "readonly" : "";

						// modified 20170509
						// 增加减少人数比例大于0，添加判断更改初始加减按钮的className
						var modRate = +modRateArr[i],
							originTNum = +originTNumArr[ tid ],
							addBtnCls,
							minusBtnCls;

						if( modRate ) {
							if( isNaN( originTNum ) ) {
								PFT.Help.AlertTo("fail", '<p style="width:300px;">缺少参数: 初始票数</p>');
								return false;
							}

							// 增加减少比例不为0, 重置min / max
							originMax = originTNum + Math.ceil( originTNum * modRate / 100 );
							originMin = originTNum - Math.ceil( originTNum * modRate / 100 );

							addBtnCls = tnum >= originMax ? "disable" : '';
							minusBtnCls = tnum <= originMin ? "disable" : '';

							tmax = originMax - has_terminal_num,
							tmin = (tmin = originMin - has_terminal_num) >= 0 ? tmin : 0;
						} else {
							tmax = tnum - has_terminal_num;
							addBtnCls = "disable";
							minusBtnCls = "";
						}

						if( tnum==0 ) minusBtnCls = "disable";

						list += that.parseTemplate(listTpl,{
							tname : tname,
							tnum : tnum-has_terminal_num,
							has_terminal_num : has_terminal_num,
							tid : tid,
							tmin : tmin,
							tmax : tmax,
							addBtnCls : addBtnCls,
							minusBtnCls : minusBtnCls,
							origin_tnum: originTNum,
							mod_rate: isNaN( modRate ) ? 0 : modRate
						});
					}
					ticModListUl.html(list);
				} else {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">' + res.msg + '</p>');
				}
			});
		} else {
			for(var i in tickets){
				var t = tickets[i].split("|"),
					tname = t[0],
					tnum = t[1],
					tid = t[2],
					has_terminal_num = t[3];

				if(typeof has_terminal_num!="undefined"){
					has_terminal_num = has_terminal_num*1;
				}else{
					has_terminal_num = 0;
				}

				var readonly = tnum==1 ? "readonly" : "";

				var modRate = +modRateArr[i],
					originTNum = '';

				addBtnCls = "disable";
				minusBtnCls = "";

				if( tnum==0 ) minusBtnCls = "disable";

				list += that.parseTemplate(listTpl,{
					tname : tname,
					tnum : tnum-has_terminal_num,
					has_terminal_num : has_terminal_num,
					tid : tid,
					tmin : tmin,
					tmax : tnum-has_terminal_num,
					addBtnCls : addBtnCls,
					minusBtnCls : minusBtnCls,
					origin_tnum: originTNum,
					mod_rate: isNaN( modRate ) ? 0 : modRate
				});
			}

			ticModListUl.html(list);
		}
	},

	renderTouristInfo: function( tarBtn, ordernum ) {
		var touristInfo = +tarBtn.attr('data-tourist-info'),		// type Number, 身份证信息类型，0 无需填写，1 只需填一位，2 一票一证
			touristContainer = $('#touristInfo');

		if( touristInfo == 2 ) {
			!touristContainer.find('.tourist-title').length && touristContainer.append('<p class="tourist-title">游客信息</p>');

			!$('#touristLoading').length && touristContainer.append('<div id="touristLoading">加载中</div>');

			PFT.Ajax({
				url: "/r/Order_OrderModify/getOrderTouristInfo",
				type: "post",
				dataType: "json",
				data: {
					ordernum: ordernum
				},
				loading: function () {
					$('#touristLoading').slideDown();
				},
				removeLoading: function () {
					$('#touristLoading').slideUp();
				},
				timeout: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求超时，请稍后重试</p>');
				},
				serverError: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求出错，请稍后重试</p>');
				}
			}, function ( res ) {

			});
		}
	}
});
module.exports = ModifyDialog;