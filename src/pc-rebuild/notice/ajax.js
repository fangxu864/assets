/**
 * Created by Administrator on 2016/12/1.
 */
function ajax(optionsOverride) {
    //ajax函数的默认参数
    var ajaxDefaultOption = {
        url : '#',
        method : 'GET',
        async : true,
        timeout : 0,
        data : null,
        dataType : 'text',
        headers : {},
        onprogress : function () {},
        onuploadprogress : function () {},
        xhr:null
    };
    var options = {};
    //合并传入参数和默认参数
    for (var i in ajaxDefaultOption){
        options[i] = optionsOverride[i] || ajaxDefaultOption[i];
    }
    //async的值为boolean要特殊处理
    options.async = options.async === false ? false : true ;
    //如果有传入xhr对象就用传入的，没有传入就新建
    var xhr = options.xhr = options.xhr || new XMLHttpRequest();


    //返回Promise实例
    return new Promise(function (resolve,reject) {

        //@请求基本配置
        xhr.open(options.method , options.url ,options.async);
        //@请求超时配置
        xhr.timeout = options.timeout;
        //@请求头配置
        for(var i in options.headers){
            xhr.setRequestHeader(i,options.headers[i]);
        }
        //@xhr进度事件
        //下载进度
        xhr.onprogress = options.onprogress;
        //上传进度
        xhr.upload.onprogress = options.onuploadprogress;
        //@xhr返回信息格式配置
        xhr.responseType = options.dataType;

        //@以下为各种情况Promise的返回状态
        //加载中断 返回reject
        xhr.onabort = function () {
            reject(new Error({
                errorType : 'abort_error',
                xhr : xhr
            }));
        };
        //加载错误 返回reject
        xhr.onerror = function () {
            reject(new Error({
                errorType : 'onerror',
                xhr : xhr
            }))
        };
        //加载超时 返回reject
        xhr.ontimeout = function () {
            reject(new Error({
                errorType : 'timeout_error',
                xhr : xhr
            }))
        };
        //加载完成 根据返回的status来判断Promise应该返回resolve还是reject
        xhr.onloaded = function () {
            //[200,300)表示接收请求正常，304表示已经有之前的缓存
            if((xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                resolve(xhr);
            } else{
                reject(new Error({
                    errorType : 'status_error'+"-"+xhr.status,
                    xhr : xhr
                }))
            }
        };

        //@进行发送
        try{
            xhr.send(options.data);
        }catch (e){
            reject(new Error({
                errorType : 'send_error',
                error:e
            }))
        }

    })
}