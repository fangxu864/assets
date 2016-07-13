<% if(Object.prototype.toString.call(data)=="[object Array]"){ %>
    <% if(data.length){ %>
        <% _.each(data,function(item,index){ %>
            <%
                var create_time = new Date(item.create_time*1000);
                var result = [];
                var month = (create_time.getMonth()+1) * 1;
                if(month<10) month = "0" + month;
                result.push(create_time.getFullYear());
                result.push(month);
                result.push(create_time.getDate());
                result = result.join("-");
            %>
            <tr data-id="<%=item.id%>" class="border-bottom listItem">
                <td class="virtual"><%=item.virtual_no%></td>
                <td class="card"><%=item.card_no%></td>
                <td class="physics"><%=item.physics_no%></td>
                <td class="createtime"><%=result%></td>
                <td><a data-virtual="<%=item.virtual_no%>" href="javascript:void(0);" class="deleteBtn">删除</a></td>
            </tr>
        <% }) %>
    <% }else{ %>
        <tr class="status empty"><td style="height:150px; text-align:center" colspan="5">暂无卡片...</td></tr>
    <% } %>
<% }else if(data=="loading"){ %>
    <tr class="status loading"><td style="height:150px; text-align:center" colspan="5">努力加载中...</td></tr>
<% }else if(data=="timeout"){ %>
    <tr class="status timeout"><td style="height:150px; text-align:center" colspan="5">请求超时，请稍后重试...</td></tr>
<% }else if(data=="error"){ %>
    <tr class="status error"><td style="height:150px; text-align:center" colspan="5">请求出错，请稍后重试...</td></tr>
<% }else{ %>
    <tr class="status fail"><td style="height:150px; text-align:center" colspan="5"><%=data%></td></tr>
<% } %>
