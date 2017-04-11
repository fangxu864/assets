require("./index.scss");
var Tpl = require("./index.xtpl");
var ShowTime = PFT.Util.Class({
    init : function(opt){
        var startDate = this.startDate = opt.startDate;
        this.refresh(startDate);

        this.poper = null;
        this.mask = null;

    },
    createPoper : function(){
        this.poper = $('<div id="showTimePoper" class="showTimePoper"></div>').appendTo($("body"));
        return this.poper;
    },
    createMask : function(){
        this.mask = $('<div id="showTimePoperMask" class="showTimePoperMask"></div>').appendTo($("body"));
        return this.mask;
    },
    open : function(){
        if(!this.poper){
            this.poper = this.createPoper();
            this.mask = this.createMask();
        }
    },
    close : function(){

    },
    refresh : function(date){
        
    }
});

module.exports = ShowTime;