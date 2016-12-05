
require("./index.scss");
var tpl= require("./index.xtpl");
var Api = require("../../common/api.js");
var ReadPhysicsCard =require("../../common/ReadPhysicsCard.js")
$(".inpNum").after(tpl);
var MainView = Backbone.View.extend({
    el: $("form"),
    events: {
        "click input[type='submit']": "onAddBtnClick",
        "change .inpNum": "onTextInpChange",
        "keydown .inpNum": "onCardInpKeyDown",
        "click #clearCardInpBtn": "onClearCardInpBtnClick"
    },
    initialize: function () {
        var that = this;
        this.submitBtn = $(".btn>.inpbtn[type='submit']");
        this.ReadPhysicsCard = new ReadPhysicsCard({ id: "readCardObj" });
        this.cardInp=$(".inpNum");
        this.phyNo=$("input[name='physics_no']");
        this.visiNo=$("input[name='visible_no']");
    },
    onAddBtnClick: function (e) {
        //var InpVal = this.cardInp.val();      
        var that =this;
        var phyVal=that.phyNo.val();
        var visiVal=that.visiNo.val();
        if (phyVal==="") { 
            alert("物理卡号不能为空"); 
            that.phyNo.focus();
            return false;
        }else if(visiVal===""){
            alert("实体卡号不能为空");
            that.visiNo.focus();
            return false;       
        }
    },
    onTextInpChange: function (e) {
        var that = this;
        var tarInp = $(e.currentTarget);
        var val = tarInp.val();
        if (val==="") return alert("物理卡号和实体卡号不能为空"); ;
        
    },
    onClearCardInpBtnClick: function (e) {
      var clearBtn = $(e.currentTarget);
      var txtInp=clearBtn.parents(".rt").prev();
        txtInp.val("").focus();     
        clearBtn.hide();
    },
    onCardInpKeyDown: function (e) {
        var tarInp = $(e.currentTarget);
        var clearBtn=tarInp.next().find(".clearCardInpBtn");
        var val = tarInp.val();
        var keycode = e.keyCode;
        val ? clearBtn.show() : clearBtn.hide();      
        if (keycode == 13) return false;
    }
    
})
$(function(){
  new MainView();
})