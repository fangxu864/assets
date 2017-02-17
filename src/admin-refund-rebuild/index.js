/**
 * Created by Administrator on 2017/2/17.
 */

var tpl = require("./index.xtpl");
$(function () {

    frame = document.createElement('IFRAME');
    document.body.appendChild(frame);

    frame.contentWindow.document.write(tpl);
    frame.contentWindow.document.close();
    frame.contentWindow.close();
    frame.contentWindow.focus();
    frame.contentWindow.print();
})


