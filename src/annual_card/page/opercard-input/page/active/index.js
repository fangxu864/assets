/**  
* Author:WangTong
* Date:2016/11/23
*/
var tpl=require("./index.xtpl")
var Api = require("../../common/api.js");
var ReadPhysicsCard =require("../../common/ReadPhysicsCard.js")
$(".personadd ul").append(tpl);
var MainView = Backbone.View.extend({
    el: $(".personadd"),
    events: {
        "click .btn>.inpbtn[type='submit']": "onAddBtnClick",
        "focus .textInp": "onTextInpFoucs",
        "keyup #cardInp": "onCardInpKeyup",
        "click #clearCardInpBtn": "onClearCardInpBtnClick"
    },
    initialize: function () {
        var that = this;
        this.cardInp = $("#cardInp");
        this.readCardBtn = $("#readCardBtn");
        this.cardInfoBar = $("#cardInfoBar").hide();
        this.submitBtn = $(".btn>.inpbtn[type='submit']");
        this.ReadPhysicsCard = new ReadPhysicsCard({ id: "readCardObj" });

    },
    onAddBtnClick: function (e) {
        var tarBtn = $(e.currentTarget);
        if (tarBtn.hasClass("disable")) return false;
        if (this.cardInfoBar.hasClass("error")) return false;
        var physics_no = this.cardInp.val();
        if (!physics_no) return alert("物理卡号不能为空");
        this.submit();
    },
    onTextInpFocus: function (e) {
        var that = this;
        var tarInp = $(e.currentTarget);
        var validate = tarInp.attr("validator");
        if (!validate) return false;
        if (tarInp.attr("id") == "cardInp") {
            $("#cardInfoBar").removeClass("error").hide();
        } else {
            tarInp.siblings(".tip").removeClass("error").hide();
        }
    },
    onClearCardInpBtnClick: function (e) {
        this.cardInp.val("").focus();
        $(e.currentTarget).hide();
    },
    onCardInpKeyup: function (e) {
        var tarInp = $(e.currentTarget);
        var val = tarInp.val();
        var keycode = e.keyCode;
        var clearBtn = $("#clearCardInpBtn");
        if (keycode != 13) return false;
        val ? clearBtn.show() : clearBtn.hide();
        this.getCardInfo(val, "physics");
    },
    getCardInfo : function(card_no,type){
		var that = this;
		var tarBtn = this.readCardBtn;
		var cardInp = that.cardInp;
		if(!card_no || !type) return false;
		PFT.Util.Ajax(Api.Url.active.checkCard,{
			params : {
				identify : card_no,
				type : type
			},
			loading : function(){
				tarBtn.addClass("disable");
				idCardInp.val("");
				$("#loadingIcon").show();
			},
			complete : function(){
				tarBtn.removeClass("disable");
				$("#loadingIcon").hide();
			},
			success : function(res){
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var needID = data.need_ID || "";
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
					var card_no = data.card_no;
					/*idCardInp.attr("validate","idCard:"+needID);
					idCardInp.attr("data-requrie",needID);
					if(needID==1){
						$("#idCard-fontRed").show();
					}else{
						$("#idCard-fontRed").hide();
					}*/
					that.cardInfoBar.show().removeClass("error").html("实体卡号："+card_no+"<i style='margin:0 10px'></i>虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
				}else{
					that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
				}
			}
		})
	}
})

$(function() {
    new MainView();
})