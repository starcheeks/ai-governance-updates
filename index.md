---
layout: default
title: AI Governance Update
---

# AI Governance Update

Tracking regulation, policy decisions, and governance movements in artificial intelligence.

In the span of just a few years, artificial intelligence has gone from a research curiosity to a mainstream technology that governments are racing to regulate. The regulatory landscape is fragmented, evolving quickly, and increasingly consequential for anyone building or using AI systems.

**This site tracks:**
- **Weekly updates** on governance movements, regulatory decisions, and policy debates
- **An evolving timeline** of how we got here—from pre-generative AI regulation to today's patchwork of rules
- **Key decisions** from the EU, U.S., China, UK, and other jurisdictions
- **The ongoing fight** over who regulates AI: federal governments, states, or some hybrid approach

---

## Latest Updates

{% assign updates = site.updates | sort: 'date' | reverse | limit: 3 %}

<div class="updates-grid">
{% for update in updates %}
  <div class="update-card">
    <div class="update-date">{{ update.date | date: "%B %d, %Y" }}</div>
    <div class="update-title">{{ update.title }}</div>
    <div class="update-summary">
      {% if update.summary %}
        {{ update.summary }}
      {% else %}
        {{ update.content | truncate: 150 }}
      {% endif %}
    </div>
    <a href="{{ update.url }}" style="margin-top: 1rem; display: inline-block;">Read more →</a>
  </div>
{% endfor %}
</div>

<p style="text-align: center; margin-top: 2rem;">
  <a href="{{ '/updates/' | relative_url }}" style="font-size: 1.1rem;">View all weekly updates →</a>
</p>

---

## The Timeline

To understand today's governance debates, you need context. How did we get here? What happened before ChatGPT? Why do the U.S. and EU have such different approaches?

**[Explore the full timeline →]({{ '/history/' | relative_url }})** — From GDPR and algorithmic bias to the Biden and Trump executive orders, SB 1047, and the ongoing state vs. federal regulatory fight.

Key eras covered:
- **Pre-GenerativeAI (2016–2022):** Early regulation, algorithmic bias concerns
- **The ChatGPT moment (Nov 2022):** When AI became mainstream
- **The regulatory surge (2023–2024):** Global response to LLMs
- **The fragmentation (2024–2026):** Diverging paths—EU strict, U.S. fragmented, China controlled

---

## About This Site

This is a public resource for understanding AI regulation. It's maintained to be:

- **Fact-based** — We link to original sources and avoid opinion
- **Neutral** — We explain different viewpoints, not endorse them
- **Up-to-date** — Weekly updates track new developments
- **Accessible** — Written for non-technical readers who care about policy

**Who runs this?** A small team monitoring AI governance movements. Feedback welcome.

**Questions?** See the [About]({{ '/about/' | relative_url }}) page for how to engage.

---

## Start Here

**New to AI governance?** Start with the [Timeline]({{ '/history/' | relative_url }}) to build context.

**Keeping up with the latest?** Check [Weekly Updates]({{ '/updates/' | relative_url }}) every Friday.

**Want to dig deeper?** Each update links to original sources (bills, executive orders, news, analysis).

---

*Last update: {{ site.time | date: "%B %d, %Y" }}*
