require('./index.scss');
require('./jquery.qrcode.min.js');

var posterList = $('#posterList'),
    nodataHTML = '<div class="nodata-wrap">暂无供应商产品海报</div>',
    pagination,
    xhrPoster;
var Pagination = require("COMMON/modules/pagination-x");

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

                if(res.data.list.length) {
                    posterList.html(renderList(res.data.list));

                    $('.QRCode').each(function(){
                        $(this).qrcode({width: 127,height: 127,text: $(this).attr('data-text')});
                    });

                    pagination.render({current: page, total: res.data.totalPage});
                } else {
                    //无数据
                    $('#paginationWrap').hide();
                    posterList.html(nodataHTML);
                }
            }
        });
}

function renderList(arr) {
    var tempStr = '';
    var link = (function(){
        var page = "/scenicDetail.html";
        var result = "";
        if(window.location.href.indexOf("/new/d/")<0){ //平台
            result = page;
        }else{ //二级域名
            result = ("/new/d" + page);
        }
        return result;
    })();
    for(var i=0, arrLen = arr.length; i<arrLen; i++) {
        tempStr += '    <div class="poster-item">'
                + '<div class="poster-img"><img src="' + arr[i].url + '"  alt=""></div>'
                + '<div class="poster-intro">'
                + '    <p class="poster-name" title="' + (arr[i].productName == null?'产品海报' : arr[i].productName) + '">' + arr[i].productName + '</p>'
                + '    <p class="poster-supply">供应商：' + arr[i].supply + '</p>'
                + '    <div class="clearfix"><a href="'+link+'?lid='+ arr[i].lid +'" class="fl" target="_blank">查看产品</a>'
                + '        <div class="fr QRdownload">下载到手机<i class="iconfont">&#xe66e;</i><div class="QRCode" data-text="'+ window.location.origin + arr[i].downUrl + '"></div></div></div></div></div>';
    }
    return tempStr;
}

$('#posterList').on('mouseenter', '.QRdownload', function(){
    $(this).children('.QRCode').show();
}).on('mouseleave', '.QRdownload', function(){
    $(this).children('.QRCode').hide();
});

// posterList.html(renderList(response.data.list));



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

    pagination.render({current:toPage,total:totalPage});

    if(xhrPoster && xhrPoster.status !== 200) {
        xhrPoster.abort();
    }

    $('html,body').animate({
        scrollTop: $('#p_content').offset().top
    }, 300);

    ajaxGetPoster(toPage, 9);
});

ajaxGetPoster(1, 9);

