var typeitem = PFT.Util.ParseTemplate(require("./typeitem.xtpl"));

var City = PFT.Util.Class({
    DEFAULT_TEXT: '景区',

    init: function( opt ){
        this.data = opt.data;
        this.parentObj = opt.host;
        this.container = opt.container;

        this.togglebtn = $('<a>', {
            class: 'ui-filterItem ui-flex-box',
            href: 'javascript:;',
            'data-filter': 'type',
            'data-type': 'A'
        }).appendTo( this.container ).append('<i class="filterIcon icon-u-regular icon-dizhi"></i>');

        this.title = $('<span>',{
            class: 't'
        }).appendTo(this.togglebtn).html( this.DEFAULT_TEXT );

        var that = this,
            typeListHTML = that.renderList( this.data );

        that.SheetCore = new opt.SheetCore({
            content : typeListHTML,
            noBtn : {
                handler: function(){
                	that.parentObj.container.removeClass('hide');
                },
                trigger: true
            },
            zIndex : 10004,
            EVENTS : {
                'tap .actionItem': function(e) {
                    that.togglebtn.attr( 'data-type', $(e.currentTarget).attr('data-type') );
                    that.title.html( $(e.currentTarget).html() );
                    that.hide();
                    that.parentObj.container.removeClass('hide');
                }
            }
        });
        that.SheetCore.close();
    },
    renderList: function( data ){
        var html = '';

        html += '<ul class="actionUl">';
        html += typeitem({ data : data });
        html += '</ul>';

        return html;
    },
    show: function(){
        this.SheetCore.show();
    },
    hide: function(){
        this.SheetCore.close();
    }
})

module.exports = City;