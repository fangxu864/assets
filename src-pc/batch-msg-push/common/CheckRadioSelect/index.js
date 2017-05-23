var CheckRadioSelect = PFT.Util.Class({
    init : function(opt){

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