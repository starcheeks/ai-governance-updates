/**
 * AI Governance Newsletter - Dashboard Interactivity
 * Handles sentiment gauge, event filtering, and interactive components
 */

// ============================================
// SENTIMENT GAUGE
// ============================================
class SentimentGauge {
  constructor(containerId, initialValue = 62) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.value = initialValue;
    this.period = '30-day'; // Default view
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  getSentimentData(value) {
    if (value <= 25) {
      return {
        color: '#D32F2F',
        label: 'Highly Restrictive',
        zone: 'red'
      };
    } else if (value <= 50) {
      return {
        color: '#F57C00',
        label: 'Tightening',
        zone: 'orange'
      };
    } else if (value <= 70) {
      return {
        color: '#FBC02D',
        label: 'Cautious',
        zone: 'yellow'
      };
    } else if (value <= 85) {
      return {
        color: '#388E3C',
        label: 'Encouraging',
        zone: 'green'
      };
    } else {
      return {
        color: '#1976D2',
        label: 'Highly Permissive',
        zone: 'blue'
      };
    }
  }

  render() {
    const sentiment = this.getSentimentData(this.value);
    const circumference = 2 * Math.PI * 80; // radius = 80
    const offset = circumference - (this.value / 100) * circumference;

    const svg = `
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <circle
          class="gauge-background"
          cx="100"
          cy="100"
          r="80"
        />
        <circle
          class="gauge-fill"
          cx="100"
          cy="100"
          r="80"
          stroke="${sentiment.color}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
        />
      </svg>
      <div class="gauge-center">
        <div class="sentiment-label sentiment-${sentiment.zone}">${sentiment.label}</div>
        <div class="sentiment-value">${this.value}%</div>
      </div>
    `;

    this.container.querySelector('.gauge-container').innerHTML = svg;
  }

  updateValue(newValue, animated = true) {
    if (animated) {
      this.animateValue(this.value, newValue, 1000);
    } else {
      this.value = newValue;
      this.render();
    }
  }

  animateValue(start, end, duration) {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      this.value = Math.round(start + (end - start) * easeOutCubic);
      this.render();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  attachEventListeners() {
    const buttons = this.container.querySelectorAll('.sentiment-controls button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.period = e.target.dataset.period;
        // In a real implementation, this would fetch different data
        // For demo, just re-render
        this.loadData(this.period);
      });
    });
  }

  loadData(period) {
    // Mock data for different periods
    const mockData = {
      '7-day': 58,
      '30-day': 62,
      '90-day': 55
    };
    
    const newValue = mockData[period] || 62;
    this.updateValue(newValue, true);
  }
}

// ============================================
// RISK METER
// ============================================
class RiskMeter {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    this.animateBars();
  }

  animateBars() {
    const bars = this.container.querySelectorAll('.risk-bar-fill');
    bars.forEach((bar, index) => {
      const targetWidth = bar.dataset.risk;
      
      // Delay each bar animation slightly
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, index * 150);
    });
  }
}

// ============================================
// KEY EVENTS FILTERING
// ============================================
class KeyEventsFilter {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.activeFilters = {
      severity: 'all',
      jurisdiction: 'all'
    };

    this.init();
  }

  init() {
    // Event filtering would be implemented here
    // For now, just show all events
    this.attachEventListeners();
  }

  attachEventListeners() {
    const eventItems = this.container.querySelectorAll('.event-item');
    eventItems.forEach(item => {
      item.addEventListener('click', () => {
        this.showEventModal(item.dataset.eventId);
      });
    });
  }

  showEventModal(eventId) {
    // Modal implementation would go here
    console.log('Show event details:', eventId);
  }

  filterEvents(severity = 'all', jurisdiction = 'all') {
    this.activeFilters = { severity, jurisdiction };
    // Filter logic would go here
  }
}

// ============================================
// DEADLINES COUNTDOWN
// ============================================
class DeadlinesManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
    this.startCountdown();
  }

  init() {
    this.updateCountdowns();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const viewButtons = this.container.querySelectorAll('.deadline-controls button');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        viewButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
  }

  switchView(view) {
    // Would switch between calendar/list views
    console.log('Switch to view:', view);
  }

  updateCountdowns() {
    const deadlineItems = this.container.querySelectorAll('.deadline-item');
    deadlineItems.forEach(item => {
      const dateStr = item.dataset.date;
      if (!dateStr) return;

      const targetDate = new Date(dateStr);
      const now = new Date();
      const daysAway = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

      const countdownEl = item.querySelector('.deadline-countdown');
      if (countdownEl) {
        if (daysAway < 0) {
          countdownEl.textContent = `${Math.abs(daysAway)} days ago`;
        } else if (daysAway === 0) {
          countdownEl.textContent = 'Today';
        } else if (daysAway === 1) {
          countdownEl.textContent = 'Tomorrow';
        } else {
          countdownEl.textContent = `${daysAway} days away`;
        }

        // Update urgency marker
        const marker = item.querySelector('.deadline-marker');
        if (marker) {
          marker.classList.remove('urgent', 'soon', 'upcoming', 'future');
          if (daysAway < 14) {
            marker.classList.add('urgent');
          } else if (daysAway < 30) {
            marker.classList.add('soon');
          } else if (daysAway < 60) {
            marker.classList.add('upcoming');
          } else {
            marker.classList.add('future');
          }
        }
      }
    });
  }

  startCountdown() {
    // Update countdowns every hour
    setInterval(() => {
      this.updateCountdowns();
    }, 3600000);
  }

  exportToCalendar(deadlineId) {
    // Calendar export implementation
    console.log('Export deadline to calendar:', deadlineId);
  }
}

// ============================================
// TIMELINE
// ============================================
class Timeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    const expandButton = this.container.querySelector('[data-action="expand"]');
    if (expandButton) {
      expandButton.addEventListener('click', () => {
        this.expandTimeline();
      });
    }

    const exportButton = this.container.querySelector('[data-action="export"]');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        this.exportToPDF();
      });
    }
  }

  expandTimeline() {
    // Would show full timeline view
    console.log('Expand timeline');
  }

  exportToPDF() {
    // PDF export implementation
    console.log('Export timeline to PDF');
  }
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sentiment gauge
  const sentimentGauge = new SentimentGauge('sentiment-card');

  // Initialize risk meter
  const riskMeter = new RiskMeter('risk-meter-card');

  // Initialize key events filtering
  const keyEvents = new KeyEventsFilter('key-events-card');

  // Initialize deadlines manager
  const deadlines = new DeadlinesManager('deadlines-card');

  // Initialize timeline
  const timeline = new Timeline('timeline-card');

  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading state removal
  document.body.classList.add('loaded');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate days between dates
 */
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SentimentGauge,
    RiskMeter,
    KeyEventsFilter,
    DeadlinesManager,
    Timeline
  };
}
