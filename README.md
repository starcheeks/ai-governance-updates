# AI Governance Update — Public Website

A Jekyll-based GitHub Pages site tracking AI regulation, policy, and governance movements globally.

## What's Included

**v1 Site Structure:**

```
ai-governance-site/
├── _config.yml              # Jekyll configuration
├── _layouts/default.html    # Base HTML layout
├── css/style.css            # Dark theme styling
├── index.md                 # Home page
├── about.md                 # About page
├── history/
│   └── index.md            # Full timeline (pre-GenAI → 2026)
├── updates/
│   └── index.md            # Weekly updates index
├── _updates/
│   └── 2026-02-21-week-1.md # First sample weekly update
└── assets/
    └── timeline.js         # Timeline interactivity (placeholder)
```

## Content

### Timeline (`history/index.md`)

**2,500+ words** covering:
- Pre-GenAI regulation (2016–2022)
- ChatGPT launch as inflection point (Nov 2022)
- Global regulatory surge (2023–2024)
- Biden Executive Order (Oct 2024)
- Trump Executive Order & deregulation (Jan 2025)
- SB 1047 saga and state vs. federal fight
- International divergence (EU strict, China controlled, U.S. fragmented)
- Current landscape (Feb 2026)

**Includes:**
- Original sources linked
- Impact badges (Critical, High, Medium, Low)
- Why each event matters for developers
- Further reading section

### Weekly Updates Template (`_updates/`)

Each Friday, publish a new update (YAML front matter + markdown). Example provided shows:
- Top 3–5 stories of the week
- Analysis section
- "What to Watch" preview
- Source links

### Homepage (`index.md`)

Aggregate view of latest updates + links to timeline and weekly updates.

### About (`about.md`)

Public-facing page explaining who maintains the site, what it covers, and how to contribute.

## How to Use

### Local Testing

```bash
# Navigate to the site directory
cd /home/otter/.openclaw/workspace/projects/ai-governance-site

# Install Jekyll (if needed)
gem install jekyll bundler

# Build and serve locally
jekyll serve
# Visit http://localhost:4000
```

### Publishing to GitHub Pages

1. **Create a GitHub repository** (e.g., `ai-governance-updates`)
2. **Push this directory** to the `main` branch
3. **Enable GitHub Pages** in repository settings (set source to `main`, folder `/`)
4. **Site appears at** `https://yourusername.github.io/ai-governance-updates`

### Publishing Weekly Updates

Add a new file to `_updates/`:

```
_updates/2026-02-28-week-2.md
```

With YAML front matter:

```yaml
---
date: 2026-02-28
title: "Week 2: [Headline]"
summary: "One-sentence summary of the week's governance movements."
---
```

The site will auto-generate the updates page with newest first.

## Customization

- **Site Title/URL:** Edit `_config.yml`
- **Colors:** Update CSS variables in `css/style.css`
- **Navigation:** Edit nav links in `_layouts/default.html`
- **Author/Email:** Update in `_config.yml` and `about.md`

## Content Guidelines

**Tone:**
- Fact-based, sourced
- Neutral (explain different viewpoints, not endorse)
- Accessible to non-technical readers
- Include why each event matters

**Structure (Weekly Updates):**
- Top 3–5 stories of the week
- 2–3 paragraphs per story with "Why it matters"
- Analysis section tying stories together
- "What to Watch" for next week

**Sourcing:**
- Link to original legislation, EOs, bills
- Link to news coverage from multiple outlets
- Include government/official statements

## Next Steps

1. **Review the timeline** for accuracy and balance. Send feedback to Donovan.
2. **Decide on GitHub repo name** (e.g., `ai-governance-updates`, `AI-Policy-Tracker`, `AIGovWatch`)
3. **Set up GitHub repo** and configure GitHub Pages
4. **Publish first weekly update** (template provided for Feb 21 week)
5. **Set up automation** (cron job Friday mornings to generate/publish updates)

## Automation (Future)

Once published, a cron job will:
- Read RSS feeds from governance sources (at midnight daily)
- Generate a weekly summary (Friday at 2 PM via Sonnet)
- Commit and push new update to GitHub Pages
- Site auto-rebuilds

For now, updates are manual.

## Questions?

- **Historical timeline accuracy:** Is there anything misleading or outdated?
- **Weekly update format:** Does the structure work? Too long? Too short?
- **Coverage focus:** Are there events we should prioritize that we're missing?

---

**Status:** v1 Ready for Review (Feb 21, 2026)  
**Next Milestone:** GitHub Pages deployment + first public publish  
**Maintenance:** Weekly updates + timeline updates as events occur
