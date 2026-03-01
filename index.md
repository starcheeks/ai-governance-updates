---
layout: default
title: AI Governance Update
---

<section class="hero">
  <div class="hero-inner">
    {% assign latest = site.updates | sort: 'date' | reverse | first %}
    {% if latest %}
    <div class="hero-overline">LATEST ISSUE</div>
    <h1>{{ latest.title }}</h1>
    <div class="hero-meta">{{ latest.date | date: "%B %d, %Y" }} · {{ latest.content | number_of_words | divided_by: 250 | plus: 1 }} min read</div>
    <p class="hero-summary">
      {% if latest.summary %}{{ latest.summary }}{% else %}{{ latest.content | strip_html | truncate: 200 }}{% endif %}
    </p>
    <a href="{{ latest.url | relative_url }}" class="btn-outline">Read this issue →</a>
    {% else %}
    <div class="hero-overline">AI GOVERNANCE UPDATE</div>
    <h1>Tracking AI Regulation, Policy & Governance</h1>
    <p class="hero-summary">A weekly briefing on the regulatory decisions, policy proposals, and governance movements shaping the future of artificial intelligence.</p>
    {% endif %}
    <p class="hero-cta-line">Published weekly. Covering U.S. federal, state, EU, and international AI policy.</p>
  </div>
</section>

<div class="topic-row" style="margin-top: 48px;">
  <span class="topic-tag">Executive Orders</span>
  <span class="topic-tag">EU AI Act</span>
  <span class="topic-tag">State Laws</span>
  <span class="topic-tag">Federal Policy</span>
  <span class="topic-tag">China AI Rules</span>
  <span class="topic-tag">UK Regulation</span>
  <span class="topic-tag">Enforcement</span>
  <span class="topic-tag">Preemption Debates</span>
</div>

<div class="section-heading">
  <h2>Recent Issues</h2>
</div>

{% assign updates = site.updates | sort: 'date' | reverse %}

<div class="cards-grid">
{% for update in updates limit: 8 %}
  <div class="update-card">
    <div class="update-card-date">{{ update.date | date: "%B %d, %Y" }}</div>
    {% if update.impact %}<span class="impact-badge impact-{{ update.impact }}">{{ update.impact | capitalize }}</span>{% endif %}
    <div class="update-card-title">{{ update.title }}</div>
    <div class="update-card-summary">
      {% if update.summary %}{{ update.summary }}{% else %}{{ update.content | strip_html | truncate: 150 }}{% endif %}
    </div>
    <div class="update-card-footer">
      <div class="update-card-tags">
        {% if update.tags %}{% for tag in update.tags %}<span class="card-tag">{{ tag }}</span>{% endfor %}{% endif %}
      </div>
      <a href="{{ update.url | relative_url }}" class="update-card-link">Read →</a>
    </div>
  </div>
{% endfor %}
</div>

{% if updates.size > 8 %}
<div class="view-all">
  <a href="{{ '/updates/' | relative_url }}">View all issues →</a>
</div>
{% endif %}

<section class="cta-section">
  <div class="cta-inner">
    <h2>Stay Informed</h2>
    <p>AI governance moves fast. New regulations, enforcement actions, and policy debates emerge every week across the U.S., EU, China, and beyond.</p>
    <a href="{{ '/history/' | relative_url }}" class="btn-outline">Explore the full timeline →</a>
  </div>
</section>
