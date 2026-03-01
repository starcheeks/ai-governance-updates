(function() {
    'use strict';

    // Gauge color mapping based on score
    function getGaugeColor(score) {
        if (score <= 20) return getComputedStyle(document.documentElement).getPropertyValue('--color-impact-high-text').trim();
        if (score <= 40) return getComputedStyle(document.documentElement).getPropertyValue('--color-accent-warm').trim();
        if (score <= 60) return getComputedStyle(document.documentElement).getPropertyValue('--color-impact-medium-text').trim();
        if (score <= 80) return getComputedStyle(document.documentElement).getPropertyValue('--color-impact-low-text').trim();
        return getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary').trim();
    }

    // Calculate the arc length for the gauge SVG
    // The arc from (20,100) to (180,100) with r=80 is a semicircle = pi * 80 ~= 251.3
    var ARC_LENGTH = 251.3;

    function updateGauge(score, label, trend, detail) {
        var fill = document.getElementById('gauge-fill');
        var needle = document.getElementById('gauge-needle');
        var scoreEl = document.getElementById('gauge-score');
        var labelEl = document.getElementById('gauge-label');
        var trendEl = document.getElementById('gauge-trend');
        var detailEl = document.getElementById('gauge-detail');

        if (!fill) return;

        var color = getGaugeColor(score);
        var fraction = score / 100;
        var dashOffset = ARC_LENGTH * (1 - fraction);

        fill.style.stroke = color;
        fill.style.strokeDasharray = ARC_LENGTH;
        fill.style.strokeDashoffset = dashOffset;

        // Needle rotation: 0 = -90deg (left), 100 = +90deg (right)
        var angle = -90 + (fraction * 180);
        needle.style.transform = 'rotate(' + angle + 'deg)';

        scoreEl.textContent = score;
        labelEl.textContent = label;
        labelEl.style.color = color;
        trendEl.textContent = trend;
        detailEl.textContent = detail;
    }

    function initSentimentToggle() {
        var buttons = document.querySelectorAll('.period-btn');
        if (!buttons.length) return;

        // Set initial gauge state from the active button
        var active = document.querySelector('.period-btn.active');
        if (active) {
            updateGauge(
                parseInt(active.getAttribute('data-score')),
                active.getAttribute('data-label'),
                active.getAttribute('data-trend'),
                active.getAttribute('data-detail')
            );
        }

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                buttons.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                updateGauge(
                    parseInt(btn.getAttribute('data-score')),
                    btn.getAttribute('data-label'),
                    btn.getAttribute('data-trend'),
                    btn.getAttribute('data-detail')
                );
            });
        });
    }

    function initEventFilters() {
        var container = document.querySelector('.dash-card-events');
        if (!container) return;

        var buttons = container.querySelectorAll('.filter-btn');
        var items = container.querySelectorAll('.event-item');

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                buttons.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var severity = btn.getAttribute('data-severity');

                items.forEach(function(item) {
                    if (severity === 'all' || item.getAttribute('data-severity') === severity) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    function initRiskBars() {
        var fills = document.querySelectorAll('.risk-fill');
        if (!fills.length) return;

        var observed = false;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !observed) {
                    observed = true;
                    fills.forEach(function(fill) {
                        var width = fill.getAttribute('data-width');
                        fill.style.width = width + '%';
                    });
                }
            });
        }, { threshold: 0.2 });

        var riskList = document.getElementById('risk-list');
        if (riskList) observer.observe(riskList);
    }

    function initDeadlineCountdowns() {
        var countdowns = document.querySelectorAll('.countdown[data-deadline]');
        var now = new Date();
        now.setHours(0, 0, 0, 0);

        countdowns.forEach(function(el) {
            var dateStr = el.getAttribute('data-deadline');
            var deadline = new Date(dateStr + 'T00:00:00');
            var diffMs = deadline - now;
            var days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            if (days < 0) {
                el.textContent = 'Past due';
                el.classList.add('urgent');
            } else if (days === 0) {
                el.textContent = 'Today';
                el.classList.add('urgent');
            } else if (days <= 14) {
                el.textContent = days + ' day' + (days === 1 ? '' : 's') + ' away';
                el.classList.add('urgent');
            } else if (days <= 60) {
                el.textContent = days + ' days away';
                el.classList.add('soon');
            } else {
                var months = Math.round(days / 30);
                el.textContent = months + ' month' + (months === 1 ? '' : 's') + ' away';
                el.classList.add('later');
            }
        });
    }

    function initCardAnimations() {
        var cards = document.querySelectorAll('.dash-card');
        if (!cards.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(function(card, i) {
            card.style.transitionDelay = (i * 0.1) + 's';
            observer.observe(card);
        });
    }

    // Updates page: impact filtering
    function initUpdatesFilter() {
        var filterBar = document.querySelector('.updates-filter-bar');
        if (!filterBar) return;

        var buttons = filterBar.querySelectorAll('.filter-btn');
        var cards = document.querySelectorAll('.update-card[data-impact]');

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                buttons.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var impact = btn.getAttribute('data-impact');

                cards.forEach(function(card) {
                    if (impact === 'all' || card.getAttribute('data-impact') === impact) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initSentimentToggle();
        initEventFilters();
        initRiskBars();
        initDeadlineCountdowns();
        initCardAnimations();
        initUpdatesFilter();
    });
})();
