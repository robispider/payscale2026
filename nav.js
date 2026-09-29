(function () {
  const links = [
    { href: 'index.html',                        label: 'ড্যাশবোর্ড' },
    { href: 'payscale2026salarycalculator.html', label: 'বেতন ক্যালকুলেটর' },
    { href: 'fixation.html',                     label: 'ধাপ নির্ধারণ' },
    { href: 'grade-diff.html',                   label: 'গ্রেড ব্যবধান' },
    { href: 'base-compare.html',                 label: 'প্রারম্ভিক তুলনা' },
    { href: 'real-value.html',                   label: 'রিয়েল বৃদ্ধি' },
    { href: 'valueerosion.html',                 label: 'প্রমোশন মূল্য' },
    { href: 'grade-diff-history.html',           label: 'ঐতিহাসিক ব্যবধান' },
    { href: 'history-line-graph.html',           label: 'ঐতিহাসিক গ্রাফ' },
    { href: '9th-payscale-2026.pdf',             label: 'গেজেট পিডিএফ' }
  ];

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // 1. Render Navigation Bar
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.innerHTML = links.map(l => {
    const active = current === l.href.toLowerCase() ? ' active' : '';
    return `<a href="${l.href}" class="${active}">${l.label}</a>`;
  }).join('');

  // 2. Inject Styles
  const style = document.createElement('style');
  style.textContent = `
    #main-nav {
      display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
      margin-bottom: 18px; max-width: 1100px; margin-left: auto; margin-right: auto;
    }
    #main-nav a {
      background: #1e293b; color: #94a3b8; text-decoration: none;
      padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
      border: 1px solid #334155; transition: all 0.2s;
    }
    #main-nav a:hover, #main-nav a.active {
      color: #38bdf8; border-color: #38bdf8;
    }
  `;
  document.head.appendChild(style);
  document.body.insertBefore(nav, document.body.firstChild);

  // --- GOOGLE ANALYTICS (GA4) AUTO-INTEGRATION ---
  const gaId = 'G-82EZ6X0KK6';

  // Prevent duplicate insertion if already loaded
  if (!document.querySelector(`script[src*="${gaId}"]`)) {
    // 1. Create and inject gtag.js library
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(gaScript);

    // 2. Setup standard dataLayer & gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag; // make available globally

    // 3. Configure and trigger pageview
    gtag('js', new Date());
    gtag('config', gaId);
  }
})();