
//---------css--------
require("./index.scss");
//--------modules-----
var ManageModule = require("./manage/index.js");
var ConfigModule = require("./config/index.js");

$(function () {
    ManageModule.show();
});