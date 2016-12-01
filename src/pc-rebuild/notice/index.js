/**
 * Author: ZhengJiashen
 * Date: 2016/11/30 10:10
 * Description: ""
 */
require("./index.scss");
require("./ajax.js");
var notice_tpl = require("./notice_tpl.xtpl");
var CHANGE_PAGE = require("./pagination_box/index.js");
var MESSAGE_BOX = require("./message_box/index.js");
var message_send_tpl = require("./message_box/message_send.xtpl");

var Main= {
        //初始化
        init: function () {

            var _this = this;

            //导入基础模版
            $(".system-notice").append(notice_tpl);

            //实例化各个模块
            _this.pagination = new CHANGE_PAGE();
            _this.message_box = new MESSAGE_BOX();


            //缓存后台数据
            var fakeData = [{content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
                {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"}
            ];

            var afterDevide =_this.dividePage(fakeData,5);
            var Page1 = afterDevide.cacheData[0];

            $("#message_container").empty();
            $("#message_container").append(message_send_tpl);
            //加载数据
            for(var i = 0 ; i<Page1.length ; i++){
                var li = $("<li> <input type='checkbox'/> <span class='blue'>"+Page1[i].content+"</span> <span class='time'>"+Page1[i].time+"</span> </li>");
                $(".message_send ul").append(li);
            }
            //分页器渲染
            _this.pagination.render(1, afterDevide.totalPage);


//运行模块交流部分
            this.CommunicateArea()
        },

//所有模块的交流区域
        CommunicateArea: function () {
            var _this = this;
            _this.message_box.on("changePage_send",function (page) {
                alert(page)
            })
        },

        dividePage: function (data, size) {

            //求出数据分页后的总页数
            var whole = data;
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
            return {cacheData:cacheData,totalPage:totalPage}
        }
    }
;


$(function () {
    Main.init()
});


