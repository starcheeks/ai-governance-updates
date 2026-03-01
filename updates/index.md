---
layout: default
title: Weekly Updates
---

<main class="site-content wide">

# Weekly Governance Updates

Every week, we publish a summary of AI governance movements: regulatory decisions, policy proposals, enforcement actions, and significant debates.

<div class="updates-filter-bar">
  <button class="filter-btn active" data-impact="all">All</button>
  <button class="filter-btn" data-impact="high">High Impact</button>
  <button class="filter-btn" data-impact="medium">Medium</button>
  <button class="filter-btn" data-impact="low">Low</button>
</div>

{% assign updates = site.updates | sort: 'date' | reverse %}

<div class="updates-list">
{% for update in updates %}
  <div class="update-card" data-impact="{{ update.impact | default: 'all' }}">
    <div class="update-card-date">{{ update.date | date: "%B %d, %Y" }}</div>
    {% if update.impact %}<span class="impact-badge impact-{{ update.impact }}">{{ update.impact | capitalize }}</span>{% endif %}
    <div class="update-card-title">{{ update.title }}</div>
    <div class="update-card-summary">
      {% if update.summary %}{{ update.summary }}{% else %}{{ update.content | strip_html | truncate: 200 }}{% endif %}
    </div>
    <div class="update-card-footer">
      <div class="update-card-tags">
        {% if update.tags %}{% for tag in update.tags %}<span class="card-tag">{{ tag }}</span>{% endfor %}{% endif %}
      </div>
      <a href="{{ update.url | relative_url }}" class="update-card-link">Read full issue &rarr;</a>
    </div>
  </div>
{% endfor %}
</div>

{% if updates.size == 0 %}
<p class="empty-state">Weekly issues will appear here. Check back soon.</p>
{% endif %}

</main>
