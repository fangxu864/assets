/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:15:23 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-08 16:49:53
 */
var ShowLinkTicketPop = require("./showLinkTicketPop");
var Main = {
    init : function(){
        var showLinkTicketPop = this.showLinkTicketPop = new ShowLinkTicketPop();
        
    }
};


$(function(){ Main.init()})