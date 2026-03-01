# Integration Guide

**Connecting the Jekyll Dashboard to Your Existing Newsletter Workflow**

This guide explains how to integrate the new dashboard-based newsletter site with your existing AI Governance Newsletter workflow.

---

## Current Workflow (As-Is)

Based on the project structure, the current workflow appears to be:

1. **Newsletter skill** (`skills/ai-governance/`) generates content weekly
2. Content is researched from RSS feeds, web sources, and tracked regulations
3. Newsletter is formatted and sent (email/published)
4. Tracking files updated in `skills/ai-governance/data/`

---

## Proposed Workflow (To-Be)

### Weekly Publishing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Newsletter Content Generation (Existing Skill)          │
│    - Research regulatory updates                            │
│    - Compile key events, deadlines, jurisdictional data     │
│    - Generate article summaries                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Data Transformation (New Script)                        │
│    - Convert newsletter content to YAML format              │
│    - Calculate sentiment score                              │
│    - Classify event severity (Critical/Important/Watch)     │
│    - Output: _data/newsletter-YYYY-MM-DD.yml               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Newsletter Post Creation                                 │
│    - Generate _newsletters/YYYY-MM-DD-week-N.md             │
│    - Include front matter with metadata                     │
│    - Reference data file for dashboard rendering            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Jekyll Build & Deploy                                    │
│    - GitHub Actions triggers on push                        │
│    - Jekyll builds static site                              │
│    - Deploy to GitHub Pages                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Distribution (Optional)                                  │
│    - Email subscribers with link to dashboard               │
│    - Post to social media                                   │
│    - Update RSS feed (automatic)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Scripts

### Script 1: Convert Newsletter Content to YAML

Create: `skills/ai-governance/scripts/convert-to-yaml.sh`

```bash
#!/bin/bash
# Convert newsletter content to Jekyll data format

NEWSLETTER_DATE="$1"
INPUT_DIR="skills/ai-governance/data/output"
OUTPUT_DIR="agents/build-agent/data/output/_data"

# Source files (adjust paths to match your actual structure)
EVENTS_FILE="$INPUT_DIR/events-${NEWSLETTER_DATE}.json"
TRACKER_FILE="$INPUT_DIR/tracker.json"

# Output file
OUTPUT_FILE="$OUTPUT_DIR/newsletter-${NEWSLETTER_DATE}.yml"

# Convert JSON to YAML and calculate sentiment
python3 << 'PYTHON_SCRIPT'
import json
import yaml
import sys
from datetime import datetime

def calculate_sentiment(events):
    """
    Calculate sentiment score based on regulatory events.
    Higher = more permissive, Lower = more restrictive
    """
    score = 50  # Neutral baseline
    
    for event in events:
        if event.get('type') == 'tightening':
            score -= 5
        elif event.get('type') == 'loosening':
            score += 3
        
        if event.get('jurisdiction') == 'EU' and event.get('severity') == 'critical':
            score -= 8  # EU enforcement weighs heavily
    
    return max(0, min(100, score))  # Clamp to 0-100

def classify_severity(event):
    """Classify event severity"""
    keywords_critical = ['deadline', 'enforcement', 'penalty', 'required']
    keywords_important = ['guidance', 'framework', 'legislation', 'proposed']
    
    title_lower = event.get('title', '').lower()
    
    if any(kw in title_lower for kw in keywords_critical):
        return 'critical'
    elif any(kw in title_lower for kw in keywords_important):
        return 'important'
    else:
        return 'watch'

# Read input (adjust structure based on your actual data format)
# This is a template - customize based on your JSON structure

output = {
    'sentiment': {
        'current_value': 62,  # Calculate from events
        'label': 'Cautious',
        'zone': 'yellow',
        'trend': 'Calculated trend description'
    },
    'key_events': {
        'critical': [],
        'important': [],
        'watch': []
    },
    # ... add other sections
}

# Write YAML
print(yaml.dump(output, default_flow_style=False, sort_keys=False))

PYTHON_SCRIPT
```

### Script 2: Generate Newsletter Post

Create: `skills/ai-governance/scripts/generate-post.sh`

```bash
#!/bin/bash
# Generate Jekyll newsletter post

DATE="$1"  # Format: 2026-03-01
WEEK_NUM="$2"
TITLE="Week ${WEEK_NUM} - $(date -d ${DATE} '+%B %d, %Y')"

OUTPUT_FILE="agents/build-agent/data/output/_newsletters/${DATE}-week-${WEEK_NUM}.md"

cat > "$OUTPUT_FILE" << EOF
---
layout: default
title: "${TITLE}"
date: ${DATE} 08:00:00 -0500
description: Weekly AI governance update
tags: []
---

<!-- Dashboard will render here using data from _data/newsletter-${DATE}.yml -->

<section class="newsletter-content">
  <!-- Full newsletter content goes here -->
</section>
EOF

echo "Created: $OUTPUT_FILE"
```

