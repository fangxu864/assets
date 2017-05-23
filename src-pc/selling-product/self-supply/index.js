/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:15:23 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-10 12:15:21
 */
var ShowLinkTicket = require("./showLinkTicket");
var Main = {
    init : function(){
        var showLinkTicket = this.showLinkTicket = new ShowLinkTicket();
        
    }
};


$(function(){ Main.init()})