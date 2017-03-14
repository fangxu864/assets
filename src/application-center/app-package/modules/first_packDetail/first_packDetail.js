/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packDetail.scss");
var first_packDetailModuleTpl = require("./first_packDetail.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



/**
 * 本模块为第一步的套餐详情模块
 */
var First_packDetailModule = {
    container: $("<div class='first_packDetailBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("First_packDetailModule.close", function () {
            _this.container.hide();
        }); 
        this.CR.pubSub.sub("First_packDetailModule.render", function ( data ) {
            _this.render( data );
        });
        //点击立即购
        this.container.on("click", ".btn-book", function () {
            var moduleId = $(this).attr("data-moduleId");
            //进行到第二步
            _this.CR.pubSub.pub("progressModule.second");
            _this.container.hide();
            _this.CR.pubSub.pub("First_packDetailModule.close");
            _this.CR.pubSub.pub("Second_packDetailModule.render",moduleId);
            _this.CR.mainBox.find(".first_packPickBox ").hide();
            $("#G_Body").animate({"scrollTop": 0}, 200, "swing")
        })
    },

    render: function( data ){
        var html =  this.template({data : data});
        this.container.html( html );

    },
    template: ParseTemplate(first_packDetailModuleTpl)



};

module.exports = First_packDetailModule;
