/**
 * Author: ZhengJiashen
 * Date: 2016/11/30 10:10
 * Description: ""
 */
require("./index.scss");
var loading = require("COMMON/js/util.loading.pc.js");
var Ajax = require("COMMON/js/util.ajax.js");
var notice_tpl = require("./notice_tpl.xtpl");
var ChangePage = require("./pagination_box/index.js");
var MessageBox = require("./message_box/index.js");
var message_send_tpl = require("./message_box/message_send.xtpl");

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
            

            //缓存发送的所有通知
            _this.refreshCache_send();

            //缓存收到的所有通知
            _this.refreshCache_accept();

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
                    _this.message_box.pageTurnTo(toPage,"message_send",_this.cacheData_send)

                }else if($("#message_container>div").hasClass("message_accept")){
                    _this.message_box.pageTurnTo(toPage,"message_accept",_this.cacheData_accept)
                }
            });

            //--------------------------点击已发送的通知 收到的通知

            //1.切换到已发送通知
            _this.message_box.on("show_message_send",function () {
                _this.refreshCache_send();
                _this.message_box.pageTurnTo(1,"message_send",_this.cacheData_send);
                _this.pagination.render(1,_this.cacheData_send.length);
            });

            //2.切换到收到的通知
            _this.message_box.on("show_message_accept",function () {
                _this.refreshCache_accept();
                _this.message_box.pageTurnTo(1,"message_accept",_this.cacheData_accept);
                _this.pagination.render(1,_this.cacheData_accept.length);
            });

            //---------------------------点击所有通知、未读通知、已读通知部分
            //1.所有通知
            _this.message_box.on("message_all",function () {
                _this.message_box.pageTurnTo(1,"message_accept",_this.cacheData_accept);
                _this.pagination.render(1,_this.cacheData_accept.length);
            });

            //2.未读通知
            _this.message_box.on("message_unread",function () {

                //使用过滤器生成局部的缓存数据，只包含未读信息
                var afterFilter = _this.filter("status",0,_this.dataBox_accept);
                var partData = _this.dividePage(afterFilter,10);

                _this.message_box.pageTurnTo(1,"message_accept",partData);
                _this.pagination.render(1,partData.length);
            });

            //3.已读通知

                //使用过滤器生成局部的缓存数据，只包含已读信息
            _this.message_box.on("message_read",function () {
                var afterFilter = _this.filter("status",1,_this.dataBox_accept);
                var partData = _this.dividePage(afterFilter,10);

                _this.message_box.pageTurnTo(1,"message_accept",partData);
                _this.pagination.render(1,partData.length);
            });

            //----------------------------------------------点击删除和标记已读
            //1.删除
            _this.message_box.on("clickDelete",function (deleteBox) {
                //如果是在已发送的通知页面
                if($("#message_container>div").hasClass("message_send")){
                    $.each(deleteBox,function (index,value) {
                        for(var i=0 ; i<_this.dataBox_send.length ; i++){
                            if(_this.dataBox_send[i]["id"] == value){
                                _this.dataBox_send.splice(i,1)
                            }
                        }
                    });

                    //刷新缓存数据
                    _this.cacheData_send =_this.dividePage(_this.dataBox_send,10);

                    //记住原来所在的页数
                    if(!_this.nowPage){_this.nowPage = 1}

                    //刷新页面并重新渲染分页器
                    _this.message_box.pageTurnTo(_this.nowPage,"message_send",_this.cacheData_send);
                    _this.pagination.render(_this.nowPage,_this.cacheData_send.length);

                //如果是在收到的通知页面
                }else if($("#message_container>div").hasClass("message_accept")){

                    $.each(deleteBox,function (index,value) {
                        for(var i=0 ; i<_this.dataBox_accept.length ; i++){
                            if(_this.dataBox_accept[i]["id"] == value){
                                _this.dataBox_accept.splice(i,1)
                            }
                        }
                    });

                    if(!_this.nowPage){_this.nowPage = 1}

                    //刷新重新缓存数据
                    _this.cacheData_accept =_this.dividePage(_this.dataBox_accept,10);


                        //(1).其中如果是选中所有通知
                    if($("#message-all").hasClass("active_type")){
                        var partData = _this.cacheData_accept;

                        //(2).其中如果是选中未读通知
                    }else if($("#message-unread").hasClass("active_type")){

                        var afterFilter = _this.filter("status",0,_this.dataBox_accept);
                        var partData = _this.dividePage(afterFilter,10);

                        //(3).其中如果是选中已读通知
                    }else if($("#message-read").hasClass("active_type")){
                        var afterFilter = _this.filter("status",1,_this.dataBox_accept);
                        var partData = _this.dividePage(afterFilter,10);

                    }

                    //通用页面刷新与分页器渲染
                    _this.message_box.pageTurnTo(_this.nowPage,"message_accept",partData);
                    _this.pagination.render(_this.nowPage,partData.length);
                }


                var req = _this.dealData({nid:deleteBox,status:1});
                console.log(req)
            });

            //2.标记为已读
            _this.message_box.on("clickMark",function (markBox) {

                //如果是在发送通知界面
                if($("#message_container>div").hasClass("message_send")){
                    $.each(markBox,function (index,value) {
                        for(var i=0 ; i<_this.dataBox_send.length ; i++){
                            if(_this.dataBox_send[i]["id"] == value){
                                _this.dataBox_send[i]["status"] = 1
                            }
                        }
                    });

                    //标记后重新缓存
                    _this.cacheData_send =_this.dividePage(_this.dataBox_send,10);

                    //记住原来所在的页数
                    if(!_this.nowPage){_this.nowPage = 1}
                    _this.message_box.pageTurnTo(_this.nowPage,"message_send",_this.cacheData_send);
                    _this.pagination.render(_this.nowPage,_this.cacheData_send.length);

                //如果是在收到的通知界面
                }else if($("#message_container>div").hasClass("message_accept")){

                    $.each(markBox,function (index,value) {
                        for(var i=0 ; i<_this.dataBox_accept.length ; i++){
                            if(_this.dataBox_accept[i]["id"] == value){
                                _this.dataBox_accept[i]["status"] = 1
                            }
                        }
                    });
                    if(!_this.nowPage){_this.nowPage = 1}

                        //其中如果是选中所有通知
                    if($("#message-all").hasClass("active_type")){
                        var partData = _this.cacheData_accept;

                        //其中如果是选中未读通知
                    }else if($("#message-unread").hasClass("active_type")){

                        var afterFilter = _this.filter("status",0,_this.dataBox_accept);
                        var partData = _this.dividePage(afterFilter,10);

                        //其中如果是选中已读通知
                    }else if($("#message-read").hasClass("active_type")){
                        var afterFilter = _this.filter("status",1,_this.dataBox_accept);
                        var partData = _this.dividePage(afterFilter,10);

                    }

                        //通用页面刷新与分页器渲染
                    _this.message_box.pageTurnTo(_this.nowPage,"message_accept",partData);
                    _this.pagination.render(_this.nowPage,partData.length);
                }
            })

        },

    /*————————————————————————————————————————————————————————————————————————————————————————————*/
    /*以下为方法，不是事件*/
        //工具：根据输入的数组与size进行分页
        dividePage: function (data, size) {

            //拷贝了一个数组(一开始使用赋值来拷贝导致了严重的错误，因为是引用，所以会把原始数据也删除)
            var whole = $.extend([], data);
            var length = data.length;
            var totalPage = Math.ceil(length/parseInt(size));


            var cacheData = [];
            for(var i=0 ; i<totalPage ; i++){
                var part = [];
                for(var j=0 ; j<size ; j++){
                    if(whole[j]){
                        part.push(whole[j]);
                    }
                }

                //如果加一个删一个就会每次漏掉一个，所以要在循环外面删除
                whole.splice(0,size);

                cacheData.push(part)
            }
            return cacheData
        },

        //工具：过滤器，需要提供属性和值
        filter: function (attr,value,data) {
            var newData = [];
            for(var i =0 ; i<data.length ; i++){
                if(data[i][attr] == value){
                    newData.push(data[i])
                }
            }
            return newData
        },

        //刷新缓存数据
        refreshCache_send:function () {
            //缓存发送的通知
            var _this = this;
            $.ajax({
                url: "/r/Notice_Notice/getNoticeList",
                dataType: "json",
                async: true,
                data: { "outbox": "" },
                type: "GET",
                beforeSend: function() {
                    var html = loading("加载中，请稍后");
                    $(".content").empty().append(html);
                },
                success: function(req) {
                    if(req.code == 200){
                        _this.dataBox_send = req.data;
                        _this.cacheData_send =_this.dividePage(_this.dataBox_send,10);

                        var Page1 = _this.cacheData_send[0];
                        $("#message_container").empty();
                        $("#message_container").append(message_send_tpl);

                        //加载数据
                        for(var i = 0 ; i<Page1.length ; i++){
                            var newLi = $("<li data-id='"+Page1[i].id+"'> <input type='checkbox'/> <a  class='blue' href='/noticed.html?id="+ Page1[i].id +"'target='_blank'>"+Page1[i].title+"</a> <span class='time'>"+Page1[i].btime+"</span> </li>");
                            $(".message_send ul").append(newLi);
                        }
                        _this.pagination.render(1,_this.cacheData_send.length);
                    }
                }
            });

        },

        refreshCache_accept:function () {
            //缓存收到的所有通知
            var _this = this;

            $.ajax({
                url: "/r/Notice_Notice/getNoticeList",
                dataType: "json",
                async: true,
                data: { "inbox": "" , "state" : 3 },
                type: "POST",
                beforeSend: function() {
                    var html = loading("加载中，请稍后");
                    $(".content").empty().append(html);
                },
                success: function(req) {
                    if(req.code == 200){
                        //console.log(req)
                        _this.dataBox_accept = req.data;
                        _this.cacheData_accept =_this.dividePage(req.data,10);
                    }
                }
            });
        },

        dealData:function (data) {
            Ajax("/r/Notice_Notice/setNoticeStatus",
                {params:data,complete:function (res) {
                    console.log(res)
                }}
            )
            // $.ajax({
            //     url: "/r/Notice_Notice/setNoticeStatus",
            //     dataType: "json",
            //     async: false,
            //     data: data,
            //         type: "GET",
            //     // beforeSend: function() {
            //     //     var html = loading("加载中，请稍后");
            //     //     $(".content").empty().append(html);
            //     // },
            //     success: function(req) {
            //         console.log(req)
            //         return 1
            //     }
            // });
        }
    }
;


$(function () {
    Main.init()
});


