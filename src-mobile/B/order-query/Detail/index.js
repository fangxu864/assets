
var Dialog = require("pft-ui-component/Mb_Model");



var Detail  = PFT.Util.Class({
    init: function () {
        console.log(111);
        console.log(new Dialog(Dialog.getDefaultOption));
        var dialog = new Dialog(Dialog.getDefaultOption);
        console.log(dialog);
        dialog.open();
    }




});

module.exports = Detail;