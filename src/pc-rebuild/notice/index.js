/**
 * Author: ZhengJiashen
 * Date: 2016/11/30 10:10
 * Description: ""
 */
require("./index.scss");
var loading = require("COMMON/js/util.loading.pc.js");
var Ajax_SetStatus = require("./Service/Service_SetStatus.js");
var Ajax_GetNotice = require("./Service/Service_GetNotice.js");
var notice_tpl = require("./notice_tpl.xtpl");
var ChangePage = require("./pagination_box/index.js");
var MessageBox = require("./message_box/index.js");
var message_send_tpl = require("./message_box/message_send.xtpl");
var message_accept_tpl = require("./message_box/message_accept.xtpl");

var Main= {

        //初始化
        init: function () {
            var _this = this;

            //导入基础模版
            $(".system-notice").append(notice_tpl);

            //实例化各个模块
            _this.pagination = new ChangePage();
            _this.message_box = new MessageBox();
            //点击发布通知

            _this.getNotice_send();

            //运行模块交流部分
            this.CommunicateArea()
        },

//所有模块的交流区域
        CommunicateArea: function () {
            var _this = this;

            //------------------------------点击分页器时触发的事件
            _this.pagination.on("pageChange",function (toPage) {

                _this.nowPage = toPage;
                if($("#message_container>div").hasClass("message_send")){
                    _this.getNotice_send({ page : toPage , allPage : _this.allPage_send });
                    // _this.message_box.pageTurnTo(toPage,"message_send",_this.cacheData_send)

                }else if($("#message_container>div").hasClass("message_accept")){
                    _this.getNotice_accept({ page : toPage , allPage : _this.allPage_accept , state : _this.nowState});
                    // _this.message_box.pageTurnTo(toPage,"message_accept",_this.cacheData_accept)
                }
            });

            //--------------------------点击已发送的通知 收到的通知

            //1.切换到已发送通知
            _this.message_box.on("show_message_send",function () {
                _this.getNotice_send()
            });

            //2.切换到收到的通知
            _this.message_box.on("show_message_accept",function () {
                _this.nowState = 3;
                $("#message_container").empty();
                $("#message_container").append(message_accept_tpl);
                _this.getNotice_accept()
            });

            //---------------------------点击所有通知、未读通知、已读通知部分
            //1.所有通知
            _this.message_box.on("message_all",function () {
                _this.nowState = 3;
                _this.getNotice_accept({allPage:_this.allPage_accept})
            });

            //2.未读通知
            _this.message_box.on("message_unread",function () {
                _this.nowState = 0;
                _this.getNotice_accept({state:0,allPage:_this.allPage_accept})
            });

            //3.已读通知

                //使用过滤器生成局部的缓存数据，只包含已读信息
            _this.message_box.on("message_read",function () {
                _this.nowState = 1;
                _this.getNotice_accept({state:1,allPage:_this.allPage_accept})
            });

            //----------------------------------------------点击删除和标记已读
            //1.删除
            _this.message_box.on("clickDelete",function (deleteBox) {

                //(一)、如果是在已发送的通知页面
                if($("#message_container>div").hasClass("message_send")){
                    var params = {nid:deleteBox,status:2};
                    var nowState = "send";
                    _this.setStatus(params,nowState);

                //（二）、如果是在收到的通知页面
                }else if($("#message_container>div").hasClass("message_accept")){

                        //(1).其中如果是选中所有通知
                    if($("#message-all").hasClass("active_type")){
                        var params = {nid:deleteBox,status:2};
                        var nowState = 3;
                        _this.setStatus(params,nowState);

                        //(2).其中如果是选中未读通知
                    }else if($("#message-unread").hasClass("active_type")){
                        var params = {nid:deleteBox,status:2};
                        var nowState = 0;
                        _this.setStatus(params,nowState);

                        //(3).其中如果是选中已读通知
                    }else if($("#message-read").hasClass("active_type")){
                        var params = {nid:deleteBox,status:2};
                        var nowState = 1;
                        _this.setStatus(params,nowState);
                    }

                }

            });

            //2.标记为已读
            _this.message_box.on("clickMark",function (markBox) {


                //如果是在发送通知界面
                if($("#message_container>div").hasClass("message_send")){
                    var params = {nid:markBox,status:1};
                    var nowState = "send";
                    _this.setStatus(params,nowState);

                //如果是在收到的通知界面
                }else if($("#message_container>div").hasClass("message_accept")){

                        //其中如果是选中所有通知
                    if($("#message-all").hasClass("active_type")){
                        var params = {nid:markBox,status:1};
                        var nowState = 3;
                        _this.setStatus(params,nowState);

                        //其中如果是选中未读通知
                    }else if($("#message-unread").hasClass("active_type")){
                        var params = {nid:markBox,status:1};
                        var nowState = 0;
                        _this.setStatus(params,nowState);

                        //其中如果是选中已读通知
                    }else if($("#message-read").hasClass("active_type")){
                        var params = {nid:markBox,status:1};
                        var nowState = 1;
                        _this.setStatus(params,nowState);

                    }
                }


            })

        },

    /*————————————————————————————————————————————————————————————————————————————————————————————*/
    /*以下为方法，不是事件*/
        setStatus:function (params,nowState) {
            var _this = this;
            if(nowState == "send"){
                Ajax_SetStatus(params,
                    {
                        success:function (data) {
                            console.log(data);
                            if(!this.nowPage){_this.nowPage = 1}
                            _this.getNotice_send({page:_this.nowPage});
                        },
                        empty:function (data) {
                            console.log("empty")
                        },
                        fail:function (msg) {
                            alert(msg)
                        }
                    }
                );
                return false
            }
            Ajax_SetStatus(params,
                {
                    success:function (data) {
                        console.log(data);
                        if(!this.nowPage){_this.nowPage = 1}
                        _this.getNotice_accept({page:_this.nowPage,state:nowState});
                    },
                    empty:function (data) {
                        console.log("empty")
                    },
                    fail:function (msg) {
                        alert(msg)
                    }
                }
            );
        },

        getNotice_send:function (params) {
            //缓存发送的通知

            var _this = this;
            var finalParams = $.extend({ action : "outbox" , page : 1 ,size : 10 , allPage : "" },params);
            Ajax_GetNotice(finalParams,
                {
                    loading:function () {
                        var html = loading("加载中，请稍后");
                        $(".content").empty().append(html);
                    },
                    success:function (data) {
                        _this.allPage_send = data[0].allPage;
                        $("#message_container").empty();
                        $("#message_container").append(message_send_tpl);

                        //加载数据
                        for(var i = 0 ; i<data.length ; i++){
                            var newLi = $("<li data-id='"+data[i].id+"'> <input type='checkbox'/> <a  class='blue' href='/noticed.html?id="+ data[i].id +"'target='_blank'>"+data[i].title+"</a> <span class='time'>"+data[i].btime+"</span> </li>");
                            $(".message_send ul").append(newLi);
                        }
                        _this.pagination.render(finalParams.page,_this.allPage_send);
                    },
                    empty:function (data) {
                        console.log("empty")
                    },
                    fail:function (msg) {
                        var html = loading("未能找到相关数据。",{loadingImg:""});
                        $(".content").empty().append(html);
                        _this.pagination.render(0,0);
                    }
                }
            );
        },


        getNotice_accept:function (params) {
            var _this = this;
            var finalParams = $.extend({ action : "inbox" , state : 3, page : 1 ,size : 10 , allPage : "" },params);
            Ajax_GetNotice(finalParams,
                {
                    loading:function () {
                        var html = loading("加载中，请稍后");
                        $(".content").empty().append(html);
                    },
                    success:function (data) {
                        _this.allPage_accept = data[0].allPage;

                        $(".message_accept .content").empty();
                        //加载数据
                        for(var i=0 ; i<data.length ; i++){
                            if(data[i].rstate == 0){
                                var haveRead = "[未读]"
                            }else if(data[i].rstate == 1){
                                var haveRead = "[已读]"
                            }
                            var newLi = $("<li data-id='"+data[i].id+"'> <input type='checkbox'/> <span>"+haveRead+"</span> <a  class='blue' href='/noticed.html?id="+ data[i].id +"'target='_blank'>"+data[i].title+"</a> <span class='time'>"+data[i].btime+"</span> </li>");
                            $(".message_accept .content").append(newLi);
                        }
                        _this.pagination.render(finalParams.page,_this.allPage_accept);

                    },
                    empty:function (data) {
                        console.log("empty")
                    },
                    fail:function (msg) {
                        var html = loading("未能找到相关数据。",{loadingImg:""});
                        $(".content").empty().append(html);
                        _this.pagination.render(0,0);
                    }
                }
            );
        },

    }
;


$(function () {
    Main.init()
});


