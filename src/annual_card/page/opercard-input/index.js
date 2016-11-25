/**  
* Author:WangTong
* Date:2016/11/23
*/
var style= require("./index.scss");
var tpl=require("./index.xtpl")
var Api = require("../../common/api.js");
var ReadPhysicsCard =require("../../common/ReadPhysicsCard.js")
$(".personadd ul").append(tpl);
var OperCard = Backbone.View.extend({
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
        this.cardInfoBar = $("#cardInfoBar");
        this.submitBtn = $(".btn>.inpbtn[type='submit']");
        this.ReadPhysicsCard = new ReadPhysicsCard({ id: "readCardObj" });

    },
    onAddBtnClick: function (e) {
        var tarBtn = $(e.currentTarget);
        if (tarBtn.hasClass("disable")) return false;
        if (this.cardInfoBar.hasClass("error")) return false;
        var physics_no = this.cardInp.val();
        if (!physics_no) return alert("物理卡号不能为空");
        
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
        this.cardInfoBar.html("");
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
		var cardInp = that.cardInp;
		if(!card_no || !type) return false;
		PFT.Util.Ajax(Api.Url.active.checkCard,{
			params : {
				identify : card_no,
				type : type
			},
			loading : function(){
				$("#cardInfoBar").html("正在加载，请稍候...");
			},
			complete : function(){
				
			},
			success : function(res){
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var needID = data.need_ID || "";
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
					var card_no = data.card_no;					
                    $("#cardInfoBar").show().html("实体卡号：<input class='inptxt' name='visible_no' id='card_no' value="+card_no+">");   
				}else{
					$("#cardInfoBar").show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
				}
			}
		})
	}
})

$(function() {
    new OperCard();
})