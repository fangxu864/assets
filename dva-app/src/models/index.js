/**
 * Author: huangzhiyang
 * Date: 2016/12/19 14:03
 * Description: ""
 */
module.exports = function(app){

    var __Models = [
        require("./index/user-info"),
        require("./index/app-used"),
    ];

    __Models.forEach(function(model){
        app.model(model);
    })


}
