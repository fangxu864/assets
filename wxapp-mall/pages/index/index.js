//index.js
//获取应用实例
var app = getApp(),
    common = require('../../utils/common.js');

Page({
    data: {
        plist: [],
        hasMore: true,
        isHasMoreHidden: false,
        isLoading: false,
        pageSize: 10,
        lastPos: 0
    },
    onLoad: function () {
        var that = this;

        this.getData({
            loading: function() {
                common.showLoading();
            },
            complete: function ( res ) {},
            success: function ( res ) {
                common.hideLoading();

                that.setData({
                    plist: res.data.list,
                    lastPos: res.data.lastPos
                })
            }
        })
    },
    getData: function( opt ) {
        var that = this;

        if (!this.data.hasMore) return;

        if( !this.data.isLoading ) {
            common.request({
                url: '/r/Mall_Product/productList/',
                data: {
                    keyword: '',
                    topic: '',
                    type: 'all',
                    city: '',
                    pageSize: this.data.pageSize,
                    lastPos: this.data.lastPos
                },
                debug: false,
                loading : function(){
                    if( opt.loading ) {

                        opt.loading();

                    } else {

                        that.setData({
                            isLoading: true
                        })

                    }
                },
                complete: function( res ) {
                    opt.complete && opt.complete( res );
                },
                success: function( res ) {
                    if( !opt.loading ) {
                        that.setData({
                            isLoading: false
                        });
                    }

                    opt.success && opt.success( res );
                }
            })
        } else {
            console.log('正在请求  请稍后');
        }
    },
    //事件处理函数
    navigateToDetail: function( e ) {
        var currentTarget = e.currentTarget,
            dataset = currentTarget.dataset,
            lid = dataset.lid,
            ptype = dataset.ptype,
            topic = dataset.topic;
            
        wx.navigateTo({
          url: 'pdetail?lid=' + e.currentTarget.dataset.lid + '&ptype=' + ptype + '&topic=' + topic
        });
    },
    scrollToLower: function( e ) {
        var that = this;

        this.getData({
            complete: function ( res ) {},

            success: function ( res ) {
                that.setData({
                    plist: that.data.plist.concat( res.data.list ),
                    lastPos: res.data.lastPos
                })

                if( res.data.lastPos == that.data.lastPos ) {
                    that.setData({
                        hasMore: false
                    });

                    setTimeout(function(){
                        that.setData({
                            isHasMoreHidden: true
                        });
                    }, 3000);
                }
            }
        })
    }
})
