require('./index.scss');

var indexTpl = require("./index.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

var Contact = PFT.Util.Class({

    init:function (relyDiv) {
    },

    render: function (relyDiv) {
        var _this = this;
        this.container  = $('<div class="contact-main-box"></div>');
        //依托的div
        console.log(relyDiv);
        var RelyDiv = typeof relyDiv === "string" ? $(relyDiv) : relyDiv;
        console.log(RelyDiv);
        RelyDiv.append(_this.container);
        this.container.html(indexTpl)
    },

    /**
     * @method 获取联系人信息
     */
    getContactData: function () {

    }
});


module.exports = Contact;