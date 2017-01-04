//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        plist:[
            {
                address:"福州",
                aid:"3385",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111381",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3386",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111382",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3387",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111383",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3388",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111384",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3389",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111385",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3390",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111386",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3391",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111387",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3385",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111388",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3385",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111389",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            },
            {
                address:"福州",
                aid:"3385",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111380",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            }
        ],
        hasMore: true,
        isLoading: false
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
        })
    },
    scrollToLower: function( e ) {
        if (!this.data.hasMore) return;

        this.setData({
            isLoading: true
        })
        
        wx.request({
            url: '',
            data: {
                x: '' ,
                y: ''
            },
            method: 'POST',
            success: function(res) {
                // console.log(res.data)
                this.setData({
                    isLoading: false
                })
            }
        })

        var ajaxData = {
                address:"福州",
                aid:"3385",
                area:"12|381|0",
                imgpath:"http://images.12301.test//123624/20160425/14615525996392_thumb.jpg",
                jsprice:"0.02",
                lid:"6603",
                pid:"111390",
                title:"（mm测试）江滨公园",
                tprice:"0.03"
            };
        
        var plist = this.data.plist;
        plist.push( ajaxData );
        
        this.setData({
            plist: plist
        })

        this.setData({
            isLoading: false
        })

    },
    onLoad: function () {
      console.log('onLoad')
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo
        })
      })
    }
})
