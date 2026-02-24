---
layout: default
title: Weekly Updates
---

# Weekly Governance Updates

Every Friday, we publish a summary of the week's AI governance movements: regulatory decisions, policy proposals, enforcement actions, and significant debates.

{% assign updates = site.updates | sort: 'date' | reverse %}

<div style="margin-top: 2rem;">
{% for update in updates %}
  <div class="card">
    <div class="timeline-date">{{ update.date | date: "%B %d, %Y" }}</div>
    <h3 style="margin-top: 0.5rem;">{{ update.title }}</h3>
    <p>{{ update.summary }}</p>
    <a href="{{ update.url }}">Read the full update →</a>
  </div>
{% endfor %}
</div>

{% if updates.size == 0 %}
  <p class="text-muted">Updates will appear here every Friday. Check back soon.</p>
{% endif %}
