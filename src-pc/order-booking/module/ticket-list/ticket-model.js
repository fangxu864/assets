var Model = PFT.Util.Class({
    data : [],
    initData : function(data){
        this.data = data;
    },
    getTargetTitket : function(opt){
        opt = opt || {};
        var pid = opt.pid;
        var aid = opt.aid;
        var tid = opt.tid;
        var data = this.data;

        for(var i=0,len=data.length; i<len; i++){
            var d = data[i];
            if(pid==d.pid && aid==d.aid && tid==d.tid){
                return d;
            }
        }

        return false;

    },
    changeCount : function(opt){
        opt = opt || {};
        var pid = opt.pid;
        var aid = opt.aid;
        var tid = opt.tid;
        var oldVal = opt.oldVal;
        var newVal = opt.newVal;

        var result = {
            isOk : true,
            code : -1,
            msg : ""
        };

        var tarTicket = this.getTargetTitket({aid:aid,pid:pid,tid:tid});
        if(!tarTicket){
            result.isOk = false;
            result.code = 0;
            msg = "不存在此票类";
            return result;
        }




    },
    changePrice : function(){

    },
    update : function(data){
        
    }
});

module.exports = Model;