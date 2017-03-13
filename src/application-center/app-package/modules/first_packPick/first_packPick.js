/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packPick.scss");
var first_packPickModuleTpl = require("./first_packPick.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



/**
 * 本模块为第一步的套餐选取模块
 */
var First_packPickModule = {
    container: $("<div class='first_packPickBox clearfix'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        // this.container.html( first_packPickModuleTpl );
        // this.container.hide();
        this.CR.pubSub.pub("DC.getPackageList");
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("first_packPick.render" , function (data) {
            _this.render(data);
        });
        //点击立即购
        this.container.on("click" , ".btn-book" , function () {
            //进行到第二步
            _this.CR.pubSub.pub("progressModule.second");
            _this.container.hide();
            _this.CR.pubSub.pub("First_packDetailModule.close");
            _this.CR.pubSub.pub("Second_packDetailModule.render");
        })
    },

    template: ParseTemplate(first_packPickModuleTpl),
    render: function (data) {
        var _this = this;
        var html = this.template({data: data});
        this.container.html(html);
    }



};

module.exports = First_packPickModule;
