/**
 * Created by Administrator on 2016/7/27.
 */
var UtilClass = require("COMMON/js/util.class");
var TabSwitch=require("./memlist/membercard.list");
var List=require("./memlist/list");

/*var Main = UtilClass({
    init : function(opt) {
      
       
    }
});*/
  console.log(List);
  var tabswitch=new TabSwitch({
      container:"#memListContainer",
      List:List
  })
   module.exports = Main;    