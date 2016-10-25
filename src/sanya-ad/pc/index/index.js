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
    if($(ele).is('[data-del]')) {
        // 删除广告
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
    } else if($(ele).is('[data-status]')) {
        // 上线/下线
        if($(ele).attr('data-status')==0) {
            $(this).html('下线').closest('td').prev().html('<span data-status="1" class="c-online">在线</span>');
        } else {
            $(this).html('上线').closest('td').prev().html('<span data-status="0" class="c-waiting">待上线</span>');
        }
        $(ele).attr('data-status', $(ele).attr('data-status')==0?'1':'0');
        $.ajax({
            url: '/r/adCO_AdCO/updateStatus',
            type: 'POST',
            data: {'id': $(ele).attr('data-adid'), 'status': $(ele).attr('data-status') },
            success: function(response) {
                ajaxGetPV(1);
            }
        });
    }
});

//测试数据
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

/*
    container   : 表格父元素id
    dataArray   : 填充数据
    pageNum     : 渲染当前页页码，从1开始
 */
function renderTB(container, dataArray, pageType) {
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
        i,
        temp = "";

    for( i = 0; i < dataArrayLen; i++) {
        temp += '<tr>';
        temp += '<td>' + pageType[dataArray[i].page_type] + ' - ' + dataArray[i].page_name + '</td>';
        temp += '<td><div class="clearfix"><img src="' + dataArray[i].pic_url + '" alt="" class="fl mr5" width="64" height="64" /><div>' + dataArray[i].ad_comment + '</div></div></td>';
        temp += '<td>' + dataArray[i].ad_url + '</td>';
        temp += '<td class="t-center">' + (dataArray[i].title == null ? '-':dataArray[i].title) + '</td>';
        temp += '<td class="t-center">' + (dataArray[i].hits == null? 0:dataArray[i].hits) + '</td>';
        temp += '<td>' + (dataArray[i].status==0?'<span data-status="0" class="c-waiting">待上线</span>':'<span data-status="1" class="c-online">在线</span>') + '</td>';
        temp += '<td><ul class="btn-group"><li><a href="sanyaad_ad.html?id='+ dataArray[i].id +'" class="btn-link">编辑</a></li><li><a href="javascript:;" class="btn-link" data-adid="'+ dataArray[i].id +'" data-status="'+ dataArray[i].status +'">' + (dataArray[i].status==0?'上线':'下线') + '</a></li><li><a href="javascript:;" class="btn-link" data-del="'+ dataArray[i].id +'">删除</a></li></ul></td>';
    }
    tbody.innerHTML = temp;
}

function ajaxManagerAd(page) {
    xhrGetPV = $.ajax({
        url: '/r/adCO_AdCO/managerAd',
        type: 'POST',
        data: {'page': page },
        success: function(response) {
            renderTB('datatableWrap', response.data.list, response.data.page_arr);
            pagination.render({current: page, total: response.data.totalPage});
        }
    });
}

var pagination = new Pagination({
        container : "#Pagination",  //必须，组件容器id
        count : 7,                //可选  连续显示分页数 建议奇数7或9
        showTotal : true,         //可选  是否显示总页数
        jump : true               //可选  是否显示跳到第几页
    }),
    xhrGetPV;

pagination.on("page.switch",function(toPage,currentPage,totalPage){
    // toPage :      要switch到第几页
    // currentPage : 当前所处第几页
    // totalPage :   当前共有几页
    ajaxManagerAd(toPage);
    $('html,body').animate({scrollTop:$('#datatableWrap').offset().top},500);
});

ajaxGetPV(1);