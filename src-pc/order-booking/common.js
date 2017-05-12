module.exports = {
    getPidAid : function(){
        var pid = $.trim($("#pidHidInp").val()) || "";
        var aid = $.trim($("#aidHidInp").val()) || "";
        return{
            pid : pid,
            aid : aid
        }
    }
}