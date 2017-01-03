/**
 * Created by Administrator on 2016/7/27.
 */
var UtilClass = require("COMMON/js/util.class");
var TabSwitch=require("./memlist/membercard.list");
var List=require("./memlist/list");


    var list=new List({
         container:"#memListContainer",
    });
  var tabswitch=new TabSwitch({
      container:"#memListContainer",
      List:list
  })
   module.exports = Main;    