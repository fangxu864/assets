/**
 * Created by Administrator on 2017/3/1.
 */

require("./progress.scss");
var progressTpl = require("./progress.xtpl");


/**
 * 本模块为进度显示模块
 */
var ProgressModule = {
    container: $("<div class='progressBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( progressTpl );
        this.bind();
        this.CR.pubSub.pub("progressModule.second");

    },
    
    bind: function () {
        var _this = this;
        //第2步
        this.CR.pubSub.sub("progressModule.second" , function () {
            _this.container.find(".line1").addClass("active");
            _this.container.find(".circle1").addClass("ok");
            _this.container.find(".circle2").addClass("active");

        });
        //第3步
        this.CR.pubSub.sub("progressModule.third" , function () {
            _this.container.find(".line1").addClass("active");
            _this.container.find(".line2").addClass("active");
            _this.container.find(".circle1").addClass("ok");
            _this.container.find(".circle2").addClass("ok");
            _this.container.find(".circle2").addClass("active");
            _this.container.find(".circle3").addClass("active");
        });
        //最后一步
        this.CR.pubSub.sub("progressModule.last" , function () {
            _this.container.find(".line").addClass("active");
            _this.container.find(".circle1").addClass("ok");
            _this.container.find(".circle2").addClass("ok");
            _this.container.find(".circle3").addClass("ok");
            _this.container.find(".circle").addClass("active");
        })
    }
};

module.exports = ProgressModule;
