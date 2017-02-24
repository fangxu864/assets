require("./index.scss");
var ListManager = require("./list-manager");
var Main = PFT.Util.Class({
    init : function(){
        var List = this.List = new ListManager();
    }
});


$(function(){
    new Main;
})