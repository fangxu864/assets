<% _.each(tickets,function(item){ %>
<li data-id="<%=item.id%>" class="ticketItem">
    <span class="t"><%=item.name%></span>
</li>
<% }) %>
