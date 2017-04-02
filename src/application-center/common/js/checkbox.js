var Checkbox = function(opts) {
    var option = {
        selector: '.checkbox',
        callbacks: null
    };

    this.opts = $.extend({}, option, opts);

    this.init();
}

Checkbox.prototype = {
    init: function () {
        var _this = this,
            callbacks = _this.opts.callbacks;

        $(document).on('click', _this.opts.selector, function(e){
            e.preventDefault ? e.preventDefault() : e.returnValue = false ;

            if($(this).is('.disabled')) {
                return false;
            } else {
                $(this).toggleClass('checked').children(':checkbox').prop('checked', !!$(this).is('.checked'));
                var myFn = $.trim($(this).attr('data-fn'));

                if(myFn && typeof callbacks[myFn] == 'function') {
                    callbacks[myFn].call(this, _this);
                }
            }
        });
    },
    unCheck: function ( ele ) {
        if( ele ) {
            $(ele).removeClass('checked').children(':checkbox').prop('checked', false);
        } else {
            $(this.opts.selector).removeClass('checked').children(':checkbox').prop('checked', false);
        }
    }
}

module.exports = Checkbox;