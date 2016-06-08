<% _.each(products,function(item){ %>
<li data-id="<%=item.id%>" class="prodItem">
    <span class="t"><%=item.name%></span>
</li>
<% }) %>