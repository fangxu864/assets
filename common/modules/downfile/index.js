/**
 * Created by Administrator on 2016/12/28.
 */

//引入插件
var DialogSimple=require("COMMON/modules/dialog-simple");
//引入tpl
var tpl = require("./index.xtpl");
//引入css
require("./index.scss");
var to_downcenter_dialog=new DialogSimple({
    width : 500,
    closeBtn : true,
    content : tpl,
    drag : true,
    speed : 200,
    offsetX : 0,
    offsetY : 0,
    overlay : true,
    headerHeightMin : 46,
    events : {}
});
/**
 * 下载类
 * @constructor
 */
function DownFile () { }

DownFile.prototype = {
    /**
     * @method                   判断下载类型，是否可以直接下载还是需要进入下载中心进行下载
     * @param params    obj      下载文件时需要传输的参数
     * @param type      string   判断下载类型时需要传输的特定数字
     * @param originUrl string   下载接口
     * return                     1:提示用户后台正在打包压缩需下载的文件，此时可引导用户进入下载中心的页面
     *                            2:弹出错误
     *                            3:直接请求原来的下载
     *                            4:后台已生成过该文件，引导用户去下载中心下载
     */
    judgeType : function ( params , type ,originUrl ) {
        var _this = this ;
        var newParams = $.extend(params ,{"judgeType" : type });
        $.ajax({
            url: "/r/MassData_ExportListen/Judge",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:10000,   //设置超时 10秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                var code = res.code.toString();
                switch (code) {
                    case "1" :
                        $("#to_downcenter_dialog .line1 p").text("您好，由于所下载的文件容量较大，已提交至后台进行打包压缩，压缩完毕后可去应用中心进行下载");
                        to_downcenter_dialog.open();
                        break ;
                    case "2" :
                        alert(res.msg);
                        break ;
                    case "3" :
                        var downUrl = originUrl + "?" + $.param(params) ;
                        _this.outExcel(downUrl);
                        break ;
                    case "4" :
                        $("#to_downcenter_dialog .line1 p").text("后台已为您生成过该文件，请去下载中心进行下载");
                        to_downcenter_dialog.open();
                        break ;
                    default :
                        alert(res.msg ? res.msg : "请求出错，错误码是：" + code)
                }
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时");
                }
            },
            error: function() {
                //请求出错处理
                alert("请求出错");
            }
        });
    },



    /**
     * @method                   导出excel
     * @param downloadUrl        下载url
     */
    outExcel : function (downloadUrl) {
        var iframeName = "iframe" + new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    }

    
};

module.exports = DownFile;
