require('./index.scss');
require('./jquery.qrcode.min.js');

var posterList = $('#posterList'),
    // resArr = [],
    pagination,
    xhrPoster;

function ajaxGetPoster( page, pageSize ) {
    xhrPoster = PFT.Util.Ajax(
        "/r/Mall_Poster/supplyProPosters/",
        {
            type:"POST",
            params:{
                "page": page,
                "pageSize": pageSize
            },
            loading: function(){

            },
            success:function(res){
                // var resIndex;

                // if(resArr.length) {
                //     for(var i=0, resArrLen = resArr.length; i<resArrLen; i++) {
                //         if(resArr[i].page == res.data.page) {
                //             resIndex = i;
                //             break;
                //         }
                //     }
                //     if(resIndex == undefined) {
                //         resArr.push(res.data);
                //     }
                // } else {
                //     resArr.push(res.data);
                // }

                if(res.data.list.length) {
                    posterList.html(renderList(res.data.list));

                    $('.QRCode').each(function(){
                        $(this).qrcode({width: 127,height: 127,text: $(this).attr('data-text')});
                    });

                    pagination.render({current: page, total: res.data.total});
                } else {
                    //无数据
                    $('#paginationWrap').hide();
                }
            }
        });
}

function renderList(arr) {
    var tempStr = '';
    for(var i=0, arrLen = arr.length; i<arrLen; i++) {
        tempStr += '    <div class="poster-item">'
                + '<div class="poster-img"><img src="' + arr[i].url + '"  alt=""></div>'
                + '<div class="poster-intro">'
                + '    <p class="poster-name">' + arr[i].productName + '</p>'
                + '    <p class="poster-supply">供应商：' + arr[i].supply + '</p>'
                + '    <div class="clearfix"><a href="'+ arr[i].downUrl +'" class="fl" target="_blank">查看产品</a>'
                + '        <div class="fr QRdownload">下载到手机<i class="iconfont">&#xe66e;</i><div class="QRCode" data-text="' + arr[i].downUrl + '"></div></div></div></div></div>';
    }
    return tempStr;
}

$('#posterList').on('mouseenter', '.QRdownload', function(){
    $(this).children('.QRCode').show();
}).on('mouseleave', '.QRdownload', function(){
    $(this).children('.QRCode').hide();
});

// posterList.html(renderList(response.data.list));

var Pagination = require("COMMON/modules/pagination-x");

pagination = new Pagination({
    container : "#paginationWrap", //必须，组件容器id
    // count : 7,                //可选  连续显示分页数 建议奇数7或9
    showTotal : true,         //可选  是否显示总页数
    jump : true	              //可选  是否显示跳到第几页
});
pagination.on("page.switch",function(toPage,currentPage,totalPage){
    // toPage :      要switch到第几页
    // currentPage : 当前所处第几页
    // totalPage :   当前共有几页
    var resIndex;

    pagination.render({current:toPage,total:totalPage});

    // if(resArr.length) {
    //     for(var i=0, resArrLen = resArr.length; i<resArrLen; i++) {
    //         if(resArr[i].page == toPage) {
    //             resIndex = i;
    //             break;
    //         }
    //     }
    //     if(resIndex != undefined) {
    //         posterList.html(renderList(resArr[resIndex].list));
    //         $('.QRCode').each(function(){
    //             $(this).qrcode({width: 127,height: 127,text: $(this).attr('data-text')});
    //         });
    //         return;
    //     }
    // }

    if(xhrPoster && xhrPoster.status !== 200) {
        xhrPoster.abort();
    }

    $('html,body').animate({
        scrollTop: $('#p_content').offset().top
    }, 300);

    ajaxGetPoster(toPage, 9);
});

ajaxGetPoster(1, 9);