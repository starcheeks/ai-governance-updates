# AI Governance Newsletter - Jekyll Dashboard

**A practitioner-first compliance dashboard for AI governance updates**

Built for auditors and compliance officers who need quick, actionable insights from dense regulatory information.

---

## 🎯 Features

### Dashboard Components (Phase 1)
- **Sentiment Gauge** - Real-time measurement of AI governance tightening/loosening trends
- **Key Events Card** - Severity-filtered news (Critical/Important/Watch)
- **Risk Meter** - Jurisdiction-level regulatory risk assessment
- **Deadlines Tracker** - Upcoming compliance deadlines with countdown
- **Historical Timeline** - Context of current events in regulatory cycle

### Design System
- **Mobile-first responsive** - Works perfectly on phones, tablets, and desktops
- **WCAG 2.1 AA compliant** - Accessible to all users
- **Color-coded risk levels** - Instant visual comprehension
- **Professional typography** - Optimized for scanning and reading
- **Semantic HTML** - SEO-friendly and screen reader compatible

---

## 🚀 Quick Start

### Prerequisites
- Ruby 2.7+ (for Jekyll)
- Bundler
- Git

### Installation

```bash
# 1. Clone/copy this directory to your GitHub Pages repository
cd your-repo

# 2. Install dependencies
bundle install

# 3. Run local development server
bundle exec jekyll serve

# 4. Open browser to http://localhost:4000
```

### GitHub Pages Deployment

```bash
# 1. Push to your GitHub repository
git add .
git commit -m "Launch AI Governance Newsletter dashboard"
git push origin main

# 2. Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch

# 3. Your site will be live at: https://yourusername.github.io/repo-name
```

---

## 📁 Project Structure

```
.
├── _config.yml              # Jekyll configuration
├── _layouts/
│   └── default.html         # Main layout template
├── _includes/               # Reusable components
├── _sass/
│   └── main.scss            # Design system styles
├── assets/
│   ├── css/
│   │   └── main.scss        # Compiled CSS
│   └── js/
│       └── dashboard.js     # Interactive components
├── _data/
│   └── sample-newsletter.yml # Newsletter data structure
├── index.html               # Dashboard homepage
├── archive.html             # Past newsletters
├── about.html               # About page
└── _newsletters/            # Individual newsletter posts
    └── 2026-03-01-week-9.md
```

---

## 📝 Creating a Newsletter

### Option 1: Manual (Quick)

1. Create a new file in `_newsletters/` folder:

```markdown
---
layout: default
title: "Week 9 - March 1, 2026"
date: 2026-03-01 08:00:00 -0500
description: Weekly AI governance update
---

<!-- Your content here -->
```

2. Update `_data/sample-newsletter.yml` with current week's data
3. Rebuild site: `bundle exec jekyll build`

### Option 2: Automated (Recommended)

**Integrate with existing workflow:**

```yaml
# .github/workflows/publish-newsletter.yml
name: Publish Newsletter

on:
  schedule:
    - cron: '0 8 * * 5'  # Every Friday at 8 AM EST
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          
      - name: Install dependencies
        run: bundle install
        
      - name: Generate newsletter data
        run: |
          # Your existing newsletter generation script
          # Output to _data/current-newsletter.yml
          
      - name: Build Jekyll site
        run: bundle exec jekyll build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

---

## 🎨 Customization

### Colors & Typography

Edit `_sass/main.scss` to customize the design system:

```scss
// Color palette
$primary-dark-blue: #1976D2;
$sentiment-red: #D32F2F;
$sentiment-orange: #F57C00;
// ... etc

// Typography
$font-stack: "Inter", "Open Sans", sans-serif;
$font-h1: 32px;
// ... etc
```

### Dashboard Cards

Cards are defined in `index.html`. To modify:

1. Edit HTML structure in `<div class="dashboard-card">` blocks
2. Update JavaScript in `assets/js/dashboard.js` for interactivity
3. Modify styles in `_sass/main.scss` under `// DASHBOARD CARDS` section

### Data Structure

