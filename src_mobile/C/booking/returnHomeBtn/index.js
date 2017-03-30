require("./index.scss");
var tpl = require("./index.xtpl");
var ReturnHome = PFT.Util.Class({
    // container : $("#container"),  
    EVENTS : {                    
    },
    init : function(){         
        $("body").append(tpl);
        $("#returnHomeBtn").on("click",function(){
            console.log("被点击了");
            window.location.href = "index.html";
        });
    }
});
module.exports = ReturnHome;
