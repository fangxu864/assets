
#下载文件公共类：DownFile
主要用到DownFile里面的judgeType方法
基本过程是：
    1.下载前使用judge方法请求后端接口，然后根据后端提示判断是立即下载，还是去下载中心下载
    /**
         * @method                   判断下载类型，是否可以直接下载还是需要进入下载中心进行下载
         * @param params    obj      下载文件时需要传输的参数
         * @param type      string   判断下载类型时需要传输的特定数字
         * @param originUrl string   下载接口
         * return                     1:提示用户后台正在打包压缩需下载的文件，此时可引导用户进入下载中心的页面
         *                            2:弹出错误
         *                            3:直接请求原来的下载
         *                            4:后台已生成过该文件，引导用户去下载中心下载
         */
        judgeType : function ( params , type ,originUrl ) {
            ...
            ...
         }
