/**
 * Author: huangzhiyang
 * Date: 2016/5/30 16:15
 * Description: ""
 */
require("./style.scss");
var FastClick = require("fastclick");
var GMasker = require("COMMON/modules/wx-gloading-mask");
var Api = require("./api");

FastClick.attach(document.body);
var TopSearch = require("./modules/top-search")({Api:Api});
var FilterBar = require("./modules/filter-bar")({Api:Api});
