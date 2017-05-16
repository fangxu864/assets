## 微平台订单查询相关业务

### 业务说明
订单查询是很重要的一个业务，在pc端，主要有两个页面组成：订单列表页、订单详情页 
由于移动端微信页面的限制，没法在一个窗口内打开多个标签页，所以在移动端，列表页跟详情页 
需要并合在一个页面内实现，即做成一个单页应用 
 
 
单页应用的路由目前选用backbone.js的Router模块 

### 订单查询的3大模块：
> 1. 订单列表模块 对应 ./ListManager
> 2. 搜索过滤模块 对应 ./SearchFilter
> 3. 订单详情模块 对应 ./Detail



### 需求文档
http://axure.12301.test/%E8%A7%84%E5%88%92%E4%B8%AD%E6%88%96%E5%B7%B2%E5%AE%8C%E6%88%90/%E5%BE%AE%E5%B9%B3%E5%8F%B00413/#g=1&p=订单列表

### 后端接口文档地址
http://git.12301.io/PFT/PFT_Documents/src/master/%E6%96%B0%E7%89%88%E5%BE%AE%E4%BF%A1B%E7%AB%AF%E4%BA%A7%E5%93%81%E9%A2%84%E8%AE%A2%E6%8E%A5%E5%8F%A3.md 
第30：获取订单列表

### 涉及到的项目及分支：
wx       feature/b-usercenter
asssets  develop
Service  release/b-ordersearch

### 页面访问
http://123624.12301.local/wx/b/order_query.html

### 前端编译
npm run local:mb ./src-mobile/B/order-query