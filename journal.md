---
<%* j = tp.user.journal(tp.file.title) -%>
type: journal
kind: <% j.kind %>
title: <% j.filename %>
aliases: <% j.aliases %>
tags: <% j.tags %>
<% j.frontmatter %>
created: <% j.now %>
uuid: <% tp.user.uuid() %>
summary: 
---
## <% j.title %>
<% j.nav %>

...<% tp.file.cursor(1) %>

<% j.extra %>
### <% j.dataviewTitle %>
<% j.dataview %>
