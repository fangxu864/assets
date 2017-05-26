/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packDetail.scss");
var first_packDetailModuleTpl = require("./first_packDetail.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
require("COMMON/modules/DragConOver")($);



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
            var moduleId = $(this).attr("data-moduleid");
            //进行到第二步
            _this.CR.pubSub.pub("progressModule.second");
            _this.container.hide();
            _this.CR.pubSub.pub("First_packDetailModule.close");
            _this.CR.pubSub.pub("DC.getSecondPackageDetail",moduleId);
            _this.CR.mainBox.find(".first_packPickBox ").hide();
            $("#G_Body").animate({"scrollTop": 0}, 200, "swing")
        });

        //表格伸展收缩按钮
        this.container.on("click",".parentTr",function (e) {
            $(this).find(".un-shrink").toggleClass("shrink");
            $(this).siblings("tr").fadeToggle(0);
        });

        this.container.on("mouseenter" , ".detail-table" ,function () {
            var curTb = $(this);
            //表格的宽度
            var tbWidth = curTb.outerWidth();
            //表格外框的宽度
            var tbWrapWidth = _this.container.find(".table-wrap").outerWidth();
            if(tbWidth > tbWrapWidth){
                curTb.addClass("over-detail-table");
            }else{
                curTb.removeClass("over-detail-table");
            }
        })



    },

    render: function( data ){
        var _this = this;
        var html =  this.template({data : data});
        this.container.html( html );
        //表格右侧拖动
        _this.container.find(".detail-table").DragConOver({
            direction:"x",
            callBack:function(dValue) {
            }
        });

    },
    template: ParseTemplate(first_packDetailModuleTpl)

};

module.exports = First_packDetailModule;
