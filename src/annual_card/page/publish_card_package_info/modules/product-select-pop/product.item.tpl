<% _.each(products,function(item){ %>
<li data-prodid="<%=item.id%>" class="prodItem">
    <span class="t"><%=item.name%></span>
</li>
<% }) %>