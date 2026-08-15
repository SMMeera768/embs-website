import { apiGet } from './api.js';

(function () {
  'use strict';

  const DATE_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.6"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', (post.category || '').toLowerCase().replace(/\s+/g, '-'));

    article.innerHTML = `
      <div class="blog-card-img-wrap">
        <img src="${post.coverImage || 'bg-image-embs/bluebg.jpeg'}" alt="${post.title || ''}" class="blog-card-img" loading="lazy" />
        <span class="blog-card-cat">${post.category || ''}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta-top">
          <span class="blog-card-date">${DATE_SVG} ${formatDate(post.createdAt || post.date)}</span>
          ${post.readTime ? `<span class="blog-card-read">${post.readTime} min read</span>` : ''}
        </div>
        <h3 class="blog-card-title">${post.title || ''}</h3>
        <p class="blog-card-desc">${post.excerpt || post.content?.substring(0, 160) || ''}</p>
        <div class="blog-card-footer">
          <span class="blog-card-author">By ${post.author || 'IEEE EMBS Editorial Team'}</span>
          <a href="${post.link || '#'}" class="blog-btn">Read Article &rarr;</a>
        </div>
      </div>`;

    return article;
  }

  /* ── Filter chips ── */
  function initFilters(cards) {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        cards.forEach(card => {
          card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ── Back to Top ── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Init ── */
  async function init() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    try {
      const res = await apiGet('/blogs');
      const posts = res.data || res;

      if (!posts.length) {
        grid.innerHTML = `<p style="color:rgba(200,210,255,0.5);text-align:center;grid-column:1/-1;padding:3rem;">No articles available yet.</p>`;
        return;
      }

      grid.innerHTML = '';
      const cards = posts.map(post => {
        const card = buildCard(post);
        grid.appendChild(card);
        return card;
      });

      initFilters(cards);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      grid.innerHTML = `<p style="color:rgba(200,210,255,0.5);text-align:center;grid-column:1/-1;padding:3rem;">Failed to load articles. Please try again later.</p>`;
    }
  }

  init();

})();
