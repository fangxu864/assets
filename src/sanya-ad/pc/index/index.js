/**
 * Author: huangzhiyang
 * Date: 2016/10/20 14:11
 * Description: ""
 */
require("./index.scss");


var Pagination = require("COMMON/modules/pagination-x");

//删除提示
function disp_confirm(text, okFunc, cancelFunc){
    var r=confirm(text?text:'');
    if (r==true) {
        //点击确定执行
        if($.isFunction(okFunc)) {
            okFunc();
        }
    } else {
        if($.isFunction(cancelFunc)) {
            cancelFunc();
        }
    }
}

$('.datatable-wrap').on('click', '.btn-link', function(e){
    var ele = e.target;
    if($(ele).html()=='删除') {
        disp_confirm('确定删除，并清除相关记录？',function(){
            $(ele).parents('tr').remove();
            $.ajax({
                url: '/r/adCO_AdCO/delAd',
                type: 'POST',
                data: {"id": $(ele).attr('data-del')},
                success: function(response){
                }
            });
        })
    }
});

var response = [
                    {
                        "id"        : 1,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容1",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品1",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 0,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 2,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容2",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品2",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 1,
                        "page_name" : "页面名称",
                        "status"    : 1,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容11",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容213",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    },
                    {
                        "id"        : 3,
                        "ad_comment": "广告文字内容广告文字内容广告文字内容广告文字内容3",
                        "ad_url"    : "http://www.baidu.com/",
                        "title"     : "适用产品3",
                        "pic_url"   : "http://static.12301.local/assets/build/local/images/sample.jpg",
                        "hits"      : 12301,
                        "position"  : 1,
                        "page_type" : 2,
                        "page_name" : "页面名称",
                        "status"    : 0,
                        "page_arr"  : ["类型1","类型2","类型3"]
                    }
                ];


// var container   = $('#datatableWrap'),
//     tb          = document.createElement('table'),
//     thead       = document.createElement('thead'),
//     tbody       = document.createElement('tbody'),
//     tempStr     = "";

// tb.setAttribute("class", "tb");
// tb.setAttribute("width", "100%");

// tempStr += '<tr>';
// tempStr += '<th width="75">广告置放页面</th>';
// tempStr += '<th>内容</th>';
// tempStr += '<th>链接地址</th>';
// tempStr += '<th width="50">适用产品</th>';
// tempStr += '<th width="40">点击量</th>';
// tempStr += '<th width="40">状态</th>';
// tempStr += '<th width="26">操作</th>';
// tempStr += '</tr>';
// thead.innerHTML = tempStr;

// tb.appendChild(thead);
// tb.appendChild(tbody);
// container.prepend(tb);

renderTB('datatableWrap', response, 1);


if(response.length>10) {
    var pagination = new Pagination({
            container : "#Pagination",  //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true               //可选  是否显示跳到第几页
        });
    pagination.render({current:1,total:Math.ceil(response.length/10)});
    pagination.on("page.switch",function(toPage,currentPage,totalPage){
        // toPage :      要switch到第几页
        // currentPage : 当前所处第几页
        // totalPage :   当前共有几页
        renderTB('datatableWrap', response, toPage>totalPage?totalPage:toPage);
        pagination.render({current:toPage,total:Math.ceil(response.length/10)});
        $('html,body').animate({scrollTop:$('#datatableWrap').offset().top},500);
    });
}

/*
    container   : 表格父元素id
    dataArray   : 填充数据
    pageNum     : 渲染当前页页码，从1开始
 */
function renderTB(container, dataArray, pageNum) {
    var tbody,
        jqContainer = $('#'+container);

    // 判断容器内是否有表格，
    // 有则选择表格主体元素，
    // 无则创建表格结构插入容器
    if(jqContainer.find('.tb').length) {
        tbody = document.getElementById(container).getElementsByTagName('tbody')[0];
    } else {
        var tb          = document.createElement('table'),
            thead       = document.createElement('thead'),
            tempStr     = "";

        tbody = document.createElement('tbody');
        tb.setAttribute("class", "tb");
        tb.setAttribute("width", "100%");

        tempStr += '<tr>';
        tempStr += '<th width="75">广告置放页面</th>';
        tempStr += '<th>内容</th>';
        tempStr += '<th>链接地址</th>';
        tempStr += '<th width="50">适用产品</th>';
        tempStr += '<th width="40">点击量</th>';
        tempStr += '<th width="40">状态</th>';
        tempStr += '<th width="26">操作</th>';
        tempStr += '</tr>';
        thead.innerHTML = tempStr;

        tb.appendChild(thead);
        tb.appendChild(tbody);
        jqContainer.prepend(tb);
    }

    // 填充数据到表格主体元素中
    var dataArrayLen = dataArray.length,
        totalPage = Math.ceil(dataArrayLen/10),
        pageNum = pageNum > totalPage ? totalPage : pageNum,
        i,
        temp = "";

    for( i = 10 * (pageNum-1); i < (totalPage>pageNum?10 * pageNum:dataArrayLen); i++) {
        temp += '<tr>';
        temp += '<td>' + dataArray[i].page_arr[dataArray[i].page_type] + ' - ' + dataArray[i].page_name + '</td>';
        temp += '<td><div class="clearfix"><img src="' + dataArray[i].pic_url + '" alt="" class="fl mr5" width="64" height="64" /><div>' + dataArray[i].ad_comment + '</div></div></td>';
        temp += '<td>' + dataArray[i].ad_url + '</td>';
        temp += '<td class="t-center">' + dataArray[i].title + '</td>';
        temp += '<td>' + dataArray[i].hits + '</td>';
        temp += '<td>' + (dataArray[i].status==0?'<span data-status="0" class="c-waiting">待上线</span>':'<span data-status="1" class="c-online">在线</span>') + '</td>';
        temp += '<td><ul class="btn-group"><li><a href="sanyaad_ad.html?id='+ dataArray[i].id +'" class="btn-link">编辑</a></li><li><a href="javascript:;" class="btn-link">' + (dataArray[i].status==0?'上线':'下线') + '</a></li><li><a href="javascript:;" class="btn-link" data-del="'+ dataArray[i].id +'">删除</a></li></ul></td>';
    }
    tbody.innerHTML = temp;
}

$.ajax({
    url:'/r/adCO_AdCO/getPV',
    type:'POST',
    error:function(XMLHttpRequest, textStatus, errorThrown){
        // jsonError = JSON.parse(XMLHttpRequest.responseText.split('\n')[1]);
        // $('#datatableWrap').html('<div class="p15">' + jsonError.msg + '</div>');
    },
    success: function(response){
        // * id    int     广告ID
        // * ad_comment    string  广告文字内容
        // * ad_url    string  广告链接地址
        // * title     string  适用产品
        // * pic_url   string  图片链接地址
        // * hits  int     点击量
        // * position  int     广告位置
        // * page_type     int     页面类型
        // * page_id   int     页面类型id
        // * status    int     广告状态，0待上线，1在线
        console.log(response);
    }
})