/**
 * Created by Administrator on 2017/5/26.
 */


/**
 * 虚拟表格的实现与操作
 * @type {{}}
 */
module.exports  = {

    /**
     * 创建虚拟表格
     * @param rowNum 行数
     * @param colNum 列数
     */
    createTb: function ( rowNum , colNum ) {
        var row = Number(rowNum);
        var col = Number(colNum);
        var virtualTb = [];
        for(var j = 0 ;j<row ; j++ ){
            virtualTb.push(new Array(col))
        }
        return virtualTb;
    },

    /**
     * 插入数据到表格
     * @param tb 
     * @param row
     * @param col
     * @param value
     */
    insert: function ( tb ,row ,col ,value ) {
        tb[row][col] = value
    }

};
