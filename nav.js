// nav.js
(function () {
  const links = [
    { href: 'index.html',            label: 'ড্যাশবোর্ড' },
    { href: 'fixation.html',         label: 'ধাপ নির্ধারণ' },
    { href: 'grade-diff.html',       label: 'গ্রেড ব্যবধান' },
    { href: 'base-compare.html',     label: 'প্রারম্ভিক বেতনের গ্রেডভিত্তিক পার্থক্য' },
    { href: 'real-value.html',       label: 'মূল্যস্ফিতির তুলনায় বৃদ্ধি' },
    { href: 'valueerosion.html',        label: 'প্রমোশন মূল্য' },
    { href: 'grade-diff-history.html',     label: 'সব পেস্কেলের বৃদ্ধি ব্যবধান' },
    { href: 'history-line-graph.html', label: 'সব পেস্কেলের বৃদ্ধি গ্রাফ' }
  ];

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.innerHTML = links.map(l => {
    const active = current === l.href.toLowerCase() ? ' active' : '';
    return `<a href="${l.href}" class="${active}">${l.label}</a>`;
  }).join('');

  // style
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

  // insert at top of body
  document.body.insertBefore(nav, document.body.firstChild);
})();