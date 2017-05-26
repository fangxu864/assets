/**
 * Created by Administrator on 2017/3/1.
 */

require("./second_packDetail.scss");
var second_packDetailModuleTpl = require("./second_packDetail.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

/**
 * 本模块为第2步的套餐详情模块
 */
var Second_packDetailModule = {
    container: $("<div class='second_packDetailBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("Second_packDetailModule.render" , function (data) {
            _this.render(data);
        });
        this.container.on("click" , ".pre-btn" ,function () {
            _this.container.hide();
            _this.CR.pubSub.pub("progressModule.first");
            _this.CR.mainBox.find(".first_packPickBox ").show();
            _this.CR.mainBox.find(".first_packDetailBox ").show();
            $("#G_Body").animate({"scrollTop":0},200,"swing")
        })

        //表格伸展收缩按钮
        this.container.on("click",".parentTr",function (e) {
            $(this).find(".un-shrink").toggleClass("shrink");
            $(this).siblings("tr").fadeToggle(0);
        });
    },

    template: ParseTemplate(second_packDetailModuleTpl),
    render: function (data) {
        var html = this.template({data:data.data});
        this.container.html(html);
        this.container.show();
    }



};

module.exports = Second_packDetailModule;
