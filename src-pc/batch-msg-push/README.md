## 平台批量消息推送相关业务

### 目前包含2个页面：
> 1. 单个消息的创建及编辑页，目录：edit-msg
> 2. 消息列表页，目录：list


### 目录结构
> 1. common       存放批量消息推送相关的公用业务逻辑，方法，配置参数，ajax url等..
> 2. edit-create  新建&编辑 消息页面
> 3. list         消息列表页



### 消息列表页 list

Views:    feature/bat_send_msg  (分支名随后端) 
Service : feature/bat_send_msg  
assets :  develop  目录：./src-pc/batch-msg-push/list

npm run local ./src-pc/batch-msg-push/list


页面访问：http://my.12301.local/new/batchPushInfo.html