require('./index.scss');
require('./jquery.qrcode.min.js');

var dialog = require('COMMON/modules/easydialog');

var posterList = $('#posterList'),
    pagination,
    xhrPoster;

function ajaxGetMyPoster( page, pageSize ) {
    xhrPoster = PFT.Util.Ajax(
        "/r/Mall_Poster/myProPosters/",
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
                + '    <p class="poster-name">' + (arr[i].productName == null?'产品海报' : arr[i].productName) + '</p>'
                + '    <div class="clearfix"><a href="posterimgupload_editmyposter.html?lid='+ arr[i].lid +'&sid=' + arr[i].sid + '" class="fl" target="_blank">编辑</a><a href="javascript:;" class="fl ml35 btnDelPoster" data-id="' + arr[i].id + '" data-product="'+ arr[i].productName +'">删除</a>'
                + '        <div class="fr QRdownload">下载到手机<i class="iconfont">&#xe66e;</i><div class="QRCode" data-text="' + arr[i].downUrl + '"></div></div></div></div></div>';
    }
    return tempStr;
}

function ajaxDelPoster(id) {
    var xhrDelPoster = PFT.Util.Ajax(
        '/r/Mall_Poster/delete/',
        {
            type:"POST",
            params:{
                "id": id
            },
            success:function(res){
                PFT.Util.STip("success", '删除海报成功', 1000, function(){
                    //删除海报成功回调
                });
            }
        }
    )
}

posterList.on('click', '.btnDelPoster', function(){
    var $this = $(this),
        posterId = $this.attr('data-id'),
        posterName = $this.attr('data-product');

    dialog.open({
        container : {
            header : '删除海报',
            content : '<div style="width:200px;padding:30px 0;">确定删除 ' + posterName + '?</div>',
            yesFn : function(){
                ajaxDelPoster(posterId);
                $this.parents('.poster-item').remove();

                if(posterList.children('.poster-item').length) {
                    ajaxGetMyPoster( $('#paginationWrap').find('.current').attr('data-page'), 9);
                } else {
                    if($('#paginationWrap').find('.current').attr('data-page') != 1) {
                        ajaxGetMyPoster( $('#paginationWrap').find('.current').attr('data-page') -1, 9);
                    } else {
                        $('#paginationWrap').hide();
                    }
                }
            },
            noFn : true
        }
    });
})

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
    jump : true               //可选  是否显示跳到第几页
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

    ajaxGetMyPoster(toPage, 9);
});

ajaxGetMyPoster(1, 9);