require('./index.scss');


var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

var Contact = PFT.Util.Class({

    init:function (relyDiv) {
        var _this = this;
        this.container  = $('<div class="contact-main-box"></div>');
        //依托的div
        var RelyDiv = typeof relyDiv === "string" ? $(relyDiv) : relyDiv;
        RelyDiv.append(_this.container);
    },

    render: function (relyDiv) {

    },

    /**
     * @method 获取联系人信息
     */
    getContactData: function () {

    }





});