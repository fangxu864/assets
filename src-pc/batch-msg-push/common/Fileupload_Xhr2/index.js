module.exports = function(url,opt){
    if(!url) return false;
    var fn = function(){};
    opt = PFT.Util.Mixin({
        loading : fn,
        complete : fn,
        success : fn,
        timeout : fn,
        serverError : fn,
        unSupport : fn
    },opt);

    var support = "FormData" in window;
    var params = opt.params;
    var fd = new FormData();
    var xhr = new XMLHttpRequest();

    if(!support) return opt.unSupport();

    for(var i in params) fd.append(i,params[i]);
    opt.loading();
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            opt.complete(xhr.responseText);
            if(xhr.status==200){
                opt.success(JSON.parse(xhr.responseText))
            }else{
                opt.serverError(xhr,xhr.responseText);
            }
        }
    };
    xhr.open("post", url, true);
    xhr.send(fd);
    return xhr;

}