require('./select.css');

var ModalSelect = FPT.Util.Class({

    init: function( opt ) {
        var defaultOpt = {
            container: 'body',  // ModalSelect父元素，默认body
            target: '',         // 绑定元素
            onSelect: null,     // 选中后回调函数
            selectOptions: null // 数据选项
        }

    }

})

module.exports = ModalSelect;