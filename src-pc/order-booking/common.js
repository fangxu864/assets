module.exports = {
    getPidAid : function(){
        var pid = $.trim($("#pidHidInp").val()) || "";
        var aid = $.trim($("#aidHidInp").val()) || "";
        return{
            pid : pid,
            aid : aid
        }
    },
    getFsid : function(){
        return $("#fsidHidInp").val();
    },
    getFsaccount : function(){
        return $("#fsaccountHidInp").val();
    },
    getFsname : function(){
        return $("#fsnameHidInp").val();
    }
}