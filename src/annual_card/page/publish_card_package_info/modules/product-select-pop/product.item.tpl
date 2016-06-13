<% _.each(products,function(item){ %>
<li data-prodid="<%=item.id%>" data-applyid="<%=item.apply_did%>" class="prodItem">
    <span class="t"><%=item.title%></span>
</li>
<% }) %>