### Script 3: Automated Weekly Workflow

Create: `skills/ai-governance/scripts/publish-to-jekyll.sh`

```bash
#!/bin/bash
# Master script for weekly newsletter publishing

set -e

NEWSLETTER_DATE=$(date +%Y-%m-%d)
WEEK_NUM=$(date +%V)  # ISO week number

REPO_ROOT="/home/otter/.openclaw/workspace"
SKILL_DIR="$REPO_ROOT/skills/ai-governance"
JEKYLL_DIR="$REPO_ROOT/agents/build-agent/data/output"

echo "📰 Publishing newsletter for $NEWSLETTER_DATE (Week $WEEK_NUM)"

# Step 1: Generate newsletter content (existing skill)
echo "→ Generating newsletter content..."
cd "$SKILL_DIR"
# Run your existing newsletter generation script here
# bash scripts/generate.sh

# Step 2: Convert to YAML format
echo "→ Converting to YAML..."
bash scripts/convert-to-yaml.sh "$NEWSLETTER_DATE"

# Step 3: Generate Jekyll post
echo "→ Creating Jekyll post..."
bash scripts/generate-post.sh "$NEWSLETTER_DATE" "$WEEK_NUM"

# Step 4: Commit and push to trigger GitHub Actions
echo "→ Deploying to GitHub Pages..."
cd "$JEKYLL_DIR"
git add .
git commit -m "Newsletter: Week $WEEK_NUM ($NEWSLETTER_DATE)"
git push origin main

echo "✅ Newsletter published! Live in ~2 minutes at GitHub Pages."
```

---

## Cron Job Setup

Add to your OpenClaw cron schedule:

```bash
# AI Governance Newsletter - Weekly publish (Fridays 8 AM EST)
0 8 * * 5 bash /home/otter/.openclaw/workspace/skills/ai-governance/scripts/publish-to-jekyll.sh
```

Or using OpenClaw's cron system:

```javascript
// Add to cron schedule
{
  "schedule": "0 8 * * 5",  // Fridays 8 AM
  "timezone": "America/New_York",
  "payload": {
    "kind": "agentTurn",
    "task": "Run AI Governance Newsletter publish workflow",
    "sessionLabel": "Newsletter Publish"
  }
}
```

---

## Data Mapping

### Your Current Structure → Jekyll Data Structure

Map your existing data to the Jekyll YAML format:

| Your Data | Jekyll Field | Notes |
|-----------|-------------|-------|
| `events.json` → Critical events | `key_events.critical[]` | Filter by severity |
| `tracker.json` → Deadlines | `deadlines[]` | Include countdown calculation |
| `jurisdictions.json` → Risk scores | `risk_meter[]` | Map to 0-100 scale |
| Sentiment calculation | `sentiment.current_value` | Algorithmic or manual scoring |

### Example Mapping Script

```python
# skills/ai-governance/scripts/map_data.py
import json

def map_events_to_jekyll(events_json):
    """Map your events format to Jekyll format"""
    with open(events_json) as f:
        events = json.load(f)
    
    jekyll_events = {
        'critical': [],
        'important': [],
        'watch': []
    }
    
    for event in events:
        severity = classify_event_severity(event)
        jekyll_event = {
            'id': event['id'],
            'title': event['title'],
            'date': event['date'],
            'jurisdiction': event['jurisdiction'],
            'jurisdiction_flag': get_flag_emoji(event['jurisdiction']),
            'severity': severity,
            'summary': event['summary']
        }
        jekyll_events[severity].append(jekyll_event)
    
    return jekyll_events

def classify_event_severity(event):
    """Your logic for classifying severity"""
    # Implement based on your criteria
    if event.get('impact_level') == 'high':
        return 'critical'
    elif event.get('impact_level') == 'medium':
        return 'important'
    else:
        return 'watch'

def get_flag_emoji(jurisdiction):
    """Map jurisdiction to flag emoji"""
    flags = {
        'EU': '🇪🇺',
        'US': '🇺🇸',
        'UK': '🇬🇧',
        'China': '🇨🇳',
        'Singapore': '🇸🇬',
        # Add more...
    }
    return flags.get(jurisdiction, '🌍')
```

---

## Sentiment Calculation Algorithm

Suggested approach for calculating the sentiment gauge:

