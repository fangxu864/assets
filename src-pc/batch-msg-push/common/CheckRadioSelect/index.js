var Util = PFT.Util;
var isObject = Util.isObject;
var isArray = Util.isArray;
var isUndefined = Util.isUndefined;
var CheckRadioSelect = PFT.Util.Class({
    init : function(opt){
        this.opt = opt;
        console.log(this.container);
        console.log(this.opt);
    },
    _createOption : function(){
        var option = this.opt.option;
        var type = option.type;
        var name = option.name;
        var html = "";
        if(isArray(option) && option.length){

        }else if(isObject(option)){

        }
    },
    disable : function(){

    },
    enable : function(){},
    getValue : function(){},
    setValue : function(){}
});


module.exports = function(container,opt){

    opt = opt || {};
    var def = {
        type : "checkbox",
        name : "",
        checked : "",
        onSelect : function(){},
        option : []
    };

    for(var i in def){
        if(typeof opt[i]=="undefined") opt[i] = def[i];
    }

    opt["container"] = container;




    return new CheckRadioSelect(opt)
}