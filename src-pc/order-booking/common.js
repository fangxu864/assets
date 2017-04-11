module.exports = {
    getPidAid : function(){
        var params = PFT.Util.UrlParse();
        return{
            pid : params.pid || "",
            aid : params.aid || ""
        }
    }
}