```python
def calculate_sentiment_score(events, historical_scores):
    """
    Calculate 0-100 sentiment score where:
    - 0-25: Highly Restrictive (Red)
    - 25-50: Tightening (Orange)
    - 50-70: Cautious (Yellow)
    - 70-85: Encouraging (Green)
    - 85-100: Highly Permissive (Blue)
    """
    
    score = 50  # Neutral baseline
    
    # Factor 1: Event types this week
    for event in events:
        if 'enforcement' in event['title'].lower():
            score -= 8
        elif 'penalty' in event['title'].lower():
            score -= 10
        elif 'deadline moved forward' in event['summary'].lower():
            score -= 5
        elif 'guidance' in event['title'].lower():
            score += 2
        elif 'loosening' in event['summary'].lower():
            score += 5
    
    # Factor 2: Regulatory velocity (number of new rules)
    new_regulations_count = sum(1 for e in events if 'passed' in e['summary'].lower())
    score -= (new_regulations_count * 3)
    
    # Factor 3: Trend vs. last week
    if historical_scores:
        last_week = historical_scores[-1]
        trend = score - last_week
        # Dampen volatility
        score = last_week + (trend * 0.7)
    
    # Factor 4: Jurisdiction weighting
    eu_events = [e for e in events if e['jurisdiction'] == 'EU']
    if len(eu_events) > 3:  # High EU activity
        score -= 5
    
    # Clamp to valid range
    return max(0, min(100, round(score)))
```

---

## Testing the Integration

### Local Test

```bash
# 1. Generate test data
cd skills/ai-governance
bash scripts/generate.sh --test-mode

# 2. Convert to Jekyll format
bash scripts/convert-to-yaml.sh 2026-03-01

# 3. Preview Jekyll site
cd agents/build-agent/data/output
bundle exec jekyll serve

# 4. Open http://localhost:4000
```

### Validation Checklist

- [ ] Sentiment gauge renders correctly
- [ ] Events categorized properly (Critical/Important/Watch)
- [ ] Risk meter shows all jurisdictions
- [ ] Deadlines display with accurate countdowns
- [ ] Timeline shows past/current/future correctly
- [ ] Mobile layout works on 375px width
- [ ] All links functional
- [ ] RSS feed includes new post
- [ ] Archive page lists new edition

---

## Rollback Plan

If issues occur after deploying:

```bash
# Revert to previous GitHub Pages deployment
cd agents/build-agent/data/output
git revert HEAD
git push origin main

# Or rollback to specific version
git reset --hard <commit-hash>
git push --force origin main
```

---

## Monitoring & Alerts

Set up monitoring for:

1. **Build failures** - GitHub Actions will email on failure
2. **Broken links** - Use `html-proofer` in CI
3. **Accessibility issues** - Run `pa11y` in CI
4. **Performance** - Lighthouse CI checks

Example GitHub Action for validation:

```yaml
# .github/workflows/test.yml
name: Test

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
      - run: bundle install
      - run: bundle exec jekyll build
      - run: npm install -g html-proofer
      - run: htmlproofer ./_site --allow-hash-href
```

---

## Maintenance

### Weekly Tasks (Automated)
- Generate and publish newsletter
- Update sentiment gauge
- Refresh risk meter data
- Add new deadlines to tracker

### Monthly Tasks (Manual Review)
- Review sentiment calculation accuracy
- Audit event classifications
- Update color coding thresholds if needed
- Check analytics for engagement metrics

### Quarterly Tasks
- Review and update design system
- Audit accessibility compliance
- Performance optimization review
- User feedback analysis

---

## Support & Troubleshooting

### Common Issues

**Issue:** Dashboard cards not rendering  
**Fix:** Check `_data/newsletter-YYYY-MM-DD.yml` exists and is valid YAML

**Issue:** Sentiment gauge stuck at 0%  
**Fix:** Verify `dashboard.js` loaded; check browser console for errors

**Issue:** GitHub Pages deploy failed  
**Fix:** Check GitHub Actions log; common cause is invalid YAML front matter

**Issue:** Old newsletter still showing  
**Fix:** Clear browser cache; verify `index.html` pulls latest data file

---

## Future Enhancements

Planned improvements for Phase 2:

1. **Automated sentiment calculation** - ML model trained on historical data
2. **Real-time updates** - WebSocket connection for breaking news
3. **Personalization engine** - User-specific event filtering
4. **AI chat assistant** - Q&A about specific regulations
5. **Comparison tool** - Side-by-side jurisdiction analysis

---

## Contact

Questions about integration?  
Email: otterlover575@gmail.com  
Subject: "Jekyll Dashboard Integration"

---

**Ready to integrate!** Follow the scripts above to connect your existing workflow to the new dashboard.
