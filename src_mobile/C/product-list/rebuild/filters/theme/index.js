var themeitem = PFT.Util.ParseTemplate(require("./themeitem.xtpl"));

var Theme = PFT.Util.Class({
    DEFAULT_TEXT: '主题',

    init: function( opt ){
        this.data = opt.data;
        this.parentObj = opt.host;
        this.container = opt.container;

        this.togglebtn = $('<a>', {
            class: 'ui-filterItem ui-flex-box',
            href: 'javascript:;',
            'data-filter': 'theme'
        }).appendTo( this.container ).append('<i class="filterIcon icon-ecshop-application icon-zhuti"></i>');

        this.title = $('<span>',{
            class: 't'
        }).appendTo(this.togglebtn).html( this.DEFAULT_TEXT );

        var that = this,
            themeHTML = that.renderList( this.data );

        that.SheetCore = new opt.SheetCore({
            content : themeHTML,
            yesBtn : {
                text: '不限',
                handler: function(){
                    that.title.html( that.DEFAULT_TEXT );
                    that.parentObj.container.removeClass('hide');
                },
                trigger: true
            },
            zIndex : 10004,
            EVENTS : {
                'tap .actionItem': function(e) {
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
        html += themeitem({ data : data });
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

module.exports = Theme;