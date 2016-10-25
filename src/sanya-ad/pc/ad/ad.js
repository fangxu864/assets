require("./ad.scss");

var urlParse    = PFT.Util.UrlParse(),
    adId        = urlParse.id,
    title       = $('#adForm').find('.section-header h2'),
    selPageType = $('#selPageType'),
    selPageName = $('#selPageName'),
    selPosition = $('#selPosition'),
    selProduct  = $('#selProduct'),
    adText      = $('#adText'),
    adUrl       = $('#adUrl');

//位置下拉菜单
var positionArr = ["头部", "尾部"],
    tempStr = '';

for(var i = 0, len = positionArr.length; i < len; i++) {
    tempStr += '<option data-position="' + i + '">' + positionArr[i] + '</option>';
}
selPosition.html('<option>请选择</option>' + tempStr);

//初始化图片上传
var Fileupload = require("COMMON/modules/fileupload");
var uploader = new Fileupload({
     container : "#Fileupload",    //必选 组件要显示在哪个容器内，可传容器id或jq对象
     action    : "/r/adCO_AdCO/uploadImg",       //必选 文件上传至后端，哪个接口地址处理
     id        : 1,                  //必选 页面上可能有好几个文件上传组件同时存在，用来标显组件唯一id(数字)
     loading   : function(){},//上传过程中的回调函数   可选
     complete  : function(response){
        var fileUploadCtn = document.getElementById('Fileupload');
        if(fileUploadCtn.getElementsByTagName('img').length) {
            fileUploadCtn.getElementsByTagName('img')[0].src = response.data.src;
        } else {
            var uploadedImg = document.createElement('img');
            uploadedImg.src = response.data.src;
            uploadedImg.width = 360;
            uploadedImg.className = 'mt10';
            fileUploadCtn.appendChild(uploadedImg);
        }
    }//上传结束后的回调函数   可选 建议后端返回的数据格式：{code:200,data:{src:"图片src地址"},msg:""}
});

//广告置放页面
var xhrSelPageType,
    xhrSelPageName,
    xhrSelProduct;

function ajaxSelPageType(pageType, pageId) {
    xhrSelPageType = $.ajax({
        url: '/r/adCO_AdCO/getPageType',
        type: 'POST',
        success: function(response){
            var tempStr = '';

            for( key in response.data) {
                tempStr += '<option data-ptype="' + key + '" ' + ((pageType!==undefined && pageType == key)?'selected':'') + '>' + response.data[key] + '</option>';
            }
            selPageType.html(tempStr);

            if(pageId === undefined) {
                pageType = pageType!==undefined ? pageType : selPageType.find("option:selected").attr('data-ptype');
                ajaxSelPageName(pageType);
            }
        }
    });
}
function ajaxSelPageName(typeId, pageId) {
    xhrSelPageName = $.ajax({
        url: '/r/adCO_AdCO/getPageInfo',
        type: 'POST',
        data: {"typeId": typeId},
        success: function(response){
            var tempStr = '';
            for(var i = 0, len = response.data.length; i < len; i++) {
                tempStr += '<option data-pageid="' + response.data[i].id + '" ' + ((pageId!==undefined && pageId == response.data[i].id)?'selected':'') + '>' + response.data[i].page_name + '</option>';
            }
            selPageName.html(tempStr);
        }
    });
}
function ajaxSelProduct(pId) {
    xhrSelProduct = $.ajax({
        url: '/r/adCO_AdCO/getLand',
        type: 'POST',
        success: function(response){
            var tempStr = '';
            for(var i = 0, len = response.data.length; i < len; i++) {
                tempStr += '<option data-pid="' + response.data[i].id + '" ' + ((pId!==undefined && pId == response.data[i].id)?'selected':'') + '>' + response.data[i].title + '</option>';
            }

            selProduct.html(tempStr);
        }
    });
}

selPageType.on('change', function(){
    var $this = $(this);

    if(xhrSelPageName) {
        xhrSelPageName.abort();
    }

    ajaxSelPageName(selPageType.find("option:selected").attr('data-ptype'));
});

ajaxSelPageType();
ajaxSelProduct();
if(adId === undefined) {
    title.html('新增广告');
} else {
    title.html('编辑广告');

    $.ajax({
        url: '/r/adCO_AdCO/getInfo',
        data: {"id": adId},
        type: 'POST',
        success: function(response){
            var responseData = response.data;

            console.log(responseData);

            //页面类型
            if(xhrSelPageType.status === 200) {
                selPageType.children('option').removeAttr('selected').end().children('[data-ptype="'+ responseData.page_type +'"]').attr('selected','selected');
            } else {
                xhrSelPageType.abort();
                ajaxSelPageType(responseData.page_type, responseData.page_id);
            }
            //页面名称
            if(xhrSelPageName.status === 200) {
                selPageName.children('option').removeAttr('selected').end().children('[data-pageid="'+ responseData.page_id +'"]').attr('selected','selected');
            } else {
                xhrSelPageName.abort();
                ajaxSelPageName(responseData.page_type, responseData.page_id);
            }

            //位置
            selPosition.children('option').removeAttr('selected').end().children('option[data-position="'+ responseData.position +'"]').attr('selected','selected');

            //适用产品
            if(xhrSelProduct.status === 200) {
                selProduct.children('option').removeAttr('selected').end().children('[data-pid="'+ responseData.product_id +'"]').attr('selected','selected');
            } else {
                xhrSelProduct.abort();
                ajaxSelProduct(responseData.product_id);
            }

            //推广文字
            adText.val(responseData.ad_comment);

            //推广图
            //如果用户在ajax请求返回前就重新上传图片，则不做处理，否则把ajax返回图片插入
            var fileUploadCtn = document.getElementById('Fileupload');
            if(!fileUploadCtn.getElementsByTagName('img').length) {
                var uploadedImg = document.createElement('img');
                uploadedImg.src = responseData.pic_url;
                uploadedImg.width = 360;
                uploadedImg.className = 'mt10';
                fileUploadCtn.appendChild(uploadedImg);
            }

            //推广链接地址
            adUrl.val(responseData.ad_url);
        }
    });
}




