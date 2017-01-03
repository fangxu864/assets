var cityitem = PFT.Util.ParseTemplate(require("./cityitem.xtpl"));

var City = PFT.Util.Class({
    DEFAULT_TEXT: '所有城市',

    init: function( opt ){
        this.data = opt.data;
        this.parentObj = opt.host;
        this.container = opt.container;

        this.togglebtn = $('<a>', {
            class: 'ui-filterItem ui-flex-box',
            href: 'javascript:;',
            'data-filter': 'city'
        }).appendTo( this.container ).append('<i class="filterIcon icon-ecshop-application icon-suoyouchengshi"></i>');

        this.title = $('<span>',{
            class: 't'
        }).appendTo(this.togglebtn).html( this.DEFAULT_TEXT );

        this.data = this.sort( this.data );

        var that = this,
            cityListHTML = that.renderList( this.data );

        that.SheetCore = new opt.SheetCore({
            header : '<a class="leftBtn" href="javascript:void(0)" slot="left"><i class="uicon uicon-jiantou-sin-left"></i></a><h3 class="fixHeaderTitle" style="text-align:center" slot="center">选择城市</h3>',
            height : $(window).height(),
            content : cityListHTML,
            yesBtn : {
                text: that.DEFAULT_TEXT,
                handler: function(){ that.parentObj.container.removeClass('hide'); },
                trigger: true
            },
            noBtn : {
                handler: function(){ that.parentObj.container.removeClass('hide'); }
            },
            zIndex : 10004,
            EVENTS : {
                'tap .leftBtn': function() { that.hide(); that.parentObj.container.removeClass('hide'); },
                'tap .cityItem': function() { that.hide(); that.parentObj.container.removeClass('hide'); }
            }
        });
    },
    sort: function( data ) {
        var arr = [],
            i,
            dataLen = data.length;

        for( i= 0; i < dataLen; i++ ) {
            (function( arr, item ){
                var i, len, obj = {};
                if( arr.length ) {
                    for( i = 0, len = arr.length; i<len; i++) {
                        if( arr[i][item.pin] ) {
                            arr[i][item.pin].push( item );
                            break;
                        }
                    }
                    if( i==len ) {
                        obj[item.pin] = [item];
                        arr[i] = obj;
                    }
                } else {
                    obj[item.pin] = [item];
                    arr[0] = obj;
                }
            })( arr, data[i] );
        }

        return arr;
    },
    renderList: function( data ){
        var html = '';

        html += '<ul class="cityList">';
        html += cityitem({ data : data });
        html += '</ul>';

        return html;
    },
    show: function(){
        this.SheetCore.show()
    },
    hide: function(){
        this.SheetCore.close();
    }
})

module.exports = City;