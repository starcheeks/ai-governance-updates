/* ==========================================================================
   AI Governance Newsletter Dashboard — Interactive JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Sample Data
     ----------------------------------------------------------------------- */
  const SENTIMENT_DATA = {
    score: 75,
    zone: 'favorable',
    label: 'Neutral-Favorable',
    trend: -15,
    trendText: 'Shifted 15% tighter this month',
    comparison: 'vs +5% last month',
    factors: {
      newsTone: 62,
      enforcement: 55,
      newsVolume: 40,
      industrySentiment: 78,
      marketSentiment: 81
    }
  };

  const EVENTS_DATA = [
    {
      id: 'evt-001',
      severity: 'critical',
      title: 'EU AI Act Compliance Deadline Announced',
      description: 'European Commission sets March 15 deadline for high-risk AI system compliance documentation submissions. Organizations deploying high-risk AI must submit conformity assessments, technical documentation, and quality management system evidence.',
      date: '2026-02-25',
      jurisdiction: 'EU',
      impact: 'All organizations deploying high-risk AI systems in the EU must act before March 15. Non-compliance could result in fines up to 3% of global annual turnover.',
      sources: [
        { title: 'European Commission Official Announcement', url: '#' },
        { title: 'AI Act Implementation Tracker', url: '#' }
      ]
    },
    {
      id: 'evt-002',
      severity: 'important',
      title: 'US Senate AI Safety Hearing Scheduled',
      description: 'Senate Commerce Committee schedules hearing on AI safety frameworks for March 22. Expected to cover mandatory disclosure requirements and algorithmic impact assessments.',
      date: '2026-02-26',
      jurisdiction: 'US',
      impact: 'Could signal direction of federal AI legislation. Industry groups should prepare testimony and position statements.',
      sources: [
        { title: 'Senate Commerce Committee Calendar', url: '#' },
        { title: 'Congressional AI Caucus Update', url: '#' }
      ]
    },
    {
      id: 'evt-003',
      severity: 'watch',
      title: 'UK AI Safety Institute Publishes Framework Update',
      description: 'Updated voluntary standards for AI testing and evaluation released for public comment. Includes new benchmarks for frontier model evaluation and safety testing protocols.',
      date: '2026-02-27',
      jurisdiction: 'UK',
      impact: 'Voluntary for now, but likely to influence mandatory standards in 2027. Organizations should review and submit comments during the 60-day window.',
      sources: [
        { title: 'UK AI Safety Institute Publication', url: '#' },
        { title: 'DSIT Policy Brief', url: '#' }
      ]
    }
  ];

  const DEADLINES_DATA = [
    { id: 'dl-001', title: 'EU AI Act Compliance Comments Due', date: '2026-03-15', daysAway: 14, icon: '📅' },
    { id: 'dl-002', title: 'US Senate AI Safety Hearing', date: '2026-03-22', daysAway: 21, icon: '⚖️' },
    { id: 'dl-003', title: 'UK AI Standards Public Feedback Closes', date: '2026-03-30', daysAway: 29, icon: '🗣️' },
    { id: 'dl-004', title: 'NIST AI Risk Management Framework v2 Published', date: '2026-04-15', daysAway: 45, icon: '📋' },
    { id: 'dl-005', title: 'EU AI Act High-Risk Registration Opens', date: '2026-05-01', daysAway: 61, icon: '📊' }
  ];

  /* -----------------------------------------------------------------------
     Gauge Rendering
     ----------------------------------------------------------------------- */
  const GAUGE_ZONES = [
    { start: 0,   end: 25,  color: '#D32F2F', label: 'Critical' },
    { start: 25,  end: 50,  color: '#F57C00', label: 'Warning' },
    { start: 50,  end: 70,  color: '#FBC02D', label: 'Neutral' },
    { start: 70,  end: 85,  color: '#388E3C', label: 'Favorable' },
    { start: 85,  end: 100, color: '#1976D2', label: 'Excellent' }
  ];

  function percentToAngle(pct) {
    // Map 0-100 to -180° to 0° (left to right semicircle)
    return -180 + (pct / 100) * 180;
  }

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  function renderGaugeSegments() {
    const svg = document.querySelector('.gauge-svg');
    if (!svg) return;

    const segmentsGroup = svg.querySelector('.gauge-segments');
    if (!segmentsGroup) return;

    const cx = 120, cy = 140, r = 90;

    GAUGE_ZONES.forEach(zone => {
      const startAngle = -180 + (zone.start / 100) * 180;
      const endAngle = -180 + (zone.end / 100) * 180;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', describeArc(cx, cy, r, startAngle, endAngle));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', zone.color);
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'butt');
      path.setAttribute('opacity', '0.85');

      // Tooltip region
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${zone.label}: ${zone.start}%–${zone.end}%`;
      path.appendChild(title);

      segmentsGroup.appendChild(path);
    });
  }

  function animateNeedle(targetScore) {
    const needle = document.querySelector('.gauge-needle');
    if (!needle) return;

    const targetAngle = percentToAngle(targetScore);
    const startAngle = -180;
    const duration = 1200;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentAngle = startAngle + (targetAngle - startAngle) * eased;

      needle.setAttribute('transform', `rotate(${currentAngle}, 120, 140)`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  /* -----------------------------------------------------------------------
     Risk Bars Animation
     ----------------------------------------------------------------------- */
  function animateRiskBars() {
    const bars = document.querySelectorAll('.risk-bar');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const target = bar.getAttribute('data-target');
            // Slight stagger based on index
            const index = Array.from(bars).indexOf(bar);
            setTimeout(() => {
              bar.style.width = target + '%';
            }, index * 150);
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    bars.forEach(bar => observer.observe(bar));
  }

  /* -----------------------------------------------------------------------
     Risk Tooltips
     ----------------------------------------------------------------------- */
  function initRiskTooltips() {
    const riskItems = document.querySelectorAll('.risk-item');

    riskItems.forEach(item => {
      const tooltip = item.querySelector('.risk-tooltip');
      if (!tooltip) return;

      const barTrack = item.querySelector('.risk-bar-track');

      barTrack.addEventListener('mouseenter', () => {
        tooltip.hidden = false;
      });

      barTrack.addEventListener('mouseleave', () => {
        tooltip.hidden = true;
      });

      // Keyboard support
      barTrack.setAttribute('tabindex', '0');
      barTrack.addEventListener('focus', () => {
        tooltip.hidden = false;
      });
      barTrack.addEventListener('blur', () => {
        tooltip.hidden = true;
      });
    });
  }

  /* -----------------------------------------------------------------------
     Modal System
     ----------------------------------------------------------------------- */
  const modal = document.getElementById('event-modal');
  let previousFocusElement = null;

  function openModal(eventId) {
    const eventData = EVENTS_DATA.find(e => e.id === eventId);
    if (!eventData || !modal) return;

    previousFocusElement = document.activeElement;

    // Populate modal
    const badge = modal.querySelector('.modal-severity-badge');
    badge.textContent = eventData.severity.charAt(0).toUpperCase() + eventData.severity.slice(1);
    badge.setAttribute('data-severity', eventData.severity);

    modal.querySelector('.modal-title').textContent = eventData.title;
    modal.querySelector('.modal-jurisdiction').textContent = eventData.jurisdiction;
    modal.querySelector('.modal-date').textContent = formatDate(eventData.date);
    modal.querySelector('.modal-description').textContent = eventData.description;
    modal.querySelector('.modal-impact-text').textContent = eventData.impact;

    const sourcesList = modal.querySelector('.modal-sources-list');
    sourcesList.innerHTML = '';
    eventData.sources.forEach(source => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = source.url;
      a.textContent = source.title;
      a.setAttribute('rel', 'noopener noreferrer');
      li.appendChild(a);
      sourcesList.appendChild(li);
    });

    // Show modal
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus trap — focus the close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';

    if (previousFocusElement) {
      previousFocusElement.focus();
      previousFocusElement = null;
    }
  }

  function initModal() {
    if (!modal) return;

    // Close button
    modal.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Click overlay to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });

    // Focus trap
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || modal.hidden) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     Event Card Clicks
     ----------------------------------------------------------------------- */
  function initEventClicks() {
    document.querySelectorAll('.event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const eventId = btn.getAttribute('data-event-id');
        if (eventId) openModal(eventId);
      });
    });
  }

  /* -----------------------------------------------------------------------
     Toggle Group (Sentiment Time Range)
     ----------------------------------------------------------------------- */
  function initToggleGroup() {
    const toggleGroup = document.querySelector('.toggle-group');
    if (!toggleGroup) return;

    const buttons = toggleGroup.querySelectorAll('.toggle-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('toggle-btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('toggle-btn--active');
        btn.setAttribute('aria-selected', 'true');

        const range = btn.getAttribute('data-range');
        updateSentimentRange(range);
      });
    });
  }

  function updateSentimentRange(range) {
    // In production, this would fetch new data. For now, show a toast.
    showToast(`Viewing ${range}-day sentiment data`);
  }

  /* -----------------------------------------------------------------------
     Sentiment Factors Expand/Collapse
     ----------------------------------------------------------------------- */
  function initSentimentExpand() {
    const expandBtn = document.querySelector('[data-action="expand-sentiment"]');
    const factorsPanel = document.querySelector('.sentiment-factors');
    if (!expandBtn || !factorsPanel) return;

    expandBtn.addEventListener('click', () => {
      const isHidden = factorsPanel.hidden;
      factorsPanel.hidden = !isHidden;
      expandBtn.textContent = isHidden ? 'Hide contributing events' : 'View contributing events';

      if (isHidden) {
        // Animate factor bars
        factorsPanel.querySelectorAll('.factor-bar').forEach(bar => {
          const value = bar.getAttribute('data-value');
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.width = value + '%';
            });
          });
        });
      }
    });
  }

  /* -----------------------------------------------------------------------
     Calendar Export
     ----------------------------------------------------------------------- */
  function initCalendarExport() {
    document.querySelectorAll('[data-action="calendar-export"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const deadlineId = btn.getAttribute('data-deadline-id');
        const deadline = DEADLINES_DATA.find(d => d.id === deadlineId);
        if (!deadline) return;

        generateICS(deadline);
        showToast(`Calendar event exported: ${deadline.title}`);
      });
    });
  }

  function generateICS(deadline) {
    const dateStr = deadline.date.replace(/-/g, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Governance Newsletter//EN',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${deadline.title}`,
      'DESCRIPTION:AI Governance Newsletter Deadline',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deadline.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* -----------------------------------------------------------------------
     Timeline Scroll to Current
     ----------------------------------------------------------------------- */
  function initTimeline() {
    const scrollContainer = document.querySelector('.timeline-scroll');
    const currentEntry = document.querySelector('.timeline-entry--current');

    if (scrollContainer && currentEntry) {
      // Wait for layout, then scroll to center current position
      requestAnimationFrame(() => {
        const containerRect = scrollContainer.getBoundingClientRect();
        const entryRect = currentEntry.getBoundingClientRect();
        const scrollLeft = entryRect.left - containerRect.left - containerRect.width / 2 + entryRect.width / 2;
        scrollContainer.scrollLeft = scrollLeft;
      });
    }

    // Hover details
    document.querySelectorAll('.timeline-entry').forEach(entry => {
      entry.addEventListener('mouseenter', () => {
        entry.style.zIndex = '2';
      });
      entry.addEventListener('mouseleave', () => {
        entry.style.zIndex = '';
      });
    });
  }

  /* -----------------------------------------------------------------------
     Toast Notification
     ----------------------------------------------------------------------- */
  function showToast(message, duration) {
    duration = duration || 3000;
    const toast = document.querySelector('.toast');
    const toastMsg = document.querySelector('.toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.hidden = false;

    // Re-trigger animation
    toast.style.animation = 'none';
    toast.offsetHeight; // force reflow
    toast.style.animation = '';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.hidden = true;
    }, duration);
  }

  /* -----------------------------------------------------------------------
     Utility
     ----------------------------------------------------------------------- */
  function formatDate(isoDate) {
    const date = new Date(isoDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /* -----------------------------------------------------------------------
     Responsive Handling
     ----------------------------------------------------------------------- */
  function handleResize() {
    // Timeline: switch between horizontal/vertical handled by CSS
    // Gauge: SVG is responsive via viewBox
  }

  /* -----------------------------------------------------------------------
     Initialization
     ----------------------------------------------------------------------- */
  function init() {
    // Render gauge
    renderGaugeSegments();
    animateNeedle(SENTIMENT_DATA.score);

    // Risk bars
    animateRiskBars();
    initRiskTooltips();

    // Modal
    initModal();
    initEventClicks();

    // Sentiment controls
    initToggleGroup();
    initSentimentExpand();

    // Calendar
    initCalendarExport();

    // Timeline
    initTimeline();

    // Resize
    window.addEventListener('resize', handleResize);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
