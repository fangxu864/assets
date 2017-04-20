module.exports = {
    //2017-04-20 判断是否是资源方帐号
    isResourceAccount : function(){
        var dtype = $.trim($("#dtypeHidInp").val());
        //如果是资源方帐号，dtype==2或3
        return (dtype==2 || dtype==3) ? true : false;
    }
}