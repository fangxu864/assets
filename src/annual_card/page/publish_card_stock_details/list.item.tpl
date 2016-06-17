<% if(Object.prototype.toString.call(data)=="[object Array]"){ %>
    <% if(data.length){ %>
        <% _.each(data,function(item,index){ %>
            <tr data-id="<%=item.id%>" class="border-bottom listItem">
                <td class="virtual"><%=item.virtual_no%></td>
                <td class="card"><%=item.card_no%></td>
                <td class="physics"><%=item.physics_no%></td>
                <td class="createtime"><%=item.create_time%></td>
                <td><a data-virtual="<%=item.virtual_no%>" href="javascript:void(0);" class="deleteBtn">删除</a></td>
            </tr>
        <% }) %>
    <% }else{ %>
        <tr class="status empty"><td>暂无卡片...</td></tr>
    <% } %>
<% }else if(data=="loading"){ %>
    <tr class="status loading"><td>努力加载中...</td></tr>
<% }else if(data=="timeout"){ %>
    <tr class="status timeout"><td>请求超时，请稍后重试...</td></tr>
<% }else if(data=="error"){ %>
    <tr class="status error"><td>请求出错，请稍后重试...</td></tr>
<% }else{ %>
    <tr class="status fail"><td><%=data%></td></tr>
<% } %>
