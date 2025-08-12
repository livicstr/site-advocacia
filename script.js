// Utility: build TOC, search, accordion, theme, nav toggle, to-top
document.addEventListener('DOMContentLoaded', () => {
  // Fill current year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Build TOC from h2 and h3 in content
  const tocList = document.getElementById('tocList');
  const content = document.querySelector('.content');
  const headers = content.querySelectorAll('h2, h3');
  headers.forEach(h => {
    if(!h.id){
      h.id = h.textContent.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-ãáàâéêíóôõúç\-]/gi,'');
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Small TOC in aside for mobile too
  const toc = document.getElementById('toc');
  if(!toc) return;

  // Search
  const search = document.getElementById('searchInput');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.content .card');
    if(!q){ cards.forEach(c => c.style.display = 'block'); return; }
    cards.forEach(c => {
      const txt = c.innerText.toLowerCase();
      c.style.display = txt.includes(q) ? 'block' : 'none';
    });
  });

  // Accordion
  document.querySelectorAll('.acc-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = btn.nextElementSibling;
      if(!panel) return;
      if(expanded){ panel.style.display = 'none'; }
      else { panel.style.display = 'block'; }
    });
  });

  // Theme toggle (dark/light)
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  // check saved preference
  const saved = localStorage.getItem('site-theme');
  if(saved === 'dark'){ body.classList.add('dark'); themeToggle.textContent = '☀️'; }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
  });

  // Nav toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => {
    const shown = navList.style.display === 'flex' || navList.style.display === 'block';
    navList.style.display = shown ? 'none' : 'block';
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href === '#') return;
      const el = document.querySelector(href);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
      // hide nav on mobile after click
      if(window.innerWidth < 900) navList.style.display = 'none';
    });
  });

  // To top button
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 400) toTop.style.display = 'block';
    else toTop.style.display = 'none';
  });
  toTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Keyboard accessibility: Escape hides nav on mobile
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      if(navList) navList.style.display = 'none';
    }
  });

  // Make external links open in new tab (if any)
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if(href && href.startsWith('http')) a.setAttribute('target','_blank');
  });
});