All dashboard data is in `_data/sample-newsletter.yml`:

```yaml
sentiment:
  current_value: 62
  label: "Cautious"
  
key_events:
  critical:
    - title: "Event title"
      date: "2026-03-15"
      jurisdiction: "EU"
      
risk_meter:
  - jurisdiction: "EU"
    risk_level: 78
    risk_label: "HIGH RISK"
```

---

## 🔌 Integration with Existing Newsletter

### From RSS Feed

If your current newsletter is RSS-based:

```ruby
# _plugins/rss_importer.rb
require 'rss'
require 'open-uri'

module Jekyll
  class RSSImporter < Generator
    def generate(site)
      feed_url = 'https://your-feed-url.com/rss'
      rss = RSS::Parser.parse(URI.open(feed_url))
      
      # Process items and create newsletter data
      # ...
    end
  end
end
```

### From Email (Mailgun/SendGrid)

Use their webhooks to trigger GitHub Actions:

```yaml
# Webhook endpoint triggers workflow
# Parses email → extracts data → updates _data/newsletter.yml → rebuild
```

### From Manual Google Doc

Use Google Sheets API:

```python
# scripts/import_from_sheets.py
import gspread
import yaml

# Fetch data from Google Sheet
# Convert to newsletter.yml format
# Commit to repository
```

---

## 📊 Analytics Setup

### Google Analytics

Uncomment in `_layouts/default.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### Privacy-Focused Alternative (Plausible)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🧪 Testing

### Accessibility

```bash
# Install pa11y
npm install -g pa11y

# Test homepage
pa11y http://localhost:4000

# Test with different screen readers
# - macOS: VoiceOver (Cmd+F5)
# - Windows: NVDA
```

### Mobile Responsiveness

```bash
# Chrome DevTools device emulation
# Test breakpoints: 375px, 768px, 1024px, 1280px+
```

### Performance

```bash
# Google Lighthouse
lighthouse http://localhost:4000 --view

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 100
```

---

## 🐛 Troubleshooting

### Jekyll build fails

```bash
# Clear cache and rebuild
bundle exec jekyll clean
bundle exec jekyll build --verbose
```

### CSS not updating

```bash
# Force Sass recompilation
touch _sass/main.scss
bundle exec jekyll build
```

### JavaScript not loading

Check browser console for errors. Ensure `assets/js/dashboard.js` is properly linked in `_layouts/default.html`.

### Dashboard cards not rendering

1. Check `_data/sample-newsletter.yml` is valid YAML
2. Verify JavaScript is enabled in browser
3. Check console for errors in `dashboard.js`

---

## 📈 Phase 2 Roadmap (Future)

- [ ] **Personalization filters** - Industry/jurisdiction-specific views
- [ ] **Calendar export** - .ics file generation for deadlines
- [ ] **Compliance callout boxes** - Automated "What this means for you" sections
- [ ] **Executive briefing PDF** - Auto-generated 1-page summary
- [ ] **Peer benchmark data** - Company response tracking
- [ ] **Search functionality** - Full-text search across newsletters
- [ ] **Email subscriptions** - Automated email delivery via Mailchimp/SendGrid
- [ ] **Dark mode** - Toggle for low-light reading

---

## 🤝 Contributing

This is a private project, but suggestions welcome:

1. Open an issue describing the enhancement
2. Reference the design spec in `content/newsletter-design-comprehensive-plan.md`
3. Submit PR with clear description of changes

---

## 📄 License

Copyright © 2026 Rill (AI Governance Team). All rights reserved.

---

## 📧 Contact

**Newsletter Email:** otterlover575@gmail.com  
**Frequency:** Weekly (Fridays, 8 AM EST)  
**Timezone:** America/New_York

---

## 🙏 Credits

- **Design System:** Based on Material Design and WCAG 2.1 AA guidelines
- **Typography:** Inter & Open Sans (Google Fonts)
- **Icons:** Unicode emoji for maximum compatibility
- **Built with:** Jekyll, Sass, vanilla JavaScript

---

**Built with care for compliance practitioners who deserve better tools.**
