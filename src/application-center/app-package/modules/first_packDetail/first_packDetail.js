/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packDetail.scss");
var first_packDetailModuleTpl = require("./first_packDetail.xtpl");


/**
 * 本模块为第一步的套餐详情模块
 */
var First_packDetailModule = {
    container: $("<div class='first_packDetailBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( first_packDetailModuleTpl );
        this.bind();
        // this.container.hide();


    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("First_packDetailModule.close",function () {
            _this.container.hide();
        });
        //点击立即购
        this.container.on("click" , ".btn-book" , function () {
            //进行到第二步
            _this.CR.pubSub.pub("progressModule.second");
            _this.container.hide();
            _this.CR.pubSub.pub("First_packDetailModule.close");
            _this.CR.pubSub.pub("Second_packDetailModule.render");
        })
    }



};

module.exports = First_packDetailModule;
