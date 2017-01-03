require("./index.scss");

var renderTpl = PFT.Util.ParseTemplate(require("./index.xtpl"));

var Search = PFT.Util.Class({
    init : function( opts ){
        var _this = this;

        this.container = $(opts.container);

        this.renderHtml();

        this.container.on('input propertychange', '.searchInp', function(){
            var clearBtn = _this.container.find('.clearBtn');

            if( $.trim( $(this).val() ) ) {
                clearBtn.addClass('show');
            } else {
                clearBtn.removeClass('show');
            }

            opts.callbacks.input && opts.callbacks.input( $(this).val() );

        }).on('click', '.clearBtn', function(){

            _this.container.find('.searchInp').val('');
            $(this).removeClass('show');
            opts.callbacks.clear && opts.callbacks.clear();

        }).find('.searchInp').focus(function(){
            var clearBtn = _this.container.find('.clearBtn');

            if( $.trim( $(this).val() ) ) {
                clearBtn.addClass('show');
            } else {
                clearBtn.removeClass('show');
            }

            opts.callbacks.focus && opts.callbacks.focus( $(this).val() );

        }).blur(function(){

            opts.callbacks.blur && opts.callbacks.blur( $(this).val() );

        })
    },
    renderHtml : function( data ){
        var html = renderTpl( data );

        this.container.append( html );
    }
});
module.exports = Search;